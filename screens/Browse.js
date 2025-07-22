import React, { useEffect } from 'react';
import {View, Text, FlatList, Image, TouchableOpacity} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

export default function BrowseScreen({mangaList, setMangaList, navigation}) {

  useEffect(() => {
    fetch('https://api.comick.fun/top')
      .then(response => response.json())
      .then(data => {
      const mangaArray = data?.comicsByCurrentSeason?.data || [];
      setMangaList(mangaArray);
    })
      .catch(error => console.error('error fetching manga', error))
  }, []);
  

  const handleAddToLibrary = (item) => {
    if (!mangaList.some(manga =>  manga.id === item.id )){ /* check duplicates in mangalist no duplicates then proceed */
      setMangaList([...mangaList,  item ]);} /* update mangaList and add the item(manga) to it */
  }

  const getCoverUrl = (item) => {
    const fileName = item.md_covers?.[0]?.b2key;
    return fileName ? `https://meo.comick.pictures/${fileName}` : null;
  };


  return (
    <View style={{ flex: 1, padding: 14 }}>
      <FlatList
        data={mangaList}
        numColumns={2}
        keyExtractor={(item, index) => item.title || item.slug}
        renderItem={({item}) => (
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
                fontSize: 15 
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
        )}/>
    </View>
  );
}

