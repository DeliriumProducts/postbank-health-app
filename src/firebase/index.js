import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firebase-firestore';

const config = {
  apiKey: 'AIzaSyDN6bsFGrxaqwhRdvAWwvIPgskw0B_yu9k',
  authDomain: 'postbank-health-tracking.firebaseapp.com',
  databaseURL: 'https://postbank-health-tracking.firebaseio.com',
  projectId: 'postbank-health-tracking',
  storageBucket: 'postbank-health-tracking.appspot.com',
  messagingSenderId: '1029893651136',
  appId: '1:1029893651136:web:363e9552a3aed3a1'
};

class Firebase {
  constructor() {
    // https://github.com/zeit/next.js/issues/1999
    if (!app.apps.length) {
      app.initializeApp(config);
      this.auth = app.auth();
      this.db = app.firestore();
      this.providers = {
        google: new app.auth.GoogleAuthProvider()
      };
    }
  }

  async register(name, email, password) {
    return this.auth.currentUser.updateProfile({
      displayName: name
    });
  }

  login(email, password) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  loginWithPopup(provider) {
    if (this.providers[provider]) {
      return this.auth.signInWithPopup(this.providers[provider]);
    }
  }

  logout() {
    return this.auth.signOut();
  }

  isInitialized() {
    return new Promise(resolve => {
      this.auth.onAuthStateChanged(resolve);
    });
  }

  getCurrentUsername() {
    return this.auth.currentUser && this.auth.currentUser.displayName;
  }
}

export default new Firebase();
