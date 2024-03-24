import React, { useState, useEffect } from "react";
import "./App.css";
import { db } from "./firebaseFile/firebase";
import firebase from 'firebase/compat/app';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { ToastContainer } from "react-toastify";

import Login from "./auth/Login";
import Signup from "./auth/Signup";
import Chat from "./home/views/Chat"
import Landing from "./home/views/Landing"
import { LoginCheck } from "./Utils/AuthCheck";
import AllUser from "./home/views/AllUser";
import { ChakraProvider } from "@chakra-ui/react";
function App() {
  const [customerName, setCustomerName] = useState("");
  const [customerPassword, setCustomerPassword] = useState("");
  const [customersData, setCustomersData] = useState([]);

  

  return (

    <>
      <ToastContainer />
      <ChakraProvider>
      <Router>
        <Routes>
          <Route exact path='/login' element={<Login />} />
          <Route exact path='/signup' element={<Signup />} />
          <Route exact path='/' element={<AllUser />} />
          <Route exact path='/chat/:uid' element={<Chat />} />
        </Routes>
      </Router>
      </ChakraProvider>
    </>
    // <div className="App">
    //   <h1 className="text-red-400 text-sm">Tufail</h1>
    //   <div className="App__form">
    //     <input
    //       type="text"
    //       placeholder="Name"
    //       value={customerName}
    //       onChange={(e) => setCustomerName(e.target.value)}
    //     />
    //     <input
    //       type="text"
    //       placeholder="Password"
    //       value={customerPassword}
    //       onChange={(e) => setCustomerPassword(e.target.value)}
    //     />
    //     <button onClick={submit}>Submit</button>
    //   </div>
    //   <div className="App__DataDisplay">
    //     <table>
    //       <tr>
    //         <th>NAME</th>
    //         <th>PASSWORD</th>
    //       </tr>

    //       {customersData?.map(({ id, data }) => (
    //         <tr key={id}>
    //           <td>{data.name}</td>
    //           <td>{data.password}</td>
    //         </tr>
    //       ))}
    //     </table>
    //   </div>
    // </div>
  );
}

export default App;