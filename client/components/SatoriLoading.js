import { Text, View } from 'react-native'
import React, { Component } from 'react'
import LottieView from 'lottie-react-native';

export class SatoriLoading extends Component {
  render() {
    return (
        <View style={{
            justifyContent: 'center',
            alignItems:'center',
            flex:1,
        }}>
         <LottieView style={{
            width:170,
         }} source={require('../assets/Img/66470-neko-gojo-satoru.json')} autoPlay loop/>
        
    
        </View>
      )
  }
}

export default SatoriLoading