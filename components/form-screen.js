import { useState } from "react";
import { Text, View, Button, StatusBar, StyleSheet, TextInput } from "react-native";
import { APP_NAME, PRIMARY_COLOR, QUATERNARY_COLOR } from '../env.json'

const styles = StyleSheet.create({
    title: {
      color: PRIMARY_COLOR,
      fontSize: 30,
      fontWeight: "bold",
      textAlign: 'center',
      marginTop: 25,
      marginBottom: 25
    },
    label: {
      marginTop: 15,
      marginLeft: 15,
      marginRight: 15,
    },
    input: {
      backgroundColor: QUATERNARY_COLOR,
      marginTop: 5,
      marginBottom: 25,
      marginLeft: 15,
      marginRight: 15,
      borderColor: PRIMARY_COLOR,
      borderWidth: 1,
      padding: 5
    },
    spacer: {
      marginBottom: 25 
    },
    homeButton: {

    }
   
  });

export const FormScreen = ({ navigation }) => {
  const [imageUrl, setImageUrl] = useState('')
  const onChangeText = (text) => {
    setImageUrl(text || '')
  }
    return (
      <View style={{ flex: 1 }}>
        <Text h1 style={styles.title}>
            Post an image to facebook.
        </Text>
        <Text style={styles.label}>Image URL</Text>
        <TextInput style={styles.input} onChangeText={onChangeText} value={imageUrl}/>
        <Text style={styles.spacer}>&nbsp;</Text>
        <Button style={styles.homeButton} title="Home" onPress={() => navigation.navigate('HomeScreen')}>Home</Button>
        <StatusBar style="auto" />
      </View>
    );
  };
