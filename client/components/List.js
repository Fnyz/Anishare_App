import {View, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import {Card, Text} from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import moment from 'moment';
import {getDoc, doc, updateDoc, collection, addDoc, serverTimestamp} from 'firebase/firestore'
import { db } from '../firebase';
import Likes from './Likes';




export class Lists extends Component {

  state = {

    isLike:false,
    rawData: [],

  }

  

  
  handleLike = (userid, postId) => {
    const docs = doc(db, 'posts', postId);
    
    getDoc(docs).then(doc =>{
      this.getPostData(doc.data(), userid, postId);
    })

  
    
  }

  getPostData = async (value, userId, postId) => {

    

    const index = value.likes.findIndex(id => id === String(userId));
    const notify = collection(db, 'notifications');
    const ownersId = value.userId;
    const owner = value.owner;
    const postTitle = value.title.trim();
    const about = 'like';

    const userData = doc(db, "users", userId);
    const res = await getDoc(userData);
    const username = res.data().username;
    const wholename = `${res.data().firstname.charAt(0)}${res.data().lastname.charAt(0)}  `
   
  
 
    if(index === -1){
      value.likes.push(userId);
      const addNotification = await addDoc(notify, {
        owner,
        person: username,
        ownersId:ownersId,
        postId,
        about,
        comments: '',
        wholename,
        title:postTitle,
        score:1,
        createdAt: serverTimestamp()
       })

    }else{
      value.likes = value.likes.filter(id => id !== String(userId));
    }

    const ref = doc(db, "posts", postId);

    updateDoc(ref, {
      likes: value.likes
     }).then(()=>{


      const ref = collection(db, 'notification',);
      addDoc(ref, {
    
        
    })



     }).catch(err => {
       console.log(err);
     }); 

    
  }


  render() {

    const { images, title, owner, tags, message, createdAt, id, usrId, userId, likes} =  this.props;
  
    const newTags =  `#${tags.split(',').join('#')}`;
    return (

        <>

        <Card style={{
            margin:10,
            padding:10,
            position:'relative',
            borderColor:this.props.choose === id ? '#ff7979': null,
        }}>
       
        <Card.Cover source={{uri:images}} style={{
            opacity:0.8,
           
        }}/>
        <Card.Content >
          <View style={{
            flexDirection:'row',
            justifyContent:'space-between',
            position:'absolute',
            right:10,
            top:-180,
          }}>
            {userId == usrId && (

            <TouchableOpacity onPress={()=> this.props.navigation.navigate('AddUpdate',{
              add:this.props.add,
              id:this.props.usrId,
              postId:id,
            })} style={{
              borderRadius:5,
              padding:5,
              backgroundColor:'rgba(0,0,0,0.2)'
            }}>
            <MaterialCommunityIcons name="dots-horizontal" size={24} color="white" />
            </TouchableOpacity> 
            ) }
          </View>
          <Text variant="titleLarge" style={{
            marginTop:10,
          }}>{title}</Text>
          <Text variant="bodyMedium">{newTags}</Text>
          <Text variant="bodyMedium" style={{
            marginTop:10,
          }}>{message}</Text>
          <Text style={{
            marginTop:10,
            opacity:0.6,
            textAlign:'right',
          }}>{owner || 'Kiritian'} / {createdAt? moment(createdAt.toDate()).calendar(): 'loading time...'}</Text>
          <View style={{
            flexDirection:'row',
            justifyContent:'space-between',
            marginTop:20,
          }}>
           
           <Likes like = {likes} userId = {usrId} id={id} handleLike={this.handleLike}/>
        
          <TouchableOpacity onPress={()=>this.props.navigation.navigate('Details', {
            postId:id,
            usrId:usrId,
            postName:title,
          })}>
          <FontAwesome name="eye" size={24} color="black" style={{
            opacity:0.5
          }}/>
          </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>
      </>
    )
  }
}

export default Lists