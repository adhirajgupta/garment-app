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
  Platform
} from 'react-native';

import db from '../config';
import firebase from 'firebase';
import AsyncStorage from '@react-native-async-storage/async-storage'

export default class WelcomeScreen extends Component {
  constructor() {
    super();
    this.state = {
      emailId: '',
      password: '',
      firstName: '',
      lastName: '',
      address: '',
      contact: '',
      confirmPassword: '',
      pin: '',
      isModalVisible: 'false',
      asyncEmail: '',
      asyncPassword: ''
    }
  }


  readData = async () => {
    try {
      const val = await AsyncStorage.getItem('email')

      if (val !== null) {
        this.setState({
          asyncEmail: val
        })
      }
    } catch (e) {
      alert('Failed to fetch the data from storage')
      console.log(e)
    }
  }


  saveData = async () => {
    try {
      await AsyncStorage.setItem('email', this.state.asyncEmail)
      this.setState({
        asyncEmail: this.state.asyncEmail
      })
      alert('Data successfully saved')
    } catch (e) {
      alert('Failed to save the data to the storage')
      console.log(e)
    }
  }


  onSubmitEditing = () => {
    if (!this.state.asyncEmail) return
    this.saveData(this.state.asyncEmail)
    this.setState({
      asyncEmail: ''
    })
  }


  readData = async () => {
    try {
      const val = await AsyncStorage.getItem('email')

      if (val !== null) {
        this.setState({
          asyncEmail: val,
          emailId: val
        })
      }
    } catch (e) {
      alert('Failed to fetch the data from storage')
      console.log(e)
    }
  }


  saveData = async () => {
    try {
      await AsyncStorage.setItem('email', this.state.asyncEmail)
      this.setState({
        asyncEmail: this.state.asyncEmail
      })
      alert('Data successfully saved')
    } catch (e) {
      alert('Failed to save the data to the storage')
      console.log(e)
    }
  }


  onSubmitEditing = () => {
    if (!this.state.asyncEmail) return
    this.saveData(this.state.asyncEmail)
    this.setState({
      asyncEmail: ''
    })
  }

  readPassword = async () => {
    try {
      const vals = await AsyncStorage.getItem('password')

      if (vals !== null) {
        this.setState({
          asyncPassword: vals,
          password: vals
        })
      }
    } catch (e) {
      alert('Failed to fetch the data from storage')
      console.log(e)
    }
  }


  savePassword = async () => {
    try {
      await AsyncStorage.setItem('password', this.state.asyncPassword)
      this.setState({
        asyncPassword: this.state.asyncPassword,
      })
      alert('Data successfully saved')
    } catch (e) {
      alert('Failed to save the data to the storage')
      console.log(e)
    }
  }


  onSubmitEditingPassword = () => {
    if (!this.state.asyncPassword) return
    this.savePassword(this.state.asyncPassword)
    this.setState({
      asyncPassword: ''
    })
  }

  userSignUp = () => {
    if (this.state.password !== this.state.confirmPassword) {
      return alert("password doesn'ta match\nCheck your password.")
    } else {
      firebase.auth().createUserWithEmailAndPassword(this.state.emailId, this.state.password)
        .then(() => {
          db.collection('users').add({
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            contact: this.state.contact,
            email_id: this.state.emailId,
            address: this.state.address,
            pin: this.state.pin,
            IsOrderActive: false
          })
          return alert(
            'User Added Successfully',
            '',
            [
              { text: 'OK', onPress: () => this.setState({ "isModalVisible": false }) },
            ]
          );
        })
        .catch((error) => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          return alert(errorMessage)
        });
    }
  }

  userLogin = (emailId, password) => {
    console.log(emailId, password)
    firebase.auth().signInWithEmailAndPassword(emailId, password)
      .then(() => {
        this.props.navigation.navigate('PendingOrder')
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        return alert(errorMessage)
      })
  }

  showModal = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.state.isModalVisible}
      >
        <View style={styles.modalContainer}>
          <ScrollView style={{ width: '100%' }}>
            <KeyboardAvoidingView style={styles.KeyboardAvoidingView}>
              <Text
                style={styles.modalTitle}
              >Registration</Text>
              <TextInput
                style={styles.formTextInput}
                placeholder={"First Name"}
                maxLength={8}
                onChangeText={(text) => {
                  this.setState({
                    firstName: text
                  })
                }}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder={"Last Name"}
                maxLength={8}
                onChangeText={(text) => {
                  this.setState({
                    lastName: text
                  })
                }}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder={"Contact"}
                maxLength={10}
                keyboardType={'numeric'}
                onChangeText={(text) => {
                  this.setState({
                    contact: text
                  })
                }}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder={"Address"}
                multiline={true}
                onChangeText={(text) => {
                  this.setState({
                    address: text
                  })
                }}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder={"Email"}
                keyboardType={'email-address'}
                onChangeText={(text) => {
                  this.setState({
                    emailId: text
                  })
                }}
              /><TextInput
                style={styles.formTextInput}
                placeholder={"Password"}
                secureTextEntry={true}
                onChangeText={(text) => {
                  this.setState({
                    password: text
                  })
                }}
              /><TextInput
                style={styles.formTextInput}
                placeholder={"Confrim Password"}
                secureTextEntry={true}
                onChangeText={(text) => {
                  this.setState({
                    confirmPassword: text
                  })
                }}
              />
              <TextInput
                style={styles.formTextInput}
                placeholder={"Pin"}
                secureTextEntry={true}
                onChangeText={(number) => {
                  this.setState({
                    pin: number
                  })
                }}

              />
              <View style={styles.modalBackButton}>
                <TouchableOpacity
                  style={styles.registerButton}
                  onPress={() =>
                    this.userSignUp(this.state.emailId, this.state.password, this.state.confirmPassword)
                  }
                >
                  <Text style={styles.registerButtonText}>Register</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.modalBackButton}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => this.setState({ "isModalVisible": false })}
                >
                  <Text style={{ color: '#003366' }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
        </View>
      </Modal>
    )
  }

  componentDidMount = () => {
    this.readData()
    this.readPassword()
    if (this.state.asyncEmail !== '') {
      if (Platform.OS === "web") {
        alert("Press enter to save password")
      } else {
        if (Platform.OS === "android") {
          Alert.alert("Press enter to save passowrd")
        }
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          {this.showModal()}
        </View>

        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.title}>ORDER</Text>
        </View>
        <View>
          <TextInput
            style={styles.loginBox}
            value={this.state.asyncEmail}
            placeholder="abc@example.com"
            keyboardType='email-address'
            onChangeText={(text) => {
              this.setState({
                emailId: text,
                asyncEmail: text,
              })
            }}
            onSubmitEditing={this.onSubmitEditing}
          />
          <TextInput
            style={styles.loginBox}
            value={this.state.asyncPassword}
            secureTextEntry={true}
            placeholder="Enter Password"
            onChangeText={(text) => {
              this.setState({
                asyncPassword: text,
                password: text
              })
            }}
            onSubmitEditing={this.onSubmitEditingPassword}
          />
          <TouchableOpacity
            style={[styles.button, { marginBottom: 20, marginTop: 20 }]}
            onPress={() => {
              this.userLogin(this.state.emailId, this.state.password)
            }}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => this.setState({ isModalVisible: true })}
          >
            <Text style={styles.buttonText}>SignUp</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  //#ADD8E6
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#ADD8E6"
  },
  profileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 50,
    fontWeight: '300',
    paddingBottom: 30,
    color: 'blue'
  },
  loginBox: {
    width: 300,
    height: 40,
    borderBottomWidth: 1.5,
    borderColor: 'blue',
    fontSize: 20,
    margin: 10,
    paddingLeft: 10
  },
  KeyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalTitle: {
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: 30,
    color: 'blue',
    margin: 50
  },
  modalContainer: {
    borderRadius: 20,
    borderColor: '#ADD8E6',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#ffff",
    marginRight: 30,
    marginLeft: 30,
    marginTop: 30,
    marginBottom: 80,
    //padding: 10,
  },
  formTextInput: {
    width: "75%",
    height: 35,
    alignSelf: 'center',
    borderColor: '#ADD8E6',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    padding: 10,
    fontSize: 15,
  },
  registerButton: {
    width: 200,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'blue',
    marginTop: 30
  },
  registerButtonText: {
    color: 'blue',
    fontSize: 15,
    fontWeight: 'bold'
  },
  cancelButton: {
    width: 200,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },

  button: {
    width: 300,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: "#007FFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.30,
    shadowRadius: 10.32,
    elevation: 16,
    padding: 10
  },
  buttonText: {
    color: '#ffff',
    fontWeight: '200',
    fontSize: 20
  }
})



