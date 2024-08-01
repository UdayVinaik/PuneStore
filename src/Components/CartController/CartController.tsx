import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import CustomIcon from '../Icon/Icon';
import {Colors} from '../../Theme/Colors';
import CustomTextInput from '../TextInput/TextInput';

interface CartControllerProps {
  onIncrement: () => void;
  onDecrement: () => void;
  quantity: string;
  onEnterValue: (val: string) => void;
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
        <CustomTextInput
          value={props.quantity?.toString()}
          onChangeText={val => props.onEnterValue(val)}
          textInputStyle={styles.textInputStyle}
          textAlign={'center'}
          keyboardType="numeric"
          containerStyle={styles.textInputContainer}
        />
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
  textInputStyle: {
    borderWidth: 0,
    fontSize: 20,
  },
  textInputContainer: {
    marginVertical: 0,
  },
  text: {
    fontSize: 24,
    fontWeight: '500',
    color: Colors.text,
  },
});

export default CartController;
