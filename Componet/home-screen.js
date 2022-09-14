import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { APP_NAME, APP_VERSION, ENVIRONMENT, PRIMARY_COLOR } from "../env.json";

const styles = StyleSheet.create({
    title: {
      color: PRIMARY_COLOR,
      fontSize: 30,
      fontWeight: "bold",
      textAlign: 'center',
      marginTop: 25,
      marginBottom: 25
    },
    logo: {
      width: 150,
      height: 150,
      tintColor: PRIMARY_COLOR,
    },
    version: {
      color: PRIMARY_COLOR,
      fontSize: 16,
    },
    environment: {
      color: PRIMARY_COLOR,
      fontSize: 12,
    },
  });

export const HomeScreen = ({ navigation }) => {
  return (
    <View style={{ display: 'flex' }}>
      <Text h1 style={styles.title}>
        {APP_NAME} Home!
      </Text>
      <Button title="Start Post" onPress={() => navigation.navigate('FormScreen')}>Start Post</Button>
      <StatusBar style="auto" />
    </View>
  );
};