import React, { useState, useLayoutEffect, useEffect } from 'react';
import {View, Text, FlatList, Image, TouchableOpacity, TextInput} from 'react-native';
import { getCoverUrl } from './getCover';

export default function MangaSearchScreen({navigation, route}){
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [covers, setCovers] = useState({});

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <TextInput
          placeholder="Search manga..."
          value={query}
          onChangeText={setQuery}
          autoFocus
          style={{
            fontSize: 19,
            height: 50,
            width: '100%',
          }}
        />
      ),
    });
  }, [navigation, query]);

  useEffect(() => {
    if (query.length > 2) {
      const fetchResults = async () => {
        try {
          const res = await fetch(`https://api.mangadex.org/manga?limit=10&title=${query}&includedTagsMode=AND&excludedTagsMode=OR&contentRating%5B%5D=safe&contentRating%5B%5D=suggestive&contentRating%5B%5D=erotica&order%5BlatestUploadedChapter%5D=desc&includes%5B%5D=`);
          const mangaData = await res.json();
          setResults(mangaData.data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchResults();
    } else {
      setResults([]);
    }
  }, [query]); 
  
  useEffect(() => {
  const fetchCovers = async () => {
    const newCovers = {};
    for (const manga of results) {
      const url = await getCoverUrl(manga);
      if (url) newCovers[manga.id] = url;
    }
    setCovers(newCovers);
  };

  if (results.length > 0) {
    fetchCovers();
  }
}, [results]);

  return (
    <View style={{ flex: 1, padding: 14, paddingBottom: 0 }}>
      <FlatList
        data={results}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={{ position: 'relative', marginBottom: 10}}>
            <TouchableOpacity onPress={() => { navigation.navigate('MangaDetails', {manga: item})}}>
              <Image 
                source={{ uri: covers[item.id] || 'https://via.placeholder.com/150' }}
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
                {item.attributes?.title?.en || item.id || 'No title'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}