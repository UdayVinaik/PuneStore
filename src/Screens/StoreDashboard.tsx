import React, {useCallback, useEffect, useRef} from 'react';
import {
  Alert,
  AppState,
  BackHandler,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors} from '../Theme/Colors';
import {
  ParamListBase,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
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
import {RootStackParamListType} from '../Constants/Types';
import NetInfo from '@react-native-community/netinfo';

const StoreDashboard = () => {
  const {navigate, setParams} =
    useNavigation<NativeStackNavigationProp<ParamListBase, string>>();
  const route = useRoute<RouteProp<RootStackParamListType, 'StoreDashboard'>>();

  const products = useSelector((state: any) => state.product.listProduct);
  const orders = useSelector(selectOrders);
  const dispatch = useDispatch();
  const appState = useRef(AppState.currentState);
  let isConnected = useRef<boolean | null>(true);

  const onSuccess = () => {
    BackHandler.exitApp();
  };

  useEffect(() => {
    const unsubscribeNetInfo = NetInfo.addEventListener(currentState => {
      isConnected.current = currentState.isConnected;
      if (!currentState.isConnected) {
        Alert.alert(
          'Error',
          'Please connect to internet. You do not have a internet connection at this moment.',
          [{text: 'OK', onPress: () => onSuccess()}],
        );
      }
    });
    return () => unsubscribeNetInfo();
  }, []);

  // For network connection
  useEffect(() => {
    const unsubscribe = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        if (!isConnected.current) {
          Alert.alert(
            'Error',
            'Please connect to internet. You do not have a internet connection at this moment.',
            [{text: 'OK', onPress: () => onSuccess()}],
          );
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      unsubscribe.remove();
    };
  }, []);

  console.log('products  ====', products);
  console.log('orders ====', orders);

  useEffect(() => {
    if (!isNonEmpty(products) || route.params?.isFromEditProduct) {
      setParams({isFromEditProduct: false});
      dispatch({type: GET_LIST_OF_PRODUCTS, payload: {isFetchImages: true}});
    }
    if (!isNonEmpty(orders)) {
      dispatch({type: GET_ORDER_LIST});
    }
  }, [products, dispatch, route.params?.isFromEditProduct]);

  const addProduct = useCallback(() => {
    navigate(ScreenNames.AddProduct);
  }, [navigate]);

  const viewOrders = useCallback(() => {
    navigate(ScreenNames.Orders, {isFromStoreDashboard: true});
  }, []);

  const navigateToListProducts = useCallback(() => {
    navigate(ScreenNames.ProductList, {isFromStoreDashboard: true});
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
      <Header title="Dashboard" />
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
