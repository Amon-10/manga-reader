import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getCoverUrl } from './getCover';
import { useSQLiteContext } from 'expo-sqlite';

// helper: unique & sort by chapter number (attempt numeric)
const uniqAndSort = (arr) => {
  const map = new Map();
  for (const item of arr) {
    if (!item || !item.id) continue;
    map.set(item.id, item);
  }
  const list = Array.from(map.values());
  list.sort((a, b) => {
    const na = parseFloat(a.number) || 0;
    const nb = parseFloat(b.number) || 0;
    if (na === nb) {
      // fallback to createdAt if same chapter or non-numeric
      return (a.createdAt || '').localeCompare(b.createdAt || '');
    }
    return na - nb;
  });
  return list;
};

export default function MangaDetailsScreen({ libraryList, setLibraryList, route }) {
  const { manga } = route.params;
  const navigation = useNavigation();
  const db = useSQLiteContext();

  const [chapterList, setChapterList] = useState([]);
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [coverUrl, setCoverUrl] = useState(null);
  const [historyMap, setHistoryMap] = useState({});

  // hide tab bar
  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: 'none' } });
    return () => parent?.setOptions({ tabBarStyle: { display: 'flex' } });
  }, [navigation]);

  // load cover (no changes)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!manga?.id) return;
        const url = await getCoverUrl(manga);
        if (mounted) setCoverUrl(url);
      } catch (err) {
        console.error('Error fetching cover', err);
      }
    })();
    return () => { mounted = false; };
  }, [manga?.id]);

  // update isInLibrary flag when parent libraryList changes (does NOT trigger chapter reload)
  useEffect(() => {
    const exists = Array.isArray(libraryList) && libraryList.some(item => item.mangaId == manga.id);
    setIsInLibrary(!!exists);
  }, [libraryList, manga?.id]);

  // --- API fetch helper (returns normalized array)
  const fetchChaptersFromApi = async (mangaId) => {
    if (!mangaId) return [];
    try {
      let all = [];
      let offset = 0;
      const limit = 100;
      let total = 0;

      do {
        const res = await fetch(
          `https://api.mangadex.org/chapter?limit=${limit}&offset=${offset}&manga=${mangaId}&translatedLanguage[]=en&order[chapter]=asc`
        );
        if (!res.ok) throw new Error('API failed');
        const json = await res.json();
        const normalized = (json.data || []).map(ch => ({
          id: ch.id,
          number: ch.attributes?.chapter,
          createdAt: ch.attributes?.createdAt?.slice(0, 10) || null,
        }));
        all = [...all, ...normalized];
        total = json.total || 0;
        offset += limit;
      } while (offset < total);

      return uniqAndSort(all);
    } catch (err) {
      console.error('Error fetching from API', err);
      return [];
    }
  };

  // --- initial load ONLY (runs on mount / when manga.id changes)
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!manga?.id) return;

      try {
        setRefreshing(true);

        // check local library DB entry directly
        const libraryRows = await db.getAllAsync(`SELECT 1 FROM library WHERE mangaId = ?`, [manga.id]);
        const saved = (libraryRows && libraryRows.length > 0);

        // if saved, try to load cached chapters from DB first
        if (saved) {
          const local = await db.getAllAsync(
            `SELECT chapterId as id, chapterNumber as number, createdAt FROM chapters WHERE mangaId = ? ORDER BY CAST(chapterNumber AS FLOAT) ASC`,
            [manga.id]
          );
          if (mounted && local?.length > 0) {
            setChapterList(uniqAndSort(local));
            // load history for this manga to show completed state
            const histRows = await db.getAllAsync(`SELECT chapterId, lastPage, completed, lastRead FROM history WHERE mangaId = ?`, [manga.id]);
            const map = {};
            (histRows || []).forEach(r => { map[r.chapterId] = r; });
            if (mounted) setHistoryMap(map);
            setRefreshing(false);
            return; // show cached and STOP (we don't force an API fetch on add)
          }
          // if saved but no cached chapters, fallthrough to API fetch (optional)
        }

        // not saved OR no cached chapters -> fetch from API and display (do NOT save unless caller chooses to)
        const apiChaps = await fetchChaptersFromApi(manga.id);
        if (mounted) setChapterList(apiChaps);
        // also load history (may be empty)
        const histRowsApi = await db.getAllAsync(`SELECT chapterId, lastPage, completed, lastRead FROM history WHERE mangaId = ?`, [manga.id]);
        const mapApi = {};
        (histRowsApi || []).forEach(r => { mapApi[r.chapterId] = r; });
        if (mounted) setHistoryMap(mapApi);
      } catch (err) {
        console.error('Initial load failed', err);
      } finally {
        if (mounted) setRefreshing(false);
      }
    })();

    return () => { mounted = false; };
  }, [manga?.id]); // only on manga.id changes — no isInLibrary or libraryList deps

  // --- pull-to-refresh handler ---
  const onRefresh = async () => {
    if (!manga?.id) return;
    setRefreshing(true);
    try {
      const apiChaps = await fetchChaptersFromApi(manga.id);

      // update UI with API result
      setChapterList(apiChaps);

      // if manga is saved in library, persist chapters to DB
      const libraryRows = await db.getAllAsync(`SELECT 1 FROM library WHERE mangaId = ?`, [manga.id]);
      const saved = libraryRows && libraryRows.length > 0;
      if (saved) {
        // replace stored chapters for this manga
        await db.runAsync(`DELETE FROM chapters WHERE mangaId = ?`, [manga.id]);
        for (const ch of apiChaps) {
          await db.runAsync(
            `INSERT OR REPLACE INTO chapters (chapterId, mangaId, createdAt, chapterNumber) VALUES (?, ?, ?, ?)`,
            [ch.id, manga.id, ch.createdAt, ch.number]
          );
        }
      }
    } catch (err) {
      console.error('Refresh failed', err);
      Alert.alert('Error', 'Could not refresh chapters.');
    } finally {
      setRefreshing(false);
    }
  };

  // --- Add to library: immediate UI update, background-only chapter caching (no spinner, no setChapterList) ---
  const handleAddToLibrary = async () => {
    try {
      const finalCover = coverUrl || null;
      const title = manga?.attributes?.title?.en
        || Object.values(manga?.attributes?.title || {})[0]
        || 'Untitled';
      const description = manga?.attributes?.description?.en
        || Object.values(manga?.attributes?.description || {})[0]
        || 'No description';
      const mangaStatus = manga?.attributes?.status || 'No status'

      // 1) insert library row immediately
      await db.runAsync(
        `INSERT OR IGNORE INTO library (mangaId, cover, title, desc, status) VALUES (?, ?, ?, ?, ?)`,
        [manga.id, finalCover, title, description, mangaStatus]
      );

      // 2) update parent library list and UI immediately
      const updatedLibrary = await db.getAllAsync(`SELECT * FROM library`);
      setLibraryList(updatedLibrary);
      setIsInLibrary(true);

      // 3) background: fetch chapters and save them to DB (DO NOT setChapterList here)
      (async () => {
        try {
          const apiChaps = await fetchChaptersFromApi(manga.id);
          if (apiChaps.length > 0) {
            await db.runAsync(`DELETE FROM chapters WHERE mangaId = ?`, [manga.id]);
            for (const ch of apiChaps) {
              await db.runAsync(
                `INSERT OR REPLACE INTO chapters (chapterId, mangaId, createdAt, chapterNumber) VALUES (?, ?, ?, ?)`,
                [ch.id, manga.id, ch.createdAt, ch.number]
              );
            }
          }
        } catch (bgErr) {
          console.error('Background save failed', bgErr);
        }
      })();
    } catch (err) {
      console.error('Add to library failed', err);
      Alert.alert('Error', 'Could not add manga to library.');
    }
  };

  // --- Remove from library (remove chapters too) ---
  const handleRemove = async (id) => {
    try {
      await db.runAsync(`DELETE FROM library WHERE mangaId = ?`, [id]);
      await db.runAsync(`DELETE FROM chapters WHERE mangaId = ?`, [id]);
      setLibraryList(prev => prev.filter(m => m.mangaId != id));
      setIsInLibrary(false);
    } catch (err) {
      console.error('Remove failed', err);
      Alert.alert('Error', 'Could not remove manga from library.');
    }
  };

  const toggleLibrary = () => {
    if (isInLibrary) handleRemove(manga.id);
    else handleAddToLibrary();
  };

  const renderHeader = () => (
    <View style={{ flex: 1, justifyContent: 'flex-start', marginTop: 20 }}>
      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
        <View style={{ alignItems: 'flex-start', paddingLeft: 10, paddingRight: 10 }}>
          <Image source={{ uri: coverUrl || null }} style={{ width: 120, height: 170, borderRadius: 7 }} />
        </View>
        <View style={{ justifyContent: 'center', width: '60%' }}>
          <Text style={{ fontSize: 23 }}>
            {manga?.attributes?.title?.en || Object.values(manga?.attributes?.title || {})[0] || manga.title || 'Untitled'}
          </Text>
          <Text style={{ fontSize: 15 }}>Status: {manga?.attributes?.status || manga.status}</Text>
          <Text style={{ fontSize: 15 }}>MangaDex</Text>
        </View>
      </View>

      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity onPress={toggleLibrary}>
          <View style={{ alignItems: 'center' }}>
            <Ionicons name={isInLibrary ? 'heart' : 'heart-outline'} size={25} color={isInLibrary ? 'red' : 'black'} />
          </View>
          <Text style={{ fontSize: 12 }}>{isInLibrary ? 'Remove from library' : 'Add to library'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={{ marginTop: 25 }}>
        {manga?.attributes?.description?.en || Object.values(manga?.attributes?.description || {})[0] || manga.desc || 'No description'}
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={chapterList}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => {
          const hist = historyMap[item.id];
          const completed = hist && Number(hist.completed) === 1;
          return (
            <TouchableOpacity
              onPress={() => navigation.navigate('ChapterReader', { chapter: { ...item, mangaId: manga.id } })}
              style={{ width: '100%', padding: 5, marginVertical: 2, backgroundColor: completed ? '#e6e6e6' : '#f2f2f2', left: 18 }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={{ fontSize: 16, color: completed ? '#999' : '#000' }}>Chapter {item.number}</Text>
                  <Text style={{ fontSize: 12, color: completed ? '#999' : '#444' }}>date added: {item.createdAt || 'N/A'}</Text>
                </View>
                {completed ? (
                  <Ionicons name='checkmark-circle' size={20} color='green' />
                ) : null}
              </View>
            </TouchableOpacity>
          );
        }}
        ListHeaderComponent={renderHeader}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          !refreshing ? (
            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
              <Text>No chapters available. Pull down to refresh.</Text>
            </View>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      <View style={{ position: 'absolute', bottom: 30, right: 10, alignItems: 'center', elevation: 5, zIndex: 100 }}>
        <TouchableOpacity
          onPress={async () => {
            try {
              // find last-read history for this manga
              const rows = await db.getAllAsync(`SELECT chapterId, lastPage FROM history WHERE mangaId = ? ORDER BY lastRead DESC LIMIT 1`, [manga.id]);
                if (rows && rows.length > 0) {
                const last = rows[0];
                // find the chapter data in the list to get chapterNumber etc
                const chapterItem = chapterList.find(c => c.id === last.chapterId) || chapterList[0];
                const initialPage = Number(last.lastPage) > 0 ? Number(last.lastPage) - 1 : 0; // convert to 0-based index
                navigation.navigate('ChapterReader', { chapter: { ...chapterItem, mangaId: manga.id }, initialPage });
              } else {
                // no history: open first chapter at page 0
                const first = chapterList[0];
                if (first) navigation.navigate('ChapterReader', { chapter: { ...first, mangaId: manga.id }, initialPage: 0 });
                else alert('No chapters available to read.');
              }
            } catch (err) {
              console.error('Read now failed', err);
              alert('Could not open reader.');
            }
          }}
          style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'red', padding: 15, borderRadius: 7 }}
        >
          <Ionicons name='caret-forward-outline' color='white' size={25} />
          <Text style={{ color: 'white', fontSize: 12, marginLeft: 10 }}>Read</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
