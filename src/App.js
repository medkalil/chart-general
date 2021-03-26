import React,{ useRef, useState } from "react"
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';


if(!firebase.apps.length){

  firebase.initializeApp({
    apiKey: "AIzaSyAJo1Ak1dwxCvRoKqYxuvvv6ketl-C4Hb8",
    authDomain: "chatapp-60bd4.firebaseapp.com",
    projectId: "chatapp-60bd4",
    storageBucket: "chatapp-60bd4.appspot.com",
    messagingSenderId: "1054857058885",
    appId: "1:1054857058885:web:424d623f258f056796e12c"
  })
}else{

 //alrady initialized
  firebase.app()
}

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>

      <section>
       {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

export default App;


//SignIn

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      <p>Do not violate the community guidelines or you will be banned for life!</p>
    </>
  )
}


//ChatRoom

function ChatRoom() {

  const dummy = useRef();

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query,{ idField: 'id' })
  //state
  const [formValue,setFormValue]=useState("")



  const sendMsg = async(e) =>{
    e.preventDefault();
    //create the msg obj
    const { uid, photoURL } = auth.currentUser;

   await messagesRef.add({
      text:formValue,
      createdAt:firebase.firestore.FieldValue.serverTimestamp(),
      photoURL,
      uid
    })

    setFormValue("")
    dummy.current.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div>
    <main>
        {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

        <span ref={dummy}></span>
    </main>
   
     <form onSubmit={sendMsg} >
       <input type="test" value={formValue} onChange={(e) => setFormValue(e.target.value) } />
       <button type="submit" disabled={!formValue} >Send</button>
     </form>
   
    </div>
  )
}


//SignOut

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}



//chatMessage
function ChatMessage({message}){

const {text,uid,photoURL} = message

const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received'  
  return(
    <div className={`message ${messageClass}`} >
      <img src={photoURL || "https://image.flaticon.com/icons/png/128/4107/4107983.png" } />
      <p> {text} </p>
    </div>
  )

}


