// import React from 'react'
import React, { useRef, useState } from "react";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/analytics";
import { db } from "../../firebaseFile/firebase";

import { useCollectionData } from "react-firebase-hooks/firestore";
import Navbar from "../components/Navbar";
import { BsChatRightTextFill } from "react-icons/bs";
import { BASE_URL } from "../../Utils/urls";
import { useNavigate } from "react-router-dom";
import { LoginCheck } from "../../Utils/AuthCheck";
export default function Landing() {
  LoginCheck();
  const auth = firebase.auth();
  const firestore = firebase.firestore();
  const analytics = firebase.analytics();
  const messagesRef = firestore.collection("users");
  const query = messagesRef.limit(25);
  const [messages] = useCollectionData(query, { idField: "id" });
  const navigate = useNavigate();
  const [newuser, setUser] = useState("");
  const hashCode = (obj) => {
    if (obj == null) {
      return 0;
    }
    var hash = 0;
    var str = JSON.stringify(obj);
    for (var i = 0; i < str.length; i++) {
      var char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32-bit signed integer
    }
    return hash;
  };
  const openChat = async (uid, name) => {
alert(uid)
    // let senderId = localStorage.getItem("uid");
    // let recieverId = uid;

    // let hscoderecieverId = recieverId
    //   .toString()
    //   .split("")
    //   .reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
    // let hascodesenderId = senderId
    //   .toString()
    //   .split("")
    //   .reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
    // let summation = hscoderecieverId + hascodesenderId;
    // localStorage.setItem("summation", summation);
    // var myId = localStorage.getItem("uid");
    // var myHashCode = hashCode(myId);
    // var uidHashCode = hashCode(uid);
    // db.collection(`chatroom`).doc(`${localStorage.getItem("summation")}`).collection(`chatusers`).doc(recieverId).collection('chats').orderBy("time", "asc")
    //   .onSnapshot((doc) => {
        
    //     doc.forEach((doc) => {
    //       doc.ref.update({
    //         isRead: true,
    //       });
    //     })

    //   });
    // db.collection("chatroom").onSnapshot((snapshot) => {


    //   localStorage.setItem("recieverName", name);
    //   localStorage.setItem("recieverId", uid);
    //   const batch = db.batch();
    //   const doc1 = db.collection(`chatroom/${summation}/chatusers`).doc(myId);
    //   const doc2 = db.collection(`chatroom/${summation}/chatusers`).doc(uid);

    //   batch.set(doc1, { foo: "bar" });
    //   batch.set(doc2, { baz: "qux" });
    //   batch
    //     .commit()
    //     .then(() => {
    //       console.log("Batch write succeeded!");
    //     })
    //     .catch((error) => {
    //       console.error("Batch write failed:", error);
    //     });
    //   // navigate(`/chat/${uid}`);
    // });

    // navigate(`/chat/${uid}`);

    // });
  };
  return (
    <>
      <Navbar transparent />
      <div className="container mx-auto shadow-lg rounded-lg">
        <div className="px-5 py-5 flex justify-between items-center bg-white border-b-2">
          <div className="font-semibold text-2xl">GoingChat</div>
        </div>

        <div className="flex flex-row justify-between bg-white">
          <div className="flex flex-col w-2/5 border-r-2 overflow-y-auto">
            <div className="border-b-2 py-4 px-2">
              <input
                onChange={(e) => setUser(e.target.value)}
                type="text"
                placeholder="Search User"
                className="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full"
              />
            </div>
            <div style={{ overflowY: "scroll", maxHeight: "70vh" }}>
              {messages?.map((ele) =>
                newuser === "" ? (
                  <div
                    onClick={() => openChat(ele.uid, ele.name)}
                    key={ele.uid}
                    className="flex flex-row py-4 px-2 items-center border-b-2 cursor-pointer"
                  >
                    <div className="w-1/4">
                      <div className="rounded-full w-fit relative after:absolute after:content-[''] after:bottom-0 after:right-0 after:w-4 after:h-4 after:rounded-full after:bg-green-600">
                        <img
                          src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                          className="object-cover h-12 w-12 rounded-full"
                          alt=""
                        />
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="text-lg font-semibold">{ele.name}</div>
                      <span className="text-gray-500">{ele.email}</span>
                    </div>
                  </div>
                ) : ele.name.toLowerCase().match(newuser.toLowerCase()) ? (
                  <div
                    onClick={() => openChat(ele.uid, ele.name)}
                    key={ele.uid}
                    className="flex flex-row py-4 px-2 items-center border-b-2 cursor-pointer"
                  >
                    <div className="w-1/4">
                      <div className="rounded-full w-fit relative after:absolute after:content-[''] after:bottom-0 after:right-0 after:w-4 after:h-4 after:rounded-full after:bg-green-600">
                        <img
                          src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                          className="object-cover h-12 w-12 rounded-full"
                          alt=""
                        />
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="text-lg font-semibold">{ele.name}</div>
                      <span className="text-gray-500">{ele.email}</span>
                    </div>
                  </div>
                ) : (
                  ""
                )
              )}
            </div>
          </div>

          <div className="w-full px-5 gap-y-6 flex flex-col justify-center items-center">
            <p className="text-3xl text-blue-600 font-semibold">
              Select a Conversation
            </p>
            <BsChatRightTextFill className="text-blue-600" size={32} />
          </div>
        </div>
      </div>
    </>
  );
}

// import React, { useEffect, useState } from "react";

// import Navbar from "../components/Navbar"
// import Footer from "../components/Footer.js";
// import { db } from "../../firebaseFile/firebase";
// import firebase from 'firebase/compat/app';
// import { LoginCheck } from "../../Utils/AuthCheck";
// import { useNavigate } from "react-router-dom";

// // import firebase from 'firebase/app';
// // import 'firebase/firestore';
// // import 'firebase/auth';
// // import 'firebase/analytics';

// import { BsChatRightTextFill } from 'react-icons/bs';
// import { BASE_URL } from "../../Utils/urls";
// import { useCollectionData } from 'react-firebase-hooks/firestore';
// export default function Landing() {
//   LoginCheck()

//   // const messagesRef = firestore.collection('users');
//   // const query = messagesRef.limit(25);

//   // const [messages] = useCollectionData(query, { idField: 'id' });
//   // console.log(messages)
//   // firebase.initializeApp({
//   //   apiKey: "AIzaSyAXab0x7u_R8K2YpCC-SepABQ004F715HY",
//   //   authDomain: "chatappfirestore-378007.firebaseapp.com",
//   //   projectId: "chatappfirestore-378007",
//   //   storageBucket: "chatappfirestore-378007.appspot.com",
//   //   messagingSenderId: "426641543242",
//   //   appId: "1:426641543242:web:027226e7faa39a9a2f16b3",
//   //   measurementId: "G-5DYGY4TNVH"
//   // })

//   const [names, setNames] = useState([]);
//   const [user, setUser] = useState("");
//   const navigate = useNavigate();
//   const hashCode = (str) => {
//     var hash = 0;
//     if (str.length == 0) {
//       return hash;
//     }
//     for (var i = 0; i < str.length; i++) {
//       var char = str.charCodeAt(i);
//       hash = ((hash << 5) - hash) + char;
//       hash = hash & hash; // Convert to 32bit integer
//     }
//     return hash;
//   }

//   useEffect(() => {
//     fetchData()
//   }, []);

//   const fetchData = () => {
//     db.collection("users").onSnapshot((snapshot) => {
//       snapshot.docs.map((doc) => (
//         names.includes(doc._delegate._document.data.value.mapValue.fields) == true ? console.log("ni hai") : setNames(current => [...current, doc._delegate._document.data.value.mapValue.fields])
//         // setNames(current => [...current, !names.includes(doc._delegate._document.data.value.mapValue.fields)?doc._delegate._document.data.value.mapValue.fields:""])
//       ))
//     });
//   }
//   const openChat = async (uid, name) => {
//     var myId = localStorage.getItem("uid");
//     var myHashCode = hashCode(myId);
//     var uidHashCode = hashCode(uid);
//     var summation = myHashCode + uidHashCode;
//     var summation = summation * -1;
//     alert(summation)
//     db.collection("chatroom").onSnapshot((snapshot) => {
//       // if (snapshot._delegate.size === 0) {
//         localStorage.setItem("summation", summation);

//         localStorage.setItem("recieverName", name);
//         localStorage.setItem("recieverId", uid);
//         const batch = db.batch();
//         const doc1 = db.collection(`chatroom/${summation}/chatusers`).doc(myId);
//         const doc2 = db.collection(`chatroom/${summation}/chatusers`).doc(uid);

//         batch.set(doc1, { foo: 'bar' });
//         batch.set(doc2, { baz: 'qux' });
//         batch.commit()
//           .then(() => {
//             console.log('Batch write succeeded!');
//           })
//           .catch((error) => {
//             console.error('Batch write failed:', error);
//           });
//           window.location.replace(`${BASE_URL}chat/${uid}`);
//         // navigate(`/chat/${uid}`)
//       // }
//       // else {
//       //   alert("ok")
//       // }

//     });
//   }

//   return (
//     <>
//       <Navbar transparent />
//       <div className="container mx-auto shadow-lg rounded-lg">

//         <div className="px-5 py-5 flex justify-between items-center bg-white border-b-2">
//           <div className="font-semibold text-2xl">GoingChat</div>

//         </div>

//         <div className="flex flex-row justify-between bg-white">

//           <div className="flex flex-col w-2/5 border-r-2 overflow-y-auto">

//             <div className="border-b-2 py-4 px-2">
//               <input
//                 onChange={(e) => setUser(e.target.value)}
//                 type="text"
//                 placeholder="search chatting"
//                 className="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full"
//               />
//             </div>
//             <div style={{ overflowY: 'scroll', maxHeight: "70vh" }}>

//               {
//                 names.map((obj) => (
//                   obj.uid.stringValue === localStorage.getItem("uid") ? "" :
//                     user === "" ? <div onClick={() => openChat(obj.uid.stringValue,obj.name.stringValue)} className="flex flex-row py-4 px-2 items-center border-b-2 cursor-pointer">
//                       <div className="w-1/4">
//                         <div className={obj.status.stringValue === "Online" ? "rounded-full w-fit relative after:absolute after:content-[''] after:bottom-0 after:right-0 after:w-4 after:h-4 after:rounded-full after:bg-green-600" : ""} >
//                           <img
//                             src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
//                             className="object-cover h-12 w-12 rounded-full"
//                             alt=""
//                           />
//                         </div>
//                       </div>
//                       <div className="w-full">
//                         <div className="text-lg font-semibold">{obj.name.stringValue}</div>
//                         <span className="text-gray-500">{obj.email.stringValue}</span>
//                       </div>
//                     </div> : obj.name.stringValue.toString().toLowerCase().match(user.toLowerCase()) || obj.email.stringValue.toString().toLowerCase().match(user.toLowerCase()) ? <div onClick={() => openChat(obj.uid.stringValue)} className="flex flex-row py-4 px-2 items-center border-b-2 cursor-pointer">
//                       <div className="w-1/4">
//                         <div className={obj.status.stringValue === "Online" ? "rounded-full w-fit relative after:absolute after:content-[''] after:bottom-0 after:right-0 after:w-4 after:h-4 after:rounded-full after:bg-green-600" : ""} >
//                           <img
//                             src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
//                             className="object-cover h-12 w-12 rounded-full"
//                             alt=""
//                           />
//                         </div>
//                       </div>
//                       <div className="w-full">
//                         <div className="text-lg font-semibold">{obj.name.stringValue}</div>
//                         <span className="text-gray-500">{obj.email.stringValue}</span>
//                       </div>
//                     </div> : ""
//                 ))
//               }
//             </div>

//           </div>

//           <div className="w-full px-5 gap-y-6 flex flex-col justify-center items-center">
//             <p className="text-3xl text-blue-600 font-semibold">Select a Conversation</p>
//             <BsChatRightTextFill className="text-blue-600" size={32} />
//           </div>

//         </div>
//       </div>

//     </>
//   );
// }
