import React, {useMemo} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import Header from '../Components/Header/Header';
import {Colors} from '../Theme/Colors';
import {CartProduct} from '../Constants/Types';

interface OrderDetailsProps {
  route: any;
}

const OrderDetails = (props: OrderDetailsProps) => {
  const {order} = props.route?.params;
  const total = useMemo(() => {
    let totalAmount = 0;
    order?.products?.forEach((item: CartProduct) => {
      totalAmount += item.totalPrice;
    });
    return totalAmount;
  }, [order]);

  const renderProduct = (product: CartProduct) => {
    return (
      <View style={styles.productContainer} key={product.id}>
        <View>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.quantity}>
            {'Quantity: '}
            {product.quantity}
          </Text>
        </View>
        <View>
          <Text style={styles.price}>
            {product.totalPrice} {'Rs.'}
          </Text>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <Header title={'Order Details'} leftIcon={'true'} />
      <ScrollView style={styles.listContainer}>
        {order?.products?.map((product: CartProduct) => {
          return renderProduct(product);
        })}
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>{'Total amount: '}</Text>
          <Text style={styles.totalText}>
            {total} {'Rs.'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grey1,
  },
  listContainer: {
    flex: 1,
    marginTop: 40,
    marginHorizontal: 20,
  },
  productContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productName: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '400',
  },
  price: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '400',
  },
  quantity: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '400',
  },
  totalContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    paddingHorizontal: 30,
    marginTop: 10,
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalText: {
    fontSize: 20,
    fontWeight: '500',
    color: Colors.text,
  },
});

export default OrderDetails;
