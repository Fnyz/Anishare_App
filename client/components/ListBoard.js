import { ScrollView, Text, View , Image, ImageBackground, TouchableOpacity} from 'react-native'
import React, { Component } from 'react'
import Lists  from './List';
import {collection, query, orderBy, onSnapshot, where} from 'firebase/firestore';
import { db } from '../firebase';
import { Searchbar } from 'react-native-paper';
import LisLoading from './ListLoading';



export class ListBoard extends Component {

  state = {
    data: [],
    choose:null,
    searchData:[],
    isLoading:false,
    backColor: null,
  }

  getAllData = () => {
    const docs = collection(db, 'posts');
        const ref = query(docs, orderBy('createdAt', 'desc'));
    
        onSnapshot(ref, (list)=>{
            let value = [];
            list.docs.forEach(element => {
                value.push({...element.data(), id: element.id});
            });
            this.setState({data:value})
           
    })
  }

  
  handleSearch = (val) => {
    this.setState({isLoading:true});
    setTimeout(() => {
     
      const fill = this.state.data.filter(item => item.title.trim().toLowerCase().includes(val.trim().toLowerCase()));
      if(val.length > 0){
       
        this.setState({data:fill, isLoading:false});
      }else{
        this.setState({isLoading:true});
        const docs = collection(db, 'posts');
          const ref = query(docs, orderBy('createdAt', 'desc'));
      
          onSnapshot(ref, (list)=>{
            
              let value = [];
              list.docs.forEach(element => {
                  value.push({...element.data(), id: element.id});
              });
              this.setState({data:value, isLoading:false})
             
      })
      }
    }, 1000);
  }

  componentDidMount(){
    this.getAllData();
  }
  render() {

    const {userId} = this.props;
    
    return (

      <>

      <View style={{
        margin:10,
      }}>
        <Searchbar
            placeholder="Search"
            opacity={0.5}
            elevation={1}
            value={this.state.searchText}
            onChangeText={(val)=> this.handleSearch(val)}
        />
      </View>
      {this.state.isLoading ? (
        <LisLoading/>
      ): (

      <ImageBackground source={{uri:this.state.choose} || require('../assets/Img/demonSlayer.jpg')} style={{width: '100%', height: '100%', flex:1}}>
       
    <ScrollView>
      <View>
        
        {!this.state.data?.length ? (
          <LisLoading data={this.state.data}/>
        ):
        this.state.data.map((d, i)=>{
            return (
                <TouchableOpacity key={i} onPress={()=>this.setState({choose: d.images})}>
                    <Lists allData = {d} {...d} navigation = {this.props.navigation} usrId = {userId} add={this.props.isAdd}/>
                </TouchableOpacity>
            )
        })
        }
      </View>
      </ScrollView>
      </ImageBackground>

      )}
      </>
    )
  }
}

export default ListBoard