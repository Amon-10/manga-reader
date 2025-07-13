import React from 'react';
import {View, Text, FlatList, Image, TouchableOpacity} from 'react-native';

export default function BrowseScreen({mangaList, setMangaList}) {
  const dummyBrowseData = [
    {
      id: '1', 
      title: 'One Piece',
      thumbnail: 'https://areajugones.sport.es/wp-content/uploads/2019/09/OnePiecePoster.jpg',
    },
    {
      id: '2', 
      title: 'kono oto tomare',
      thumbnail: 'https://th.bing.com/th/id/OIP.EHyu_Pw3XRUzETH5qT1oggHaLH?w=201&h=302&c=7&r=0&o=7&pid=1.7&rm=3'
    },
    {
      id: '3', 
      title: 'Attack on Titan',
      thumbnail: 'https://th.bing.com/th/id/OIP.3WOE0d3rVVi06Wovztcr0wHaLR?w=201&h=306&c=7&r=0&o=5&pid=1.7',
    },
    {
      id: '4',
      title: 'Berserk',
      thumbnail: 'https://th.bing.com/th/id/OIP.fyrdu2Swsa9NuJitn-anWgHaKi?w=127&h=180&c=7&r=0&o=5&pid=1.7'
    },
    {
      id: '5',
      title: 'Frieren',
      thumbnail: 'https://th.bing.com/th/id/OIP.B3miyOevlCrPdPlEtLRitAHaLo?w=199&h=313&c=7&r=0&o=7&pid=1.7&rm=3'
    }
  ];

  const handleAddToLibrary = (item) => {
    if (!mangaList.some(manga =>  manga.id === item.id )){
      setMangaList([...mangaList,  item ]);}
  }

  return (
    <View style={{ flex: 1, padding: 14 }}>
      <FlatList
        data={dummyBrowseData}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <View style={{ position: 'relative', marginBottom: 10}}>
            <Image 
              source={{ uri: item.thumbnail }}
              style={{ width: 160, height:220, marginRight: 12, borderRadius: 7 }}
            />
            <TouchableOpacity onPress={() => handleAddToLibrary(item)} style={{ position:'absolute', top: 5, right: 17, backgroundColor: '#4CAF50', padding: 2, borderRadius: 4}}>
              <Text style={{color: '#fff'}}>Add to library</Text>
            </TouchableOpacity>
            <Text style={{ position:'absolute', bottom: 5, left: 5, color: 'white', backgroundColor: 'rgba(0,0,0,0.6)', padding: 2, borderRadius: 4, fontSize: 15 }}>
              {item.title}
            </Text>
          </View>
        )}/>
    </View>
  );
}

