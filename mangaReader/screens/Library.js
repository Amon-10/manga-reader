import React, { useEffect } from 'react';
import {View, Text, FlatList, Image, TouchableOpacity} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { getCoverUrl } from './getCover';
import { useSQLiteContext } from 'expo-sqlite';

export default function LibraryScreen({libraryList, setLibraryList, navigation}) {
  const db = useSQLiteContext();

  const showLibrary = async () => {
    try{
      const allMangaInLibrary = await db.getAllAsync(`SELECT * FROM library`);
      setLibraryList(allMangaInLibrary);
      console.log(JSON.stringify(allMangaInLibrary, null, 2));
    } catch(error){
      console.error('Could not load library', error);
    }
  };

  useEffect(() => {
    showLibrary();
  }, []);

  return (
    <View style={{ flex: 1, padding: 14 }}>
      {libraryList.length === 0
      ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Library empty</Text></View>
      :
   
      <FlatList 
        data={libraryList}
        numColumns={2}
        keyExtractor={(item) => item.mangaId.toString()}
        renderItem={({item}) => (
        <View style={{ position: 'relative',marginBottom: 10 }}>
          <TouchableOpacity onPress={() => { navigation.navigate('MangaDetails', {manga: item})}}>
            <Image 
              source={{ uri: item.cover }}
              style={{ width: 160, height:220, marginRight: 12, borderRadius: 7 }}
            />
            <Text style={{ 
              position:'absolute', 
              bottom: 5, 
              left: 5, 
              color: 'white', 
              backgroundColor: 'rgba(0,0,0,0.6)', 
              padding: 2, 
              borderRadius: 4, 
              fontSize: 15 
            }}>
              {item.title || item.slug || 'no title'}
            </Text>
          </TouchableOpacity>
        </View>)}
      />}
    </View>
  );
}