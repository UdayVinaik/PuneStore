import { OrderStatuses } from "./Constants";

export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    quantity: number;
    imageURL?: string;
}

export interface CartProduct {
    id: string;
    name: string;
    price: number;
    category: string;
    quantity: number;
    imageURL?: string;
    totalPrice: number;
}

export interface Order {
    id: string;
    userDetails: UserDetails;
    products: CartProduct[],
    status: OrderStatuses;
}

export interface OrderStateType {
    listOrders: Order[] | null;
    loading: boolean;
    errors: string;
}

export interface ProductStateType {
    listProduct: Product[] | null ,
    loading: boolean;
    errors: string;
}

export interface SectionListItemType {
    title: string;
    data: any[];
}

export interface ImageURLsStateType {
    imageURLs: string[];
    loading: boolean;
    errors: string;
}

export interface ImageURLs {
    imageURLs: string[];
}

export interface Cart {
    id: string;
    userDetails: UserDetails,
    products: CartProduct[];
    errors: string;
}

export interface UserDetails {
    name: string;
    uid: string;
}

export type RootStackParamListType = {
    HomeScreen : {
        isFromUserDetails?: boolean,
    },
    Orders: {
        isFromStoreDashboard?: boolean;
        isFromUpdateOrder?: boolean;
    },
    LoginScreen: {
        isFromLogout?: boolean;
    }
}