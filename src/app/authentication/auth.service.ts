import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  firebaseConfig = {
    apiKey: "AIzaSyBQkX9es68aUtthLmtTzK6T9TFToXu_GtE",
    authDomain: "mafia-ce294.firebaseapp.com",
    projectId: "mafia-ce294",
    storageBucket: "mafia-ce294.appspot.com",
    messagingSenderId: "159102484359",
    appId: "1:159102484359:web:38d8322bdbc77315441d22",
    measurementId: "G-X283NRB22E"
  };

  app = initializeApp(this.firebaseConfig);
  analytics = getAnalytics(this.app);
  provider = new GoogleAuthProvider();
  constructor() {}
  auth = getAuth();
  signInWithGoogle(){
    signInWithPopup(this.auth, this.provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      // The signed-in user info.
      const user = result.user;
      console.log(token);
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
  }
}
