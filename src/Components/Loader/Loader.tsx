import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {Colors} from '../../Theme/Colors';

interface LoaderProps {
  isLoading: boolean;
}

const Loader = (props: LoaderProps) => {
  return (
    <View style={styles.container}>
      {props.isLoading && <ActivityIndicator size="large" color={'black'} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    opacity: 0.4,
    zIndex: 1,
  },
});

export default Loader;
