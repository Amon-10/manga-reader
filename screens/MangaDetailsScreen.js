import React from 'react';
import {View, Text, FlatList, Image, TouchableOpacity} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function MangaDetailsScreen(){
  const route = useRoute();
  const { manga } = route.params;

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', marginTop: 30}}>
          <Image
            source={{uri: manga.thumbnail}}
            style={{ width: 120, height:170, marginRight: 12, borderRadius: 7 }}
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