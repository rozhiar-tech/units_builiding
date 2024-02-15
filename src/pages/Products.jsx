import React from 'react'
import { productData } from '../data/data'
const Products = () => {
    // Your data

    return (
        <div className="container mx-auto my-10">
            <table className="min-w-full bg-white border border-gray-300 shadow-md">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">وجهە</th>
                        <th className="py-2 px-4 border-b">قات</th>
                        <th className="py-2 px-4 border-b">رقم شقه</th>
                        <th className="py-2 px-4 border-b">متر</th>
                        <th className="py-2 px-4 border-b">سعر متر</th>
                        <th className="py-2 px-4 border-b">سعر كلي</th>
                    </tr>
                </thead>
                <tbody>
                    {productData.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                            <td className="py-2 px-4 border-b">{item.Column1}</td>
                            <td className="py-2 px-4 border-b">{item.قات}</td>
                            <td className="py-2 px-4 border-b">{item.رقم_شقه}</td>
                            <td className="py-2 px-4 border-b">{item.متر}</td>
                            <td className="py-2 px-4 border-b">{item.سعر_متر}</td>
                            <td className="py-2 px-4 border-b">{item.سعر_كلي}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Products
