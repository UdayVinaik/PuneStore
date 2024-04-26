import { call, put, select, takeLatest } from "redux-saga/effects";
import { GET_ALL_IMAGES_FROM_STORAGE } from "../../Constants/ActionTypes";
import storage from '@react-native-firebase/storage';
import { selectListProducts } from "../Slices/ProductSlice";
import { Product } from "../../Constants/Types";
import { setImageURLsListSuccessAction } from "../Slices/ImageSlice";

const fetchImages = async (products: Product[]) => {
    try {
      const urls = await Promise.all(products.map(async (product: Product) => {
        const url = await storage().ref(`images/${product.category}/${product.id}`).getDownloadURL();
        return url;
      }));
      return urls;

    } catch (error) {
      console.error('Error downloading images:', error);
    }
  };

export function* workerImageSaga() {
    try {
        const products: Product[] = yield select(selectListProducts);
        const urls: string[] = yield call(fetchImages, products);
        yield put(setImageURLsListSuccessAction(urls));
    }
    catch(error) {
        console.log('Error ==', error);
    }
}

export function* watcherImageSaga() {
    yield takeLatest(GET_ALL_IMAGES_FROM_STORAGE, workerImageSaga)
}