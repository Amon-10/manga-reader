import React, {useState} from 'react';
import {View, Text, TextInput, Button} from 'react-native';

export default function Temp() {
    const [inputTemp, setInputTemp] = useState('');
    const [convertedTemp, setConvertedTemp] = useState('');
    const [unit, setUnit] = useState('');
    
    return(
        <View style={{flex: 1, alignItems: 'center', marginTop: 250}}>
            <TextInput 
                style={{
                    height: 40, 
                    borderColor: 'gray', 
                    backgroundColor: 'rgba(0,0,0,0.6)', 
                    color: 'white', 
                    width: '95%',
                    borderRadius: 7,
                }}
                placeholder='Type here'
                value={inputTemp}
                onChangeText={(newTemp) => setInputTemp(newTemp)}
                />
            <View style= {{marginTop: 20, width: '95%'}}>
                <Button onPress={() => { 
                    setConvertedTemp((parseFloat(inputTemp) * 9/5 + 32).toFixed(2));
                    setUnit('degree Fahrenheit');
                }} 
                title='convert to fahrenheit'
                />

                <View style={{marginTop: 10}}> 
                    <Button onPress={() => {
                        setConvertedTemp(((parseFloat(inputTemp) - 32)* 5/9).toFixed(2));
                        setUnit('degree Celsius');
                    }} 
                    title='convert to celsius'
                    />
                </View>
                <Text style={{marginTop: 20, fontSize: 18}}>Temperature = {inputTemp}</Text>
                <Text style={{marginTop: 20, fontSize: 18}}>Converted Temperature = {convertedTemp} {unit}</Text>
            </View>
        </View>
    );
}