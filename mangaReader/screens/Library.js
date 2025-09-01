import React from 'react';
import {View, Text, FlatList, Image, TouchableOpacity} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { getCoverUrl } from './getCover';

export default function LibraryScreen({libraryList, navigation}) {
  return (
    <View style={{ flex: 1, padding: 14 }}>
      {libraryList.length === 0
      ? <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Library empty</Text></View>
      :
   
      <FlatList 
        data={libraryList}
        numColumns={2}
        keyExtractor={(item) => item.title || item.slug}
        renderItem={({item}) => (
        <View style={{ position: 'relative',marginBottom: 10 }}>
          <TouchableOpacity onPress={() => { navigation.navigate('MangaDetails', {manga: item})}}>
            <Image 
              source={{ uri: getCoverUrl(item) }}
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
              {item.title || item.slug || 'no title'}
            </Text>
          </TouchableOpacity>
        </View>)}
      />}
    </View>
  );
}