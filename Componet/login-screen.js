
import { Text, View, Button, StatusBar, StyleSheet } from "react-native";
import { APP_NAME, PRIMARY_COLOR } from '../env.json'

const styles = StyleSheet.create({
    title: {
      color: PRIMARY_COLOR,
      fontSize: 30,
      fontWeight: "bold",
      textAlign: 'center',
      marginTop: 25,
      marginBottom: 25
    }
  });

export const LoginScreen = ({ navigation }) => {
    return (
      <View style={{ flex: 1 }}>
        <Text h1 style={styles.title}>
            {APP_NAME} Login!
        </Text>
        <Button title="Login" onPress={() => navigation.navigate('HomeScreen')}>Login</Button>
        <StatusBar style="auto" />
      </View>
    );
  };