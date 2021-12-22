import React, {useState, useEffect} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import dummyContacts from '../../../assets/data/contacts.json';

import {Voximplant} from 'react-native-voximplant';
const ContactScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loggedUser, setloggedUser] = useState('');
  const [filteredContact, setFilteredContact] = useState(dummyContacts);
  const voximplant = Voximplant.getInstance();
  const navigation = useNavigation();
  useEffect(() => {
    voximplant.on(Voximplant.ClientEvents.IncomingCall, incomingCallEvents => {
      navigation.navigate('IncomingCall', {call: incomingCallEvents.call});
    });
    return () => {
      voximplant.off(Voximplant.ClientEvents.IncomingCall);
    };
  }, []);

  useEffect(() => {
    const newContacts = dummyContacts.filter(contact =>
      contact.user_display_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    );
    setFilteredContact(newContacts);
  }, [searchTerm]);
  const callUser = user => {
    navigation.navigate('Calling', {user});
  };
  // useEffect(() => {
  //   const getData = async () => {
  //     try {
  //       const value = await AsyncStorage.getItem('@username');
  //       if (value !== null) {
  //         // value previously stored
  //         setloggedUser(value);
  //       }
  //     } catch (e) {
  //       // error reading value
  //       console.log(e);
  //     }
  //   };

  //   getData();

  //   const newContacts = dummyContacts.filter(
  //     contact => contact.user_name != loggedUser,
  //   );
  //   setFilteredContact(newContacts);
  // }, []);
  return (
    <View style={styles.page}>
      <TextInput
        placeholder="Search"
        value={searchTerm}
        style={styles.searchInput}
        onChangeText={value => {
          setSearchTerm(value);
        }}
      />
      <FlatList
        data={filteredContact}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({item}) => (
          <Pressable
            onPress={() => {
              callUser(item);
            }}>
            <Text style={styles.contactName}>{item.user_display_name}</Text>
          </Pressable>
        )}
      />
    </View>
  );
};

export default ContactScreen;

const styles = StyleSheet.create({
  page: {
    padding: 10,
    flex: 1,
    backgroundColor: '#fff',
  },
  contactName: {
    fontSize: 16,
    fontWeight: '400',
    marginVertical: 13,
  },
  separator: {
    height: 1,
    backgroundColor: 'lightgray',
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
  },
});
