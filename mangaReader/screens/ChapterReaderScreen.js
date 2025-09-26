import React, {useEffect, useState} from 'react';
import {View, Text, Image, ActivityIndicator, Dimensions, FlatList} from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function ChapterReaderScreen({route}){
    const {chapter} = route.params;
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    /* console.log(JSON.stringify(chapter, null, 2)); */

    useEffect(() => {
        const fetchPages = async () => {
            try {
                const res = await fetch(`https://api.mangadex.org/at-home/server/${chapter.id}`);
                const data = await res.json();
                /* console.log('testing chapter info: ', data); */
                if (!data || !data.baseUrl || !data.chapter) {
                    throw new Error("Invalid chapter data");
                }

                const imageUrls = data.chapter.data.map(
                    (file) => `${data.baseUrl}/data/${data.chapter.hash}/${file}`
                );

                setPages(imageUrls);
                
            } catch(err){
                console.error('Error fetching chapter images', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchPages();
    }, [chapter.id]); // the stuff in the brackets make it so that this runs 
    // once when the component first mounts and then again when chapter.id changes

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
        <FlatList
            data={pages}
            keyExtractor={(item, index) => `${chapter.id}-${index}`}
            initialNumToRender={6}
            maxToRenderPerBatch={10}
            windowSize={10}
            renderItem={({ item, index }) =>(
                <Image
                    source={{ uri: item}}
                    resizeMode= "contain"
                    style={{ width: screenWidth, height: screenWidth * 1.4, marginBottom: 8 }}
                    onError={() => console.warn(`Image ${index + 1} failed to load`)}
                />
            )}
        />
    )
}