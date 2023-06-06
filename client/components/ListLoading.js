import { View, Text} from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';  

const LisLoading = ({data}) => {
    
  return (
    <View style={{
        justifyContent: 'center',
        alignItems:'center',
        flex:1,
    }}>
     <LottieView style={{
        width:300,
     }} source={require('../assets/Img/68737-pochita-improved.json')} autoPlay loop/>
     <Text variant="displayLarge" style={{
        fontSize:40,
        fontWeight:'bold',
        color:'coral'
     }}>{data?.length === 0 ? 'No post found!': 'Please wait ...'}</Text>

    </View>
  )
}

export default LisLoading