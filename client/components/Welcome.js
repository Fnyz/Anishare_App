import { View, Text} from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';

const Welcome = () => {
  return (
    <View style={{
        justifyContent: 'center',
        alignItems:'center',
        flex:1,
    }}>
     <LottieView style={{
        width:300,
     }} source={require('../assets/Img/75705-welcome-animation.json')} autoPlay loop/>
     <Text variant="displayLarge" style={{
        fontSize:40,
        fontWeight:'bold',
        color:'coral'
     }}>Welcome user</Text>
    </View>
  )
}

export default Welcome