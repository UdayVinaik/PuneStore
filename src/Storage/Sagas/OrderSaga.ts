import { call, put, takeLatest } from "redux-saga/effects";
import { GET_ORDER_BY_ID, GET_ORDER_LIST, UPDATE_ORDER_STATUS } from "../../Constants/ActionTypes";
import FBManager from "../../Helpers/Firebase/FirebaseManager";
import { Schemas } from "../../Constants/SchemaName";
import { Order } from "../../Constants/Types";
import { setOrderListAction, setOrderListErrorAction } from "../Slices/OrderSlice";
import { OrderStatuses, OrderStatusesArray } from "../../Constants/Constants";

export const fetchOrders = async () => {
    try {
        const orders = await FBManager.ReadAll(Schemas.Order)
        return orders;
    } catch(error) {
        console.log('Error ==', error);
    }
}

export const fetchOrderByUid = async (id: string) => {
    try {
        const orders = await FBManager.Read(Schemas.Order, 'id' , id);
        return orders;
    } catch(error) {
        console.log('Error ==', error);
    }
}

export const updateOrderByUid = async (order: Order, orderStatus: OrderStatuses) => {
    try {
        console.log('aaaa ====')
        if(orderStatus === OrderStatusesArray[3]?.key) {
            await FBManager.Delete(Schemas.Order, order.id);
        }
        const result = await FBManager.Update(Schemas.Order, order.id, {status: orderStatus});
        return result;
    } catch(error) {
        console.log('Error ==', error);
    }
}

export function* workerOrderSaga({payload}: any) {
    try {
        if (payload?.id) {
            const orders: Order[] = yield call(fetchOrderByUid, payload?.id);
            yield put(setOrderListAction(orders))
        }
        else {
            const orders: Order[] = yield call(fetchOrders);
            yield put(setOrderListAction(orders))
        }
    } catch(error) {
        console.log('Error ====', error);
        yield put(setOrderListErrorAction(error))
    }
}

export function* updateOrderStatusSaga ({payload}: any) {
    try {
        const result: any = yield call(updateOrderByUid, payload?.order, payload?.orderStatus);
        console.log('result ====', result);
    } catch(error) {
        console.log('Error ====', error);
    }
}

export function* watcherOrderSaga() {
    yield takeLatest(GET_ORDER_LIST, workerOrderSaga);
    yield takeLatest(GET_ORDER_BY_ID, workerOrderSaga);
    yield takeLatest(UPDATE_ORDER_STATUS, updateOrderStatusSaga)
}