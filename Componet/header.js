import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { APP_NAME, PRIMARY_COLOR, QUATERNARY_COLOR } from "../env.json";

var width = Dimensions.get("window").width;

export const Header = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.text}>{APP_NAME}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 48,
    padding: 8,
    paddingRight: 12,
    paddingLeft: 12,
    backgroundColor: PRIMARY_COLOR,
    position: "absolute",
    top: 24,
    width: width,
    alignSelf: "stretch",
    textAlign: "center",
  },
  text: {
    color: QUATERNARY_COLOR,
    fontSize: 23,
    fontWeight: "bold",
    textAlign: "center",
  },
});