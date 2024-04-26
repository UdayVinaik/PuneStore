import React, {useCallback, useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Colors} from '../Theme/Colors';
import Header from '../Components/Header/Header';
import {useSelector} from 'react-redux';
import {ImageURLs, Product, SectionListItemType} from '../Constants/Types';
import {selectImageURLs} from '../Storage/Slices/ImageSlice';
import {ParamListBase, useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScreenNames} from '../Constants/ScreenName';

const ProductList = () => {
  const products = useSelector((state: any) => state.product.listProduct);
  const imageURLs = useSelector(selectImageURLs);
  const [productsByCategory, setProductsByCategory] = useState(
    [] as SectionListItemType[],
  );
  const {navigate} =
    useNavigation<NativeStackNavigationProp<ParamListBase, string>>();

  const modifyData = useCallback(() => {
    let productsByCategory: SectionListItemType[] = [];
    products.forEach((currentProduct: Product) => {
      const currentProductImageUrl: string = imageURLs?.find((url: string) =>
        url?.includes(currentProduct?.id),
      );
      currentProduct = {
        ...currentProduct,
        imageURL: currentProductImageUrl ?? '',
      };
      const resultIndex: number = productsByCategory.findIndex(
        (item: SectionListItemType) => item.title === currentProduct.category,
      );

      if (resultIndex !== -1) {
        // If category already exists, update its data
        productsByCategory[resultIndex].data.push(currentProduct);
      } else {
        // If category doesn't exist, create a new one
        const item: SectionListItemType = {
          title: currentProduct.category,
          data: [currentProduct],
        };
        productsByCategory.push(item);
      }
    });
    setProductsByCategory(productsByCategory);
  }, [products, imageURLs, setProductsByCategory]);

  useEffect(() => {
    modifyData();
  }, [modifyData]);

  const navigateoProductsByCategory = useCallback(
    (item: SectionListItemType) => {
      navigate(ScreenNames.ProductsByCategory, {item});
    },
    [],
  );

  return (
    <View style={styles.container}>
      <Header title={'Products'} leftIcon={'true'} />
      <ScrollView style={styles.container}>
        {productsByCategory?.map((item: SectionListItemType, index: number) => {
          return (
            <TouchableOpacity
              style={styles.button}
              key={index.toString()}
              onPress={() => navigateoProductsByCategory(item)}>
              <Text style={styles.buttonText}>{item.title}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
  },
  buttonText: {
    color: Colors.whiteText,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProductList;
