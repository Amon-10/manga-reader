import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';

const Tab = createBottomTabNavigator();

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

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList 
        data={dummyManga}
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
        <View style={{ flexDirection: 'row', marginBottom: 12, alignItems: 'center' }}>
          <Image 
            source={{ uri: item.thumbnail }}
            style={{ width: 160, height:220, marginRight: 12, borderRadius: 4 }}
          />
          <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 18, marginBottom: 8 }}>
              {item.title}
            </Text>
            
            {/* <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity style={{ backgroundColor: '#4CAF50', padding: 6, borderRadius: 4 }}>
                <Text style={{ color: '#fff' }}>Continue</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{ backgroundColor: '#f44336', padding: 6, borderRadius: 4 }}>
                <Text style={{ color: '#fff' }}>Remove</Text>
              </TouchableOpacity>
            </View> */}
          </View>
        </View>)}
      />
    </View>
  );
}

function BrowseScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Browse</Text>
    </View>
  );
}

function HistoryScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>History</Text>
    </View>
  );
}

function MoreScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>More</Text>
    </View>
  );
}

export default function App() {
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
        <Tab.Screen name="Library" component={LibraryScreen}/>
        <Tab.Screen name="History" component={HistoryScreen}/>
        <Tab.Screen name="Browse" component={BrowseScreen}/>
        <Tab.Screen name="More" component={MoreScreen}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

