import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: "AIzaSyB49NTLSoKLPHjkgAb8enWE6m4wcsx6Tq4",
  authDomain: "healthconnect-7f724.firebaseapp.com",
  projectId: "healthconnect-7f724",
  storageBucket: "healthconnect-7f724.appspot.com",
  messagingSenderId: "237748165343",
  appId: "1:237748165343:web:8221f96333aca535f8a76a"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const firestore = firebase.firestore();


const servers = {
  iceServers: [
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    { urls: "stun:stun3.l.google.com:19302" },
    { urls: "stun:stun4.l.google.com:19302" }
  ],
  iceCandidatePoolSize: 10
};


// Global State
const pc = new RTCPeerConnection(servers);

export { firestore, pc };
