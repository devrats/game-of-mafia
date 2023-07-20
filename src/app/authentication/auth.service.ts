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
import { NgxSpinnerService } from 'ngx-spinner';

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
    databaseURL: 'https://mafia-ce294-default-rtdb.firebaseio.com',
  };
  principle: Subject<any> = new Subject<any>();
  config = {
    headers: {
      'Content-Type': 'application/JSON',
    },
  };

  constructor(private spinner : NgxSpinnerService){}

  app = initializeApp(this.firebaseConfig);
  analytics = getAnalytics(this.app);
  provider = new GoogleAuthProvider();
  auth = getAuth();
  async signInWithGoogle() {
    this.spinner.show()
    await signInWithPopup(this.auth, this.provider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user = result.user;
        let y = await this.getRequest(user, 'login');
        this.principle.next(y);
        this.spinner.hide()
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
        this.spinner.hide()
        // ...
      });
      this.spinner.hide()
  }

  async getRequest(data: any, url: string) {
    this.spinner.show()
    try {
      let res = await axios.post(
        'https://mafia-backend.onrender.com/' + url,
        data,
        this.config
      );
      if (res.status == 200) {
        sessionStorage.setItem('token', res.data.jwt);
        sessionStorage.setItem('uId', res.data.uid);
        sessionStorage.setItem('email', res.data.email);
        sessionStorage.setItem('displayName', res.data.displayName);
        sessionStorage.setItem('pic', res.data.photo);
        this.spinner.hide()
        return { data: res.data, code: 200 };
      }
      if (res.status == 201) {
        this.spinner.hide()
        return { data: res.data, code: 201 };
      }
    } catch (error: any) {
      console.log(error);
      this.spinner.hide()
      return error;
    }
    this.spinner.hide()
  }

  async signOut() {
    this.spinner.show()
    signOut(this.auth)
      .then(() => {
        sessionStorage.clear();
        this.spinner.hide()
      })
      .catch((error) => {
        // An error happened.
        this.spinner.hide()
      });
      this.spinner.hide()
  }
}
