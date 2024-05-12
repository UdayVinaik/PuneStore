import React, {useCallback, useMemo} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {CartProduct, Product} from '../../Constants/Types';
import {Colors} from '../../Theme/Colors';
import CartController from '../CartController/CartController';
import {useDispatch, useSelector} from 'react-redux';
import {selectCart, setCartItemsAction} from '../../Storage/Slices/CartSlice';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScreenNames} from '../../Constants/ScreenName';

interface ProductItemProps {
  item: CartProduct;
  isFromCart?: boolean;
  isFromStoreDashboard?: boolean;
}

const ProductItem = (props: ProductItemProps) => {
  const {item} = props;
  const dispatch = useDispatch();
  const cartProducts = useSelector(selectCart);
  const imagePlaceholder = require('../../Assets/Images/ImagePlaceholder.png');
  const {navigate} =
    useNavigation<NativeStackNavigationProp<ParamListBase, string>>();

  console.log('cartProducts ====', cartProducts);

  const onDecrement = useCallback(() => {
    const resultIndex: number = cartProducts?.findIndex(
      (product: Product) => product?.id === item?.id,
    );
    if (resultIndex !== -1) {
      if (cartProducts[resultIndex]?.quantity > 1) {
        const price = cartProducts[resultIndex]?.totalPrice - item.price;
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

  const onPressItem = useCallback(
    (item: CartProduct) => {
      navigate(ScreenNames.EditProductScreen, {item});
    },
    [navigate],
  );

  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => onPressItem(item)}
      disabled={!props?.isFromStoreDashboard}>
      <View style={styles.imageContainer}>
        <Image
          source={item.imageURL ? {uri: item.imageURL} : imagePlaceholder}
          style={styles.image}
        />
      </View>
      <View style={styles.nameAndQuantityContainer}>
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
        {props?.isFromStoreDashboard && (
          <View style={styles.quantityContainer}>
            <Text style={styles.quantity}>{'Quantities Left: '} </Text>
            <Text style={styles.quantityRed}>{item.quantity ?? 0}</Text>
          </View>
        )}
      </View>

      <View style={styles.cartControllerContainer}>
        {item.quantity > 0 ? (
          <CartController
            onDecrement={onDecrement}
            onIncrement={onIncrement}
            quantity={showQuantity}
          />
        ) : (
          <View style={styles.outOfStockView}>
            <Text style={styles.outOfStockText}>{'Out of Stock'}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.background,
    marginHorizontal: 10,
    marginVertical: 5,
    alignItems: 'center',
    borderRadius: 20,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  imageContainer: {
    marginHorizontal: 10,
    marginVertical: 10,
    flex: 0.2,
  },
  nameAndQuantityContainer: {
    flex: 0.6,
    marginVertical: 15,
  },
  name: {
    fontSize: 18,
    color: Colors.text,
    fontWeight: '500',
  },
  nameContainer: {
    paddingLeft: 20,
  },
  cartControllerContainer: {
    flex: 0.2,
  },
  quantity: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  quantityRed: {
    fontSize: 16,
    color: Colors.accent,
    fontWeight: '700',
  },
  priceContainer: {
    paddingLeft: 20,
  },
  quantityContainer: {
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  outOfStockView: {
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginRight: 10,
  },
  outOfStockText: {
    color: Colors.whiteText,
    fontSize: 16,
  },
});

export default ProductItem;
