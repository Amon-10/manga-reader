import React from 'react';
import {View, Text, FlatList, Image, TouchableOpacity} from 'react-native';
import { useRoute } from '@react-navigation/native';

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
        </View>
      );
}