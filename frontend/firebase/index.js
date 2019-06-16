import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firebase-firestore';
import 'firebase/functions';

const config = {
  apiKey: 'AIzaSyDN6bsFGrxaqwhRdvAWwvIPgskw0B_yu9k',
  authDomain: 'postbank-health-tracking.firebaseapp.com',
  databaseURL: 'https://postbank-health-tracking.firebaseio.com',
  projectId: 'postbank-health-tracking',
  storageBucket: 'postbank-health-tracking.appspot.com',
  messagingSenderId: '1029893651136',
  appId: '1:1029893651136:web:363e9552a3aed3a1',
  clientId:
    '1029893651136-4qiqu2fs5akdq7c1n5ok1eihujc70jfs.apps.googleusercontent.com'
};

class Firebase {
  constructor() {
    // https://github.com/zeit/next.js/issues/1999
    if (!app.apps.length) {
      app.initializeApp(config);
      this.auth = app.auth();
      this.db = app.firestore();
      this.functions = app.functions();

      this.initClient();

      const googleProvider = new app.auth.GoogleAuthProvider();
      googleProvider.addScope(
        'https://www.googleapis.com/auth/fitness.activity.read'
      );

      this.providers = {
        google: googleProvider
      };
    }
  }

  initClient() {
    gapi.load('client', () => {
      gapi.client.init({
        apiKey: config.apiKey,
        clientId: config.clientId,
        discoveryDocs: [
          'https://www.googleapis.com/discovery/v1/apis/fitness/v1/rest'
        ],
        scope: 'https://www.googleapis.com/auth/fitness.activity.read'
      });

      gapi.client.load('fitness', 'v1', () => {
        console.log('fitness rdy');
      });
    });
  }

  async register(name, email, password) {
    return this.auth.currentUser.updateProfile({
      displayName: name
    });
  }

  async login() {
    const googleAuth = gapi.auth2.getAuthInstance();
    const googleUser = await googleAuth.signIn();

    const token = googleUser.getAuthResponse().id_token;

    const credential = this.auth.GoogleAuthProvider.credential(token);

    return this.auth.signInAndRetrieveDataWithCredential(credential);
  }

  loginWithPopup(provider) {
    if (this.providers[provider]) {
      return this.auth.signInWithPopup(this.providers[provider]);
    }
  }

  logout() {
    return this.auth.signOut();
  }

  onAuthStateChanged(cb) {
    return this.auth.onAuthStateChanged(cb);
  }

  getCurrentUser() {
    if (this.auth) {
      return this.auth.currentUser;
    }
  }
}

export default new Firebase();
