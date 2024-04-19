// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0nIDRnhOvqota8Ux6vGSI5w_NFPCfJVw",
  authDomain: "mern-blogsite-68baf.firebaseapp.com",
  projectId: "mern-blogsite-68baf",
  storageBucket: "mern-blogsite-68baf.appspot.com",
  messagingSenderId: "68160025887",
  appId: "1:68160025887:web:10bbee3f7d1a548b57ec2a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


//google authentication

const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {
    let user = null;

    await signInWithPopup(auth, provider)
    .then((result) => {
        user = result.user
    })
    .catch((err) => {
        console.log("Error in GoogleAuth: ", err);
    })

    return user;
}