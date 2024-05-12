import createSagaMiddleware from "@redux-saga/core";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { all } from 'redux-saga/effects';
import  {watcherProductSaga}  from './Sagas/ProductSaga';
import {watcherImageSaga} from './Sagas/ImageSaga'
import productReducer from './Slices/ProductSlice';
import imageReducer from './Slices/ImageSlice';
import cartReducer from './Slices/CartSlice';
import orderReducer from './Slices/OrderSlice';
import globalReducer from './Slices/GlobalSlice';
import { watcherOrderSaga } from "./Sagas/OrderSaga";

function* rootSaga() {
    yield all([watcherProductSaga(), watcherImageSaga(), watcherOrderSaga()]);
}

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
    reducer: {
        product: productReducer,
        image: imageReducer,
        cart: cartReducer,
        order: orderReducer,
        global: globalReducer
    },
    middleware: () => [sagaMiddleware],
});

sagaMiddleware.run(rootSaga);
export default store;