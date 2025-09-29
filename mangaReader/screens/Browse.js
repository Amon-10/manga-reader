import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';

function BrowseScreen({ mangaList, setMangaList, navigation }) {
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20;

  const fetchManga = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.mangadex.org/manga?limit=${limit}&offset=${offset}&includes[]=cover_art&order[followedCount]=desc`
      );

      if (!response.ok) {
        throw new Error('API failed');
      }

      const data = await response.json();
      const newManga = data.data || [];

      if (newManga.length === 0) {
        setHasMore(false);
        return;
      }

      setMangaList((prevList) => {
        const newItems = newManga.filter(
          (manga) => !prevList.some((item) => item.id === manga.id)
        );
        return [...prevList, ...newItems];
      });

      setOffset((prev) => prev + limit);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManga();
  }, []);

  const getCoverUrl = (manga) => {
    const coverRel = manga.relationships?.find((rel) => rel.type === 'cover_art');
    if (!coverRel) return null;
    return `https://uploads.mangadex.org/covers/${manga.id}/${coverRel.attributes?.fileName}.256.jpg`;
  };

  return (
    <View style={{ flex: 1, paddingRight: 14, paddingLeft: 14, paddingBottom: 0 }}>
      <FlatList
        data={mangaList}
        numColumns={2}
        keyExtractor={(item) => item.id}
        onEndReached={fetchManga}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => {
          const title = item.attributes?.title?.en || Object.values(item.attributes?.title || {})[0];
          return (
            <View style={{ position: 'relative' }}>
              <TouchableOpacity onPress={() => navigation.navigate('MangaDetails', { manga: item })}>
                <Image
                  source={{ uri: getCoverUrl(item) || 'https://via.placeholder.com/150' }}
                  style={{ width: 160, height: 220, marginRight: 12, borderRadius: 7, marginTop: 10 }}
                />
                <Text
                  style={{
                    position: 'absolute',
                    bottom: 5,
                    left: 5,
                    color: 'white',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    padding: 2,
                    borderRadius: 4,
                    fontSize: 15,
                    maxWidth: '85%',
                  }}
                >
                  {title || 'No title'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
        ListFooterComponent={loading ? <ActivityIndicator /> : null}
      />
    </View>
  );
}

export default React.memo(BrowseScreen);
