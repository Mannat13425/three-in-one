import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  FacebookAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { StyleSheet, View } from 'react-native';
import React from "react";
import { Header } from "./Componet/header";
import { Routes } from "./Componet/routes";
import reactDom from 'react-dom';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDN_qHhxPaOGG95tpNSivcpUr5HQpHZytE",
  authDomain: "three-in-one-ae036.firebaseapp.com",
  projectId: "three-in-one-ae036",
  storageBucket: "three-in-one-ae036.appspot.com",
  messagingSenderId: "887016390278",
  appId: "1:887016390278:web:3a125ae6139cf3b5d89b07"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);



const auth = getAuth(firebaseApp);

// Listen for authentication state to change.
onAuthStateChanged(auth, user => {
  if (user != null) {
    console.log('We are authenticated now!');
  }

  // Do other things
});



GoogleSignin.configure({
  webClientId: '887016390278-aob7n4s679eflts2eidop100o1id6il2.apps.googleusercontent.com',
});



async function onGoogleButtonPress() {
  // Get the users ID token
  const { idToken } = await GoogleSignin.signIn();

  // Create a Google credential with the token
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);

  // Sign-in the user with the credential
  return auth().signInWithCredential(googleCredential);
}

import { Button } from 'react-native';

function GoogleSignInButton() {
  return (
    <Button
      title="Google Sign-In"
      onPress={() => onGoogleButtonPress().then(() => console.log('Signed in with Google!'))}
    />
  );
}

const App = () => {
  return (
    <View style={styles.home}>
      <Header />
      {GoogleSignInButton()}
      <Routes style={styles.routes} />
    </View>
  );
};

const styles = StyleSheet.create({
  home: {
    marginTop: 30,
    flex: 1,
    paddingTop: 80
  },
  routes: {
    flex: 1
  }
});

export default App;