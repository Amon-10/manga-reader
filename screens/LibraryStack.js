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
                    setLibraryList={setLibraryList}
                    />
                )}                
            </Stack.Screen>
            <Stack.Screen name='MangaDetails' component={MangaDetailsScreen} options={{ title: 'Details'}} />

            <Stack.Screen name='ChapterReader' component={ChapterReaderScreen} options={{ title: 'Reader'}} />
        </Stack.Navigator>
    );
}