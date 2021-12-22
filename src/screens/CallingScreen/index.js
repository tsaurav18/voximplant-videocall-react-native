import React, {useEffect, useState, useRef} from 'react';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CallActionBox from '../../components/CallActionBox';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation, useRoute} from '@react-navigation/native';

import {Voximplant} from 'react-native-voximplant';
const CallingScreen = () => {
  const [localVideoStreamId, setLocalVideoStreamId] = useState('');
  const [remoteVideoStreamId, setRemoteVideoStreamId] = useState('');
  const [callStatus, setCallStatus] = useState('Calling...');
  const navigation = useNavigation();
  const route = useRoute();
  const {user, call: incomingCall, isIncomingCall} = route?.params;
  const voximplant = Voximplant.getInstance();
  const [permissionGranted, setPermissionGranted] = useState(false);
  const call = useRef(incomingCall);
  const endpoint = useRef(null);
  const goBack = () => {
    navigation.pop();
  };
  const permissions = [
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    PermissionsAndroid.PERMISSIONS.CAMERA,
  ];
  const requestPermissions = async () => {
    const granted = await PermissionsAndroid.requestMultiple(permissions);
    const recordAudioGranted =
      granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === 'granted';
    const cameraGranted =
      granted[PermissionsAndroid.PERMISSIONS.CAMERA] === 'granted';
    if (!cameraGranted || !recordAudioGranted) {
      Alert.alert('Permissions not granted');
    } else {
      setPermissionGranted(true);
    }
  };
  useEffect(() => {
    if (Platform.OS === 'android') {
      requestPermissions();
    } else {
      setPermissionGranted(true);
    }
  }, []);

  useEffect(() => {
    const callSettings = {
      video: {
        sendVideo: true,
        receiveVideo: true,
      },
    };
    if (!permissionGranted) return;
    const makeCall = async () => {
      call.current = await voximplant.call(user.user_name, callSettings);
      subscribeToCallEvents();
    };

    const answerCall = async () => {
      subscribeToCallEvents();
      endpoint.current = call.current.getEndpoints()[0];
      subscribeToEndpointEvent();
      call.current.answer(callSettings);
    };
    const subscribeToCallEvents = () => {
      call.current.on(Voximplant.CallEvents.Failed, callEvent => {
        showError(callEvent.reason);
      });
      call.current.on(Voximplant.CallEvents.ProgressToneStart, callEvent => {
        setCallStatus('Ringing...');
      });
      call.current.on(Voximplant.CallEvents.Connected, callEvent => {
        setCallStatus('Call Connected...');
      });
      call.current.on(Voximplant.CallEvents.Disconnected, callEvent => {
        navigation.navigate('Contacts');
      });

      call.current.on(
        Voximplant.CallEvents.LocalVideoStreamAdded,
        callEvent => {
          setLocalVideoStreamId(callEvent.videoStream.id);
        },
      );
      call.current.on(Voximplant.CallEvents.EndpointAdded, callEvent => {
        endpoint.current = callEvent.endpoint;
        subscribeToEndpointEvent();
      });
    };
    const subscribeToEndpointEvent = async () => {
      endpoint.current.on(
        Voximplant.EndpointEvents.RemoteVideoStreamAdded,
        endpointEvent => {
          setRemoteVideoStreamId(endpointEvent.videoStream.id);
        },
      );
    };
    const showError = reason => {
      Alert.alert('call failed', `Reason:${reason}`, [
        {text: 'OK', onPress: navigation.navigate('Contacts')},
      ]);
    };
    if (isIncomingCall) {
      answerCall();
    } else {
      makeCall();
    }
    console.log(localVideoStreamId);
    return () => {
      call.current.off(Voximplant.CallEvents.Failed);
      call.current.off(Voximplant.CallEvents.ProgressToneStart);
      call.current.off(Voximplant.CallEvents.Connected);
      call.current.off(Voximplant.CallEvents.Disconnected);
      call.current.off(Voximplant.CallEvents.LocalVideoStreamAdded);
      call.current.off(Voximplant.CallEvents.RemoteVideoStreamAdded);
      call.current.off(Voximplant.CallEvents.EndpointAdded);
    };
  }, [permissionGranted]);
  const onHangupPress = () => {
    call.current.hangup();
  };
  return (
    <View style={styles.page}>
      <Pressable onPress={goBack} style={styles.backButton}>
        <Ionicons name="chevron-back" size={30} color="white" />
      </Pressable>

      <Voximplant.VideoView
        videoStreamId={remoteVideoStreamId}
        style={styles.remoteVideo}
      />
      <Voximplant.VideoView
        videoStreamId={localVideoStreamId}
        style={styles.localVideo}
      />

      <View style={styles.cameraPreview}>
        <Text style={styles.name}>{user?.user_display_name}</Text>
        <Text style={styles.phoneNumber}>{callStatus}</Text>
      </View>
      {/* bottom button box */}
      <CallActionBox onHangupPress={onHangupPress} />
    </View>
  );
};

export default CallingScreen;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#7b4e80',
  },

  cameraPreview: {
    backgroundColor: '#7b4e80',
    alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: 10,
  },

  localVideo: {
    width: 100,
    height: 150,
    backgroundColor: '#ffff6e',
    borderRadius: 10,
    position: 'absolute',
    right: 10,
    top: 100,
    zIndex: 999,
  },
  remoteVideo: {
    width: '100%',
    height: '100%',
    backgroundColor: '#7b4e80',
    borderRadius: 10,
    position: 'absolute',
    left: 0,
    right: 0,
    // bottom: 100,
  },
  name: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 50,
    marginBottom: 15,
  },
  phoneNumber: {
    fontSize: 20,
    color: '#fff',
  },
  backButton: {
    position: 'absolute',
    top: 70,
    left: 20,
    zIndex: 1000,
  },
});
