import React, { Component } from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, TextInput, Dimensions, Button, Alert } from 'react-native';
import Axios from 'axios';
import AsyncStorage  from '@react-native-community/async-storage';
import Mainmenu from './component/Mainmenu';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      auth : false
    }
  }

  handlelogin () {
    window.btoa = require('Base64').btoa;
    Axios({
      method : 'GET',
      url : "https://api.fluxgen.in/aquagen/v1/auth/login",
      auth: {
        username: this.state.username,
        password: this.state.password
      } 
    }).then(res => res.data).then( async response => {
        if(response.status === "success"){
          try{
            await AsyncStorage.setItem('data' , JSON.stringify(response));
          }catch(error){console.log(error)};
          this.setState({auth : true})
        }
      }).catch(e => {console.log(e) ;Alert.alert("Alert","Username or password is invalid",[{text : 'OK'}],{cancelable : false})});
  }

  render() {
    if(this.state.auth){
      return(<Mainmenu/>)
    }else{
    return (
      <ImageBackground source={require('./assets/loginbackground.png')} style={styles.ImageBackground} >
        <View style={styles.container} >
          <Image source={require('./assets/logo.png')} style={{ marginBottom: 50, height: 150, width: 150 }} />

          <TouchableOpacity style={styles.InputText}>
            <TextInput
              placeholder=" Username.."
              onChangeText={e => this.setState({ username: e })}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.InputText}>
            <TextInput
              placeholder=" Password.."
              secureTextEntry
              onChangeText={e => this.setState({ password: e })}
            />
          </TouchableOpacity >
          <TouchableOpacity style={styles.LoginInput} onPress={this.handlelogin.bind(this)}>
            <Text style={{ textAlign: 'center', color: 'black' }}>LOGIN</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    )   }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 5,
    borderColor: "#000000"
  },
  ImageBackground: {
    flex: 1,
    width: null,
    height: null
  },
  InputText: {
    backgroundColor: '#F3F3F3',
    borderRadius: 20,
    shadowColor: '#000000',
    margin: 15,
    width: "80%",
    height: 40,
    justifyContent: 'center',
    alignContent: 'center'
  },
  LoginInput: {
    marginTop: 20,
    backgroundColor: '#c6f5f2',
    borderRadius: 20,
    shadowColor: '#000000',
    shadowRadius: 15,
    shadowOffset: { width: 50, height: 50 },
    width: "60%",
    height: 50,
    justifyContent: 'center',
    alignContent: 'center'

  }
});
