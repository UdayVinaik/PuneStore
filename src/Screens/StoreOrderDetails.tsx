import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../Components/Header/Header';
import {Colors} from '../Theme/Colors';
import {CartProduct, UserDetails as UserDetailsType} from '../Constants/Types';
import {Dropdown} from 'react-native-element-dropdown';
import {OrderStatusesArray} from '../Constants/Constants';
import Loader from '../Components/Loader/Loader';
import {useDispatch} from 'react-redux';
import {isNonEmpty} from '../Helpers/Utility/UtilityManager';
import {UPDATE_ORDER_STATUS} from '../Constants/ActionTypes';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScreenNames} from '../Constants/ScreenName';
import {sendEmail} from '../Helpers/Email/Email';

interface StoreOrderDetailsProps {
  route: any;
}

export const createMailBody = (
  userDetails: UserDetailsType,
  products: CartProduct[],
) => {
  let total = 0;
  let body = `Name: ${userDetails?.name}\n UID: ${userDetails.uid}\n\n Products: \n\n`;
  products?.forEach((product: CartProduct) => {
    const line = `${product.name} \nQuantity: ${product.quantity}\nPrice: ${product.totalPrice}\n\n`;
    body = body.concat(line);
    total += product.totalPrice;
  });
  body = body.concat(`\nTotal: ${total}`);
  return body;
};

const StoreOrderDetails = (props: StoreOrderDetailsProps) => {
  const {order} = props.route?.params;
  const [orderStatus, setOrderStatus] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [uploading, setUploading] = useState(false);
  const dispatch = useDispatch();
  const {navigate} =
    useNavigation<NativeStackNavigationProp<ParamListBase, string>>();

  useEffect(() => {
    setOrderStatus(order?.status);
  }, []);

  const total = useMemo(() => {
    let totalAmount = 0;
    order?.products?.forEach((item: CartProduct) => {
      totalAmount += item.totalPrice;
    });
    return totalAmount;
  }, [order]);

  const onClickSave = useCallback(async () => {
    setUploading(true);
    if (orderStatus !== order?.status && isNonEmpty(orderStatus)) {
      if (orderStatus === OrderStatusesArray[3]?.key) {
        const subject = `Order Delivered: ${order?.userDetails?.uid}\n`;
        await sendEmail(
          'punesatsangstore@gmail.com',
          subject,
          createMailBody(order.userDetails, order.products),
        );
      }
      dispatch({
        type: UPDATE_ORDER_STATUS,
        payload: {order: order, orderStatus: orderStatus},
      });
      navigate(ScreenNames.Orders, {isFromUpdateOrder: true});
    }
    setUploading(false);
  }, [orderStatus, order, setUploading]);

  const renderProduct = (product: CartProduct) => {
    return (
      <View style={styles.productContainer} key={product.id}>
        <View>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.quantity}>
            {'Quantity: '}
            {product.quantity}
          </Text>
        </View>
        <View>
          <Text style={styles.price}>
            {product.totalPrice} {'Rs.'}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title={'Order Details'} leftIcon={'true'} />
      <ScrollView style={styles.listContainer}>
        <View style={styles.userDetails}>
          <Text style={styles.titleText}>{'User Details:\n'}</Text>
          <Text style={styles.text}>
            {'Name: '}
            {order?.userDetails?.name || ''}
          </Text>
          <Text style={styles.text}>
            {'UID: '}
            {order?.userDetails?.uid || ''}
          </Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.titleText}>{'Status:\n'}</Text>
          <Dropdown
            data={OrderStatusesArray}
            maxHeight={400}
            labelField={'label'}
            valueField={'key'}
            value={orderStatus}
            onChange={item => {
              setOrderStatus(item.key);
              setIsFocus(false);
            }}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            placeholder={!isFocus ? 'Select item' : '...'}
            style={styles.dropdown}
            placeholderStyle={styles.dropdownPlaceholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            iconColor={Colors.primary}
          />
        </View>
        {order?.products?.map((product: CartProduct) => {
          return renderProduct(product);
        })}
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>{'Total amount: '}</Text>
          <Text style={styles.totalText}>
            {total} {'Rs.'}
          </Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={onClickSave}>
          <Text style={styles.buttonText}>{'Save'}</Text>
        </TouchableOpacity>
      </ScrollView>
      {uploading && <Loader isLoading={uploading} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey1,
  },
  listContainer: {
    flex: 1,
    marginTop: 40,
    marginHorizontal: 20,
  },
  productContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productName: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '400',
  },
  price: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '400',
  },
  quantity: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '400',
  },
  totalContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    paddingHorizontal: 30,
    marginTop: 10,
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalText: {
    fontSize: 20,
    fontWeight: '500',
    color: Colors.text,
  },
  titleText: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: '700',
  },
  userDetails: {
    marginVertical: 20,
  },
  text: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '400',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: Colors.primary,
    height: 50,
    paddingHorizontal: 10,
  },
  dropdownPlaceholderStyle: {
    color: Colors.primary,
  },
  selectedTextStyle: {
    color: Colors.primary,
  },
  iconStyle: {
    width: 25,
    height: 25,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginVertical: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.whiteText,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StoreOrderDetails;
