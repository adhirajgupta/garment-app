import React, { Component } from 'react'
import { View, Text, TouchableOpacity, ScrollView, FlatList, StyleSheet } from 'react-native';
import { Card, Icon, ListItem } from 'react-native-elements'

import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader';

export default class MyCompletedOrder extends Component {
    constructor() {
        super()
        this.state = {
            ToId: firebase.auth().currentUser.email,
            ToName: "",
            CompletedOrder: [],

        }
        this.order = null
        this.colour = "#defade"
    }

    static navigationOptions = { header: null };

    getToDetails = (ToId) => {
        db.collection('users').where("email_id", '==', ToId).get()
            .then(snapshot => {
                snapshot.forEach((doc) => {
                    this.setState({
                        "ToName": doc.data().first_name + " " + doc.data().last_name
                    })
                })
            })
    }

    getAllCompletedOrders = () => {
        this.order = db.collection('CompletedOrders').where("ToId", "==", this.state.ToId)
            .onSnapshot((snapshot) => {
                var CompletedOrder = []
                snapshot.docs.map((doc) => {
                    var ord = doc.data()
                    ord["doc_id"] = doc.id
                    CompletedOrder.push(ord)
                })
                this.setState({
                    CompletedOrder: CompletedOrder
                })
            })
    }

    completeOrder = (orderDetails) => {
        if (orderDetails.OrderStatus === "Order Completed") {
            var OrderStatus = "Order Viewed"
            db.collection('CompletedOrders').doc(orderDetails.doc_id).update({
                "OrderStatus": "Order Viewed"
            })
            this.sendNotification(orderDetails, OrderStatus)
        } else {
            var OrderStatus = "Order Completed"
            db.collection('CompletedOrders').doc(orderDetails.doc_id).update({
                "OrderStatus": "Order Completed"
            })
            this.sendNotification(orderDetails, OrderStatus)
        }
    }


    sendNotification = (orderDetails, orderStatus) => {
        var orderId = orderDetails.OrderId
        db.collection("Notifications")
            .where("OrderId", "==", orderId)
            .get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    var message = ""
                    if (orderStatus === "Order Completed") {
                        message = this.state.ToId + " completed your order"
                    } else {
                        message = this.state.ToId + " has viewed your order"
                    }
                    db.collection("Notifications").doc(doc.id).update({
                        "message": message,
                        "notification_status": "unread",
                        "date": firebase.firestore.FieldValue.serverTimestamp()
                    })
                })
            })
    }


    keyExtractor = (item, index) => index.toString()

    renderItem = ({ item, i }) => {

        var status = item.OrderStatus.split(' ')
        console.log(status)

        return (
            <Card
                title={
                    <TouchableOpacity
                        onPress={() => {
                            this.completeOrder(item)
                        }}
                    >
                        <Text style={{ color: item.OrderStatus === "Order Completed" ? "green" : "#ff5722", fontSize: 20, }}>
                            {"The order " + item.UserId + " ordered " + " of " + item.NumberOfPieces + item.Item + " from " + item.CompanyName + " is " + status[1]}
                        </Text>
                    </TouchableOpacity>}
                titleStyle={{ alignItems: 'center', alignSelf: 'center', fontSize: 30 }}
            >
            </Card>
        )
    }


    componentDidMount() {
        this.getToDetails(this.state.ToId)
        this.getAllCompletedOrders()
        console.log(this.state)
    }

    componentDidUpdate() {
        console.log(this.state)
    }

    componentWillUnmount() {
        this.order();
        console.log(this.state)
    }

    render() {
        return (
            /*      <View style={{ flex: 1 }}>
                    <MyHeader title="Completed Orders" navigation={this.props.navigation} />
            
                    <View>
                        <Text>Hello you are in the MyCompletedOrder</Text>
                    </View>
                    </View>*/
            <View style={{ flex: 1 }}>
                <MyHeader navigation={this.props.navigation} title="Completed Orders" />
                <View style={{ flex: 1 }}>
                    {
                        this.state.CompletedOrder.length === 0
                            ? (

                                <View style={styles.subtitle}>
                                    <Text style={{ fontSize: 20 }}>List of all Completed Orders</Text>
                                </View>
                            )
                            : (

                                <FlatList
                                    keyExtractor={this.keyExtractor}
                                    data={this.state.CompletedOrder}
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
    button: {
        width: 100,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8
        },
        elevation: 16
    },
    subtitle: {
        flex: 1,
        fontSize: 20,
        justifyContent: 'center',
        alignItems: 'center'
    }
})
