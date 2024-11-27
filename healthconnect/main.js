import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAksY7L0YrzPEnzoWxSPN3JXlsudFK4Z5Q",
  authDomain: "healthcare-95912.firebaseapp.com",
  projectId: "healthcare-95912",
  storageBucket: "healthcare-95912.firebasestorage.app",
  messagingSenderId: "61352829355",
  appId: "1:61352829355:web:53d936febb30e5ea78b2ee",
  measurementId: "G-PLHW4CDS1J"
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
