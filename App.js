import { StyleSheet, View } from 'react-native';
import React from "react";
import { Header } from "./Componet/header";
import { Routes } from "./Componet/routes";
import reactDom from 'react-dom';

const App = () => {
  return (
    <View style={styles.home}>
      <Header />
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