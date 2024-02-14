import React from 'react'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import { getOrderStatus } from '../lib/helpers'

const recentOrderData = [
    {
        id: '1',
        unit_id: '4324',
        client_id: '23143',
        client_name: 'Shirley A. Lape',
        order_date: '2022-05-17T03:24:00',
        order_total: '$435.50',
        current_order_status: 'Payed',
        payment_plan: false,
        address: '123 Main St, Cityville, CA 12345'
    },
    {
        id: '7',
        unit_id: '7453',
        client_id: '96453',
        client_name: 'Ryan Carroll',
        order_date: '2022-05-14T05:24:00',
        order_total: '$96.35',
        current_order_status: 'Payed',
        payment_plan: false,
        address: '456 Oak St, Townsville, CA 67890'
    },
    {
        id: '2',
        unit_id: '5434',
        client_id: '65345',
        client_name: 'Mason Nash',
        order_date: '2022-05-17T07:14:00',
        order_total: '$836.44',
        current_order_status: 'Payment Plan',
        payment_plan: true,
        address: '789 Pine St, Villageland, CA 54321'
    },
    {
        id: '3',
        unit_id: '9854',
        client_id: '87832',
        client_name: 'Luke Parkin',
        order_date: '2022-05-16T12:40:00',
        order_total: '$334.50',
        current_order_status: 'Payed',
        payment_plan: false,
        address: '101 Elm St, Suburbia, CA 13579'
    },
    {
        id: '4',
        unit_id: '8763',
        client_id: '09832',
        client_name: 'Anthony Fry',
        order_date: '2022-05-14T03:24:00',
        order_total: '$876.00',
        current_order_status: 'Payment Plan',
        payment_plan: true,
        address: '202 Maple St, Countryside, CA 24680'
    },
    {
        id: '5',
        unit_id: '5627',
        client_id: '97632',
        client_name: 'Ryan Carroll',
        order_date: '2022-05-14T05:24:00',
        order_total: '$96.35',
        current_order_status: 'Payed',
        payment_plan: false,
        address: '303 Birch St, Hamlet, CA 97531'
    }
]

export default function RecentOrders() {
    return (
        <div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1">
            <strong className="text-gray-700 font-medium">Recent Orders</strong>
            <div className="border-x border-gray-200 rounded-sm mt-3">
                <table className="w-full text-gray-700">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Unit ID</th>
                            <th>client Name</th>
                            <th>Order Date</th>
                            <th>Order Total</th>
                            <th> Address</th>
                            <th>Order Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentOrderData.map((order) => (
                            <tr key={order.id}>
                                <td>
                                    <Link to={`/order/${order.id}`}>#{order.id}</Link>
                                </td>
                                <td>
                                    <Link to={`/product/${order.product_id}`}>#{order.unit_id}</Link>
                                </td>
                                <td>
                                    <Link to={`/customer/${order.customer_id}`}>{order.client_name}</Link>
                                </td>
                                <td>{format(new Date(order.order_date), 'dd MMM yyyy')}</td>
                                <td>{order.order_total}</td>
                                <td>{order.address}</td>
                                <td>{getOrderStatus(order.current_order_status)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
