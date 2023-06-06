import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons';


const Likes = ({like, userId, id, handleLike}) => {
    return (
     <>
     <TouchableOpacity onPress={()=> handleLike(userId, id)}>  
     <View style={{
       flexDirection:'row',
       justifyContent:'center',
       alignItems:'center',
       gap:10,
     }}>
     {like.length > 0 ? 
     
       like.find(id => id === userId) ? 
        (<>
        <AntDesign name="like1" size={24} color="gray" />
        <Text style={{
         fontSize:15,
        }}>
        {like.length > 2 ? `You and ${like.length - 1} others`: `${like.length} Like${like.length > 1 ? 's': ''}`}
        </Text>
       </>
       )
 
       : (
         <>
         <AntDesign name="like2" size={24} color="black" />
         <Text style={{
         fontSize:15,
        }}>
         {like.length} {like.length === 1 ? 'Like' : 'Likes'} 
         </Text>
         </>
       ) 
     : (
       <>
      <AntDesign name="like2" size={24} color="black" />
      <Text>Like</Text>
       </>
     )}
     </View>
     </TouchableOpacity>
     </>
    )
   
 }
 
export default Likes