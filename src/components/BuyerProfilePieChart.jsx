import React, { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'
import { collection, getDocs, firestore } from '../firebase/initFirebase'
import { useTranslation } from 'react-i18next'
import { productData } from '../data/data'
const RADIAN = Math.PI / 180
const COLORS = ['#00C49F', '#FFBB28', '#FF8042']

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    )
}

const BuyerProfilePieChart = () => {
    const [chartData, setChartData] = useState([])
    const { t } = useTranslation()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersCollection = collection(firestore, 'Users')
                const usersSnapshot = await getDocs(usersCollection)

                const meterCounts = {
                    152: 0,
                    203: 0
                }

                usersSnapshot.forEach((doc) => {
                    const propertyCode = doc.data().propertyCode
                    const matchedProductDetail = productData.find((product) => product.رقم_شقه === propertyCode)

                    if (matchedProductDetail && [152, 203].includes(matchedProductDetail.متر)) {
                        // console.log('matchedProductDetail', matchedProductDetail)
                        meterCounts[matchedProductDetail.متر]++
                    }
                })

                const data = Object.keys(meterCounts).map((meter) => ({
                    name: `${meter} متر`,
                    value: meterCounts[meter]
                }))
                console.log(data)
                setChartData(data)
            } catch (error) {
                console.error('Error fetching data for BuyerProfilePieChart:', error.message)
            }
        }

        fetchData()
    }, [])

    return (
        <div className="w-[20rem] h-[22rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col">
            <strong className="text-gray-700 font-medium">{t('transactions.pmeter')}</strong>
            <div className="mt-3 w-full flex-1 text-xs">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart width={400} height={300}>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="45%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={105}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {chartData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default BuyerProfilePieChart
