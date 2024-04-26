import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {ScreenNames} from '../../Constants/ScreenName';
import LoginScreen from '../../Screens/LoginScreen';
import HomeScreen from '../../Screens/HomeScreen';
import StoreDashboard from '../../Screens/StoreDashboard';
import AddProduct from '../../Screens/AddProduct';
import ProductList from '../../Screens/ProductList';
import ProductsByCategory from '../../Screens/ProductsByCategory';
import Cart from '../../Screens/Cart';
import UserDetails from '../../Screens/UserDetails';
import Orders from '../../Screens/Orders';
import OrderDetails from '../../Screens/OrderDetails';
import StoreOrderDetails from '../../Screens/StoreOrderDetails';

const Stack = createNativeStackNavigator();

const Routes = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name={ScreenNames.LoginScreen} component={LoginScreen} />
        <Stack.Screen name={ScreenNames.HomeScreen} component={HomeScreen} />
        <Stack.Screen
          name={ScreenNames.StoreDashboard}
          component={StoreDashboard}
        />
        <Stack.Screen name={ScreenNames.AddProduct} component={AddProduct} />
        <Stack.Screen name={ScreenNames.ProductList} component={ProductList} />
        <Stack.Screen
          name={ScreenNames.ProductsByCategory}
          component={ProductsByCategory}
        />
        <Stack.Screen name={ScreenNames.Cart} component={Cart} />
        <Stack.Screen name={ScreenNames.UserDetails} component={UserDetails} />
        <Stack.Screen name={ScreenNames.Orders} component={Orders} />
        <Stack.Screen
          name={ScreenNames.OrderDetails}
          component={OrderDetails}
        />
        <Stack.Screen
          name={ScreenNames.StoreOrderDetails}
          component={StoreOrderDetails}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
