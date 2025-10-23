import React, {useEffect, useState, useRef, useCallback} from 'react';
import {View, Text, Image, ActivityIndicator, Dimensions, FlatList, Animated} from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';

const screenWidth = Dimensions.get('window').width;

export default function ChapterReaderScreen({route}){
    const {chapter, initialPage = 0} = route.params || {};
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const db = useSQLiteContext();
    const flatListRef = useRef(null);
    const currentIndexRef = useRef(0);
    const [resumeToast, setResumeToast] = useState('');
    const toastOpacity = useRef(new Animated.Value(0)).current;

    // fetch pages
    useEffect(() => {
        let cancelled = false;
        const fetchPages = async () => {
            try {
                const res = await fetch(`https://api.comick.fun/chapter/${chapter.hid}/get_images`);
                const data = await res.json();
                if (!cancelled) setPages(data);
            } catch(err){
                console.error('Error fetching chapter images', err);
                if (!cancelled) setError(true);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchPages();
        return () => { cancelled = true; };
    }, [chapter.hid]); // runs when component mounts or chapter.hid changes

    const safeRun = useCallback(async (sql, params=[]) => {
      try {
        if (db && typeof db.runAsync === 'function') await db.runAsync(sql, params);
        else console.warn('DB runAsync not available, skipping:', sql);
      } catch (e) {
        console.warn('DB operation failed', e);
      }
    }, [db]);

    // ensure history row exists and has mangaId
    useEffect(() => {
      if (!chapter || !chapter.hid) return;
      safeRun(`INSERT OR IGNORE INTO history(chapterId, mangaId, lastPage, completed) VALUES (?, ?, ?, ?)`, [chapter.hid, chapter.mangaId || null, 0, 0]);
      if (chapter.mangaId) {
        safeRun(`UPDATE history SET mangaId = ? WHERE chapterId = ? AND (mangaId IS NULL OR mangaId = '')`, [chapter.mangaId, chapter.hid]);
      }
    }, [chapter, safeRun]);

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

        // scroll to initialPage when pages are ready
        useEffect(() => {
            if (!flatListRef.current || pages.length === 0) return;
            const idx = Math.max(0, Math.floor(Number(initialPage) || 0));
            setTimeout(() => {
                try {
                    flatListRef.current.scrollToIndex({ index: idx, animated: false });
                    currentIndexRef.current = idx;
                    safeRun(`UPDATE history SET lastPage = ?, lastRead = CURRENT_TIMESTAMP WHERE chapterId = ?`, [idx + 1, chapter.hid]);
                    if (idx > 0) {
                        setResumeToast(`Resuming at page ${idx + 1}`);
                        Animated.timing(toastOpacity, { toValue: 1, duration: 200, useNativeDriver: true }).start(() => {
                            setTimeout(() => {
                                Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => setResumeToast(''));
                            }, 1400);
                        });
                    }
                } catch (e) {
                    console.warn('Could not scroll to initial page', e);
                }
            }, 150);
        }, [pages, initialPage, safeRun, chapter]);

        const onViewableItemsChanged = useRef(({ viewableItems }) => {
            if (!viewableItems || viewableItems.length === 0) return;
            const firstVisible = viewableItems[0];
            const index = firstVisible.index ?? 0;
            currentIndexRef.current = index;
            safeRun(`UPDATE history SET lastPage = ?, lastRead = CURRENT_TIMESTAMP WHERE chapterId = ?`, [index + 1, chapter.hid]);
            if (pages.length > 0 && index === pages.length - 1) {
                safeRun(`UPDATE history SET completed = 1, lastRead = CURRENT_TIMESTAMP WHERE chapterId = ?`, [chapter.hid]);
            }
        }).current;

        const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    ref={flatListRef}
                    data={pages}
                    keyExtractor={(item, index) => item.b2key + index}
                    // estimate item layout for scrollToIndex
                    getItemLayout={(data, index) => {
                        const estHeight = Math.round(screenWidth / 0.7) + 8;
                        return { length: estHeight, offset: estHeight * index, index };
                    }}
                    initialNumToRender={6}
                    maxToRenderPerBatch={10}
                    windowSize={10}
                    renderItem={({ item, index }) => (
                        <Image
                            source={{ uri: `https://meo.comick.pictures/${item.b2key}`}}
                            resizeMode= "contain"
                            style={{ width: screenWidth, height: screenWidth * 1.4, marginBottom: 8 }}
                            onError={() => console.warn(`Image ${index + 1} failed to load`)}
                        />
                    )}
                    onViewableItemsChanged={onViewableItemsChanged}
                    onScrollToIndexFailed={({ index, averageItemLength }) => {
                        console.warn('onScrollToIndexFailed, falling back', index, averageItemLength);
                        const est = Math.round(averageItemLength || (screenWidth / 0.7) + 8);
                        try {
                            flatListRef.current.scrollToOffset({ offset: est * index, animated: false });
                        } catch (err) {
                            setTimeout(() => {
                                try { flatListRef.current.scrollToIndex({ index, animated: false }); } catch (e) { console.warn('Retry failed', e); }
                            }, 200);
                        }
                    }}
                    viewabilityConfig={viewabilityConfig}
                />
                {resumeToast ? (
                    <Animated.View style={{ position: 'absolute', top: 60, alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.75)', padding: 8, borderRadius: 6, opacity: toastOpacity }}>
                        <Text style={{ color: 'white' }}>{resumeToast}</Text>
                    </Animated.View>
                ) : null}
            </View>
        );
}