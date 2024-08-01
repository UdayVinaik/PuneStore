import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../Components/Header/Header';
import Loader from '../Components/Loader/Loader';
import {Colors} from '../Theme/Colors';
import CustomTextInput from '../Components/TextInput/TextInput';
import {
  getDataFromAsyncStorage,
  isNonEmpty,
} from '../Helpers/Utility/UtilityManager';
import {AsyncStorageConstants} from '../Constants/AsyncStorageConstants';
import {useDispatch, useSelector} from 'react-redux';
import {selectCart, setCartItemsAction} from '../Storage/Slices/CartSlice';
import {Order, Product} from '../Constants/Types';
import {OrderStatuses} from '../Constants/Constants';
import FBManager from '../Helpers/Firebase/FirebaseManager';
import {Schemas} from '../Constants/SchemaName';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScreenNames} from '../Constants/ScreenName';
import {selectOrders} from '../Storage/Slices/OrderSlice';
import {GET_LIST_OF_PRODUCTS} from '../Constants/ActionTypes';
import {selectIsAdminLoggedIn} from '../Storage/Slices/GlobalSlice';
import uuid from 'react-native-uuid';

const UserDetails = () => {
  const [username, setUserName] = useState('');
  const [uid, setUid] = useState('');
  const [loading, setLoading] = useState(false);
  const [storedName, setStoredName] = useState('');
  const [storedUid, setStoredUid] = useState('');
  const cartProducts = useSelector(selectCart);
  const products = useSelector((state: any) => state.product.listProduct);
  const orders = useSelector(selectOrders);
  const {navigate} =
    useNavigation<NativeStackNavigationProp<ParamListBase, string>>();
  const dispatch = useDispatch();
  const isAdmin = useSelector(selectIsAdminLoggedIn);

  useEffect(() => {
    const getUsernameAndUid = async () => {
      const name = await getDataFromAsyncStorage(AsyncStorageConstants.Name);
      const uid = await getDataFromAsyncStorage(AsyncStorageConstants.UID);
      setUserName(name);
      setStoredName(name);
      setUid(uid);
      setStoredUid(uid);
    };
    getUsernameAndUid();
  }, []);

  const validateOrder = useCallback(
    async (order: Order) => {
      try {
        const itemsOutOfStock: Product[] = [];
        dispatch({type: GET_LIST_OF_PRODUCTS});
        order?.products?.map(product => {
          const actualProduct = products?.find(
            (prod: Product) => prod.id === product.id,
          );
          if (actualProduct) {
            if (actualProduct?.quantity < product?.quantity) {
              itemsOutOfStock.push(product);
            }
          }
        });
        if (isNonEmpty(itemsOutOfStock)) {
          let showItems = ``;
          itemsOutOfStock?.map(product => {
            showItems += `${product?.name}\n`;
          });
          Alert.alert(
            'Error',
            `Currently following items are out of stock or you ordered a quantity more than available in stock: \n\n${showItems}\nPlease remove them from order list to complete your order.\n`,
          );
          return false;
        } else return true;
      } catch (error) {
        console.log('error ====', error);
      }
    },
    [dispatch, products],
  );

  const placeOrder = useCallback(async () => {
    setLoading(true);
    if (
      (isNonEmpty(username) && isNonEmpty(uid) && !isNonEmpty(orders)) ||
      (isNonEmpty(username) && isNonEmpty(uid) && isAdmin)
    ) {
      const order: Order = {
        id: isAdmin ? uuid.v4()?.toString() : uid.toUpperCase(),
        userDetails: {
          name: username,
          uid: uid.toUpperCase(),
        },
        products: cartProducts,
        status: OrderStatuses.OrderPlaced,
      };

      const isOrderValid = await validateOrder(order);
      if (isOrderValid) {
        await FBManager.Add(Schemas.Order, order?.id, order);
        await Promise.all(
          order.products?.map(async (product: Product) => {
            const actualProduct = products?.find(
              (prod: Product) => prod.id === product.id,
            );
            await FBManager.Update(Schemas.Product, product.id, {
              quantity:
                actualProduct?.quantity - product.quantity > 0
                  ? actualProduct?.quantity - product.quantity
                  : 0,
            });
          }),
        );
        dispatch(setCartItemsAction([]));
        navigate(ScreenNames.HomeScreen, {isFromUserDetails: true});
      }
    } else if (isNonEmpty(orders)) {
      Alert.alert(
        'Error',
        'You have already placed one order. Once that will be completed, then only you can place new order.',
      );
      navigate(ScreenNames.HomeScreen);
    } else {
      Alert.alert('Error', 'Please check if name or uid is missing');
    }
    setLoading(false);
  }, [username, uid, navigate, storedName, storedUid, products]);

  return (
    <View style={styles.container}>
      <Header title={'User Details'} leftIcon={'true'} />
      <ScrollView style={styles.listContainer}>
        <CustomTextInput
          value={username}
          onChangeText={val => setUserName(val)}
          placeholder={'Name: '}
        />
        <CustomTextInput
          value={uid}
          onChangeText={val => setUid(val)}
          placeholder={'UID Number: '}
        />
        <TouchableOpacity style={styles.button} onPress={placeOrder}>
          <Text style={styles.buttonText}>{'Place Order'}</Text>
        </TouchableOpacity>
      </ScrollView>
      {loading && <Loader isLoading={loading} />}
    </View>
  );
};

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

export default UserDetails;
