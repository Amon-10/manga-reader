import React, { useEffect, useState } from 'react';
import {View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator} from 'react-native';
import { getCoverUrl } from './getCover';

export default function BrowseScreen({mangaList, setMangaList, libraryList, setLibraryList, navigation}) {

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const limit = 16;

  
  const fetchManga = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.comick.fun/v1.0/search/?page=${page}&limit=${limit}&comic_types=manga&sort=rating&showall=false&t=false`
      );

      if (!response.ok) {
        throw new Error('API failed');
      }

      const data = await response.json();

      if (data.length === 0) {
        setHasMore(false);
        return;
      }

      /* const data = json?.rank || []; */
      /* console.log(JSON.stringify(data, null, 2)); // log test */

      setMangaList(prevList => {
        const newItems = data.filter(
          manga => !prevList.some(item => item.id === manga.id) // remove duplicates
        );
        return [...prevList, ...newItems];
      });

      setPage(prev => prev + 1);
    } catch (error) { 
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchManga();
  }, []);

  
  const handleAddToLibrary = (item) => {
    if (!Array.isArray(libraryList)) {   // encountered some errors so had to test it out here p.s Im keeping this comment and the code as fallback
      console.log('libraryList is not an array', libraryList);
      return;
    }

    if (!libraryList.some(manga =>  manga.slug === item.slug )){ /* check duplicates in libraryList no duplicates then proceed */
      setLibraryList([...libraryList,  item ]);} /* update libraryList and add the item(manga) to it */
  }

  return (
    <View style={{ flex: 1, padding: 14, paddingBottom: 0 }}>
      <FlatList
        data={mangaList}
        numColumns={2}
        keyExtractor={(item) => item.title || item.slug}
        onEndReached={fetchManga}
        onEndReachedThreshold={0.5}
        renderItem={({item}) => {
          /* console.log(JSON.stringify(item.title, null, 2)); // log test */
          return (
          <View style={{ position: 'relative', marginBottom: 10}}>
            <TouchableOpacity onPress={() => { navigation.navigate('MangaDetails', {manga: item})}}>
              <Image 
                source={{ uri: getCoverUrl(item) || 'https://via.placeholder.com/150' }}
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
                fontSize: 15,
                maxWidth: '85%' 
              }}>
                {item.title || item.slug || 'No title'}
              </Text>
            </TouchableOpacity>
              <TouchableOpacity onPress={() => handleAddToLibrary(item)} 
              style={{ 
                position:'absolute', 
                top: 5, 
                right: 17, 
                backgroundColor: '#4CAF50', 
                padding: 2, 
                borderRadius: 4
              }}>
                <Text style={{color: '#fff'}}>Add to library</Text>
              </TouchableOpacity>
          </View>
          )
        }}
        ListFooterComponent={loading ? <ActivityIndicator /> : null}/>
    </View>
  );
}

