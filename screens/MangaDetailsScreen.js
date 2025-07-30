import React,{ useEffect } from 'react';
import {View, Text, FlatList, Image, TouchableOpacity} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function MangaDetailsScreen(){
  const route = useRoute();
  const { manga } = route.params;

  const getCoverUrl = (manga) => {
    const fileName = manga.md_covers?.[0]?.b2key;
    return fileName ? `https://meo.comick.pictures/${fileName}` : null;
  };

  useEffect(() => {
    const fetchMangaDetails = async () => {
      try {
        const res = await fetch(`https://api.comick.fun/comic/${manga.slug}/`);
        const json = await res.json();

        const hid = json?.comic?.hid;
        if (hid) {
          fetchChapters(hid);
        }

      } catch(err) {
        console.error('Error fetching manga details', err);
      }
    };

    const fetchChapters = async (hid) => {
      try {
      const response = await fetch(`https://api.comick.fun/comic/${hid}/chapters?limit=500&lang=en`); // remember chapter limit is 60 rn

        if(!response.ok){
          throw new error('Could not fetch chapter resources');
        }

        const data = await response.json();
        console.log(JSON.stringify(('Chapters: ', data.chapters), null, 2));

      } catch (error) {
        console.error(error);
      }
    };
    fetchMangaDetails();
  }, []);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', marginTop: 30}}>
          <Image
            source={{uri: getCoverUrl(manga) || 'https://via.placeholder.com/150'}}
            style={{ width: 120, height:170, borderRadius: 7 }}
          />

          <Text style={{fontSize: 20}}>{manga.title}</Text>

          <Text style={{marginTop: 15}}>summary</Text>

          <TouchableOpacity onPress={() => alert('Read now button')}
          style={{ flexDirection: 'row', alignItems:'center', backgroundColor:'red', padding: 13, borderRadius: 7, bottom: -300, left: 120}} >

            <Ionicons name='caret-forward-outline' color='white' size= {25}/>

            <Text style={{color: 'white', fontSize: 14, marginLeft: 10}}>Read</Text>

          </TouchableOpacity>
        </View>
        
      );
}