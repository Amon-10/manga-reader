import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {BrowseScreen, MangaDetailsScreen} from './index';

const Stack = createNativeStackNavigator();

export default function BrowseStack({mangaList, setMangaList}) {
    return (
        <Stack.Navigator>
            <Stack.Screen name='Browse'>
                {(props) => (
                    <BrowseScreen
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


