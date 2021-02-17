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
ScrollView
} from 'react-native';
import { Card, Header, Icon } from 'react-native-elements';

import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader';

export default class CompanyDetailsScreen extends Component {
constructor(props) {
super(props);
this.state = {
    userId: firebase.auth().currentUser.email,
    userName: "",
    FromId: this.props.navigation.getParam('details')["UserId"],
    OrderId: this.props.navigation.getParam('details')["OrderId"],
    Item: this.props.navigation.getParam('details')["Item"],
    NumberOfPieces:     this.props.navigation.getParam('details')["NumberOfPieces"],
    Description: this.props.navigation.getParam('details')["Description"],
    CompanyName: this.props.navigation.getParam('details')["CompanyName"],
    From: this.props.navigation.getParam('details')["From"],
    FromContact: '',
    FromAddress: '',
    FromDocId: '',
    ToName: '',
}
}

getFromDetails() {
db.collection('users').where('email_id', '==', this.state.FromId).get()
    .then(snapshot => {
        snapshot.forEach(doc=>{
            this.setState({
                FromContact: doc.data().contact,
                FromAddress: doc.data().address,
            })
        })
    })
        db.collection('orders').where('OrderId','==',this.state.OrderId).get()
  .then(snapshot=>{
    snapshot.forEach(doc => {
      this.setState({FromDocId:doc.id})
 })
 })
}
getUserDetails = (userId) => {
db.collection('users').where('email_id', '==', userId).get()
    .then((snapshot) => {
        snapshot.forEach((doc) => {
            this.setState({
                userName: doc.data().first_name + " " + doc.data().last_name
            })
        })
    })
}

updateOrderStatus = () => {
db.collection('CompletedOrders').add({
    "Item": this.state.Item,
    "CompanyName": this.state.CompanyName,
    "From": this.state.From,
    "ToId": this.state.userId,
    "OrderStatus": "Order Viewed",
    "NumberOfPieces" : this.state.NumberOfPieces,
    "Description": this.state.Description,
    "ToName" : this.state.ToName,
    "UserId":this.state.userId,
    "OrderId":this.state.OrderId
})
}

deletedoc = (Item,CompanyName,NumberOfPieces,Description) => {
    db.collection('orders')
        .where('Item', '==', Item)
        .where('CompanyName', '==', CompanyName)
        .where('NumberOfPieces', '==', NumberOfPieces)
        .where('Description', '==', Description).get()
        .then(snapshot => {
        snapshot.forEach(doc => {
            const upd = db.collection('orders').doc(doc.id).delete();
        })
        })
}

addNotification = () => {
    var message = this.state.userId + " has viewed your order"
    db.collection("Notifications").add({
        "targeted_user_id": this.state.FromId,
        "ToId": this.state.userId,
        "OrderId": this.state.OrderId,
        "Item": this.state.Item,
        "date": firebase.firestore.FieldValue.serverTimestamp(),
        "notification_status": "unread",
        "message": message
    })
}






componentDidMount() {
this.getFromDetails()
this.getUserDetails(this.state.userId)
console.log(this.state)
}


render() {
return (
    <ScrollView>
    <View style={styles.container}>
        <View style={{ flex: 0.1 }}>
            <Header
                leftComponent={<Icon name='arrow-left' type='feather' color='#696969' onPress={() => this.props.navigation.goBack()} />}
                centerComponent={{ text: "Company Details", style: { color: '#90A5A9', fontSize: 20, fontWeight: "bold", } }}
                backgroundColor="#eaf8fe"
            />
        </View>
        <View style={{ flex: 0.8 }}>
            <Card
                title={"Order Information"}
                titleStyle={{ fontSize: 20 }}
            >
                <Card >
                    <Text style={{ fontWeight: 'bold' }}>Item: {this.state.Item}</Text>
                </Card>
                <Card>
                    <Text style={{ fontWeight: 'bold' }}>Company Name : {this.state.CompanyName}</Text>
                </Card>
                <Card>
                    <Text style={{ fontWeight: 'bold' }}>Number Of Pieces: {this.state.NumberOfPieces}</Text>
                </Card>
                <Card>
                    <Text style={{ fontWeight: 'bold' }}>Description: {this.state.Description}</Text>
                </Card>

            </Card>
        </View>
        <View style={{ flex: 0.5 }}>
            <Card
                title={"Reciever Information"}
                titleStyle={{ fontSize: 20 }}
            >
                <Card>
                    <Text style={{ fontWeight: 'bold' }}>Name: {this.state.From}</Text>
                </Card>
                <Card>
                    <Text style={{ fontWeight: 'bold' }}>Contact: {this.state.FromContact}</Text>
                </Card>
                <Card>
                    <Text style={{ fontWeight: 'bold' }}>Address: {this.state.FromAddress}</Text>
                </Card>
            </Card>
        </View>
        <View style={styles.buttonContainer}>
            {
                this.state.FromId !== this.state.userId
                    ? (
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                this.updateOrderStatus()
                                this.deletedoc(this.state.Item,this.state.CompanyName,this.state.NumberOfPieces,this.state.Description)
                                this.addNotification()
                                this.props.navigation.navigate('MyCompletedOrder')
                            }}>
                            <Text>Complete Order</Text>
                        </TouchableOpacity>
                    )
                    : null
            }
        </View>
    </View>
    </ScrollView>
)
}

}



const styles = StyleSheet.create({
container: {
flex: 1,
},
buttonContainer: {
flex: 0.3,
justifyContent: 'center',
alignItems: 'center'
},
button: {
width: 200,
height: 50,
justifyContent: 'center',
alignItems: 'center',
borderRadius: 10,
backgroundColor: 'orange',
shadowColor: "#000",
shadowOffset: {
    width: 0,
    height: 8
},
elevation: 16
}
})