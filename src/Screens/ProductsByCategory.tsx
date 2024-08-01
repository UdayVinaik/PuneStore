import React, {useCallback, useState} from 'react';
import {FlatList, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Colors} from '../Theme/Colors';
import Header from '../Components/Header/Header';
import {Product} from '../Constants/Types';
import ProductItem from '../Components/ProductItem/ProductItem';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {ScreenNames} from '../Constants/ScreenName';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import CustomImageBackground from '../Components/CustomImageBackground/CustomImageBackground';
import SearchBar from '../Components/SearchBar/SearchBar';

interface ProductsByCategoryProps {
  route: any;
}

const ProductsByCategory = (props: ProductsByCategoryProps) => {
  const [products, setProducts] = useState(
    props?.route?.params?.item?.data as Product[],
  );
  const [searchText, setSearchText] = useState('');
  const {navigate} =
    useNavigation<NativeStackNavigationProp<ParamListBase, string>>();

  const renderItem = ({item}: any) => {
    return (
      <ProductItem
        item={item}
        isFromStoreDashboard={props?.route?.params?.isFromStoreDashboard}
      />
    );
  };

  const navigateToCart = useCallback(() => {
    navigate(ScreenNames.Cart);
  }, [navigate]);

  const navigateToProductCategory = useCallback(() => {
    navigate(ScreenNames.HomeScreen);
  }, [navigate]);

  const onSearch = useCallback(
    (value: string) => {
      if (value) {
        setSearchText(value);
        const modifiedProducts = props?.route?.params?.item?.data?.filter(
          (product: Product) =>
            product?.name?.toLowerCase()?.includes(value?.toLowerCase())
              ? true
              : false,
        );
        setProducts(modifiedProducts);
      } else {
        setSearchText(value);
        setProducts(props?.route?.params?.item?.data);
      }
    },
    [setSearchText, products, setProducts],
  );

  const onPressCancel = useCallback(() => {
    setSearchText('');
    setProducts(props?.route?.params?.item?.data);
  }, [setSearchText]);

  return (
    <CustomImageBackground>
      <Header title={'Products by category'} leftIcon={'true'} />
      <SearchBar
        value={searchText}
        placeholder={'Search'}
        onChangeText={onSearch}
        onPressCancel={onPressCancel}
      />
      <FlatList data={products} renderItem={renderItem} />
      <TouchableOpacity
        style={styles.button}
        onPress={navigateToProductCategory}>
        <Text style={styles.buttonText}>{'Continue Shopping'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={navigateToCart}>
        <Text style={styles.buttonText}>{'Go to Cart'}</Text>
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
    marginVertical: 10,
  },
  buttonText: {
    color: Colors.whiteText,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProductsByCategory;
