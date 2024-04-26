export enum OrderStatuses {
    OrderPlaced = 'Order_Placed',
    OrderReceived = 'Order_Received',
    OrderPacked = 'Order_Packed',
    Deliverd = 'Delivered'
}

export const OrderStatusesArray = [
    {
        id: '1',
        label: 'Order Placed',
        key: OrderStatuses.OrderPlaced
    },
    {
        id: '2',
        label: 'Order Received',
        key: OrderStatuses.OrderReceived,
    },
    {
        id: '3',
        label: 'Order Packed',
        key: OrderStatuses.OrderPacked,
    },
    {
        id: '4',
        label: 'Delivered',
        key: OrderStatuses.Deliverd,
    },
]