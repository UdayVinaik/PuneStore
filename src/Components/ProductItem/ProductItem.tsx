import React, {useCallback, useMemo} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {CartProduct, Product} from '../../Constants/Types';
import {Colors} from '../../Theme/Colors';
import CartController from '../CartController/CartController';
import {useDispatch, useSelector} from 'react-redux';
import {selectCart, setCartItemsAction} from '../../Storage/Slices/CartSlice';

interface ProductItemProps {
  item: CartProduct;
  isFromCart?: boolean;
}

const ProductItem = (props: ProductItemProps) => {
  const {item} = props;
  const dispatch = useDispatch();
  const cartProducts = useSelector(selectCart);
  const imagePlaceholder = require('../../Assets/Images/ImagePlaceholder.png');

  console.log('cartProducts ====', cartProducts);

  const onDecrement = useCallback(() => {
    const resultIndex: number = cartProducts?.findIndex(
      (product: Product) => product?.id === item?.id,
    );
    if (resultIndex !== -1) {
      if (cartProducts[resultIndex]?.quantity > 1) {
        const price = cartProducts[resultIndex]?.totalPrice - item.price;
        console.log('price ====', price);
        console.log('cartProducts[resultIndex]?.price ====');
        const quantity = cartProducts[resultIndex]?.quantity - 1;
        const modifiedCartProducts = [...cartProducts];
        modifiedCartProducts[resultIndex] = {
          ...modifiedCartProducts[resultIndex],
          totalPrice: price,
          quantity: quantity,
        };
        dispatch(setCartItemsAction(modifiedCartProducts));
      } else {
        const modifiedCartProducts = [...cartProducts];
        modifiedCartProducts.splice(resultIndex, 1);
        dispatch(setCartItemsAction(modifiedCartProducts));
      }
    }
  }, [cartProducts, item, dispatch]);

  const onIncrement = useCallback(() => {
    const resultIndex: number = cartProducts?.findIndex(
      (product: Product) => product?.id === item?.id,
    );
    if (resultIndex !== -1) {
      const price = cartProducts[resultIndex]?.totalPrice + item.price;
      const quantity = cartProducts[resultIndex]?.quantity + 1;
      const modifiedCartProducts = [...cartProducts];
      modifiedCartProducts[resultIndex] = {
        ...modifiedCartProducts[resultIndex],
        totalPrice: price,
        quantity: quantity,
      };
      dispatch(setCartItemsAction(modifiedCartProducts));
    } else {
      const modifiedCartProducts = [
        ...cartProducts,
        {...item, quantity: 1, totalPrice: item.price},
      ];
      dispatch(setCartItemsAction(modifiedCartProducts));
    }
  }, [cartProducts, item, dispatch]);

  const showQuantity = useMemo(() => {
    const isProductAvailableInCart = cartProducts?.find(
      (product: Product) => product?.id === item?.id,
    );
    if (isProductAvailableInCart) {
      return isProductAvailableInCart?.quantity?.toString();
    } else {
      return '0';
    }
  }, [cartProducts, item]);

  console.log(
    'item.price * item.quantity ====',
    item.price,
    item.quantity,
    item.price * item.quantity,
    item.totalPrice,
  );

  return (
    <View style={styles.itemContainer}>
      <View style={styles.imageContainer}>
        <Image source={{uri: item.imageURL}} style={styles.image} />
      </View>
      <View style={styles.nameContainer}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.name}>
          {props?.isFromCart ? item.totalPrice : item.price}
          {' Rs.'}
        </Text>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.quantity}>{'Quantities Left: '}</Text>
        <Text style={styles.quantityRed}>{item.quantity ?? 0}</Text>
      </View>
      <View style={styles.cartControllerContainer}>
        <CartController
          onDecrement={onDecrement}
          onIncrement={onIncrement}
          quantity={showQuantity}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.background,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  imageContainer: {
    paddingVertical: 10,
    paddingTop: 25,
  },
  name: {
    fontSize: 20,
    color: Colors.text,
    fontWeight: '500',
  },
  nameContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    minHeight: 70,
  },
  cartControllerContainer: {
    paddingBottom: 20,
  },
  quantity: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  quantityRed: {
    fontSize: 20,
    color: Colors.accent,
    fontWeight: '700',
  },
  priceContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    minHeight: 50,
  },
});

export default ProductItem;
