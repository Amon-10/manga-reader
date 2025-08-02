import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {BrowseScreen, ChapterReaderScreen, MangaDetailsScreen} from './index';

const Stack = createNativeStackNavigator();

export default function BrowseStack({mangaList, setMangaList, libraryList, setLibraryList}) {
    return (
        <Stack.Navigator>
            <Stack.Screen name='Browse'>
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
        </Stack.Navigator>
    );
}


