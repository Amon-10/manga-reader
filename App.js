import React, {useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import Browse from './Browse';

const Tab = createBottomTabNavigator();

/* Library */
function LibraryScreen() {
  const dummyManga = [
    {
      id: '1', 
      title: 'One Piece',
      thumbnail: 'https://areajugones.sport.es/wp-content/uploads/2019/09/OnePiecePoster.jpg',
    },
    {
      id: '2', 
      title: 'Tokyo ghoul',
      thumbnail: 'https://th.bing.com/th/id/OIP.6mrZO44Dax_bf-cq-0eFzwHaKd?w=203&h=287&c=7&r=0&o=7&pid=1.7&rm=3'
    },
    {
      id: '3', 
      title: 'Attack on Titan',
      thumbnail: 'https://th.bing.com/th/id/OIP.3WOE0d3rVVi06Wovztcr0wHaLR?w=201&h=306&c=7&r=0&o=5&pid=1.7',
    },
  ];
  /* const [mangaList, setMangaList] = useState(dummyManga); */

  const handleRemove = (id) => {
  setMangaList(prevList => prevList.filter(manga => manga.id !== id));
  };

  return (
    <View style={{ flex: 1, padding: 14 }}>
      <FlatList 
        data={mangaList}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
        <View style={{ position: 'relative',marginBottom: 10 }}>
          <Image 
            source={{ uri: item.thumbnail }}
            style={{ width: 160, height:220, marginRight: 12, borderRadius: 7 }}
          />
          <TouchableOpacity onPress={() => handleRemove(item.id)}
          style={{ position:'absolute', top: 5, right: 17, backgroundColor: '#f44336', padding: 2, borderRadius: 4 }}>
              <Text style={{ color: '#fff' }}>Remove</Text>
          </TouchableOpacity>

          <Text style={{ position:'absolute', bottom: 5, left: 5, color: 'white', backgroundColor: 'rgba(0,0,0,0.6)', padding: 2, borderRadius: 4, fontSize: 15 }}>
            {item.title}
          </Text>
        </View>)}
      />
    </View>
  );
}

/* Browse */
function BrowseScreen() {
  const dummyBrowseData = [
    {
      id: '1', 
      title: 'One Piece',
      thumbnail: 'https://areajugones.sport.es/wp-content/uploads/2019/09/OnePiecePoster.jpg',
    },
    {
      id: '2', 
      title: 'kono oto tomare',
      thumbnail: 'https://th.bing.com/th/id/OIP.EHyu_Pw3XRUzETH5qT1oggHaLH?w=201&h=302&c=7&r=0&o=7&pid=1.7&rm=3'
    },
    {
      id: '3', 
      title: 'Attack on Titan',
      thumbnail: 'https://th.bing.com/th/id/OIP.3WOE0d3rVVi06Wovztcr0wHaLR?w=201&h=306&c=7&r=0&o=5&pid=1.7',
    },
    {
      id: '4',
      title: 'Berserk',
      thumbnail: 'https://th.bing.com/th/id/OIP.fyrdu2Swsa9NuJitn-anWgHaKi?w=127&h=180&c=7&r=0&o=5&pid=1.7'
    },
    {
      id: '5',
      title: 'Frieren',
      thumbnail: 'https://th.bing.com/th/id/OIP.B3miyOevlCrPdPlEtLRitAHaLo?w=199&h=313&c=7&r=0&o=7&pid=1.7&rm=3'
    }
  ];
  return (
    <View style={{ flex: 1, padding: 14 }}>
      <FlatList
        data={dummyBrowseData}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <View style={{ position: 'relative', marginBottom: 10}}>
            <Image 
              source={{ uri: item.thumbnail }}
              style={{ width: 160, height:220, marginRight: 12, borderRadius: 7 }}
            />
            <TouchableOpacity style={{ position:'absolute', top: 5, right: 17, backgroundColor: '#4CAF50', padding: 2, borderRadius: 4}}>
              <Text style={{color: '#fff'}}>Add to library</Text>
            </TouchableOpacity>
            <Text style={{ position:'absolute', bottom: 5, left: 5, color: 'white', backgroundColor: 'rgba(0,0,0,0.6)', padding: 2, borderRadius: 4, fontSize: 15 }}>
              {item.title}
            </Text>
          </View>
        )}/>
    </View>
  );
}
/* History */
function HistoryScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>History</Text>
    </View>
  );
}

/* More */
function MoreScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>More</Text>
    </View>
  );
}

export default function App() {
  /* const [mangaList, setMangaList] = useState([]);
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName='Library'
      screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Library') {
              iconName = focused ? 'book' : 'book-outline';
            }
            else if (route.name ==='History') {
              iconName = focused ? 'timer' : 'timer-outline';
            } 
            else if (route.name === 'Browse') {
              iconName = focused ? 'search' : 'search-outline';
            }
            else if (route.name === 'More') {
              iconName = focused ? 'ellipsis-horizontal' : 'ellipsis-horizontal-outline';
            }

            // Return the icon component
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
        >
        <Tab.Screen name="Library" children={() => <BrowseScreen mangaList={mangaList} setMangaList={setMangaList}/>}/>
        <Tab.Screen name="History" component={HistoryScreen}/>
        <Tab.Screen name="Browse" children={() => <BrowseScreen mangaList={mangaList} setMangaList={setMangaList}/>}/>
        <Tab.Screen name="More" component={MoreScreen}/>
      </Tab.Navigator>
    </NavigationContainer>
  ); */
  return <Browse />
}

