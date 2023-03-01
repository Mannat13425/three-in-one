import { StyleSheet, View, Button, Text } from 'react-native';
import React, { useState, useEffect } from "react";
import { Header } from "./components/header";
import { Routes } from "./components/routes";
import auth from "@react-native-firebase/auth"
import { AccessToken, LoginManager, ShareDialog } from 'react-native-fbsdk-next';

const onFacebookButtonPress = async () => {
  // Attempt login with permissions
  const result = await LoginManager.logInWithPermissions(['public_profile', 'email', 'instagram_content_publish', 'pages_show_list', 'pages_manage_posts']);

  if (result.isCancelled) {
    throw 'User cancelled the login process';
  }

  // Once signed in, get the users AccesToken
  const data = await AccessToken.getCurrentAccessToken();

  if (!data) {
    throw 'Something went wrong obtaining access token';
  }

  // Create a Firebase credential with the AccessToken
  const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

  // Sign-in the user with the credential
  return auth().signInWithCredential(facebookCredential);
}

const onLogoutButtonPress = async () => {
  await LoginManager.logOut()
  return auth().signOut()
}

// const onFacebookButtonPress = async () => {
//   console.log('Click!')
// }

// Build up a shareable link.
// const linkExample = {
//   contentType: 'link',
//   contentUrl: "https://facebook.com",
// };

const photoExample = {
  contentType: 'photo',
  photos: [
    { imageUrl: "https://media.giphy.com/media/xT5LMzIK1AdZJ4cYW4/giphy.gif" }
  ]
};

const App = () => {

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [shareLinkContent, setShareLinkContent] = useState(photoExample);

// ...

// Share the link using the share dialog.
  const onShareButtonPress = async () => {
    ShareDialog.canShow(shareLinkContent).then((canShow) => {
        console.log("can show", canShow)
        if (canShow) {
          return ShareDialog.show(shareLinkContent);
        }
      }
    ).then((result) => {
        console.log('result', result)
        if (result.isCancelled) {
          console.log('Share cancelled');
        } else {
          console.log('Share success with postId: '
            + result.postId);
        }
      },
      (error) => {
        console.log('Share fail with error: ' + error);
      }
    );
  }

  // Handle user state changes
  const onAuthStateChanged = (user) => {
    console.log('user', user)
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const renderLoginButton = () => {
    return (
        <>
          <Header />
          <Button title="Facebook Sign-In" onPress={() => onFacebookButtonPress().then(() => console.log('Signed in with Facebook!'))} />
        </>
    );
  }

  /*
            <Button
            title="Share"
            onPress={() => onShareButtonPress().then(() => console.log('Opend facebook share dialog!'))}
          />
          */

  const renderContent = () => {
    return (
        <>
        <Header />
        <Routes style={styles.routes} />
        <Button title="Logout" onPress={() => onLogoutButtonPress().then(() => console.log('Logged out!'))} />
        </>
    );
  }

  return (
     <View style={styles.home}>{user ? renderContent() : renderLoginButton()}</View>
  )


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