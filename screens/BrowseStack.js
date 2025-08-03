import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {BrowseScreen, ChapterReaderScreen, MangaDetailsScreen, mangaSearchScreen} from './index';
import {TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
/* import { useNavigation } from '@react-navigation/native'; */

const Stack = createNativeStackNavigator();

export default function BrowseStack({mangaList, setMangaList, libraryList, setLibraryList}) {

    /* const navigation = useNavigation(); */
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
                    libraryList={libraryList}
                    setLibraryList={setLibraryList}
                    />
                )}
            </Stack.Screen> 
            
            <Stack.Screen name='MangaDetails' component={MangaDetailsScreen} options={{ title: 'Details'}} />
            
            <Stack.Screen name='ChapterReader' component={ChapterReaderScreen} options={{ title: 'Reader'}} />

            <Stack.Screen name='mangaSearch' component={mangaSearchScreen} options={{ title: 'Search manga'}}/>
        </Stack.Navigator>
    );
}


