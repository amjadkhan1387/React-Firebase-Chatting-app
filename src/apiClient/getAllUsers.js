import { useState, useEffect } from "react";
import { db } from ".././firebaseFile/firebase";
import firebase from 'firebase/compat/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';
const useFetch = (uid) => {

    const [names, setNames] = useState([]);
    const [messages, setMessages] = useState([]);
    useEffect(() => {
        db.collection("users").onSnapshot((snapshot) => {
            snapshot.docs.map((doc) => (
                names.includes(doc._delegate._document.data.value.mapValue.fields) === true ? "" : setNames(current => [...current, doc._delegate._document.data.value.mapValue.fields])
            ))
        });
        setMessages([]);
        db.collection(`chatroom`).doc(`${localStorage.getItem("summation")}`).collection(`chatusers`).doc(`${uid}`).collection('chats').orderBy("time", "asc")
            .onSnapshot((doc) => {
                // console.log("Current data: ", doc);
                doc.forEach((doc) => {
                    messages.includes(doc._delegate._document.data.value.mapValue.fields) === true ? console.log("") : setMessages(current => [...current, doc._delegate._document.data.value.mapValue.fields])
                })

            });

    }, [])

    const reFetch = async () => {
        db.collection("users").onSnapshot((snapshot) => {
            snapshot.docs.map((doc) => (
                names.includes(doc._delegate._document.data.value.mapValue.fields) === true ? console.log("") : setNames(current => [...current, doc._delegate._document.data.value.mapValue.fields])
            ))
        });
        db.collection(`chatroom`).doc(`${localStorage.getItem("summation")}`).collection(`chatusers`).doc(`${uid}`).collection('chats').orderBy("time", "asc")
            .onSnapshot((doc) => {
                // console.log("Current data: ", doc);
                doc.forEach((doc) => {
                    messages.includes(doc._delegate._document.data.value.mapValue.fields) === true ? console.log("") : setMessages(current => [...current, doc._delegate._document.data.value.mapValue.fields])
                })

            });
            // const uniqueArray = [...new Set(messages.map(JSON.stringify))].map(JSON.parse);
            // setMessages(uniqueArray)
        // messages.includes(doc._delegate._document.data.value.mapValue.fields) === true ? console.log("ni hai message") : setMessages(current => [...current, doc._delegate._document.data.value.mapValue.fields])

    };

    
    return { names, messages,reFetch };
};

export default useFetch;
