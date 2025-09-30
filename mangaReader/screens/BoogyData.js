import React,{ useEffect, useLayoutEffect, useState } from 'react';
import {View, Text, FlatList, Image, TouchableOpacity, Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getCoverUrl } from './getCover';
import { useSQLiteContext } from 'expo-sqlite';

export default function MangaDetailsScreen({libraryList, setLibraryList, route}) {

  const { manga } = route.params;
  const navigation = useNavigation();
  const db = useSQLiteContext();

  const [chapterList, setChapterList] = useState([]);
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [coverUrl, setCoverUrl] = useState(null);

  // Hide bottom tab bar on details screen
  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: 'none' } });
    return () => parent?.setOptions({ tabBarStyle: { display: 'flex' } });
  }, [navigation]);

  // --- Fetch Chapters ---
  const fetchChapters = async (mangaId) => {
    if (!mangaId) return [];

    try {
      setRefreshing(true);

      // 1. Get local chapters first
      const localChapters = await db.getAllAsync(
        `SELECT chapterId as id, chapterNumber as number, createdAt FROM chapters WHERE mangaId = ? ORDER BY CAST(chapterNumber AS FLOAT) ASC`,
        [mangaId]
      );

      if (localChapters.length > 0) {
        setChapterList(localChapters);
      }

      // 2. Fetch from API
      let allChapters = [];
      let offset = 0;
      const limit = 100;
      let total = 0;

      do {
        const res = await fetch(
          `https://api.mangadex.org/chapter?limit=${limit}&offset=${offset}&manga=${mangaId}&translatedLanguage[]=en&order[chapter]=asc`
        );
        const data = await res.json();

        const normalized = (data.data || []).map(chap => ({
          id: chap.id,
          number: chap.attributes?.chapter,
          createdAt: chap.attributes?.createdAt?.slice(0, 10) || null,
        }));

        allChapters = [...allChapters, ...normalized];
        total = data.total || 0;
        offset += limit;
      } while (offset < total);

      if (allChapters.length > 0) {
        setChapterList(allChapters);

        for (const chap of allChapters) {
          await db.runAsync(
            `INSERT OR REPLACE INTO chapters (chapterId, mangaId, createdAt, chapterNumber) VALUES (?, ?, ?, ?)`,
            [chap.id, mangaId, chap.createdAt, chap.number]
          );
        }
      }

      return allChapters;
    } catch (error) {
      console.error('Error fetching chapters', error);
      Alert.alert('Error', 'Could not fetch chapters.');
      return [];
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (manga?.id) fetchChapters(manga.id);
  }, [manga?.id]);

  // Cover image
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

  // Sync library status
  useEffect(() => {
    const exists = libraryList.some(item => item.mangaId == manga.id);
    setIsInLibrary(exists);
  }, [libraryList, manga.id]);

  // --- Add to Library ---
  const handleAddToLibrary = async () => {
    try {
      const finalCover = coverUrl || null;

      const title = manga?.attributes?.title?.en
        || Object.values(manga?.attributes?.title || {})[0]
        || 'Untitled';

      const description = manga?.attributes?.description?.en
        || Object.values(manga?.attributes?.description || {})[0]
        || 'No description';

      await db.runAsync(
        `INSERT OR IGNORE INTO library (mangaId, cover, title, desc) VALUES (?, ?, ?, ?)`,
        [manga.id, finalCover, title, description]
      );

      // also fetch and save chapters
      await fetchChapters(manga.id);

      const updatedLibrary = await db.getAllAsync(`SELECT * FROM library`);
      setLibraryList(updatedLibrary);
      setIsInLibrary(true); // update immediately
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not add manga to library.");
    }
  };

  // --- Remove from Library ---
  const handleRemove = async (id) => {
    try {
      await db.runAsync(`DELETE FROM library WHERE mangaId = ?`, [id]);
      await db.runAsync(`DELETE FROM chapters WHERE mangaId = ?`, [id]);
      setLibraryList(prev => prev.filter(manga => manga.mangaId != id));
      setIsInLibrary(false); // update immediately
    } catch (error) {
      console.error("Error removing manga", error);
      Alert.alert("Error", "Could not remove manga from library.");
    }
  };

  const toggleLibrary = () => {
    if (isInLibrary) handleRemove(manga.id);
    else handleAddToLibrary();
  };

  // --- Header ---
  const renderHeader = () => (
    <View style={{ flex: 1, justifyContent: 'flex-start', marginTop: 20}}>
      <View style={{ flexDirection: "row", marginBottom: 20 }}>
        <View style={{alignItems: 'flex-start', paddingLeft: 10, paddingRight: 10}}>
          <Image
            source={{ uri: coverUrl || null }}
            style={{ width: 120, height:170, borderRadius: 7 }}
          />
        </View>
        <View style={{ justifyContent: 'center', width: '60%' }}>
          <Text style={{fontSize: 23}}>
            {manga?.attributes?.title?.en
            || Object.values(manga?.attributes?.title || {})[0]
            || 'Untitled'}
          </Text>
          <Text style={{fontSize: 15}}>Status: {manga?.attributes?.status}</Text>
          <Text style={{fontSize: 15}}>MangaDex</Text>
        </View>
      </View>

      <View style={{ alignItems: 'center'}}>
        <TouchableOpacity onPress={toggleLibrary}>
          <View style={{alignItems: 'center'}}>
            <Ionicons 
              name={isInLibrary? 'heart' : 'heart-outline'} 
              size={25} 
              color={isInLibrary? 'red' : 'black'}
            />
          </View>
          <Text style={{fontSize: 12}}>{isInLibrary? 'Remove from library' : 'Add to library'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={{marginTop: 25}}>
        {manga?.attributes?.description?.en
        || Object.values(manga?.attributes?.description || {})[0]
        || 'No description'}
      </Text>
    </View>
  );

  // --- Render ---
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={chapterList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => navigation.navigate('ChapterReader', {chapter: item})}
            style={{ width: '100%', padding: 5, marginVertical: 2, backgroundColor: '#f2f2f2', left: 18 }}>
            <Text style={{fontSize: 16}}>Chapter {item.number}</Text>
            <Text style={{fontSize: 12}}>date added: {item.createdAt || "N/A"}</Text>
          </TouchableOpacity>
        )}

        ListHeaderComponent={renderHeader}
        refreshing={refreshing}
        onRefresh={() => fetchChapters(manga.id)}

        ListEmptyComponent={
          !refreshing ? (
            <View style={{ justifyContent: "center", alignItems: "center", marginTop: 20 }}>
              <Text>No chapters available. Pull down to refresh.</Text>
            </View>
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 120 }}
      />
      
      <View style={{position: 'absolute', bottom: 30, right: 10, alignItems: 'center', elevation: 5, zIndex: 100}}>
        <TouchableOpacity 
          onPress={() => alert('Read now button')}
          style={{ flexDirection: 'row', alignItems:'center', backgroundColor:'red', padding: 15, borderRadius: 7 }} >
          <Ionicons name='caret-forward-outline' color='white' size= {25}/>
          <Text style={{color: 'white', fontSize: 12, marginLeft: 10}}>Read</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
