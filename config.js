import firebase from 'firebase';
require('@firebase/firestore')

const firebaseConfig = {
  apiKey: "AIzaSyCqEQyKBcSf2DQaWpZyWnGADYnoz84znog",
  authDomain: "c93-fb8e5.firebaseapp.com",
  databaseURL: "https://c93-fb8e5.firebaseio.com",
  projectId: "c93-fb8e5",
  storageBucket: "c93-fb8e5.appspot.com",
  messagingSenderId: "161282253290",
  appId: "1:161282253290:web:c5f76b7f8c3102febbd293"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
