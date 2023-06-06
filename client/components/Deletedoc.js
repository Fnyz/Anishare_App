import { Alert, Text, TouchableOpacity, View } from 'react-native';
import {doc, deleteDoc}  from 'firebase/firestore';
import React, { Component } from 'react'
import { Feather } from '@expo/vector-icons';
import { db } from '../firebase';
import Toast from 'react-native-toast-message';
import { Button } from 'react-native-paper';


export class Deletedoc extends Component {


  state={
    click:false,
  }



    handleDelete = (postId, navigation)=>{
      this.setState({click:true});
        deleteDoc(doc(db, 'posts', postId)).then(()=>{
          this.setState({click:false});
          Toast.show({
            type: 'success',
            text1: 'Post is deleted successfully! 👋',
            position:'top',
          });
            navigation.goBack();   
        })

    }

  render() {
    return (
      
      
      
      <View>
         {this.state.click ? (
           <Button loading style={{
            position:'relative',
            right:-25,
            top:-4,
           }}
           textColor='#ff7979' 
           >
           </Button>
         ):(
         <TouchableOpacity onPress={()=>this.handleDelete(this.props.postId, this.props.navigation)}>
              <Feather name="trash-2" size={24} color="black" style={{
                opacity:0.5
              }}/>
          </TouchableOpacity>

         )}
      </View>
            


      
    
    )
  }
}

export default Deletedoc