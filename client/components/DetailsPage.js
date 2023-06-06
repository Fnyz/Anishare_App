import { Alert, ImageBackground, ScrollView, TouchableOpacity, View, Image , TouchableWithoutFeedback, Keyboard} from 'react-native'
import React, { Component } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {Card, Text,Button, TextInput} from 'react-native-paper'
import { AntDesign } from '@expo/vector-icons';
import {onSnapshot, doc, getDoc, updateDoc, collection, query, orderBy, addDoc, serverTimestamp} from 'firebase/firestore'
import { db } from '../firebase';
import moment from 'moment'
import Deletedoc from './Deletedoc';
import YoutubeIframe from 'react-native-youtube-iframe';
import LisLoading from './ListLoading';
import Toast from 'react-native-toast-message';



export class DetailsPage extends Component {

  state = {
    data:{},
    comments:'',
    commnts:[],
    isLoading:false,
    relatedPost:[],
    images:null,
    url:null,
    commenting:[],
    tags:null,
    message:null,
    owner:null,
    dates:null,
    title:null,
    newComId:'',
    click:false,
    newFresh:[],
  }


  handleDetails = (img,vUrl, title, comments, tags, message, owner, dates, id) => {

 
    this.setState({
      images:img, 
      url:vUrl,
      title,
      commnts:comments,
      tags,
      message,
      owner,
      dates,
      newComId:id,
      
    });

    const copy = title.trim().toLowerCase().split(' ')[0];
    const docs = collection(db, 'posts');
        const ref = query(docs, orderBy('createdAt', 'desc'));
    
        onSnapshot(ref, (list)=>{
            let value = [];
            list.docs.forEach(element => {
                value.push({...element.data(), id: element.id});
            });
            value = value.filter(item =>item.title.trim().toLowerCase().split(' ')[0] == copy);
           this.setState({newFresh:value});
            
           
    })


  }


  

  handleSubmit = async (userId, id) => {

    let final =  !this.state.newComId ? id: this.state.newComId;
    this.setState({click:true});

    if(!this.state.comments){

      this.setState({click:false});

      Alert.alert(
        "WARNING",
        "Please input a comment before submitting.",
        [
            { text: "Okay", onPress: () => {
              console.log('Close!')
            }}
            
            ]
        );

         


        return;

      
    }

    

       
const docRef = doc(db, "users", userId);
const getPost = doc(db, "posts", final);
const notify = collection(db, 'notifications');
const docSnap = await getDoc(docRef);
const postResult = await getDoc(getPost);

const res = await Promise.all([docSnap.data(), postResult.data()]);

 
  const comment = res[1].comments;
  const com = `${res[0].username.trim()}: ${this.state?.comments}`;
  const isAbout = 'commented'
  const personWhoComment = res[0].username.trim();
  const commm = this.state?.comments;
  const idOfOwer = res[1].userId;
  const owner = res[1].owner;
  const title = res[1].title;
  const wholname = `${res[0].firstname.charAt(0).trim()}${res[0].lastname.charAt(0).trim()}`;
  const postId = id;
  
    comment.push({message: com, ids:userId});
    

 

   const Updated = await updateDoc(getPost, {
    comments: comment})

   const addNotification = await addDoc(notify, {
    owner,
    person: personWhoComment,
    ownersId:idOfOwer,
    postId,
    about: isAbout,
    comments: commm,
    wholename: wholname,
    title,
    score:1,
    createdAt: serverTimestamp()
   })

   

   Promise.all([Updated, addNotification])
   .then(()=>{

    this.setState({commnts:comment, click:false, comments:''});

   });
  


  }


  getSingleData = () => {

    this.setState({isLoading:true});

    const {postId} = this.props.route.params;

    const docs = doc(db, 'posts', postId);

    getDoc(docs).then(doc =>{
      this.setState({isLoading:false});
      this.setState({data: doc.data(), id: doc.id});
      
    })

  }
  getComments = () => {

    const {postId} = this.props.route.params;

    const docs = collection(db, 'posts');
        const ref = query(docs, orderBy('createdAt', 'desc'));
    
        onSnapshot(ref, (list)=>{
            let value = [];
            list?.docs?.forEach(element => {
                value.push({...element.data(), id: element.id});
            });
            value = value.find(doc => doc.id === postId);
            this.setState({commnts:value?.comments});
           
    })

  }

  
 
  componentDidMount(){
    this.getSingleData();
    this.getComments();

    const title = this.props.route?.params?.postName.trim().toLowerCase().split(' ')[0];
    const docs = collection(db, 'posts');
        const ref = query(docs, orderBy('createdAt', 'desc'));
    
        onSnapshot(ref, (list)=>{
            let value = [];
            list.docs.forEach(element => {
                value.push({...element.data(), id: element.id});
            });
            value = value.filter(item =>item.title.trim().toLowerCase().split(' ')[0] == title);
            this.setState({relatedPost: value})
    })

   
    
  }
  render() {
    

    const {postId} = this.props.route.params;
    const {tags, userId} = this.state.data;
    const {usrId} = this.props.route.params;
    const newTags =  `#${tags?.split(',').join('#')}`;

    let res = !this.state.newFresh.length ? this.state?.relatedPost.map(item => item).
    filter(item => item.title !== this.props.route.params.postName): this.state?.newFresh.map(item => item).
    filter(item => item.title !== this.state.title);
  

  

    

    
    if(this.state.isLoading){
      return (
        <LisLoading/>
      )
    }
    
   

    return (
      <TouchableWithoutFeedback onPress={()=> Keyboard.dismiss()}>

      <SafeAreaView style={{
        
      }}>

        {!this.state.data ? (
          <View>
            <Text>Data is loading...</Text>
          </View>
        ):
        (

          <ImageBackground source={{uri:this.state.data.images}} style={{
            width:'100%',
            height:'100%',
            justifyContent:'center'
        }}>
          <ScrollView>


        <Card style={{
          margin:10,
                    padding:10,
                    position:'relative',
                  }}>
          
 <YoutubeIframe
                height={200} 
                width={350}
                play={true}
                videoId={this.state.url ? String(this.state.url):String(this.state.data?.vdioId)}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                /> 
      
        <Card.Content >
        <View style={{
          flexDirection:'row',
          justifyContent:'space-between',
          alignItems:'center',
          marginTop:10,
        }}>
        <View style={{
          flexDirection:'column',
          width:170,
          gap:5,
        }}>
          <Text style={{
            flexWrap: 'wrap',   
            fontWeight:'bold',
            fontSize:15,
            flexShrink: 1 
          }}>{this.state.title ? this.state.title : this.state.data.title}</Text>
          <Text variant="bodyMedium">{this.state.tags? `#${this.state.tags?.split(',').join('#')}`: newTags}</Text>
        </View>
        <Card.Cover source={this.state.images ? {uri:this.state.images}: {uri:this.state.data.images}} style={{
            width:100,
            height:100,
        }}/>
        </View>
           
          <Text variant="bodyMedium" style={{
            marginTop:10,
          }}>
            {this.state.message ? this.state.message : this.state.data.message}
          </Text>
          <Text style={{
            marginTop:10,
            opacity:0.6,
            textAlign:'right',
          }}>{this.state.owner? this.state.owner : this.state.data.owner} / {this.state.data?.createdAt? moment(this.state.dates ? this.state.dates.toDate() : this.state.data.createdAt.toDate()).calendar(): 'loading time...'}</Text>
          <Text style={{
              borderBottomWidth:1,
            opacity:0.3
          }}></Text>
          <View style={{
            marginTop:15,
          }}>
            <Text style={{
                marginBottom:5,
                fontWeight:'bold',
                opacity:0.5
            }}>Comments:</Text>
            <ScrollView 

ref={ref => this.scrollView = ref}
onContentSizeChange={(contentWidth, contentHeight)=>{        
    this.scrollView.scrollToEnd({animated: true});
}}
            
            
            style={{
              height:55,
            }}>


            {!this.state.commnts?.length ? (
  <Text style={{
    fontSize:13,
    opacity:0.6
  }}>No comments found!</Text>
  ): 


this.state.commnts?.map((item, i)=>{
  return (
    <View key={i}>
<Text style={{
 fontWeight:'bold',
 fontSize:13,
opacity:0.6
}}>{item.message.split(': ')[0]}:
  <Text style={{
    fontSize:12,
    opacity:0.6
  }}> {item.message.split(': ')[1]}</Text>
</Text>

    </View>

  )
})}








            


          
             
          
            </ScrollView>
           
          
           </View>
           <View style={{
             marginTop:20,
            }}>
           <TextInput 
            mode='outlined'
            activeOutlineColor='#ff7979'
            outlineColor='white'
            placeholder="e.g comment here"
            textColor="gray"
            placeholderTextColor='gray'
            value={this.state?.comments}
            onChangeText = {(val)=> this.setState({comments:val})}
            style={{
                opacity:0.8,
              }}
              />
           </View>
          <View style={{
            flexDirection:'row',
            justifyContent:'space-between',
            marginTop:20,
            alignItems:'center',
          }}>

            {this.state.click ? (

<Button loading textColor='white' labelStyle={{
  fontSize:17,
  marginTop:13,
borderRadius:0,
}} mode="outlined" onPress={()=> this.handleSubmit(usrId,postId)} style={{
backgroundColor:'#ff7979',
borderWidth:0,
}}>
 Sending...
</Button>



            ): ( 

              <Button icon='send' textColor='white' labelStyle={{
                fontSize:17,
                marginTop:13,
              borderRadius:0,
            }} mode="outlined" onPress={()=> this.handleSubmit(usrId,postId, userId)} style={{
              backgroundColor:'#ff7979',
              borderWidth:0,
            }}>
              Send comment
            </Button>




             )}
          <View style={{
            flexDirection:'row',
            gap:10,
        }}>
          {this.state.data.userId == usrId && (
           <Deletedoc postId = {postId} navigation={this.props.navigation}/>
          )}
          <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
          <AntDesign name="back" size={24} color="black" style={{
            opacity:0.5,
            elevation:1,
          }}/>
          </TouchableOpacity>
          </View>
          </View>

          <Text style={{
            marginTop:20,
            opacity:0.5,
            fontWeight:'bold',
          }}>Related post:</Text>
          
          <View>

          <ScrollView  horizontal={true}
          showsHorizontalScrollIndicator={false} style={{
            height: !res.length ? 30 : 180,
          }}>
            {!res?.length ? (
              <Text style={{
                marginTop:10,
                opacity:0.6,
                fontSize:15,
              }}>No related post found!</Text>
            ) :res?.map((item,i)=> {
              return (
                <TouchableOpacity key={i} onPress={()=> this.handleDetails(item.images, item.vdioId, item.title, item.comments, item.tags, item.message, item.owner, item.createdAt, item.id, item.title)}>
                 <View style={{
                   borderWidth:1,
                   borderColor:'gray',
                   justifyContent: 'center',
                   alignItems: 'center',
                   marginRight:10,
                   marginTop:10,
                   borderRadius:10,
                   paddingBottom:10,
                  }}>
                   <Image source={{uri:item.images}} style={{
                     width:120,
                     height:120,
                     margin:10,
                    }}/>
                   <Text style={{
                     fontSize:12,
                     fontWeight:'bold',
                    }}>{item.title}</Text>
                 </View>
              </TouchableOpacity>
              )
            })}
          </ScrollView>
            </View>
        
  
          
        </Card.Content>
      </Card>
        </ScrollView>

    </ImageBackground>
          
        )}


        
      </SafeAreaView>
            </TouchableWithoutFeedback>
    )
  }
}

export default DetailsPage