import React, {useCallback, useState} from 'react';
import {
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import CustomTextInput from '../Components/TextInput/TextInput';
import {Colors} from '../Theme/Colors';
import Header from '../Components/Header/Header';
import {Dropdown} from 'react-native-element-dropdown';
import {Categories} from '../Constants/Category';
import Loader from '../Components/Loader/Loader';
import storage from '@react-native-firebase/storage';
import {
  launchImageLibrary,
  OptionsCommon,
  ImagePickerResponse,
} from 'react-native-image-picker';
import uuid from 'react-native-uuid';
import FBManager from '../Helpers/Firebase/FirebaseManager';
import {Schemas} from '../Constants/SchemaName';
import {
  isNonEmpty,
  isPositive,
  isPositiveInteger,
  validateName,
} from '../Helpers/Utility/UtilityManager';

const AddProduct = () => {
  const [product, setProduct] = useState({
    id: '',
    name: '',
    price: '',
    category: '',
    quantity: '',
  });
  const [productError, setProductError] = useState({
    idError: false,
    nameError: false,
    priceError: false,
    categoryError: false,
    quantityError: false,
  });
  const [isError, setIsError] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUri, setImageUri] = useState('' as string | undefined);
  const [process, setProcess] = useState('');

  const uploadImage = useCallback(
    async (id: string) => {
      try {
        if (!isNonEmpty(imageUri)) {
          Alert.alert('Error', 'Please select an image.');
        } else {
          setUploading(true);
          const reference = storage().ref(`/images/${product.category}/${id}`);

          // Put File
          const task = reference.putFile(imageUri.replace('file://', ''));

          task.on('state_changed', taskSnapshot => {
            setProcess(
              `${taskSnapshot.bytesTransferred} transferred 
           out of ${taskSnapshot.totalBytes}`,
            );
            console.log(
              `${taskSnapshot.bytesTransferred} transferred 
           out of ${taskSnapshot.totalBytes}`,
            );
          });
          task.then(() => {
            setUploading(false);
            Alert.alert('Success', 'Image uploaded to the bucket!', [
              {text: 'OK', onPress: () => onSuccess()},
            ]);
            setProcess('');
          });
        }
      } catch (error) {
        setUploading(false);
        console.error(error);
        Alert.alert('Error', 'An error occurred while uploading the image.');
      }
    },
    [imageUri, setUploading, product, setProcess],
  );

  const validateInputs = useCallback(() => {
    if (!validateName(product.name)) {
      setIsError(true);
      setProductError({
        idError: false,
        nameError: true,
        priceError: false,
        categoryError: false,
        quantityError: false,
      });
    } else if (!isPositive(parseInt(product.price))) {
      setIsError(true);
      setProductError({
        idError: false,
        nameError: false,
        priceError: true,
        categoryError: false,
        quantityError: false,
      });
    } else if (!isNonEmpty(product.category)) {
      setIsError(true);
      setProductError({
        idError: false,
        nameError: false,
        priceError: false,
        categoryError: true,
        quantityError: false,
      });
    } else if (!isPositiveInteger(parseInt(product.quantity))) {
      setIsError(true);
      setProductError({
        idError: false,
        nameError: false,
        priceError: false,
        categoryError: false,
        quantityError: true,
      });
    } else {
      setIsError(false);
      setProductError({
        idError: false,
        nameError: false,
        priceError: false,
        categoryError: false,
        quantityError: false,
      });
    }
  }, [product, setIsError, setProductError, productError]);

  const addProduct = useCallback(async () => {
    if (!isError && isNonEmpty(imageUri)) {
      const id: string = uuid.v4().toString();
      const modifiedProduct = {
        ...product,
        price: parseFloat(product.price),
        quantity: parseInt(product.quantity),
      };
      setProduct({...product, id: id});
      await uploadImage(id);
      await FBManager.Add(Schemas.Product, id, {...modifiedProduct, id: id});
    } else {
      Alert.alert('Error', 'Please check if any field is missing');
    }
  }, [setProduct, product, isError, uploadImage, FBManager, imageUri]);

  const selectImage = useCallback(async () => {
    try {
      setUploading(true);
      const options: OptionsCommon = {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
      };

      const result: ImagePickerResponse | undefined = await launchImageLibrary(
        options,
      );
      setImageUri(result?.assets?.[0]?.uri);
      setUploading(false);
    } catch (error) {
      setImageUri('');
      Alert.alert('Error', 'Some error occured.');
    }
  }, [setImageUri, setUploading]);

  const onSuccess = useCallback(() => {
    setProduct({id: '', name: '', price: '', category: '', quantity: ''});
    setImageUri('');
  }, [setImageUri]);

  return (
    <View style={styles.container}>
      <Header title={'Dashboard'} leftIcon={'true'} />
      <ScrollView style={styles.container}>
        <View style={styles.listContainer}>
          <CustomTextInput
            value={product.name}
            onChangeText={val => {
              setProduct({...product, name: val});
              validateInputs();
            }}
            placeholder={'Name: '}
            isError={productError.nameError}
            errorText={'Please enter correct name'}
          />
          <CustomTextInput
            value={product.price}
            onChangeText={val => {
              setProduct({...product, price: val});
              validateInputs();
            }}
            placeholder={'Price: '}
            isError={productError.priceError}
            errorText={'Please enter correct price'}
          />
          <Dropdown
            data={Categories}
            maxHeight={400}
            labelField={'label'}
            valueField={'key'}
            value={product.category}
            onChange={item => {
              setProduct({...product, category: item.key});
              setIsFocus(false);
              validateInputs();
            }}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            placeholder={!isFocus ? 'Select item' : '...'}
            style={styles.dropdown}
            placeholderStyle={styles.dropdownPlaceholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            iconColor={Colors.primary}
          />
          <CustomTextInput
            value={product.quantity}
            onChangeText={val => {
              setProduct({...product, quantity: val});
              validateInputs();
            }}
            placeholder={'Quantity: '}
            isError={productError.quantityError}
            errorText={'Please enter correct quantity'}
          />
          <View style={styles.imageContainer}>
            {imageUri && (
              <View style={styles.imageBlock}>
                <Image source={{uri: imageUri}} style={styles.image} />
              </View>
            )}
            <TouchableOpacity
              style={styles.button}
              onPress={() => selectImage()}>
              <Text style={styles.buttonText}>{'Select Photo'}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={addProduct}>
            <Text style={styles.buttonText}>{'Add'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      {uploading && <Loader isLoading={uploading} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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

export default AddProduct;
