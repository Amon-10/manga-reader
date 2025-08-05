import React, { useState } from 'react';
import {View, Text, FlatList, Image, TouchableOpacity, TextInput} from 'react-native';

export function SearchBar(){
    return(
        <View>
            <TextInput
                style={{ height: 50, fontSize: 19 }}
                placeholder='search'
            />
        </View>
    );
}

export default function MangaSearchScreen(){
  
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  return(
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>search</Text>
    </View>
  );
}