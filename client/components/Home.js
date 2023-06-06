import { Text, View, TouchableOpacity, Alert, TouchableWithoutFeedback, Keyboard, ScrollView} from 'react-native'
import React, { Component, useState , useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Avatar, Badge, Button, Modal, PaperProvider, Portal} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ListBoard from './ListBoard';
import { AntDesign } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { Auth } from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, doc, getDoc, onSnapshot, orderBy, query, updateDoc, where } from "firebase/firestore";
import { db } from '../firebase';
import Welcome from './Welcome';
import { ActivityIndicator } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment'
import { Entypo } from '@expo/vector-icons';




Header = ({navigation, userId, isAdd}) => {


 

   const [username, setUsername] = useState('');
   const [avatar, setAvatar] = useState('');
   const [length, setLength] = useState(0);
   const [data, setData] = useState([]);
   const [visible, setVisible] = React.useState(false);
   const [id, setChoose] = useState(null);
   const [click, setClick] = useState(false);


  const hideModal = () => {
    setVisible(false);
    setClick(false);
  };
  const containerStyle = {backgroundColor: 'white', padding: 10};


   const getUserData = async () => {

    
const docRef = doc(db, "users", userId);
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
  setUsername(docSnap.data().username);
  setAvatar(`${docSnap.data().firstname.charAt(0)}${docSnap.data().lastname.charAt(0)}`)

  
  const docs = collection(db, 'notifications');
  const ref = query(docs, where('ownersId', '==', userId), orderBy('createdAt', 'desc'));

onSnapshot(ref,notify => {
  let value = [];
  let count = 0;
      notify.docs.forEach(element => {
          value.push({...element.data(), id: element.id});
      });
      value = value.filter(t => t.person.trim() !== docSnap.data().username.trim());
      setData(value);

      value?.map(t => {
        if(t?.score === 1){
          count++;
          setLength(count);
        }
      })
      
      
      
});
 
} else {
 
  console.log("No such document!");
}
     
   }

   handleClear = () => {
    setVisible(true);
    setClick(true);

   
   }
   handleShowNotify = (id, score, postId, title) => {
    setChoose(id);
    setLength(length - 1);
    const updateScore = doc(db, "notifications", id);
    updateDoc(updateScore, {
      score: score - 1}).then(()=>{

        navigation.navigate('Details', {
          postId,
          usrId:userId,
          postName:title,
        })
        setVisible(false);

      })

      

   

  
    
    
    
    }
   
  
   useEffect(()=>{
    getUserData();
    
   }, [])

  
    const logOut = () => {

      Alert.alert(
        "Do you wish to sign out!",
        "Please choose one of the following.",
        [
         {
          text: "No",
            onPress: () => {
              Toast.show({
                type: 'success',
                text1: 'Thank you for your response 👋',
                position:'top',
              });
            },
            style: "cancel"
            },
            { text: "Yes", onPress: () => {
            signOut(Auth).then(()=> {
               AsyncStorage.clear();  
                console.log('signOut');
                navigation.replace('SignInSignUp')})
              }}
            ]
        );

    }


    
    
    return (
      <>
    
        <View style={{
          marginTop:25,
        }}>
            <Text style={{
                alignSelf:'center',
                fontSize:30,
                opacity:0.7,
            }}>Anishare</Text>
            <Text style={{
                borderTopWidth:5,
                borderTopColor:'coral',
                width:75,
                alignSelf:'center',
            }}></Text>
        </View>
       
        <View style={{
            flexDirection:'row',
            alignItems:'center',
            justifyContent:'space-between',
            marginHorizontal:25,
            marginTop:10,
        }}>
        <View style={{
            flexDirection: 'row',
            alignItems:'center',
            gap:10,
        }}>
        <Avatar.Text size={70} label={avatar ? avatar : (
           <ActivityIndicator animating={true} color='white' size={15} style={{
            opacity:0.8,
          }}/>
          )} />
        <View>
            <Text style={{
                opacity:0.5,
            }}>Welcome user</Text>
            <Text style={{
                fontSize:20,
                margin:0,
                lineHeight:35,
            }}>{username ? username : (
              <ActivityIndicator animating={true} color='coral' size={15} style={{
                opacity:0.8,
              }}/>
              )} <MaterialCommunityIcons name="hand-wave-outline" size={24} color="coral" />
            </Text>
        </View>
        </View>
        <View style={{
        position:'relative',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        gap:7,
        }}>
          <TouchableOpacity onPress={handleClear}>

       {click ? (

<View style={{
  position:'relative',
}}>
<Badge style={{
  position:'absolute',
  right:-5,
  top:-2,
  zIndex:1,
}}>{length}</Badge>
<Ionicons name="notifications-off-outline" size={27} color="black" style={{
  opacity:0.5,
  zIndex:0,
}} />

</View>
        
       ):(

      <View style={{
        position:'relative',
      }}>
      <Badge style={{
        position:'absolute',
        right:-5,
        top:-2,
        zIndex:1,
      }}>{length}</Badge>
      <Ionicons name="notifications-outline" size={27} color="black" style={{
        opacity:0.5,
        zIndex:0,
      }} />

      </View>

       )}     

      </TouchableOpacity>
      <Text style={{
        fontSize:40,
        color:'coral'
      }}>/</Text>
      <TouchableOpacity onPress={()=> navigation.navigate('AddUpdate', {
        id:userId,
        name: username,
        add: isAdd,
      })}>
      <AntDesign name="pluscircleo" size={24} color="black" style={{
        opacity:0.5,
      }}/>
      </TouchableOpacity>
      <Text style={{
        fontSize:40,
        color:'coral'
      }}>/</Text>
     <TouchableOpacity onPress={()=> logOut()}>
      <AntDesign name="logout" size={24} color="black" style={{
        opacity:0.5,
      }} />
     </TouchableOpacity>
          
        </View>

<Portal>
<Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle} style={{
  marginHorizontal:20,
}}>

<View style={{
      flexDirection: 'row',
      justifyContent:'center',
      alignItems: 'center',
      marginBottom:10,
      gap:3
    }}>

    <Ionicons name="notifications-outline" size={30} color="#ff7979" />
    <Text style={{
      color:'#ff7979',
      fontSize:30,
      
    }}>
      Notifications
    </Text>

    </View>
  <ScrollView style={{
    height:300,
  }}>
   
    

  {!data.length ? (
    <Text>Don't have any notifications found!</Text>
  ): (
    data?.map((user, index) =>{
      return (
       
          <View style={{
            flexDirection: 'row',
            gap:10,
            alignContent:'center',
            marginVertical:5,
            borderWidth:1,
            borderColor: user?.score === 0 ? 'white' : 'white',
            backgroundColor:user?.score === 0 ? 'white' : '#dfe6e9',
            padding:6,
            borderRadius:10,
          }} key={index}>
          <Avatar.Text size={45} label={user.wholename ? user.wholename.trim() : (
           <ActivityIndicator animating={true} color='white' size={15} style={{
            opacity:0.8,
          }}/>
          )} />
          <View>
            <View style={{
              flexDirection:'row',
            }}>  
            <Text style={{
              fontSize:15,
              fontWeight:'bold',
             
            }}>{user?.person}</Text>
            <Text style={{
              fontSize:15,
              
            }}> is {user.about} your post. </Text>
            </View>
            <Text style={{
              fontSize:15,
              
            }}>about <Text style={{
              color:'#ff7979',
              fontWeight:'bold',
            }}>{user.title}</Text></Text>
            <Text style={{
              fontSize:12,
              marginTop:2,
              opacity:0.5,
        
            }}>{moment(user?.createdAt.toDate()).calendar()}</Text>
          </View>
          <TouchableOpacity style={{
            position:'relative',
            top:15,
            left: user.about === 'like' ? 70:20,
          }} onPress={()=> handleShowNotify(user.id,user?.score, user?.postId, user.title)}>
          <Entypo name="dots-three-horizontal" size={24} color="black" />
          </TouchableOpacity>
         
          </View>
        
        )
      })
      )}
      </ScrollView>
</Modal>
</Portal>

      
        </View>

        </>
    )
  }
  
  
  export class Home extends Component {
    
    state = {
      isAdd: true,
      starts:true,
    }
    
    componentDidMount () {
      setInterval(()=>{
        this.setState({starts:false})
      },3000)
    }
    render() {
      
      // if(this.state.starts){
      //   return (
      //     <Welcome/>
      //     )
      //   }
        
        return (
          <PaperProvider>
        <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>

          <SafeAreaView style={{
            flex:1,
          }}>
                   
              <Header navigation = {this.props.navigation} userId = {this.props.route.params.id} isAdd={this.state.isAdd}/>
              <ListBoard navigation = {this.props.navigation} userId = {this.props.route.params.id} isAdd={!this.state.isAdd}/>
             
              
          </SafeAreaView>
            </TouchableWithoutFeedback>
            </PaperProvider>

      )
    

  }
}

export default Home