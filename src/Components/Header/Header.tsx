// Header.js
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Colors} from '../../Theme/Colors';

interface HeaderProps {
  title: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
}

const Header = ({
  title,
  leftIcon,
  rightIcon,
  onRightIconPress,
}: HeaderProps) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.leftRightBlock}>
        {leftIcon && <Text style={styles.backButton}>{'Back'}</Text>}
      </TouchableOpacity>
      <View style={styles.titleBox}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <TouchableOpacity
        onPress={onRightIconPress}
        style={styles.leftRightBlock}>
        {rightIcon && (
          <Text style={styles.actionButton}>
            {rightIcon ? rightIcon : 'Custom'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary, // Change header background color as needed
    height: 60,
    paddingHorizontal: 15,
  },
  backButton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  titleBox: {
    flex: 0.8,
    alignItems: 'center',
  },
  title: {
    color: Colors.whiteText,
    fontSize: 20,
    fontWeight: 'bold',
  },
  actionButton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  leftRightBlock: {
    flex: 0.2,
    marginHorizontal: 10,
  },
});

export default Header;
