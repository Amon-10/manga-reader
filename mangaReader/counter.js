import React, {useState} from 'react';
import {View, Text, Button} from 'react-native';

export default function counter(){
    const [count, setCount] = useState(0); 
    return(
        <View style={{flex:1, alignItems: 'center', justifyContent:'center', fontSize: 18}}>
        <Text>
            count = {count}
        </Text>
        <Button onPress={() => setCount(count + 1)} title= 'Increase'/>
        <Button onPress={() => setCount(count - 1)} title= 'decrease'/>
        </View>
    );
}