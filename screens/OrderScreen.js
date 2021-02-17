import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
//import { RFValue } from "react-native-responsive-fontsize";
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader';
export default class OrderScreen extends Component {
  constructor() {
    super();
    this.state = {
      NumberOfPieces: 0,
      CompanyName: '',
      Description: '',
      Item: '',
      UserId: firebase.auth().currentUser.email,
      From: ''
    }
  }
  createUniqueId() {
    return Math.random().toString(36).substring(7);
  }

  addOrder = async (CompanyName, NumberOfPieces, Description, Item, From) => {
    var randomRequestId = this.createUniqueId();
    db.collection("orders").add({
      "UserId": this.state.UserId,
      "From": From,
      "CompanyName": CompanyName,
      "NumberOfPieces": NumberOfPieces,
      "OrderId": randomRequestId,
      "OrderStatus": "requested",
      "Description": Description,
      "date": firebase.firestore.FieldValue.serverTimestamp(),
      "Item": Item
    });
    this.setState({
      CompanyName: '',
      NumberOfPieces: '',
      Description: '',
      Item: '',
    })
    alert("Order added succeesfully")
  }


addNotification = async(CompanyName, NumberOfPieces, Description, Item, From)=>{
  var message = this.state.UserId + " has placed an order"
  db.collection('Notifications').add({
    "targeted_user_id":From,
    "UserId": this.state.UserId,
    "From": From,
    "OrderStatus": "requested",
    "date": firebase.firestore.FieldValue.serverTimestamp(),
    "notification_status": "unread",
    "message":message,
    "Item":this.state.Item
  })
}


  componentDidUpdate() {
    console.log(this.state)
  }


  render() {
    return (
      <KeyboardAvoidingView style={styles.keyBoardStyle}>
        <View style={{ flex: 1 }}>
          <MyHeader title="Order" navigation={this.props.navigation} />

          <View style={styles.container}>
            <Text style={styles.header}>Place Your Order</Text>
            <TextInput
              style={styles.itemInput}
              placeholder="What Do You Want To Order"
              onChangeText={(text) => {
                this.setState({
                  Item: text,
                })
              }
              }
            />
            <TextInput
              style={styles.NumberOfPieces}
              keyboardType='numeric'
              placeholder="Number Of Pieces"
              onChangeText={(num) => {
                this.setState({
                  NumberOfPieces: num
                })
              }}
            />
            <TextInput
              style={styles.companyName}
              placeholder="Comapany Name"
              onChangeText={(text) => {
                this.setState({
                  CompanyName: text
                })
              }}
            />
            <TextInput
              style={styles.from}
              keyboardType={'email-address'}
              placeholder="From(email id of seller)"
              onChangeText={(text) => {
                this.setState({
                  From: text
                })
              }}
            />
            <TextInput
              style={styles.Description}
              multiline={true}
              numberOfLines={10}
              placeholder="Description"
              onChangeText={(text) => {
                this.setState({
                  Description: text
                })
              }}
            />


            <TouchableOpacity style={styles.button} onPress={() => {
              this.addOrder(this.state.CompanyName, this.state.NumberOfPieces, this.state.Description, this.state.Item, this.state.From),
              this.addNotification(this.state.CompanyName, this.state.NumberOfPieces, this.state.Description, this.state.Item, this.state.From)
            }}>
              <Text>Place Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'space-evenly',
  },
  itemInput: {
    width: "75%",
    height: "6%",
    alignItems: 'center',
    borderColor: '#1351d8',
    justifyContent: 'space-evenly',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  InputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
  },
  keyBoardStyle: {
    flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center'
  },
  header: {
    fontSize: 35,
    color: '#1351d8',
    alignItems: 'center',
    textAlign: 'center',
  },
  NumberOfPieces: {
    width: "75%",
    height: "6%",
    alignItems: 'center',
    borderColor: '#1351d8',
    justifyContent: 'space-evenly',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginTop:30
  },
  companyName: {
    width: "75%",
    height: "6%",
    alignItems: 'center',
    borderColor: '#1351d8',
    justifyContent: 'space-evenly',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginTop:30
  },
  from: {
    width: "75%",
    height: "6%",
    alignItems: 'center',
    borderColor: '#1351d8',
    justifyContent: 'space-evenly',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginTop:30
  },

  Description: {
    width: "75%",
    height: "6%",
    alignSelf: 'center',
    borderColor: '#1351d8',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 30,
    padding: 10,
  },
  button: {
    width: "75%",
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: "#ff5722",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop: 20
  },

})
