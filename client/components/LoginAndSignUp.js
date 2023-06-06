
import React, { Component } from 'react'
import { View , Text, TouchableOpacity, SafeAreaView, TouchableWithoutFeedback, Keyboard, Alert} from 'react-native';
import { TextInput, Button, Card, PaperProvider, Portal, Dialog} from 'react-native-paper';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';
import { setDoc , doc} from 'firebase/firestore';
import { Auth } from '../firebase';
import { db } from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';











export class LoginAndSignUp extends Component {

  

    state ={
        IsSignUp:false,
        secureEntry: true,
        firstName: '',
        lastName: '',
        username:'',
        email:'',
        password:'',
        isLogin:false,
        visible: false,
        
        status: {}
        
    }

    onBuffer = (data) => {
      console.log(data);
    }
    videoError = (data) => {
      console.log(data);
    }

 

    handleChange = () => {
        this.setState({IsSignUp:!this.state.IsSignUp});
    }
    handleSubmit = () => {

      if(!this.state.email || !this.state.password){
        this.setState({visible: false});
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
    

      this.setState({visible: true});

        if(this.state.IsSignUp){
          this.setState({visible: true});

          if(!this.state.firstName || !this.state.lastName){
            this.setState({visible: false});
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

          
        


          createUserWithEmailAndPassword(Auth,
            this.state.email,
            this.state.password
        ).then((users) => {
      
           
          
            const ref = doc(db, 'users', users.user.uid)
      
            setDoc(ref,{
                firstname: this.state.firstName,
                lastname: this.state.lastName,
                username: this.state.username,
                userId: users.user.uid,
            })
           

            this.setState({email:'', firstName:'', lastName: '', password:'', username:'', visible: false});
            Alert.alert(
              "SUCCESS!",
              'Account created successfully.',
              [
              
                { text: "OK", onPress: () => {
                  console.log('close!');
                }}
              ]
            );
            setTimeout(() => {
              this.setState({IsSignUp:false});
            }, 2000);   
      
        }).catch((error) => {

          
          
          let errorMessage = null;
      
            switch(error.code) {
              case "auth/missing-password":
                errorMessage = "Password is missing, please try again!";
              break;
              case "auth/invalid-email":
                errorMessage = "Email is in valid format, please try again!";
              break;
              case "auth/weak-password":
                errorMessage = "Password must be at least 6 characters long.";
              break;
              case 'auth/email-already-in-use':
                errorMessage = "User email already exists.";
              break;
              default:
            }

            if(errorMessage){
              this.setState({visible:false})
              Alert.alert(
                "WARNING!",
                errorMessage,
                [
      
                  { text: "OK", onPress: () => {
                    console.log('close!');
                  }}
                ]
              );
            }
      
       
            
        })

        return;

        }



        signInWithEmailAndPassword(Auth,
          this.state.email,
          this.state.password
        ).then((users)=> {
          const profile = {
            email: users.user.email,
            id: users.user.uid
          }
          AsyncStorage.setItem('profile', JSON.stringify(profile));  
          this.setState({email:'',password:''});
          this.props.navigation.navigate('Home', profile);
        }).catch((error) => {
          let errorMessage = null;
    
          switch(error.code) {
            case "auth/missing-password":
              errorMessage = "Password is missing, please try again!";
            break;
            case "auth/invalid-email":
              errorMessage = "Email is in valid format, please try again!";
            break;
            case "auth/weak-password":
              errorMessage = "Password must be at least 6 characters long.";
            break;
            case "auth/wrong-password":
              errorMessage = "Password is incorrect!";
            break;
            case 'auth/user-not-found':
              errorMessage = "Email is not registered!";
            break;
            default:
             
          }
     
          if(errorMessage){
            this.setState({visible:false})
            Alert.alert(
              "WARNING!",
              errorMessage,
              [
              
                { text: "OK", onPress: () => {
                  console.log('close!');
                }}
              ]
            );
          }
        
        })


        
      


        
      
        
    }
    handleShowPassword = () => {
        this.setState({secureEntry:!this.state.secureEntry});
    }

  render() {
    return (
      <>

      
<PaperProvider>
     <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>

      <SafeAreaView style={{
        flex: 1,
        justifyContent:'center',
      }}>




        
         <Card style={{
            margin:15,
         }}>



     



          

         <Card.Content>
         <View style={{
            gap:10,
         }}>


      
    
            
      <Text>
        {this.state.IsSignUp ? (
            <View style={{
                justifyContent:'center',
                alignItems: 'center',
                width:329,
            }}>
                <Text style={{
                    fontSize:40,
                    opacity:0.6,
                }}>Register</Text>
                <Text style={{
                    fontSize:10,
                    opacity:0.6,
                }}>Fill out the form</Text>
            </View>
        ) : (
            <View style={{
                justifyContent:'center',
                alignItems: 'center',
                width:329,
            }}>
                <Text style={{
                    fontSize:35,
                    opacity:0.6,
                }}>Hello there,</Text>
                <Text style={{
                    fontSize:35,
                    opacity:0.6,
                }}>Welcome back.</Text>
            </View>
        )}
      </Text>
      {this.state.IsSignUp && (
        <View style={{
            gap:10,
        }}>
            <TextInput label="Firstname"
                  mode='outlined'
                  activeOutlineColor='#ff7979'
                  outlineColor='white'
                  placeholder="e.g noname"
                  textColor="gray"
                  value={this.state.firstName}
                  onChangeText={(val)=> this.setState({firstName:val})}
                  placeholderTextColor='gray'
                  style={{
                    opacity:0.8,
            }}

            />
            <TextInput label="Lastname"
            mode='outlined'
            activeOutlineColor='#ff7979'
            outlineColor='white'
            placeholder="e.g lastname"
            textColor="gray"
            placeholderTextColor='gray'
            value={this.state.lastName}
                  onChangeText={(val)=> this.setState({lastName:val})}
            style={{
              opacity:0.8,
      }}
            />
            <TextInput label="Username"
            mode='outlined'
            activeOutlineColor='#ff7979'
            outlineColor='white'
            placeholder="e.g piattos"
            textColor="gray"
            placeholderTextColor='gray'
            value={this.state.username}
                  onChangeText={(val)=> this.setState({username:val})}
            style={{
              opacity:0.8,
      }}
            />
        </View>
      )}
      <TextInput
      label="Email"
      mode='outlined'
      activeOutlineColor='#ff7979'
      outlineColor='white'
      placeholder="e.g noname@example.com"
      textColor="gray"
      placeholderTextColor='gray'
      value={this.state.email}
      onChangeText={(val)=> this.setState({email:val})}
      style={{
        opacity:0.8,
      }}
      />
      <TextInput
      label= 'Password'
      placeholder="e.g 1234******"
      placeholderTextColor='gray'
      mode='outlined'
      outlineColor='white'
      activeOutlineColor='#ff7979'
      secureTextEntry={this.state.secureEntry}
      value={this.state.password}
      onChangeText={(val)=> this.setState({password:val})}
      style={{
        marginBottom:10,
      }}
      right={<TextInput.Icon icon={this.state.secureEntry? 'eye-off' : 'eye'} onPress={this.handleShowPassword} />}
      />
      <Button icon={this.state.IsSignUp? "account-plus": "key-variant"} textColor='white' labelStyle={{
        fontSize:20,
        marginTop:13,
      }} mode="outlined" onPress={this.handleSubmit} style={{
        padding:5,
        backgroundColor:'#ff7979',
        borderWidth:0,
      }}>
        {this.state.IsSignUp ? 'Registered' : 'Login'}
      </Button>
      <View style={{
        flexDirection:'row',
        gap:2,
        alignSelf:'center',
        opacity:0.6,
        marginVertical:5,
      }}>
      <Text>{this.state.IsSignUp? 'Do you have an account?': `Don't have an account?`}</Text>
      <TouchableOpacity onPress={this.handleChange}>
      <Text style={{
        color:'red',
        fontStyle:'italic',
      }}>{this.state.IsSignUp? 'Login here': `Register here`}</Text>
      </TouchableOpacity>
      </View>
        </View>
         </Card.Content>
         </Card>

         
      <View>
        <Portal>
          <Dialog visible={this.state.visible} onDismiss={this.hideDialog} style={{
            width:300,
            height:80,
            alignSelf:'center',
          }
          }>
           
            <Dialog.Content style={{
              flexDirection:'row',
              alignItems: 'center',
              gap:15,
              justifyContent:'center',
            }}>
            <ActivityIndicator animating={true} color='coral' size={25} style={{
              opacity:0.8,
              position:'relative',
              left:-10,
            }}/>
            <Text style={{
              fontSize:25,
              opacity:0.5,
              position:'relative',
              left:-5,
            }}>{!this.state.IsSignUp ? 'Loggin in ..' : 'Registering ..'}</Text>
            </Dialog.Content>
          </Dialog>
        </Portal>
      </View>
      
      </SafeAreaView>
        </TouchableWithoutFeedback>
    </PaperProvider>
    
      </>
    )
  }
}

export default LoginAndSignUp