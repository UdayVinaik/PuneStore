import { call, put, takeLatest } from "redux-saga/effects";
import { GET_ALL_IMAGES_FROM_STORAGE, GET_LIST_OF_PRODUCTS } from "../../Constants/ActionTypes";
import FBManager from "../../Helpers/Firebase/FirebaseManager";
import { Schemas } from "../../Constants/SchemaName";
import { Product } from "../../Constants/Types";
import { setListProductsErrorAction, setListProductsSuccessAction } from "../Slices/ProductSlice";

export const getListProducts = async () => {
    try {
        const result = await FBManager.ReadAll(Schemas.Product);
        return result;
    } catch (error) {
        console.log('Error ==', error);
    }
}

export function* workerProductSaga(payload: any) {
    try {
        const result: Product[] = yield call(getListProducts);
        yield put(setListProductsSuccessAction(result));
        yield put({type: GET_ALL_IMAGES_FROM_STORAGE})

    }
    catch(error) {
        console.log('Error ==', error);
        yield put(setListProductsErrorAction(error));
    }

}

export function* watcherProductSaga() {
    yield takeLatest(GET_LIST_OF_PRODUCTS, workerProductSaga)
}