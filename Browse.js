import React, {useState} from 'react';
import {View, Text, Button, FlatList, Image, TouchableOpacity} from 'react-native';

export default function Browse(){
     const dummyManga = [
        {
            id:'1',
            title:'One piece',
            thumbnail: 'https://areajugones.sport.es/wp-content/uploads/2019/09/OnePiecePoster.jpg',
        },
        {
            id:'2',
            title:'kono oto tomare',
            thumbnail:'https://th.bing.com/th/id/OIP.EHyu_Pw3XRUzETH5qT1oggHaLH?w=201&h=302&c=7&r=0&o=7&pid=1.7&rm=3',
        },
        {
            id:'3',
            title:'Berserk',
            thumbnail:'https://th.bing.com/th/id/OIP.fyrdu2Swsa9NuJitn-anWgHaKi?w=127&h=180&c=7&r=0&o=5&pid=1.7',
        },
     ]   

    return (
        <View style={{flex: 1, padding: 14}}>
            <FlatList
                data={dummyManga}
                numColumns={2}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={{position: 'relative',paddingBottom: 5, marginTop:40, marginRight: 10}}>   
                        <Image
                            source={{uri: item.thumbnail}}
                            style={{ width: 160, height: 220, borderRadius: 7}}
                        />
                        <Text style={{ position: 'absolute', bottom: 50, left: 6, backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', padding: 2, borderRadius: 7}}>
                            {item.title}
                        </Text>
                        <View style={{marginTop: 43}}>
                            <TouchableOpacity onPress={() => alert('Read this manga')} style={{position:'absolute', bottom: -30,backgroundColor:'green', borderRadius: 7, alignItems:'center', width:'40%'}}>
                                <Text style={{color: 'white', padding: 6}}>Read</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity onPress={() => alert('Save this manga')} style={{position:'absolute', bottom: 10,backgroundColor:'#2196F3', borderRadius: 7, alignItems:'center', width:'40%'}}>
                                <Text style={{color: 'white', padding: 6}}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

