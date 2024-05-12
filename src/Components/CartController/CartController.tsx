import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import CustomIcon from '../Icon/Icon';
import {Colors} from '../../Theme/Colors';

interface CartControllerProps {
  onIncrement: () => void;
  onDecrement: () => void;
  quantity: string;
}

const CartController = (props: CartControllerProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={props.onIncrement}>
        <CustomIcon name="plus" />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{props.quantity}</Text>
      </View>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={props.onDecrement}>
        <CustomIcon name="minus" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  iconContainer: {
    backgroundColor: Colors.primary,
    padding: 1,
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: '500',
    color: Colors.text,
  },
});

export default CartController;
