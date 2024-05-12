import React from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native';

const backgroundImage = require('../../Assets/Images/Background.jpeg');

interface CustomImageBackgroundProps {
  children: any;
}

const CustomImageBackground = (props: CustomImageBackgroundProps) => {
  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.imageContainer}
      resizeMode={'repeat'}
      blurRadius={20}>
      {props.children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
  },
});

export default CustomImageBackground;
