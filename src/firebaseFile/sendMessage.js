
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { generateRandomString } from "../Utils/randomString";
import "firebase/compat/storage";
export async function sendMessage(message) {
  try {
    const firestore = firebase.firestore();
    const recieverChat = firestore
      .collection(`chatroom`)
      .doc(localStorage.getItem("summation"))
      .collection("chatusers")
      .doc(localStorage.getItem("recieverId"))
      .collection("chats");
    const chatRef = firestore
      .collection(`chatroom`)
      .doc(localStorage.getItem("summation"))
      .collection("chatusers")
      .doc(localStorage.getItem("uid"))
      .collection("chats");
    await chatRef.add({
      contact: {
        name: null,
        number: null,
      },
      duration: "",
      isSend: true,
      latitude: null,
      messageStatus: "read",
      longitude: null,
      message: message,
      time: getCurrentDateTimeString(),
      contact: {},
      isRead: false,
      messageId: generateRandomString(),
      sendby: localStorage.getItem("senderName"),
      type: "text",
    });
    await recieverChat.add({
      contact: {
        name: null,
        number: null,
      },
      duration: "",
      isSend: true,
      latitude: null,
      messageStatus: "read",
      longitude: null,
      message: message,
      time: getCurrentDateTimeString(),
      contact: {},
      isRead: false,
      messageId: generateRandomString(),
      sendby: localStorage.getItem("senderName"),
      type: "text",
    });
   return true;
  } catch (error) {
   return false;
    console.log(error);
  }
}

function getCurrentDateTimeString() {
    const currentDate = new Date();
    const year = currentDate.getUTCFullYear();
    const month = String(currentDate.getUTCMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getUTCDate()).padStart(2, "0");
    const hours = String(currentDate.getUTCHours()).padStart(2, "0");
    const minutes = String(currentDate.getUTCMinutes()).padStart(2, "0");
    const seconds = String(currentDate.getUTCSeconds()).padStart(2, "0");
    const milliseconds = String(currentDate.getUTCMilliseconds()).padStart(
      3,
      "0"
    );

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}Z`;
  }