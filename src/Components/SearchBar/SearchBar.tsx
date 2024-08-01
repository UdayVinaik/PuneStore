import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import CustomTextInput from '../TextInput/TextInput';
import CustomIcon from '../Icon/Icon';
import {Colors} from '../../Theme/Colors';

interface SearchBarProps {
  value: string;
  onChangeText: (val: string) => void;
  onPressCancel: () => void;
  placeholder?: string;
}

const SearchBar = (props: SearchBarProps) => {
  return (
    <View style={styles.container}>
      <CustomTextInput
        value={props.value}
        placeholder={props.placeholder}
        onChangeText={props.onChangeText}
        containerStyle={styles.containerStyle}
        textInputStyle={styles.textInputStyle}
      />
      <TouchableOpacity
        style={styles.iconStyle}
        onPress={props.onPressCancel}
        activeOpacity={0.8}>
        <CustomIcon name="window-close" size={25} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    maxHeight: 50,
    marginVertical: 5,
    marginHorizontal: 10,
  },
  containerStyle: {
    flex: 1,
  },
  textInputStyle: {
    borderWidth: 0,
  },
  iconStyle: {
    backgroundColor: Colors.background,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 10,
  },
});

export default SearchBar;
