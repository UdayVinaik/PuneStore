import React, {useCallback, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../Components/Header/Header';
import CustomTextInput from '../Components/TextInput/TextInput';
import Loader from '../Components/Loader/Loader';
import {RootStackParamListType} from '../Constants/Types';
import {Colors} from '../Theme/Colors';
import {
  ParamListBase,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import FBManager from '../Helpers/Firebase/FirebaseManager';
import {Schemas} from '../Constants/SchemaName';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScreenNames} from '../Constants/ScreenName';
import CustomImageBackground from '../Components/CustomImageBackground/CustomImageBackground';

const EditProductScreen = () => {
  const route =
    useRoute<RouteProp<RootStackParamListType, 'EditProductScreen'>>();
  const [product, setProduct] = useState(route.params?.item);
  const {navigate} =
    useNavigation<NativeStackNavigationProp<ParamListBase, string>>();

  const [uploading, setUploading] = useState(false);

  const updateProduct = useCallback(async () => {
    try {
      setUploading(true);
      await FBManager.Update(Schemas.Product, product.id, {
        quantity: product.quantity,
      });
      setUploading(false);
      navigate(ScreenNames.StoreDashboard, {isFromEditProduct: true});
    } catch (error) {
      console.log('Error ====', error);
    }
  }, [setUploading, product, navigate]);

  return (
    <CustomImageBackground>
      <Header title={'Dashboard'} leftIcon={'true'} />
      <ScrollView style={styles.container}>
        <View style={styles.listContainer}>
          <CustomTextInput
            value={product.name}
            onChangeText={val => {
              setProduct({...product, name: val});
            }}
            placeholder={'Name: '}
          />
          <CustomTextInput
            value={product.quantity ? product.quantity.toString() : ''}
            onChangeText={val => {
              setProduct({...product, quantity: parseInt(val)});
            }}
            placeholder={'Quantity: '}
          />
          <TouchableOpacity style={styles.button} onPress={updateProduct}>
            <Text style={styles.buttonText}>{'Update'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {uploading && <Loader isLoading={uploading} />}
    </CustomImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    marginTop: 40,
    marginHorizontal: 20,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.whiteText,
    fontSize: 18,
    fontWeight: 'bold',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: Colors.primary,
    height: 50,
    paddingHorizontal: 10,
  },
  dropdownPlaceholderStyle: {
    color: Colors.primary,
  },
  selectedTextStyle: {
    color: Colors.primary,
  },
  iconStyle: {
    width: 25,
    height: 25,
  },
  imageContainer: {
    paddingVertical: 10,
  },
  image: {
    width: 100,
    height: 100,
  },
  imageBlock: {
    alignItems: 'center',
    marginVertical: 10,
  },
});

export default EditProductScreen;
