import React, { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'

export default function Products() {
    const [products, setProducts] = useState([])

    useEffect(() => {
        // Function to retrieve data from IndexedDB
        const fetchDataFromIndexedDB = async () => {
            const request = indexedDB.open('ExcelDataDB', 1)

            request.onsuccess = (event) => {
                const db = event.target.result
                const transaction = db.transaction(['excelDataStore'], 'readonly')
                const store = transaction.objectStore('excelDataStore')

                // Get all data from the store
                const getAllRequest = store.getAll()

                getAllRequest.onsuccess = (event) => {
                    const data = event.target.result

                    if (data && data.length > 0) {
                        // Display the saved data in the table
                        setProducts(data[0].data)
                    }
                }
            }
        }

        // Fetch data from IndexedDB when the component mounts
        fetchDataFromIndexedDB()
    }, [])

    const handleFileChange = async (e) => {
        const file = e.target.files[0]

        if (file) {
            try {
                const data = await readFile(file)
                const workbook = XLSX.read(data, { type: 'array' })
                const sheetName = workbook.SheetNames[0]
                const sheet = workbook.Sheets[sheetName]
                const jsonData = XLSX.utils.sheet_to_json(sheet)
                setProducts(jsonData)

                // Store the data in IndexedDB for future use
                storeDataInIndexedDB(jsonData)
            } catch (error) {
                console.error('Error reading Excel file:', error.message)
            }
        }
    }

    const readFile = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = (e) => resolve(new Uint8Array(e.target.result))
            reader.onerror = (e) => reject(new Error('Unable to read the file.'))
            reader.readAsArrayBuffer(file)
        })
    }

    const storeDataInIndexedDB = (data) => {
        const request = indexedDB.open('ExcelDataDB', 1)

        request.onupgradeneeded = (event) => {
            const db = event.target.result
            db.createObjectStore('excelDataStore', { keyPath: 'id', autoIncrement: true })
        }

        request.onsuccess = (event) => {
            const db = event.target.result
            const transaction = db.transaction(['excelDataStore'], 'readwrite')
            const store = transaction.objectStore('excelDataStore')

            // Clear existing data and add the new data
            store.clear()
            store.add({ data })
        }
    }

    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-2xl font-semibold mb-4">Products</h1>
            <input type="file" onChange={handleFileChange} accept=".xlsx" />
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        {/* Add table headers based on your data structure */}
                        {Object.keys(products[0] || {}).map((key) => (
                            <th key={key} className="border border-gray-300 p-2">
                                {key}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {/* Add table rows based on your data structure */}
                    {products.map((product, index) => (
                        <tr key={index}>
                            {Object.values(product).map((value, i) => (
                                <td key={i} className="border border-gray-300 p-2">
                                    {value}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
