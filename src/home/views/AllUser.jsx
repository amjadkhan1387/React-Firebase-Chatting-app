import React, { useState } from "react";
import Navbar from "../components/Navbar";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/analytics";
import { db } from "../../firebaseFile/firebase";
import { BsChatRightTextFill } from "react-icons/bs";
import { BASE_URL } from "../../Utils/urls";
import { useNavigate } from "react-router-dom";
import { LoginCheck } from "../../Utils/AuthCheck";
import { useCollectionData } from "react-firebase-hooks/firestore";
export default function AllUser() {
  LoginCheck();
  const navigate = useNavigate();
  const firestore = firebase.firestore();
  const analytics = firebase.analytics();
  const messagesRef = firestore.collection("users");
  const query = messagesRef.limit(25);
  const [messages] = useCollectionData(query, { idField: "id" });
  const [search, setSearch] = useState("");

  
String.prototype.hashCode = function () {
  let hash = 0;
  if (this.length == 0) return hash;

  for (let i = 0; i < this.length; i++) {
    const char = this.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32-bit integer (equivalent to Dart's hash & hash)
  }
  return hash;
};

function makeAUniqueString(ci, ui) {
  let temp = 0;
  if (ci > ui) {
    temp = ci;
    ci = ui;
    ui = temp;
  }

  if (ci > ui) {
    console.log(`${ci}${ui}`);
    return (ci.toString().hashCode() + ui.toString().hashCode()).toString();
  } else {
    console.log(`${ui}${ci}`);
    return (ui.toString().hashCode() + ci.toString().hashCode()).toString();
  }
}

  const openChat = async (uid, name) => {
    let senderId = localStorage.getItem("uid");
    let recieverId = uid;

    const uniqueString = makeAUniqueString(senderId,recieverId);
   

   
    // let senderId = "4YVc5sCFDees9q8VkNqfx0jtaca2";
    // let recieverId = "65RocuUufsN2abU1vZ81M70yH7F2";
    // let hscoderecieverId = recieverId
    //   .toString()
    //   .split("")
    //   .reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
    // let hascodesenderId = senderId
    //   .toString()
    //   .split("")
    //   .reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
    // let summation = hscoderecieverId + hascodesenderId;

    localStorage.setItem("summation", uniqueString);

    db.collection("chatroom").onSnapshot((snapshot) => {
      if (snapshot._delegate.size === 0) {
        localStorage.setItem("recieverName", name);
        localStorage.setItem("recieverId", uid);
        const batch = db.batch();
        const doc1 = db
          .collection(`chatroom/${uniqueString}/chatusers`)
          .doc(senderId);
        const doc2 = db.collection(`chatroom/${uniqueString}/chatusers`).doc(uid);

        batch.set(doc1, { foo: "bar" });
        batch.set(doc2, { baz: "qux" });
        batch
          .commit()
          .then(() => {})
          .catch((error) => {
            console.error("Batch write failed:", error);
          });
        // window.location.replace(`${BASE_URL}chat/${uid}`);
        // navigate(`/chat/${uid}`)
        // }
        // else {
        //   alert("ok")
      }
    });
    db.collection(`chatroom`)
      .doc(`${localStorage.getItem("summation")}`)
      .collection(`chatusers`)
      .doc(recieverId)
      .collection("chats")
      .orderBy("time", "asc")
      .onSnapshot((doc) => {
        console.log("Current data: ", doc);
        doc.forEach((doc) => {
          doc.ref.update({
            isRead: true,
          });
        });
      });
    navigate(`/chat/${uid}`);
  };
  return (
    <>
      <Navbar />
      <div className="w-3/5 mx-auto py-16">
        <p className="py-4 text-4xl text-center font-semibold text-indigo-700">
          Enter User Name
        </p>
        <div>
          <input
            onChange={(e) => setSearch(e.target.value)}
            type={"text"}
            placeholder="Search User"
            className="py-1 border border-gray-400 rounded-lg w-full"
          />
        </div>
        {messages?.map((user) =>
          search === "" ? (
            ""
          ) : user.name.toLowerCase().match(search.toLowerCase()) ||
            user.email.toLowerCase().match(search.toLowerCase()) ? (
            <div
              onClick={() => openChat(user.uid, user.name)}
              className="bg-indigo-700 cursor-pointer shadow-lg text-white rounded-lg my-2 text-center flex justify-around py-6 items-center hover:bg-white border-2 border-indogo-700 hover:text-indigo-700"
            >
              <p className="text-2xl">{user.name}</p>
              <p className="text-xl">{user.email}</p>
            </div>
          ) : (
            ""
          )
        )}
      </div>
    </>
  );
}
