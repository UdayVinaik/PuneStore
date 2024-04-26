// HomeScreen.js
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import {Colors} from '../Theme/Colors';
import Header from '../Components/Header/Header';
import {useDispatch, useSelector} from 'react-redux';
import {
  GET_LIST_OF_PRODUCTS,
  GET_ORDER_BY_ID,
  GET_ORDER_LIST,
} from '../Constants/ActionTypes';
import {
  ParamListBase,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {ScreenNames} from '../Constants/ScreenName';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Loader from '../Components/Loader/Loader';
import {selectOrders} from '../Storage/Slices/OrderSlice';
import {RootStackParamListType} from '../Constants/Types';
import {
  getDataFromAsyncStorage,
  isNonEmpty,
  storeDataInAsyncStorage,
} from '../Helpers/Utility/UtilityManager';
import {AsyncStorageConstants} from '../Constants/AsyncStorageConstants';

function HomeScreen() {
  const dispatch = useDispatch();
  const {navigate} =
    useNavigation<NativeStackNavigationProp<ParamListBase, string>>();
  const route = useRoute<RouteProp<RootStackParamListType, 'HomeScreen'>>();
  const products = useSelector((state: any) => state.product.listProduct);
  const orders = useSelector(selectOrders);
  const [uid, setUid] = useState('');

  console.log('products  ====', products);
  console.log('orders ====', orders);

  useEffect(() => {
    const getUid = async () => {
      const uid = await getDataFromAsyncStorage(AsyncStorageConstants.UID);
      setUid(uid);
    };

    getUid();
  }, [setUid]);

  console.log('uid ====', uid);

  useEffect(() => {
    if (!isNonEmpty(products)) {
      dispatch({type: GET_LIST_OF_PRODUCTS});
    }
    if (!isNonEmpty(orders)) {
      dispatch({type: GET_ORDER_BY_ID, payload: {id: uid.toUpperCase()}});
    }
  }, [products, dispatch, route.params?.isFromUserDetails]);

  const navigateToListProducts = useCallback(() => {
    navigate(ScreenNames.ProductList);
  }, [navigate]);

  const navigateToOrdersPage = useCallback(() => {
    navigate(ScreenNames.Orders);
  }, [navigate]);

  const navigateToCart = useCallback(() => {
    navigate(ScreenNames.Cart);
  }, [navigate]);

  const onPressLogout = useCallback(async () => {
    await storeDataInAsyncStorage(AsyncStorageConstants.LoggedInType, null);
    navigate(ScreenNames.LoginScreen, {isFromLogout: true});
  }, [navigate]);

  if (!products && !orders) {
    return (
      <View style={styles.container}>
        <Header title={'Dashboard'} leftIcon={'true'} />
        <Loader isLoading={true} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title={'Dashboard'} leftIcon={'true'} />
      <ScrollView style={styles.listContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={navigateToListProducts}>
          <Text style={styles.buttonText}>{'List Products'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={navigateToOrdersPage}>
          <Text style={styles.buttonText}>{'Your Orders'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={navigateToCart}>
          <Text style={styles.buttonText}>{'Go to Cart'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onPressLogout}>
          <Text style={styles.buttonText}>{'Log out'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  listContainer: {
    flex: 1,
    marginTop: 40,
    marginHorizontal: 20,
  },
});

export default HomeScreen;
