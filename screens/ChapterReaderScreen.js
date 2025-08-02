import React, {useEffect, useState} from 'react';
import {View, Text, Image, ScrollView} from 'react-native';

export default function ChapterReaderScreen({route}){
    const {chapter} = route.params;
    const [pages, setPages] = useState([]);

    useEffect(() => {
        const fetchPages = async () => {
            try {
                const res = await fetch(`https://api.comick.fun/chapter/${chapter.hid}/get_images`);
                const data = await res.json();
                console.log('testing chapter info: ', data);
                
            } catch(err){
                console.error(err);
            }
        };

        fetchPages();
    }, []);
}