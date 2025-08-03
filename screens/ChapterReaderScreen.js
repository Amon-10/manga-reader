import React, {useEffect, useState} from 'react';
import {View, Text, Image, ScrollView, ActivityIndicator, Dimensions} from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function ChapterReaderScreen({route}){
    const {chapter} = route.params;
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchPages = async () => {
            try {
                const res = await fetch(`https://api.comick.fun/chapter/${chapter.hid}/get_images`);
                const data = await res.json();
                console.log('testing chapter info: ', data);
                setPages(data);
                
            } catch(err){
                console.error('Error fetching chapter images', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchPages();
    }, [chapter.hid]); // the stuff in the brackets make it so that this runs 
    // once when the component first mounts and then again when chapter.hid changes

    if (loading) {
        return (
            <View style={{flex:1, justifyContent: 'center', alignItems: 'center', padding: 16}}>
                <ActivityIndicator size='large' color='gray'/>
                <Text>Loading pages...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={{flex:1, justifyContent: 'center', alignItems: 'center', padding: 16}}>
                <Text style={{ color: 'red' }}>Failed to load chapter. Please try again later.</Text>
            </View>
        )
    }

    return (
        <ScrollView>
            {pages.map((page, index) => (
                <Image
                    key={index}
                    source={{ uri: `https://meo.comick.pictures/${page.b2key}`}}
                    style={{ width: screenWidth, height: screenWidth * 1.4, resizeMode: 'contain', marginBottom: 8, }} 
                    onError={() => console.warn(`Image ${index + 1} failed to load`)}
                />
            ))}
        </ScrollView>
    )
}