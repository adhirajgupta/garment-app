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
    FlatList
} from 'react-native';

import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader';
import { ListItem, Card } from 'react-native-elements';


export default class MyPendingOrder extends Component {
    constructor() {
        super();
        this.state = {
            UserId: firebase.auth().currentUser.email,
            PendingOrders: []
        }
        this.order = null
    }
    getPendingOrderList = () => {
        db.collection("orders").where("UserId","==",this.state.UserId)
        .onSnapshot(snapshot=>{
            var list = snapshot.docs.map(doc => doc.data())
            console.log(list)
            this.setState({
                PendingOrders:list
            })
        })
    }

    deletedoc = (Item, CompanyName, NumberOfPieces, Description) => {
        db.collection('orders')
            .onSnapshot(snapshot => {
                snapshot.forEach(doc => {
                    const upd = db.collection('orders').doc(doc.id).delete();
                })
            })
    }



    componentDidMount() {
        this.getPendingOrderList()
    }


    keyExtractor = (item, index) => index.toString()

    renderItem = ({ item, i }) => {
        return (
            <Card
                title={<TouchableOpacity style = {{alignContent:'center',alignSelf:'center'}} onPress={()=>this.props.navigation.navigate('CompanyDetails',{"details":item})}><Text style={{fontSize:30,fontWeight:'600'}}>{item.From+" is selling "+item.NumberOfPieces+" "+item.Item+" of "+item.CompanyName}</Text></TouchableOpacity>}
                titleStyle={{alignItems:'center',alignSelf:'center',fontSize:30}}
            >
            </Card>
        )
    }


    render() {
        return (
            <View style={{ flex: 1 }}>
                <MyHeader title="My Orders" navigation={this.props.navigation} />
                <View style={{ flex: 1 }}>
                    {
                        this.state.PendingOrders.length === 0
                            ? (
                                <View style={styles.subContainer}>
                                    <Text style={{ fontSize: 20 }}>List Of All your orders</Text>
                                </View>
                            )
                            : (
                                <FlatList
                                    keyExtractor={this.keyExtractor}
                                    data={this.state.PendingOrders}
                                    renderItem={this.renderItem}
                                />
                            )
                    }
                </View>
            </View>
        )
    }
}


const styles = StyleSheet.create({
    subContainer: {
        flex: 1,
        fontSize: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        width: 100,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#1351d8",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8
        },
    }
})