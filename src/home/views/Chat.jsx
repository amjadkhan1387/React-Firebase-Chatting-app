import React, { useRef, useState, useEffect } from "react";

import { useCollectionData } from "react-firebase-hooks/firestore";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/storage";

import Navbar from "../components/Navbar";
import { db } from "../../firebaseFile/firebase";

import { RiDeleteBinLine } from "react-icons/ri";
import { BsCheck2, BsCheck2All } from "react-icons/bs";
import { generateRandomString } from "../../Utils/randomString";
import { storage } from "../../firebaseFile/firebase";
import { sendMessage } from "../../firebaseFile/sendMessage";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,

} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import FileUploader from "react-firebase-file-uploader";
import { error_toaster } from "../../Utils/toaster";
export default function Chat() {
  window.addEventListener("beforeunload", function (e) {
    e.preventDefault();
    e.returnValue = "";
  });

  const [newuser, setUser] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState("");
  const [searchMessage, setSearchMessage] = useState("");
  const firestore = firebase.firestore();

  const [selectedFile, setSelectedFile] = useState("");
  const messagesEndRef = useRef(null);


  const [modal, setModal] = useState(false);


  const handleUploadSuccess = (filename) => {
    
    storage
      .ref("images")
      .child(filename)
      .getDownloadURL()
      .then(async (url) => {
        try {
          // Create a single batch to add both documents
          const batch = firestore.batch();

          // Add the image message to chatRef
          const chatMessage = {
            contact: {
              name: null,
              number: null,
            },
            duration: "",
            isSend: true,
            latitude: null,
            longitude: null,
            message: url,
            messageStatus: "read",
            time: getCurrentDateTimeString(),
            contact: {},
            isRead: false,
            messageId: generateRandomString(),
            sendby: localStorage.getItem("senderName"),
            type: "image",
          };
          const chatMessageRef = chatRef.doc();
          batch.set(chatMessageRef, chatMessage);

          // Add the image message to recieverChat
          const recieverChatMessage = {
            contact: {
              name: null,
              number: null,
            },
            duration: "",
            messageStatus: "read",
            isSend: true,
            latitude: null,
            longitude: null,
            message: url,
            time: getCurrentDateTimeString(),
            contact: {},
            isRead: false,
            messageId: generateRandomString(),
            sendby: localStorage.getItem("senderName"),
            type: "image",
          };
          const recieverChatMessageRef = recieverChat.doc();
          batch.set(recieverChatMessageRef, recieverChatMessage);

          // Commit the batch to add both documents atomically
          await batch.commit();
        } catch (error) {
          console.error("Error while adding image messages:", error);
        }
      });
  };

  const handleProgress = (progress) => setLoading(false);
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
  const chatquery = chatRef.orderBy("time").limit(25);
  const [chats] = useCollectionData(chatquery);

  const messagesRef = firestore.collection("users");
  const query = messagesRef.limit(25);
  const [messages] = useCollectionData(query, { idField: "id" });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  });

  const openChat = async (uid, name) => {
    let senderId = localStorage.getItem("uid");
    let recieverId = uid;

    let hscoderecieverId = recieverId
      .toString()
      .split("")
      .reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
    let hascodesenderId = senderId
      .toString()
      .split("")
      .reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
    let summation = hscoderecieverId + hascodesenderId;
    localStorage.setItem("summation", summation);
    var myId = localStorage.getItem("uid");

    db.collection("chatroom").onSnapshot((snapshot) => {
      // if (snapshot._delegate.size === 0) {

      localStorage.setItem("recieverName", name);
      localStorage.setItem("recieverId", uid);
      const batch = db.batch();
      const doc1 = db.collection(`chatroom/${summation}/chatusers`).doc(myId);
      const doc2 = db.collection(`chatroom/${summation}/chatusers`).doc(uid);

      batch.set(doc1, { foo: "bar" });
      batch.set(doc2, { baz: "qux" });
      batch
        .commit()
        .then(() => {
          console.log("Batch write succeeded!");
        })
        .catch((error) => {
          console.error("Batch write failed:", error);
        });
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
  const delete_chat = async () => {
    const emptyMessages = await firestore
      .collection(`chatroom`)
      .doc(`${localStorage.getItem("summation")}`)
      .collection(`chatusers`)
      .doc(`${localStorage.getItem("uid")}`)
      .collection("chats")
      .get();
    const batch = firestore.batch();
    emptyMessages.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    setModal(false);
  };
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

  const testing_sending_message =async (newMessage) => {
    if (newMessage === "") {
      error_toaster("Please write something!");
      return false;
    } else {
      setLoading(true)
      const data =await sendMessage(newMessage);
      if(data === true)
      {
        setLoading(false);
        setNewMessage("");
      }
      else
      {
        setLoading(false);
        error_toaster("Something went wrong!");
      }

    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      testing_sending_message(newMessage);
    }
  };

  return (
    <>
      <Navbar />

      <div className=" mx-auto shadow-lg rounded-lg h-screen">
        <div className="px-5 py-5 flex justify-between items-center bg-white border-b-2">
          <div className="font-semibold text-2xl">GoingChat</div>
          <div className="w-1/2">
            <input
              onChange={(e) => setSearchMessage(e.target.value)}
              type="text"
              name=""
              id=""
              placeholder="search in Message"
              className="rounded bg-gray-100 py-3 px-5 w-full shadow-md border-gray-300"
            />
          </div>
          <div className="flex justify-between items-center gap-x-2">
            <div className="h-10 px-4 p-2 bg-themeIndigo rounded-lg text-white font-semibold flex items-center justify-center border border-themeIndigo hover:bg-white hover:text-blue-600">
              {localStorage.getItem("recieverName")}
            </div>
            <div>
              <RiDeleteBinLine
                onClick={() => setModal(true)}
                size={24}
                className="text-themeIndigo cursor-pointer"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-row justify-between bg-white">
          <div className="flex flex-col w-2/5 border-r-2 overflow-y-auto">
            <div className="border-b-2 py-4 px-2">
              <input
                onChange={(e) => setUser(e.target.value)}
                type="text"
                placeholder="search User"
                className="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full"
              />
            </div>
            <div style={{ overflowY: "scroll", maxHeight: "100vh" }}>
              {messages?.map((ele) =>
                localStorage.getItem("senderName") !== ele.name ? (
                  newuser === "" ? (
                    <div
                      onClick={() => openChat(ele.uid, ele.name)}
                      key={ele.uid}
                      className="flex flex-row py-4 px-2 items-center border-b-2 cursor-pointer shadow-lg"
                    >
                      <div className="w-1/4">
                        <div
                          className={
                            ele.status === "Online"
                              ? "rounded-full w-fit relative after:absolute after:content-[''] after:bottom-0 after:right-0 after:w-4 after:h-4 after:rounded-full after:bg-green-600"
                              : ""
                          }
                        >
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
                      className="flex flex-row py-4 px-2 items-center border-b-2 cursor-pointer shadow-lg"
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
                ) : (
                  ""
                )
              )}
            </div>
          </div>

          <div
            style={{ overflowY: "scroll", maxHeight: "70vh" }}
            className="w-full px-5 flex flex-col justify-between"
          >
            <div className="flex flex-col mt-5">
              {chats?.length === 0 ? (
                <div className="flex justify-center items-center">
                  <p className="font-semibold">No Message</p>
                </div>
              ) : (
                chats?.map((message) =>
                  searchMessage === "" ? (
                    message.type === "text" ? (
                      <div className="mb-4">
                        <div
                          class={
                            localStorage.getItem("senderName") ===
                            message.sendby
                              ? "flex flex-col items-end  "
                              : "flex flex-col items-start"
                          }
                        >
                          <div className="flex">
                            <div
                              class={
                                localStorage.getItem("senderName") ===
                                message.sendby
                                  ? "mr-2 py-3 px-4 bg-blue-600  rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
                                  : "mr-2 py-3 px-4 bg-gray-600  rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
                              }
                            >
                              {message.message}
                            </div>
                            <img
                              src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                              className="object-cover h-8 w-8 rounded-full"
                              alt=""
                            />
                          </div>
                        </div>
                        <div
                          class={
                            localStorage.getItem("senderName") ===
                            message.sendby
                              ? "flex  justify-end gap-x-2"
                              : "flex justify-start gap-x-2"
                          }
                        >
                          <p className="text-xs">
                            {new Date(
                              message?.time?.seconds ?? "3453453" * 1000
                            )
                              .toISOString()
                              .slice(11, 19)}
                          </p>
                          {localStorage.getItem("senderName") ===
                          message.sendby ? (
                            message.isRead ? (
                              <BsCheck2All />
                            ) : (
                              <BsCheck2 />
                            )
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div>
                          <div
                            className={
                              localStorage.getItem("senderName") ===
                              message.sendby
                                ? "flex flex-col items-end mb-4 "
                                : "flex flex-col items-start mb-4"
                            }
                          >
                            <img
                              src={message.message}
                              alt="image"
                              className="rounded-lg w-36 h-36 object-contain"
                            />
                          </div>
                          <div
                            class={
                              localStorage.getItem("senderName") ===
                              message.sendby
                                ? "flex  justify-end gap-x-2"
                                : "flex justify-start gap-x-2"
                            }
                          >
                            <p className="text-xs">
                              {new Date(message?.time?.seconds ?? "2342" * 1000)
                                .toISOString()
                                .slice(11, 19)}
                            </p>
                            {localStorage.getItem("senderName") ===
                            message.sendby ? (
                              message.isRead ? (
                                <BsCheck2All />
                              ) : (
                                <BsCheck2 />
                              )
                            ) : (
                              ""
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  ) : message.message
                      .toLowerCase()
                      .match(searchMessage.toLowerCase()) ? (
                    <div>
                      <div
                        class={
                          localStorage.getItem("senderName") === message.sendby
                            ? "flex flex-col items-end mb-4 "
                            : "flex flex-col items-start mb-4"
                        }
                      >
                        <div className="flex">
                          <div
                            class={
                              localStorage.getItem("senderName") ===
                              message.sendby
                                ? "mr-2 py-3 px-4 bg-blue-600  rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
                                : "mr-2 py-3 px-4 bg-gray-600  rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
                            }
                          >
                            {message.message}
                          </div>
                          <img
                            src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                            className="object-cover h-8 w-8 rounded-full"
                            alt=""
                          />
                        </div>
                        <div
                          class={
                            localStorage.getItem("senderName") ===
                            message.sendby
                              ? "flex  justify-end gap-x-2"
                              : "flex justify-start gap-x-2"
                          }
                        >
                          <p className="text-xs">
                            {new Date(
                              message?.time?.seconds ?? "2342323" * 1000
                            )
                              .toISOString()
                              .slice(11, 19)}
                          </p>
                          {localStorage.getItem("senderName") ===
                          message.sendby ? (
                            message.isRead ? (
                              <BsCheck2All />
                            ) : (
                              <BsCheck2 />
                            )
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    ""
                  )
                )
              )}
              <div ref={messagesEndRef} />
              {selectedFile && (
                <div className="flex items-end justify-center flex-col">
                  <img
                    className="h-28 w-28 object-cover rounded-xl"
                    alt="New Image"
                    src={URL.createObjectURL(selectedFile)}
                  />
                  <br />
                  <div>
                    <button
                      className="btn btn-danger btn-sm button-border"
                      onClick={() => setSelectedFile(null)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
              <div className="flex items-center py-4 absolute contents:[''] bottom-0 w-[65%]">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-[200%] bg-gray-300 py-2 px-3"
                  type="text"
                  placeholder="Type your message here..."
                  onKeyPress={handleKeyPress}
                />

                <FileUploader
                  accept="image/*"
                  name="image"
                  randomizeFilename
                  storageRef={storage.ref("images")}
                  onUploadStart={() => {
                    setLoading(true);
                  }}
                  onUploadError={(error) => {
                    setLoading(false);
                  }}
                  onUploadSuccess={handleUploadSuccess}
                  onProgress={handleProgress}
                />

                {loading ? (
                  <img src="/loading.gif" className="h-10 w-10 object-cover" />
                ) : (
                  <button
                    onClick={() => testing_sending_message(newMessage)}
                    className="w-[150px] cursor-pointer bg-themeIndigo text-white border border-themeIndigo hover:bg-white hover:text-themeIndigo py-2 px-6"
                  >
                    Send
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={modal} onClose={() => setModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <p>Do you want to delete this converstaion?</p>
            <div className="flex justify-end gap-x-2">
              <button
                onClick={() => setModal(false)}
                className="py-1 bg-gray-600 px-4 rounded text-white"
              >
                No
              </button>
              <button
                onClick={() => delete_chat()}
                className="py-1 bg-blue-600 px-4 rounded text-white"
              >
                Yes
              </button>
            </div>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    
    </>
  );
}
