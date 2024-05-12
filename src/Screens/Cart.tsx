import React, {useCallback, useMemo, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Colors} from '../Theme/Colors';
import Header from '../Components/Header/Header';
import ProductItem from '../Components/ProductItem/ProductItem';
import {useSelector} from 'react-redux';
import {selectCart} from '../Storage/Slices/CartSlice';
import {CartProduct, Product} from '../Constants/Types';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScreenNames} from '../Constants/ScreenName';
import {isNonEmpty} from '../Helpers/Utility/UtilityManager';
import CustomImageBackground from '../Components/CustomImageBackground/CustomImageBackground';

interface CartProps {}

const Cart = (props: CartProps) => {
  const cartProducts = useSelector(selectCart);
  const {navigate} =
    useNavigation<NativeStackNavigationProp<ParamListBase, string>>();

  const total = useMemo(() => {
    let totalAmount = 0;
    cartProducts?.forEach((item: CartProduct) => {
      totalAmount += item.totalPrice;
    });
    return totalAmount;
  }, [cartProducts]);

  const renderItem = ({item}: any) => {
    return <ProductItem item={item} isFromCart={true} />;
  };

  const onPressCheckout = useCallback(() => {
    navigate(ScreenNames.UserDetails);
  }, [navigate]);

  if (!isNonEmpty(cartProducts)) {
    return (
      <CustomImageBackground>
        <Header title={'Cart'} leftIcon={'true'} />
        <View style={styles.emptyTextContainer}>
          <Text style={styles.emptyText}>
            {'Your cart is empty. Please add some items to place order.'}
          </Text>
        </View>
      </CustomImageBackground>
    );
  }

  return (
    <CustomImageBackground>
      <Header title={'Cart'} leftIcon={'true'} />
      <FlatList data={cartProducts ?? []} renderItem={renderItem} />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>{'Total amount: '}</Text>
        <Text style={styles.totalText}>
          {total} {'Rs.'}
        </Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={onPressCheckout}>
        <Text style={styles.buttonText}>{'Checkout'}</Text>
      </TouchableOpacity>
    </CustomImageBackground>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 20,
  },
  buttonText: {
    color: Colors.whiteText,
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    paddingHorizontal: 30,
    marginBottom: 20,
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
  totalText: {
    fontSize: 20,
    fontWeight: '500',
    color: Colors.text,
  },
  emptyText: {
    fontSize: 20,
    color: Colors.whiteText,
    fontWeight: '500',
  },
  emptyTextContainer: {
    marginHorizontal: 10,
    marginVertical: 20,
    backgroundColor: Colors.primary,
    padding: 10,
  },
});

export default Cart;
