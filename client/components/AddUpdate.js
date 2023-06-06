
import React, { Component } from 'react'
import { View , Text,SafeAreaView, TouchableOpacity, Image, ImageBackground, TouchableWithoutFeedback, Keyboard, Alert} from 'react-native';
import { TextInput, Button, Card, PaperProvider, Portal, Dialog} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import LisLoading from './ListLoading';
import SatoriLoading from './SatoriLoading';
import Toast from 'react-native-toast-message';
import axios from 'axios';



export class AddUpdate extends Component {

    state ={
        isUser:false,
        image:null,
        title:'',
        message: '',
        tags: '',
        comments: [],
        likes: [],
        vId:'',
        youtubeLink:null,
        isLoading: false,
        visible: false,
        generatedLink:null,
        generating:false,
        title2:'',
    }

    dataGet = async (title) =>{

      this.setState({generating: true});

      if(!title){

        this.setState({generating: false});


        Alert.alert(
          "WARNING!",
          'Please input a title first before generating a link.',
          [
          
            { text: "OK", onPress: () => {
              console.log('close!');
            }}
          ]
        );
        
        return;
      }

      const options = {
        method: 'GET',
        url: 'https://youtube-search-results.p.rapidapi.com/youtube-search/',
        params: {
          q: title
        },
        headers: {
          'X-RapidAPI-Key': '2c03f756fdmsh4f3695731c5c35ep1d7f1fjsndcf5957040e7',
          'X-RapidAPI-Host': 'youtube-search-results.p.rapidapi.com'
        }
      };
      
      try {
        const response = await axios.request(options);
        let value = Math.floor(Math.random() * response.data.items.length-1);
        const title = response?.data?.items[value]?.title;
        const vId = response?.data?.items[value]?.id;
        const image = response?.data?.items[value]?.bestThumbnail?.url;
        const url = response?.data?.items[value]?.url?.trim();
        this.setState({youtubeLink:url, image, title2:title, vId, generating: false});
      
      } catch (error) {
        console.error(error);
      }

    }

    pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });
      
          if(result.canceled){
            return null;
          }
          if (!result.canceled) {
           this.setState({image: result.assets[0].uri})
          }
    };
    handleSubmit = (id, name, postId) => {





      if(this.state.isUser){

        if(!this.state.title || !this.state.message || !this.state.tags || !this.state.youtubeLink){
          Alert.alert(
            "WARNING!",
            'Please input all required fields.',
            [
            
              { text: "OK", onPress: () => {
                console.log('close!');
              }}
            ]
          );
          return;
        }

        if(!this.state.image){
          Alert.alert(
            "WARNING!",
            'Please choose an image.',
            [
            
              { text: "OK", onPress: () => {
                console.log('close!');
              }}
            ]
          );
          return;
        }
        var regExp2 = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    

        if(!this.state.youtubeLink.match(regExp2)){
          this.setState({youtubeLink:''})
          Alert.alert(
            "WARNING!",
            'Please input a valid youtube link only.',
            [
            
              { text: "OK", onPress: () => {
                console.log('close!');
              }}
            ]
          );
          return;
        }
        const regexp = /^\S*$/;

        if(!this.state.tags.match(regexp)){
            Alert.alert(
            "WARNING!",
            'Please input with comma separator and without space.',
            [
            
              { text: "OK", onPress: () => {
                console.log('close!');
              }}
            ]
          );
          return;
        }




      

        this.setState({visible: true});


        let clearUrl = '';
        const url = this.state.youtubeLink?.trim();
 
      var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
 var match = url?.match(regExp);
 if (match && match[2].length == 11) {
   clearUrl = match[2];
 } else {
   //error
 }


        const ref = collection(db, 'posts');
        addDoc(ref, {
            owner:name,
            title: this.state.title,
            message: this.state.message,
            tags: this.state.tags,
            images: this.state.image,
            vdioId: clearUrl,
            userId: id,
            comments: [],
            likes: [],
            createdAt: serverTimestamp(),
        }).then(()=>{

          this.setState({
            title:'',
            message:'',
            tags: '',
            images: '',
            comments: [],
            likes: [],
          })
          this.setState({visible: false});
          Toast.show({
            type: 'success',
            text1: 'Post created successfully! 👋',
            position:'top',
          });
          this.props.navigation.goBack();
            
        }).catch((err)=>{

          console.log(err);
        })
        return;
      }


      


      const regexp = /^\S*$/;

      if(!this.state.tags.match(regexp)){
          Alert.alert(
          "WARNING!",
          'Please input with comma separator and without space.',
          [
          
            { text: "OK", onPress: () => {
              console.log('close!');
            }}
          ]
        );
        return;
      }

      

      
      this.setState({visible: true});


      const ref = doc(db, "posts", postId);

      updateDoc(ref, {
            title: this.state.title,
            message: this.state.message,
            tags: this.state.tags,
            images: this.state.image,
       }).then(()=>{

        this.setState({
          title:'',
          message:'',
          tags: '',
          images: '',
          comments: [],
          likes: [],
        })

        this.setState({visible: false});
        Toast.show({
          type: 'success',
          text1: 'Post updated successfully! 👋',
          position:'top',
        });
        this.props.navigation.goBack();
           
       }).catch(err => {
         console.log(err);
       }); 

 




        
    }

    componentDidMount(){

      this.setState({isLoading:true});
       
      if(this.props.route.params.add){
        this.setState({isUser:this.props.route.params.add, isLoading:false})
        return;
      }

      if(this.props.route.params.id && !this.props.route.params.add){
        this.setState({isLoading:true})
        const postId = this.props.route.params.postId;

        
    const docs = doc(db, 'posts', postId);

    getDoc(docs).then(doc =>{
      this.setState({isLoading:false});
      const title = doc.data().title;
      const img = doc.data().images;
      const tags = doc.data().tags;
      const message = doc.data().message;

      this.setState({
        title,
        image: img,
        tags,
        message,
      })
      
    })
      return;  
      }
    }
   

  render() {


    const {id, name} = this.props.route.params;

    if(this.state.isLoading){
      return (
        <LisLoading/>
      )
    }
   

     
    return (
      <>
      <PaperProvider>
        <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>

      <SafeAreaView style={{
        flex: 1,
      }}>

        <ImageBackground  source={!this.state.image? (require('../assets/Img/demonSlayer.jpg')) : {uri: this.state.image}} style={{
          flex: 1,
          justifyContent:'center',
          alignItems: 'center',
        }}>




        <Card style={{
          margin:15,
        }}>

         <Card.Content>
         <View style={{
            gap:10,
         }}>


          
            
      <Text>
        
            <View style={{
                justifyContent:'center',
                alignItems: 'center',
                width:329, 
            }}>
  <Text style={{
                    fontSize:20,
                    opacity:0.6,
                }}>{this.state.isUser ? 'Share your favorite anime' : 'Update your favorite anime'}</Text>
                <Text style={{
                    fontSize:10,
                    opacity:0.6,
                }}>Fill out the form</Text>
            </View>
      </Text>
      <TouchableOpacity onPress={this.pickImage}>
      <Card.Cover source={!this.state.image? (require('../assets/Img/demonSlayer.jpg')) : {uri: this.state.image}}/>
      </TouchableOpacity>
        <View style={{
            gap:10,
            marginBottom:10,
        }}>
            <TextInput label="Title"
                  mode='outlined'
                  activeOutlineColor='#ff7979'
                  outlineColor='white'
                  placeholder="e.g Demon slayer"
                  textColor="gray"
                  placeholderTextColor='gray'
                  value= {this.state.title}
                  onChangeText ={(val)=> this.setState({title:val})}
                  style={{
                    opacity:0.8,
            }}

            />

            {this.state.title2 && (

              <TextInput disabled
                    mode='outlined'
                    activeOutlineColor='#ff7979'
                    outlineColor='white'
                    placeholder="e.g Generated title results"
                    textColor="gray"
                    placeholderTextColor='gray'
                    value= {this.state.title2}
                    style={{
                      opacity:0.8,
              }}
              />

            )}

            <TextInput label="Message"
            mode='outlined'
            activeOutlineColor='#ff7979'
            outlineColor='white'
            placeholder="e.g Demon slayer is the best."
            textColor="gray"
            multiline
            placeholderTextColor='gray'
            value= {this.state.message}
            onChangeText ={(val)=> this.setState({message:val})}
            style={{
              opacity:0.8,
      }}
            />

<TextInput label="Tags (comma separated)"
mode='outlined'
activeOutlineColor='#ff7979'
outlineColor='white'
placeholder="e.g #Awesome"
textColor="gray"
value= {this.state.tags}
onChangeText ={(val)=> this.setState({tags:val})}
placeholderTextColor='gray'
style={{
  opacity:0.8,
}}
/>

            {this.state.isUser && (
              <TextInput label="Generate link or Input a link"
  mode='outlined'
  activeOutlineColor='#ff7979'
  outlineColor='white'
  placeholder="e.g https://youtu.be/DttTRPKdq-0."
  textColor="gray"
  multiline
  placeholderTextColor='gray'
  value= {this.state.youtubeLink}
  onChangeText ={(val)=> this.setState({youtubeLink:val})}
  style={{
    opacity:0.8,
}}
  />
            )}

        </View>
       {this.state.isUser? (
         this.state.generating ? (
  
  <Button loading textColor='white' labelStyle={{
   fontSize:20,
   marginTop:13,
  }} mode="outlined" onPress={()=>this.dataGet(this.state.title)} style={{
   padding:5,
   backgroundColor:'#ff7979',
   borderWidth:0,
  }}>
   Please wait ...
  </Button>
  
         ): (
  
         <Button icon='send' textColor='white' labelStyle={{
         fontSize:20,
         marginTop:13,
       }} mode="outlined" onPress={()=>this.dataGet(this.state.title)} style={{
         padding:5,
         backgroundColor:'#ff7979',
         borderWidth:0,
       }}>
         Generate link
       </Button>
         )

       ): null}     


      
      <Button icon={this.state.IsSignUp? "account-plus": "plus-circle-outline"} textColor='white' labelStyle={{
        fontSize:20,
        marginTop:13,
      }} mode="outlined" onPress={()=>this.handleSubmit(id, name, this.props.route.params.postId)} style={{
        padding:5,
        backgroundColor:'#ff7979',
        borderWidth:0,
      }}>
        {!this.state.isUser ? 'Update Post' : 'Create Post'}
      </Button>
      <Button icon='keyboard-backspace' textColor='#ff7979' labelStyle={{
        fontSize:20,
        marginTop:13,
      }} mode="outlined" onPress={()=>this.props.navigation.goBack()} style={{
        padding:5,
        borderColor:'#ff7979',
        borderWidth:1,
      }}>
        Go back
      </Button>


      <View style={{
        flexDirection:'row',
        gap:2,
        alignSelf:'center',
        opacity:0.6,
        marginVertical:5,
      }}>
     
      </View>
        </View>
         </Card.Content>
         </Card>
      <View>
        <Portal>
          <Dialog visible={this.state.visible} style={{
            backgroundColor:'white',
            flexDirection:'row',
            alignItems:'center',
            justifyContent:'center',
          }}>
          <Dialog.Title style={{
            position:'relative',
            left:22,
          }}>
          <SatoriLoading />

          </Dialog.Title>   
            <Dialog.Content>
              <Text variant="bodyMedium" style={{
                color:'coral',
                fontSize:25,
                position:'relative',
                right:55,
                top:10,
                fontWeight:'bold',
                opacity:0.8,
              }}>Please wait ...</Text>
            </Dialog.Content>
          </Dialog>
        </Portal>
      </View>


        </ImageBackground>
      </SafeAreaView>
           </TouchableWithoutFeedback>
    </PaperProvider>
      </>
    )
  }
}



export default AddUpdate
