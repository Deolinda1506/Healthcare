import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAuzphnR1wdlyULyn9O8xnAvEtwdsWnwZI",
  authDomain: "healthconnect-ce75d.firebaseapp.com",
  projectId: "healthconnect-ce75d",
  storageBucket: "healthconnect-ce75d.firebasestorage.app",
  messagingSenderId: "289666047939",
  appId: "1:289666047939:web:a76c6556e349c3825de776",
  measurementId: "G-0MK1ZTTME6"
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
