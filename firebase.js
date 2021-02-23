import firebase from "firebase/app";

import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/performance";

const firebaseConfig = {
  apiKey: "AIzaSyA4HKw0rV5-G1zGpDU_-KOtbsiaAfZ8A2M",
  authDomain: "readwithme-ea316.firebaseapp.com",
  databaseURL: "https://readwithme-ea316.firebaseio.com",
  projectId: "readwithme-ea316",
  storageBucket: "readwithme-ea316.appspot.com",
  messagingSenderId: "89981139684",
  appId: "1:89981139684:web:3b42ecb8597b20e4ed4af1"
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
// export const performance = firebase.performance();

// export let analytics;

// if (process.env.NODE_ENV !== "test") {
//   analytics = firebase.analytics();
// }
