/* import * as React from 'react'; */
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';

const Tab = createBottomTabNavigator();

function LibraryScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Library</Text>
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
      <Tab.Navigator initialRouteName='Library'>
        <Tab.Screen name="Library" component={LibraryScreen}/>
        <Tab.Screen name="History" component={HistoryScreen}/>
        <Tab.Screen name="Browse" component={BrowseScreen}/>
        <Tab.Screen name="More" component={MoreScreen}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

