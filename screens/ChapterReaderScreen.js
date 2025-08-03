import React, {useEffect, useState} from 'react';
import {View, Text, Image, ScrollView, ActivityIndicator} from 'react-native';

export default function ChapterReaderScreen({route}){
    const {chapter} = route.params;
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPages = async () => {
            try {
                const res = await fetch(`https://api.comick.fun/chapter/${chapter.hid}/get_images`);
                const data = await res.json();
                console.log('testing chapter info: ', data);
                setPages(data);
                
            } catch(err){
                console.error('Error fetching chapter images', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPages();
    }, [chapter.hid]); // the stuff in the brackets make it so that this runs 
    // once when the component first mounts and then again when chapter.hid changes

    if (loading) return <ActivityIndicator size='large' color='gray'/>;

    return (
        <ScrollView>
            {pages.map((page, index) => (
                <Image
                    key={index}
                    source={{ uri: `https://meo.comick.pictures/${page.b2key}`}}
                    style={{ width: '100%', height: 500, resizeMode: 'contain' }} 
                />
            ))}
        </ScrollView>
    )
}