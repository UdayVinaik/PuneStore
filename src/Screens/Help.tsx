import React, {useCallback, useState} from 'react';
import {Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import CustomImageBackground from '../Components/CustomImageBackground/CustomImageBackground';
import Header from '../Components/Header/Header';
import {Colors} from '../Theme/Colors';
import CustomTextInput from '../Components/TextInput/TextInput';

const Help = () => {
  const [appMsg, setAppMsg] = useState('');
  const [storeOwnerMsg, setStoreOwnerMsg] = useState('');

  const sendAppMsg = useCallback(async () => {
    try {
      let phoneNumber = '+919690014680';
      let url = `whatsapp://send?text=${appMsg}&phone=${phoneNumber}`;
      const canOpen = Linking.canOpenURL(url);
      if (!canOpen) {
        throw new Error('Provided URL can not be handled');
      }
      Linking.openURL(url);
    } catch (error) {
      console.log('Error ====', error);
    }
  }, [appMsg]);

  const sendStoreOwnerMsg = useCallback(async () => {
    try {
      let phoneNumber = '+919049041649';
      let url = `whatsapp://send?text=${storeOwnerMsg}&phone=${phoneNumber}`;
      const canOpen = Linking.canOpenURL(url);
      if (!canOpen) {
        throw new Error('Provided URL can not be handled');
      }
      Linking.openURL(url);
    } catch (error) {
      console.log('Error ====', error);
    }
  }, [storeOwnerMsg]);

  return (
    <CustomImageBackground>
      <Header title={'Help'} leftIcon="true" />
      <View style={styles.container}>
        <Text style={styles.text}>
          {
            'If you have any app related issues then please type your message here and you will get response on WhatsApp.'
          }
        </Text>
        <CustomTextInput
          value={appMsg}
          onChangeText={val => setAppMsg(val)}
          placeholder={'Type your message here:'}
          multiline={true}
          numberOfLines={4}
          containerStyle={styles.input}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={sendAppMsg}>
        <Text style={styles.buttonText}>{'Send'}</Text>
      </TouchableOpacity>
      <View style={styles.container}>
        <Text style={styles.text}>
          {
            'If you have any store or product related issue please type your message here'
          }
        </Text>
        <CustomTextInput
          value={storeOwnerMsg}
          onChangeText={val => setStoreOwnerMsg(val)}
          placeholder={'Type your message here:'}
          multiline={true}
          numberOfLines={4}
          containerStyle={styles.input}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={sendStoreOwnerMsg}>
        <Text style={styles.buttonText}>{'Send Msg to Store Owner'}</Text>
      </TouchableOpacity>
    </CustomImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginVertical: 20,
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flex: 0.4,
  },
  text: {
    fontSize: 20,
    color: Colors.whiteText,
    fontWeight: '500',
  },
  input: {
    minHeight: 100,
    backgroundColor: Colors.whiteText,
    margin: 0,
    padding: 0,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 5,
  },
  buttonText: {
    color: Colors.whiteText,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Help;
