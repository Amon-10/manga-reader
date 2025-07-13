import React from 'react';
import {View, Text, FlatList, Image, TouchableOpacity} from 'react-native';

export default function LibraryScreen({mangaList, setMangaList}) {

  const handleRemove = (id) => {
  setMangaList(prevList => prevList.filter(manga => manga.id !== id));
  };

  return (
    <View style={{ flex: 1, padding: 14 }}>
      {mangaList.length === 0
      ? <View style={{alignItems:'center', marginTop:270}}><Text>Library empty</Text></View>
      :
   
      <FlatList 
        data={mangaList}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
        <View style={{ position: 'relative',marginBottom: 10 }}>
          <Image 
            source={{ uri: item.thumbnail }}
            style={{ width: 160, height:220, marginRight: 12, borderRadius: 7 }}
          />
          <TouchableOpacity onPress={() => handleRemove(item.id)}
          style={{ position:'absolute', top: 5, right: 17, backgroundColor: '#f44336', padding: 2, borderRadius: 4 }}>
              <Text style={{ color: '#fff' }}>Remove</Text>
          </TouchableOpacity>

          <Text style={{ position:'absolute', bottom: 5, left: 5, color: 'white', backgroundColor: 'rgba(0,0,0,0.6)', padding: 2, borderRadius: 4, fontSize: 15 }}>
            {item.title}
          </Text>
        </View>)}
      />}
    </View>
  );
}