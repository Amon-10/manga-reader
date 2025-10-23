import React,{ useEffect, useLayoutEffect, useState } from 'react';
import {View, Text, FlatList, Image, TouchableOpacity} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { getCoverUrl } from './getCover';
import { useSQLiteContext } from 'expo-sqlite';
import { Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MangaDetailsScreen({libraryList, setLibraryList, route}){
  
  const { manga } = route.params;
  const navigation = useNavigation();
  const db = useSQLiteContext();

  const [chapterList, setChapterList] = useState([]);
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [historyMap, setHistoryMap] = useState({});

  useLayoutEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({
      tabBarStyle: { display: 'none' }
    });

    return () => {
      parent?.setOptions({
        tabBarStyle: { display: 'flex' }
      });
    };
  }, [navigation]);  // I got rid of bottom tab bar over here in mangadetails screen

  const fetchMangaDetails = async () => {
    try {
      setRefreshing(true);
      const res = await fetch(`https://api.comick.fun/comic/${manga.slug}/`);
      const json = await res.json();

      const hid = json?.comic?.hid;
      if (hid) {
        await fetchChapters(hid);
      }

    } catch(err) {
      console.error('Error fetching manga details', err);
      Alert.alert("Error", "Could not load manga details. Please try again.");
    } finally {
      setRefreshing(false);
    }
  };

  const fetchChapters = async (hid) => {
    try {
    const response = await fetch(`https://api.comick.fun/comic/${hid}/chapters?limit=2000&lang=en`); // remember chapter limit is 60 rn

      if(!response.ok){
        throw new Error('Could not fetch chapter resources');
      }

      const data = await response.json();
      const chap = data?.chapters || [];
      /* console.log(JSON.stringify(chap.slice(0,5), null, 2)); */ // test log

      setChapterList(chap);

    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message || 'An error occurred while adding manga');
    }
  };
  
  useEffect(() => {
    fetchMangaDetails();
    // load history for manga if available
    (async () => {
      try {
        const rows = await db.getAllAsync(`SELECT chapterId, lastPage, completed, lastRead FROM history WHERE mangaId = ?`, [manga.id]);
        const map = {};
        (rows || []).forEach(r => { map[r.chapterId] = r; });
        setHistoryMap(map);
      } catch (e) {
        console.warn('Could not load history map', e);
      }
    })();
  }, []);

  const handleAddToLibrary = async () => {
    try {
      if (!Array.isArray(libraryList)) {  
        console.log('libraryList is not an array', libraryList);
        return;
      }

      if (!libraryList.some(item =>  item.mangaId == manga.id )){ 
        /* setLibraryList([...libraryList,  manga ]); */
        const coverUrl = manga.cover?.startsWith("http")
        ? manga.cover
        : `https://meo.comick.pictures/${manga.md_covers?.[0]?.b2key || manga.cover}`
        await db.runAsync( 
          `INSERT OR IGNORE INTO library (mangaId, cover, title, slug, desc) VALUES (?, ?, ?, ?, ?)`,
          [manga.id, coverUrl, manga.title, manga.slug, manga.desc ]
        ); 

        const updatedLibrary = await db.getAllAsync(`SELECT * FROM library`);
        setLibraryList(updatedLibrary);
      }

    } catch (error){
      console.error(error);
      Alert.alert("Error", "Could not add manga to library.");

    }
  }

  const handleRemove = async (id) => {
    try {
      await db.runAsync(
        `DELETE FROM library WHERE mangaId = ?`,
        [id]
      );
      setLibraryList(prevList => prevList.filter(manga => manga.mangaId != id));
    }catch (error) {
      console.error("Error removing manga", error);
      Alert.alert("Error", "Could not remove manga from library.")
    }
  };

  useEffect(() => {
    const exists = libraryList.some(item => item.mangaId == manga.id);
    setIsInLibrary(exists);
  }, [libraryList, manga.id]);

  const toggleLibrary = () => {
    if (isInLibrary){
      handleRemove(manga.id);
    }
    else {
      handleAddToLibrary(manga);
    }
  };

  const renderHeader = () => (
    <View style={{ flex: 1, justifyContent: 'flex-start', marginTop: 20}}>
      <View style={{ flexDirection: "row", marginBottom: 20 }}>
        <View style={{alignItems: 'flex-start', paddingLeft: 10, paddingRight: 10}}>
          <Image
            source={{uri: getCoverUrl(manga) || manga.cover}}
            style={{ width: 120, height:170, borderRadius: 7 }}
          />
        </View>
        <View style={{ justifyContent: 'center', width: '60%' }}>
          <Text style={{fontSize: 23}}>{manga.title}</Text>
          <Text style={{fontSize: 15}}>Author:</Text>
          <Text style={{fontSize: 15}}>Status:</Text>
          <Text style={{fontSize: 15}}>Comick</Text>
        </View>
      </View>

      <View style={{ alignItems: 'center'}}>
        <TouchableOpacity onPress= {toggleLibrary}>
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

      <Text style={{marginTop: 25}}>{manga.desc}</Text>
          
    </View>
  );

    return (
      <View>
        <FlatList
          data={chapterList}
          keyExtractor={(item) => item.hid}
          renderItem={({item}) => {
            const hist = historyMap[item.hid];
            const completed = hist && Number(hist.completed) === 1;
            return (
              <TouchableOpacity onPress={() => {navigation.navigate('ChapterReader', {chapter: { ...item, mangaId: manga.id }})}}
                style={{ width: '100%', padding: 5, marginVertical: 2, backgroundColor: completed ? '#e6e6e6' : '#f2f2f2', left: 18 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <Text style={{fontSize: 16, color: completed ? '#999' : '#000'}}>chapter {item.chap}</Text>
                    <Text style={{fontSize: 12, color: completed ? '#999' : '#444'}}>date added: {item.created_at ? item.created_at.slice(0,10) : "N/A"}</Text>
                  </View>
                  {completed ? (<Ionicons name='checkmark-circle' size={20} color='green' />) : null}
                </View>
              </TouchableOpacity>
            );
          }}

          ListHeaderComponent={renderHeader}
          refreshing={refreshing}
          onRefresh={fetchMangaDetails}

          ListEmptyComponent={
            !refreshing ? (
              <View style={{ justifyContent: "center", alignItems: "center", marginTop: 20 }}>
                <Text>No chapters available. Pull down to refresh.</Text>
              </View>
            ) : null
          }
        />
        
        <View style={{position: 'absolute', bottom: 30, right: 10, alignItems: 'center', elevation: 5, zIndex: 100}}>
          <TouchableOpacity
            onPress={async () => {
              try {
                const rows = await db.getAllAsync(`SELECT chapterId, lastPage FROM history WHERE mangaId = ? ORDER BY lastRead DESC LIMIT 1`, [manga.id]);
                if (rows && rows.length > 0) {
                  const last = rows[0];
                  const chapterItem = chapterList.find(c => c.hid === last.chapterId) || chapterList[0];
                  const initialPage = Number(last.lastPage) > 0 ? Number(last.lastPage) - 1 : 0;
                  if (chapterItem) navigation.navigate('ChapterReader', { chapter: { ...chapterItem, mangaId: manga.id }, initialPage });
                  else Alert.alert('No chapter found', 'Could not locate the last read chapter.');
                } else {
                  const first = chapterList[0];
                  if (first) navigation.navigate('ChapterReader', { chapter: { ...first, mangaId: manga.id }, initialPage: 0 });
                  else Alert.alert('No chapters available', 'No chapters to open.');
                }
              } catch (err) {
                console.error('Read now failed', err);
                Alert.alert('Error', 'Could not open reader.');
              }
            }}
            style={{ 
              flexDirection: 'row', 
              alignItems:'center', 
              backgroundColor:'red', 
              padding: 15, 
              borderRadius: 7, 
            }} >

            <Ionicons name='caret-forward-outline' color='white' size= {25}/>

            <Text style={{color: 'white', fontSize: 12, marginLeft: 10}}>Read</Text>

          </TouchableOpacity>
        </View>
      </View>
    );
}