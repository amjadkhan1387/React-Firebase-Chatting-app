import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage'; // Import the Storage module

const firebaseConfig = {
  apiKey: "AIzaSyAXab0x7u_R8K2YpCC-SepABQ004F715HY",
  authDomain: "chatappfirestore-378007.firebaseapp.com",
  databaseURL: "https://chatappfirestore-378007-default-rtdb.firebaseio.com",
  projectId: "chatappfirestore-378007",
  storageBucket: "chatappfirestore-378007.appspot.com",
  messagingSenderId: "426641543242",
  appId: "1:426641543242:web:027226e7faa39a9a2f16b3",
  measurementId: "G-5DYGY4TNVH"
};

// Use this to initialize the firebase App
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Use these for db, auth & storage
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage(); // Initialize the Storage service

export { auth, db, storage };
