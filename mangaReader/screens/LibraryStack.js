import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {LibraryScreen, MangaDetailsScreen, ChapterReaderScreen} from './index';

const Stack = createNativeStackNavigator();

export default function LibraryStack({libraryList, setLibraryList}){
    return(
        <Stack.Navigator>
            <Stack.Screen name='Library'>
                {(props) => (
                    <LibraryScreen
                    {...props}
                    libraryList={libraryList}
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
        </Stack.Navigator>
    );
}