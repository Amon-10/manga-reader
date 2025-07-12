import React,{useState} from 'react';
import {View, Text, Button, FlatList, Image, TouchableOpacity} from 'react-native';
import Browse,{dummyManga} from './Browse';

export default function Library(){

     return (
        <View>
            <FlatList
                data={dummyManga}
                numColumns={2}
                keyExtractor={ item => item.id }
                renderItem={({item}) => (
                    <View>
                        <Image
                            source={{ uri: item.thumbnail }}
                            style={{ width:160, height: 220 }}
                        />
                        <Text>{item.title}</Text>
                        <View>
                            <TouchableOpacity >
                                <Text>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
     );
}