import React, {useCallback, useEffect, useRef} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../Components/Header/Header';
import {Colors} from '../Theme/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {selectOrders} from '../Storage/Slices/OrderSlice';
import {Order, RootStackParamListType} from '../Constants/Types';
import CustomIcon from '../Components/Icon/Icon';
import {
  ParamListBase,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScreenNames} from '../Constants/ScreenName';
import {isNonEmpty} from '../Helpers/Utility/UtilityManager';
import {GET_ORDER_LIST} from '../Constants/ActionTypes';
import CustomImageBackground from '../Components/CustomImageBackground/CustomImageBackground';

const Orders = () => {
  const isFirstUpdate = useRef(true);
  const orders = useSelector(selectOrders);
  const {navigate, setParams} =
    useNavigation<NativeStackNavigationProp<ParamListBase, string>>();
  const route = useRoute<RouteProp<RootStackParamListType, 'Orders'>>();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isFirstUpdate.current) {
      if (route.params?.isFromUpdateOrder) {
        dispatch({type: GET_ORDER_LIST});
        setParams({isFromUpdateOrder: false});
      }
    } else {
      isFirstUpdate.current = false;
    }
  }, [route.params?.isFromUpdateOrder]);

  const onPressOrder = useCallback(
    (item: Order) => {
      if (route?.params?.isFromStoreDashboard) {
        navigate(ScreenNames.StoreOrderDetails, {
          order: item,
        });
      } else {
        navigate(ScreenNames.OrderDetails, {order: item});
      }
    },
    [navigate],
  );
  const renderItem = (item: Order) => {
    return (
      <TouchableOpacity
        style={styles.orderContainer}
        key={item.id}
        onPress={() => onPressOrder(item)}>
        <View style={styles.textContainer}>
          <Text style={[styles.text, styles.orderId]}>
            {'Order Id: '} {item.id}
          </Text>
          <Text style={styles.text}>
            {'Status: '} <Text style={styles.orderStatus}>{item.status}</Text>
          </Text>
        </View>
        <View style={styles.iconContainer}>
          <CustomIcon name={'arrow-right'} color={Colors.black} />
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <CustomImageBackground>
      <Header title={'Orders'} leftIcon={'true'} />
      <ScrollView style={styles.listContainer}>
        {!isNonEmpty(orders) && (
          <View style={styles.emptyTextContainer}>
            <Text style={styles.emptyText}>
              {'There are no orders placed by you currently.'}
            </Text>
          </View>
        )}
        {orders?.map((item: Order) => {
          return renderItem(item);
        })}
      </ScrollView>
    </CustomImageBackground>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    marginTop: 40,
    marginHorizontal: 20,
  },
  orderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
    marginTop: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  iconContainer: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 0.8,
  },
  text: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  orderStatus: {
    color: Colors.accent,
    fontWeight: '700',
  },
  orderId: {
    paddingBottom: 10,
  },
  emptyText: {
    fontSize: 20,
    color: Colors.whiteText,
    fontWeight: '700',
  },
  emptyTextContainer: {
    marginHorizontal: 10,
    marginVertical: 20,
    backgroundColor: Colors.primary,
    padding: 10,
  },
});

export default Orders;
