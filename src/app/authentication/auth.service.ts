import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { async, Subject } from 'rxjs';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseConfig = {
    apiKey: 'AIzaSyBQkX9es68aUtthLmtTzK6T9TFToXu_GtE',
    authDomain: 'mafia-ce294.firebaseapp.com',
    projectId: 'mafia-ce294',
    storageBucket: 'mafia-ce294.appspot.com',
    messagingSenderId: '159102484359',
    appId: '1:159102484359:web:38d8322bdbc77315441d22',
    measurementId: 'G-X283NRB22E',
  };
  principle: Subject<any> = new Subject<any>();
  config = {
    headers: {
      'Content-Type': 'application/JSON',
    },
  };

  app = initializeApp(this.firebaseConfig);
  analytics = getAnalytics(this.app);
  provider = new GoogleAuthProvider();
  constructor() {}
  auth = getAuth();
  async signInWithGoogle() {
    signInWithPopup(this.auth, this.provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;
        this.principle.next(user);
        // return res;
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        this.principle.next(errorMessage);
        // ...
      });
  }

  async getRequest(data: any, url: string) {
    try {
      let res = await axios.post(
        'http://localhost:3000/' + url,
        data,
        this.config
      );
      if (res.status == 200) {
        sessionStorage.setItem('token', res.data.jwt);
        return { data: res.data, code: 200 };
      }
      if (res.status == 201) {
        console.log(res.data);
        return { data: res.data, code: 201 };
      }
    } catch (error: any) {
      console.log(error);
      return error;
    }
  }

  async signOut() {
    signOut(this.auth)
      .then(() => {
        sessionStorage.clear();
        console.log('sign out');
      })
      .catch((error) => {
        // An error happened.
      });
  }
}
