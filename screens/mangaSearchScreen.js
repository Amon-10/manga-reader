import React, { useState, useLayoutEffect, useEffect } from 'react';
import {View, Text, FlatList, Image, TouchableOpacity, TextInput} from 'react-native';


export default function MangaSearchScreen({navigation, route, libraryList, setLibraryList}){
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

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

  // Fetching logic
  useEffect(() => {
    if (query.length > 2) {
      const fetchResults = async () => {
        try {
          const res = await fetch(`https://api.comick.fun/v1.0/search?q=${query}`);
          const data = await res.json();
          setResults(data); // or data.comics depending on response
        } catch (err) {
          console.error(err);
        }
      };
      fetchResults();
    } else {
      setResults([]);
    }
  }, [query]);

  const getCoverUrl = (item) => {
    const fileName = item.md_covers?.[0]?.b2key;
    return fileName ? `https://meo.comick.pictures/${fileName}` : null;
  };

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
        data={results}
        numColumns={2}
        keyExtractor={(item) => item.slug || item.id.toString()}
        renderItem={({ item }) => (
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
        )}
      />
    </View>
  );
}