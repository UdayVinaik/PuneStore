// CustomTextInput.js
import React from 'react';
import {TextInput, View, Text, StyleSheet} from 'react-native';
import {Colors} from '../../Theme/Colors';

interface TextInputProps {
  value: string;
  onChangeText: (value: string) => void;
  isError?: boolean;
  placeholder?: string;
  errorText?: string;
  multiline?: boolean;
  numberOfLines?: number;
  containerStyle?: any;
}

const CustomTextInput = ({
  value,
  onChangeText,
  isError,
  placeholder = '',
  errorText = '',
  multiline,
  numberOfLines,
  containerStyle,
}: TextInputProps) => {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={[styles.input, containerStyle, isError && styles.error]}
        placeholder={placeholder}
        placeholderTextColor={Colors.primary}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
      {isError && (
        <Text style={styles.errorText}>{errorText ? errorText : 'Error'}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    backgroundColor: Colors.background,
  },
  input: {
    height: 50,
    borderColor: Colors.primary,
    borderWidth: 1,
    paddingHorizontal: 10,
    color: Colors.primary,
    borderRadius: 5,
  },
  error: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
});

export default CustomTextInput;
