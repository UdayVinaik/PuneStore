import React, {useCallback, useEffect, useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  BackHandler,
  Alert,
  AppState,
} from 'react-native';
import {Colors} from '../Theme/Colors';
import Header from '../Components/Header/Header';
import {useDispatch, useSelector} from 'react-redux';
import {GET_LIST_OF_PRODUCTS, GET_ORDER_BY_ID} from '../Constants/ActionTypes';
import {
  ParamListBase,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {ScreenNames} from '../Constants/ScreenName';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Loader from '../Components/Loader/Loader';
import {selectOrders, setOrderListAction} from '../Storage/Slices/OrderSlice';
import {
  Admin,
  Product,
  RootStackParamListType,
  SectionListItemType,
} from '../Constants/Types';
import {
  getDataFromAsyncStorage,
  isNonEmpty,
  storeDataInAsyncStorage,
} from '../Helpers/Utility/UtilityManager';
import {AsyncStorageConstants} from '../Constants/AsyncStorageConstants';
import NetInfo from '@react-native-community/netinfo';
import CustomImageBackground from '../Components/CustomImageBackground/CustomImageBackground';
import {selectImageURLs} from '../Storage/Slices/ImageSlice';
import {Categories} from '../Constants/Category';
import FBManager from '../Helpers/Firebase/FirebaseManager';
import {Schemas} from '../Constants/SchemaName';
import {selectIsAdminLoggedIn, setIsAdmin} from '../Storage/Slices/GlobalSlice';
import {setListProductsSuccessAction} from '../Storage/Slices/ProductSlice';

function HomeScreen() {
  const dispatch = useDispatch();
  const {navigate, setParams} =
    useNavigation<NativeStackNavigationProp<ParamListBase, string>>();
  const route = useRoute<RouteProp<RootStackParamListType, 'HomeScreen'>>();
  const products = useSelector((state: any) => state.product?.listProduct);
  const isProductsLoading = useSelector((state: any) => state.product?.loading);
  const imageURLs = useSelector(selectImageURLs);
  const orders = useSelector(selectOrders);
  const isOrdersLoading = useSelector((state: any) => state.order?.loading);
  const [uid, setUid] = useState('');
  const appState = useRef(AppState.currentState);
  let isConnected = useRef<boolean | null>(true);
  const [productsByCategory, setProductsByCategory] = useState(
    [] as SectionListItemType[],
  );
  const isAdmin = useSelector(selectIsAdminLoggedIn);

  const navigateoProductsByCategory = useCallback(
    (item: SectionListItemType) => {
      navigate(ScreenNames.ProductsByCategory, {
        item,
      });
    },
    [navigate],
  );

  const showItemTitle = useCallback((title: string) => {
    const category = Categories?.find(item => item?.key === title);
    return category?.label ?? '';
  }, []);

  //Get uid
  useEffect(() => {
    const getUid = async () => {
      const uid = await getDataFromAsyncStorage(AsyncStorageConstants.UID);
      setUid(uid);
    };
    getUid();
  }, []);

  const onSuccess = () => {
    BackHandler.exitApp();
  };

  //Modify data as per categories
  const modifyData = useCallback(() => {
    let productsByCategory: SectionListItemType[] = [];
    products?.forEach((currentProduct: Product) => {
      const currentProductImageUrl: string = imageURLs?.find((url: string) =>
        url?.includes(currentProduct?.id),
      );
      currentProduct = {
        ...currentProduct,
        imageURL: currentProductImageUrl ?? '',
      };
      const resultIndex: number = productsByCategory.findIndex(
        (item: SectionListItemType) => item.title === currentProduct.category,
      );

      if (resultIndex !== -1) {
        // If category already exists, update its data
        productsByCategory[resultIndex].data.push(currentProduct);
      } else {
        // If category doesn't exist, create a new one
        const item: SectionListItemType = {
          title: currentProduct.category,
          data: [currentProduct],
        };
        productsByCategory.push(item);
      }
    });
    setProductsByCategory(productsByCategory);
  }, [products, imageURLs, setProductsByCategory]);

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

  // Get data from Backend
  useEffect(() => {
    const getDataFromBackend = async () => {
      if (!isNonEmpty(products)) {
        dispatch({type: GET_LIST_OF_PRODUCTS, payload: {isFetchImages: true}});
      }
      if (!isNonEmpty(orders)) {
        dispatch({type: GET_ORDER_BY_ID, payload: {id: uid.toUpperCase()}});
      }
      if (route.params?.isFromUserDetails) {
        dispatch({type: GET_LIST_OF_PRODUCTS});
        setParams({isFromUserDetails: false});
      }
      const admins = await FBManager.ReadAll(Schemas.Admins);
      const isAdmin = admins?.find(
        (admin: Admin) => admin.uid?.toLowerCase() === uid?.toLowerCase(),
      );
      if (isAdmin) {
        dispatch(setIsAdmin(true));
      } else {
        dispatch(setIsAdmin(false));
      }
    };

    getDataFromBackend();
  }, [products, dispatch, route.params?.isFromUserDetails, uid, setParams]);

  useEffect(() => {
    modifyData();
  }, [modifyData]);

  const navigateToOrdersPage = useCallback(() => {
    navigate(ScreenNames.Orders);
  }, [navigate]);

  const navigateToCart = useCallback(() => {
    navigate(ScreenNames.Cart);
  }, [navigate]);

  const navigateToHelp = useCallback(() => {
    navigate(ScreenNames.Help);
  }, [navigate]);

  const navigateToOwnerDashboard = useCallback(() => {
    navigate(ScreenNames.StoreDashboard);
  }, [navigate]);

  const onPressLogout = useCallback(async () => {
    await storeDataInAsyncStorage(AsyncStorageConstants.LoggedInType, null);
    await storeDataInAsyncStorage(AsyncStorageConstants.UID, '');
    await storeDataInAsyncStorage(AsyncStorageConstants.Name, '');
    navigate(ScreenNames.LoginScreen, {isFromLogout: true});
    dispatch(setListProductsSuccessAction(null));
    dispatch(setOrderListAction(null));
  }, [navigate]);

  if (isProductsLoading || isOrdersLoading) {
    return (
      <View style={styles.container}>
        <Header title={'Dashboard'} leftIcon={'true'} />
        <Loader isLoading={true} />
      </View>
    );
  }

  return (
    <CustomImageBackground>
      <Header
        title={'Dashboard'}
        rightIcon="Log out"
        onRightIconPress={onPressLogout}
      />
      <ScrollView style={styles.listContainer}>
        {productsByCategory?.map((item: SectionListItemType, index: number) => {
          return (
            <TouchableOpacity
              style={styles.button}
              key={index.toString()}
              onPress={() => navigateoProductsByCategory(item)}>
              <Text style={styles.buttonText}>{showItemTitle(item.title)}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View style={styles.bottomView}>
        {!isAdmin && (
          <TouchableOpacity
            style={styles.button}
            onPress={navigateToOrdersPage}>
            <Text style={styles.buttonText}>{'Your Orders'}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[styles.button]} onPress={navigateToCart}>
          <Text style={styles.buttonText}>{'Go to Cart'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={navigateToHelp}>
          <Text style={styles.buttonText}>{'Help'}</Text>
        </TouchableOpacity>
        {isAdmin && (
          <TouchableOpacity
            style={styles.button}
            onPress={navigateToOwnerDashboard}>
            <Text style={styles.buttonText}>{'Admin'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </CustomImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    backgroundColor: Colors.primary,
    margin: 2,
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
  bottomView: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    marginHorizontal: 20,
  },
});

export default HomeScreen;
