import React, {useState} from 'react';
import {StyleSheet, Text, View, Pressable} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
const CallActionBox = ({onHangupPress}) => {
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const onReverseCamera = () => {
    console.warn('hello');
  };
  const onToggleCamera = () => {
    setIsCameraOn(!isCameraOn);
  };
  const onToggleMicrophone = () => {
    setIsMicOn(!isMicOn);
  };

  return (
    <View style={styles.buttonsContainer}>
      <Pressable onPress={onReverseCamera} style={styles.iconButton}>
        <Ionicons name="ios-camera-reverse" size={30} color={'#fff'} />
      </Pressable>
      <Pressable onPress={onToggleCamera} style={styles.iconButton}>
        <MaterialIcon
          name={isCameraOn ? 'camera-off' : 'camera'}
          size={30}
          color={'#fff'}
        />
      </Pressable>
      <Pressable onPress={onToggleMicrophone} style={styles.iconButton}>
        <MaterialIcon
          name={isMicOn ? 'microphone-off' : 'microphone'}
          size={30}
          color={'#fff'}
        />
      </Pressable>
      <Pressable
        onPress={onHangupPress}
        style={[styles.iconButton, {backgroundColor: 'red'}]}>
        <MaterialIcon name="phone-hangup" size={30} color={'#fff'} />
      </Pressable>
    </View>
  );
};

export default CallActionBox;

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
    backgroundColor: '#333333',
    padding: 10,
    paddingBottom: 40,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginTop: 'auto',
  },
  iconButton: {
    backgroundColor: '#4a4a4a',
    padding: 10,
    borderRadius: 50,
  },
});
