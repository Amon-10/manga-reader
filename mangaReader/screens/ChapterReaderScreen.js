import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, Dimensions, FlatList } from 'react-native';

const screenWidth = Dimensions.get('window').width;

function AutoSizedImage({ uri, index }) {
  const [ratio, setRatio] = useState(0.7); // default ratio for manga

  useEffect(() => {
    Image.getSize(
      uri,
      (width, height) => {
        if (width && height) {
          setRatio(width / height); // dynamically adjust ratio
        }
      },
      () => console.warn(`Failed to get size for image ${index + 1}`)
    );
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
  const { chapter } = route.params;
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPages = async () => {
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

        setPages(imageUrls);
      } catch (err) {
        console.error('Error fetching chapter images', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, [chapter.id]);

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
    />
  );
}
