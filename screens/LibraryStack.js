import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {LibraryScreen, MangaDetailsScreen} from './index';

const Stack = createNativeStackNavigator();

export default function LibraryStack({mangaList, setMangaList}){
    return(
        <Stack.Navigator>
            <Stack.Screen name='Library'>
                {(props) => (
                    <LibraryScreen
                    {...props}
                    mangaList={mangaList}
                    setMangaList={setMangaList}
                    />
                )}                
            </Stack.Screen>
            <Stack.Screen name='MangaDetails' component={MangaDetailsScreen} options={{ title: 'Details'}} />
        </Stack.Navigator>
    );
}