import React,{ useEffect, useLayoutEffect, useState } from 'react';
import {View, Text, FlatList, Image, TouchableOpacity} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function MangaDetailsScreen(){
  const route = useRoute();
  const { manga } = route.params;
  const navigation = useNavigation();

  const [chapterList, setChapterList] = useState([]);

  const getCoverUrl = (manga) => {
    const fileName = manga.md_covers?.[0]?.b2key;
    return fileName ? `https://meo.comick.pictures/${fileName}` : null;
  };

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
          throw new Error('Could not fetch chapter resources');
        }

        const data = await response.json();
        const chap = data?.chapters || [];
        console.log(JSON.stringify(chap.slice(0,5), null, 2)); // test log

        setChapterList(chap);

      } catch (error) {
        console.error(error);
      }
    };
    fetchMangaDetails();
  }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'flex-start', marginTop: 20}}>
          <View style={{alignItems: 'center'}}>
            <Image
              source={{uri: getCoverUrl(manga) || 'https://via.placeholder.com/150'}}
              style={{ width: 120, height:170, borderRadius: 7 }}
            />

            <Text style={{fontSize: 20, marginTop: 10}}>{manga.title}</Text>

            <Text style={{marginTop: 10}}>summary</Text>
          </View>

          <FlatList
            data={chapterList}
            keyExtractor={(item) => item.hid}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => alert(`read chapter ${item.chap}`)}
                style={{ width: '100%', padding: 5, marginVertical: 2, backgroundColor: '#f2f2f2', left: 18 }}>
                <Text style={{fontSize: 16}}>chapter {item.chap}</Text>
                <Text style={{fontSize: 12}}>date added: {item.created_at.slice(0,10)}</Text>
              </TouchableOpacity>
            )}
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