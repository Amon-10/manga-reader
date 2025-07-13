import React, {useState} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import {BrowseScreen, LibraryScreen, HistoryScreen, MoreScreen} from './screens';

const Tab = createBottomTabNavigator();

export default function App() {
  const [mangaList, setMangaList] = useState([]);
  
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
        <Tab.Screen name="Library">
          {() => <LibraryScreen mangaList={mangaList} setMangaList={setMangaList}/>}
        </Tab.Screen>

        <Tab.Screen name="History" component={HistoryScreen}/>

        <Tab.Screen name="Browse">
          {() => <BrowseScreen mangaList={mangaList} setMangaList={setMangaList}/> }
        </Tab.Screen>

        <Tab.Screen name="More" component={MoreScreen}/>
      </Tab.Navigator>
    </NavigationContainer>
  ); 
}

