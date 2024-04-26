// LoginScreen.js
import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Header from '../Components/Header/Header';
import {Colors} from '../Theme/Colors';
import CustomTextInput from '../Components/TextInput/TextInput';
import {
  ParamListBase,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {ScreenNames} from '../Constants/ScreenName';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  getDataFromAsyncStorage,
  storeDataInAsyncStorage,
  validateName,
  validateUid,
} from '../Helpers/Utility/UtilityManager';
import {AsyncStorageConstants} from '../Constants/AsyncStorageConstants';
import {RootStackParamListType} from '../Constants/Types';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const {navigate, setParams} =
    useNavigation<NativeStackNavigationProp<ParamListBase, string>>();

  const route = useRoute<RouteProp<RootStackParamListType, 'LoginScreen'>>();

  useEffect(() => {
    setUsername('');
    setPassword('');
    setParams({isFromLogout: false});
  }, [route?.params?.isFromLogout]);

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await getDataFromAsyncStorage(
          AsyncStorageConstants.LoggedInType,
        );
        if (value === 'user') {
          navigate(ScreenNames.HomeScreen);
        } else if (value === 'owner') {
          navigate(ScreenNames.StoreDashboard);
        }
      } catch (err) {
        console.log('Error: ', err);
      }
    };
    getData();
  }, [navigate]);

  const handleUserLogin = async () => {
    if (validateName(username) && validateUid(password)) {
      setError(false);
      await storeDataInAsyncStorage(
        AsyncStorageConstants.UID,
        password.toUpperCase(),
      );
      await storeDataInAsyncStorage(AsyncStorageConstants.Name, username);
      await storeDataInAsyncStorage(AsyncStorageConstants.LoggedInType, 'user');
      navigate(ScreenNames.HomeScreen);
    } else {
      setError(true);
    }
  };

  const handleOwnerLogin = async () => {
    if (
      username.toLowerCase() === 'punestore' &&
      password.toLowerCase() === 'radhasoami'
    ) {
      await storeDataInAsyncStorage(
        AsyncStorageConstants.LoggedInType,
        'owner',
      );
      navigate(ScreenNames.StoreDashboard);
    }
  };

  return (
    <View style={{flex: 1}}>
      <Header title={'Sign In'} />
      <View style={styles.container}>
        <View style={styles.puneSatsangStoreText}>
          <Text style={styles.storeText}>{'Pune Satsang Store'}</Text>
        </View>
        <CustomTextInput
          value={username}
          onChangeText={val => setUsername(val)}
          placeholder={'Name: '}
        />
        <CustomTextInput
          value={password}
          onChangeText={val => setPassword(val)}
          placeholder={'UID: '}
        />
        {error && (
          <View style={styles.errorBlock}>
            <Text style={styles.errorText}>
              {'* Either username or password is incorrect'}
            </Text>
          </View>
        )}
        <TouchableOpacity style={styles.button} onPress={handleUserLogin}>
          <Text style={styles.buttonText}>{'Login as User'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleOwnerLogin}>
          <Text style={styles.buttonText}>{'Login as Owner'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.whiteText,
    fontSize: 18,
    fontWeight: 'bold',
  },
  puneSatsangStoreText: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: Colors.background,
    paddingTop: 50,
  },
  storeText: {
    fontSize: 36,
    color: Colors.primary,
  },
  errorText: {
    color: Colors.red,
    fontSize: 18,
  },
  errorBlock: {
    paddingVertical: 20,
  },
});

export default LoginScreen;
