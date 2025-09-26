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
  /* console.log(JSON.stringify(manga, null, 2)); */

  const [chapterList, setChapterList] = useState([]);
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [coverUrl, setCoverUrl] = useState(null);

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

  const fetchChapters = async (mangaId) => {
    let allChapters = [];
    let offset = 0;
    const limit = 100;
    let total = 0;

    try {
      setRefreshing(true);
      do {
        const res = await fetch(
          `https://api.mangadex.org/chapter?limit=${limit}&offset=${offset}&manga=${mangaId}&translatedLanguage[]=en&order[chapter]=asc`
        );
        const data = await res.json();

        allChapters = [...allChapters, ...data.data];
        total = data.total || 0;
        offset += limit;

      } while (offset < total);

      setChapterList(allChapters);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not fetch chapters.');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchChapters(manga.id);
  }, [manga.id]);

  useEffect(() => {
    (async () => {
      const url = await getCoverUrl(manga);
      setCoverUrl(url);
    })();
  }, []);

  useEffect(() => {
      const exists = libraryList.some(item => item.mangaId == manga.id);
      setIsInLibrary(exists);
    }, [libraryList, manga.id]);

  const handleAddToLibrary = async () => {
    try {
      if (!Array.isArray(libraryList)) {  
        console.log('libraryList is not an array', libraryList);
        return;
      }

      if (!libraryList.some(item =>  item.mangaId == manga.id )){ 
        /* setLibraryList([...libraryList,  manga ]); */
        const finalCover = coverUrl || null;

        await db.runAsync( 
          `INSERT OR IGNORE INTO library (mangaId, cover, title, desc) VALUES (?, ?, ?, ?)`,
          [
            manga.id, 
            finalCover, 
            manga.attributes.name.en || 'Untitled',
            manga.attributes.deascription.en || 'No description'
          ]
        ); 

        const updatedLibrary = await db.getAllAsync(`SELECT * FROM library`);
        setLibraryList(updatedLibrary);
      }

    } catch (error){
      console.error(error);
      Alert.alert("Error", "Could not add manga to library.");

    }
  };

  const handleRemove = async (id) => {
    try {
      await db.runAsync(
        `DELETE FROM library WHERE mangaId = ?`,
      [id]);
      setLibraryList(prevList => prevList.filter(manga => manga.mangaId != id));
    }catch (error) {
      console.error("Error removing manga", error);
      Alert.alert("Error", "Could not remove manga from library.")
    }
  };

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
            source={{ uri: coverUrl || null }}
            style={{ width: 120, height:170, borderRadius: 7 }}
          />
        </View>
        <View style={{ justifyContent: 'center', width: '60%' }}>
          <Text style={{fontSize: 23}}>{manga?.attributes?.title?.en}</Text>
          <Text style={{fontSize: 15}}>Author:</Text>
          <Text style={{fontSize: 15}}>Status: {manga.attributes.status}</Text>
          <Text style={{fontSize: 15}}>MangaDex</Text>
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

      <Text style={{marginTop: 25}}>{manga?.attributes?.description?.en}</Text>
          
    </View>
  );

  return (
    <View>
      <FlatList
        data={chapterList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => {navigation.navigate('ChapterReader', {chapter: item})}}
            style={{ width: '100%', padding: 5, marginVertical: 2, backgroundColor: '#f2f2f2', left: 18 }}>
            <Text style={{fontSize: 16}}>chapter {item.attributes.chapter}</Text>
            <Text style={{fontSize: 12}}>date added: {item.attributes.createdAt ? item.attributes.createdAt.slice(0,10) : "N/A"}</Text>
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
      />
      
      <View style={{position: 'absolute', bottom: 30, right: 10, alignItems: 'center', elevation: 5, zIndex: 100}}>
        <TouchableOpacity onPress={() => alert('Read now button')}
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