import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import CallActionBox from '../../components/CallActionBox';

const CallScreen = () => {
  return (
    <View style={styles.page}>
      <View style={styles.cameraPreview}>{/* <View></View> */}</View>
      <CallActionBox />
    </View>
  );
};

export default CallScreen;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#7b4e80',
  },
  cameraPreview: {
    width: 120,
    height: 170,
    backgroundColor: 'yellow',
    position: 'absolute',
    right: 15,
    top: 100,
    borderRadius: 10,

    // alignItems: 'center',
    // paddingTop: 10,
    // paddingHorizontal: 10,
  },
});
