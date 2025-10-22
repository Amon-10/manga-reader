import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, Image, ActivityIndicator, Dimensions, FlatList } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';

const screenWidth = Dimensions.get('window').width;

function AutoSizedImage({ uri, index }) {
  const [ratio, setRatio] = useState(0.7); // default ratio for manga

  useEffect(() => {
    let mounted = true;
    Image.getSize(
      uri,
      (width, height) => {
        if (mounted && width && height) {
          setRatio(width / height); // dynamically adjust ratio
        }
      },
      () => console.warn(`Failed to get size for image ${index + 1}`)
    );
    return () => {
      mounted = false;
    };
  }, [uri]);

  return (
    <Image
      source={{ uri }}
      resizeMode="contain"
      style={{
        width: screenWidth,
        aspectRatio: ratio,
        marginBottom: 8,
      }}
    />
  );
}

export default function ChapterReaderScreen({ route }) {
  const { chapter } = route.params || {};

  // Hooks must run unconditionally at top-level
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const db = useSQLiteContext();
  const flatListRef = useRef(null);
  const currentIndexRef = useRef(0);

  // Fetch pages
  useEffect(() => {
    let cancelled = false;

    const fetchPages = async () => {
      if (!chapter || !chapter.id) {
        setError(true);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `https://api.mangadex.org/at-home/server/${chapter.id}`
        );
        const data = await res.json();

        if (!data || !data.baseUrl || !data.chapter) {
          throw new Error('Invalid chapter data');
        }

        const imageUrls = data.chapter.data.map(
          (file) => `${data.baseUrl}/data/${data.chapter.hash}/${file}`
        );

        if (!cancelled) setPages(imageUrls);
      } catch (err) {
        console.error('Error fetching chapter images', err);
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPages();

    return () => {
      cancelled = true;
    };
  }, [chapter]);

  // Safe DB helpers: check for runAsync and catch errors
  const safeRun = useCallback(async (sql, params = []) => {
    try {
      if (db && typeof db.runAsync === 'function') {
        await db.runAsync(sql, params);
      } else {
        // fallback: try exec or ignore
        console.warn('DB runAsync not available; skipping:', sql);
      }
    } catch (e) {
      console.warn('DB operation failed', e);
    }
  }, [db]);

  // Start tracking history when chapter loads
  useEffect(() => {
    if (!chapter || !chapter.id) return;

    safeRun(
      `INSERT OR IGNORE INTO history(chapterId, mangaId, lastPage, completed) VALUES (?, ?, ?, ?)`,
      [chapter.id, chapter.mangaId || null, 0, 0]
    );
  }, [chapter, safeRun]);

  // Viewability callback to update last page and mark completed at last page
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (!viewableItems || viewableItems.length === 0) return;
    const firstVisible = viewableItems[0];
    const index = firstVisible.index ?? 0;
    currentIndexRef.current = index;

    // update last page (use 1-based index for UX)
    safeRun(
      `UPDATE history SET lastPage = ? WHERE chapterId = ?`,
      [index + 1, chapter.id]
    );

    // if last page, mark completed
    if (pages.length > 0 && index === pages.length - 1) {
      safeRun(
        `UPDATE history SET completed = 1 WHERE chapterId = ?`,
        [chapter.id]
      );
    }
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <ActivityIndicator size="large" color="gray" />
        <Text>Loading pages...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <Text style={{ color: 'red' }}>
          Failed to load chapter. Please try again later.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      ref={flatListRef}
      data={pages}
      keyExtractor={(item, index) => `${chapter.id}-${index}`}
      initialNumToRender={6}
      maxToRenderPerBatch={10}
      windowSize={10}
      renderItem={({ item, index }) => (
        <View style={{ alignItems: 'center', marginBottom: 8 }}>
          <AutoSizedImage uri={item} index={index} />
          <Text style={{ fontSize: 12, color: 'black' }}> {index + 1} / { pages.length }</Text>
        </View>
      )}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
    />
  );
}
