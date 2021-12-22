import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import {Voximplant} from 'react-native-voximplant';
import {APP_NAME, ACC_NAME} from '../Constants';

const LoginScreen = () => {
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigation = useNavigation();
  const voximplant = Voximplant.getInstance();

  useEffect(() => {
    const connect = async () => {
      const status = await voximplant.getClientState();
      if (status === Voximplant.ClientState.DISCONNECTED) {
        //check the connection

        await voximplant.connect();
      } else if (status === Voximplant.ClientState.LOGGED_IN) {
        redirectHome(); //if already logged in
      }
    };
    connect();
  }, []);
  const signIn = async () => {
    try {
      const fqUsername = `${username}@${APP_NAME}.${ACC_NAME}.voximplant.com`; //login via implant with vailed user
      const user = await voximplant.login(fqUsername, password);
      redirectHome(); //go to contact page
    } catch (e) {
      Alert.alert(e.name, `Error code:${e.code}`);
    }
  };
  const redirectHome = () => {
    navigation.reset({
      //reset function is to delete all the history you can not go back
      index: 0,
      routes: [
        {
          name: 'Contacts',
        },
      ],
    });
  };
  return (
    <View style={styles.page}>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="username"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="password"
        secureTextEntry
        style={styles.input}
      />
      <Pressable style={styles.button} onPress={signIn}>
        <Text>Sign in</Text>
      </Pressable>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  page: {padding: 10, alignItems: 'stretch', flex: 1, justifyContent: 'center'},
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: 'dodgerblue',
    marginVertical: 10,
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
});
