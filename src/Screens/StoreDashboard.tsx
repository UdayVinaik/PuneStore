import React, {useCallback, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors} from '../Theme/Colors';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {ScreenNames} from '../Constants/ScreenName';
import Header from '../Components/Header/Header';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux';
import {selectOrders} from '../Storage/Slices/OrderSlice';
import {
  isNonEmpty,
  storeDataInAsyncStorage,
} from '../Helpers/Utility/UtilityManager';
import {GET_LIST_OF_PRODUCTS, GET_ORDER_LIST} from '../Constants/ActionTypes';
import Loader from '../Components/Loader/Loader';
import {AsyncStorageConstants} from '../Constants/AsyncStorageConstants';

const StoreDashboard = () => {
  const {navigate} =
    useNavigation<NativeStackNavigationProp<ParamListBase, string>>();

  const products = useSelector((state: any) => state.product.listProduct);
  const orders = useSelector(selectOrders);
  const dispatch = useDispatch();

  console.log('products  ====', products);
  console.log('orders ====', orders);

  useEffect(() => {
    if (!isNonEmpty(products)) {
      dispatch({type: GET_LIST_OF_PRODUCTS});
    }
    if (!isNonEmpty(orders)) {
      dispatch({type: GET_ORDER_LIST});
    }
  }, [products, dispatch]);

  const addProduct = useCallback(() => {
    navigate(ScreenNames.AddProduct);
  }, [navigate]);

  const viewOrders = useCallback(() => {
    navigate(ScreenNames.Orders, {isFromStoreDashboard: true});
  }, []);

  const navigateToListProducts = useCallback(() => {
    navigate(ScreenNames.ProductList);
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
      <Header title="Dashboard" leftIcon="true" />
      <ScrollView style={styles.listContainer}>
        <TouchableOpacity style={styles.button} onPress={addProduct}>
          <Text style={styles.buttonText}>{'Add Product'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={viewOrders}>
          <Text style={styles.buttonText}>{'View Orders'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={navigateToListProducts}>
          <Text style={styles.buttonText}>{'List Products'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onPressLogout}>
          <Text style={styles.buttonText}>{'Log out'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContainer: {
    marginTop: 40,
    marginHorizontal: 20,
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
});

export default StoreDashboard;
