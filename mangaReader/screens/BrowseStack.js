import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {BrowseScreen, ChapterReaderScreen, MangaDetailsScreen, MangaSearchScreen} from './index';
import {TouchableOpacity, TextInput, View} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator();

export default function BrowseStack({mangaList, setMangaList, libraryList, setLibraryList}) {

    return (
        <Stack.Navigator>
            <Stack.Screen name='Browse' options={({ navigation }) => ({
                headerRight: () => (
                    <TouchableOpacity onPress={() => navigation.navigate('mangaSearch')}>
                        <Ionicons name="search" size={24} color="black" />
                    </TouchableOpacity>
                ),
            })}>
                {(props) => (
                    <BrowseScreen
                        {...props}
                        mangaList={mangaList}
                        setMangaList={setMangaList}
                    />
                )}
            </Stack.Screen> 
            
            <Stack.Screen name='MangaDetails' options={{ title: 'Details'}}>
                {(props) => (
                    <MangaDetailsScreen
                        {...props}
                        libraryList={libraryList}
                        setLibraryList={setLibraryList}
                    />
                )}
            </Stack.Screen>
            
            <Stack.Screen name='ChapterReader' component={ChapterReaderScreen} options={{ title: 'Reader'}} />

            <Stack.Screen name='mangaSearch' options={{ headerTitle: ''}}>
                {(props) => (
                    <MangaSearchScreen
                        {...props}
                    />
                )}
            </Stack.Screen>
        </Stack.Navigator>
    );
}


