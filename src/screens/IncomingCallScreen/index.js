import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, ImageBackground, View, Pressable} from 'react-native';
import bg from '../../../assets/images/Incomingcallbg.png';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useRoute, useNavigation} from '@react-navigation/native';

import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import {Voximplant} from 'react-native-voximplant';

const IncomingCallScreen = () => {
  const [caller, setCaller] = useState('');
  const route = useRoute();
  const navigation = useNavigation();
  const {call} = route.params;
  console.log(call);
  useEffect(() => {
    setCaller(call.getEndpoints()[0].displayName);
    call.on(Voximplant.CallEvents.Disconnected, callEvent => {
      navigation.navigate('Contacts');
    });
    return () => {
      call.off(Voximplant.CallEvents.Disconnected);
    };
  }, []);
  const onDecline = () => {
    call.decline();
  };
  const onAccept = () => {
    navigation.navigate('Calling', {call, isIncomingCall: true});
  };
  return (
    <ImageBackground source={bg} style={styles.bg} resizeMode="cover">
      <Text style={styles.name}>{caller}</Text>
      <Text style={styles.phoneNumber}>Medic Video...</Text>
      <View style={[styles.row, {marginTop: 'auto'}]}>
        <View style={styles.iconContainer}>
          <Ionicons name="alarm" color={'#fff'} size={30} />
          <Text style={styles.iconText}>Remind me</Text>
        </View>
        <View style={styles.iconContainer}>
          <Entypo name="message" color={'#fff'} size={30} />
          <Text style={styles.iconText}>Message</Text>
        </View>
      </View>
      <View style={styles.row}>
        {/* decline button */}
        <Pressable onPress={onDecline} style={styles.iconContainer}>
          <View style={styles.iconButtonContainer}>
            <Feather name="x" color={'#fff'} size={40} />
          </View>
          <Text style={styles.iconText}>Decline</Text>
        </Pressable>
        {/* accept button */}
        <Pressable onPress={onAccept} style={styles.iconContainer}>
          <View
            style={[styles.iconButtonContainer, {backgroundColor: '#2e7bff'}]}>
            <Feather name="check" color={'#fff'} size={40} />
          </View>
          <Text style={styles.iconText}>Accept</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
};

export default IncomingCallScreen;

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    paddingBottom: 50,
  },
  name: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 100,
    marginBottom: 15,
  },
  phoneNumber: {
    fontSize: 20,
    color: '#fff',
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  iconContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  iconText: {
    color: '#fff',
  },
  iconButtonContainer: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 50,
    margin: 10,
  },
});
