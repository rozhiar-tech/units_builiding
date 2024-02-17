import React, { useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    InputAdornment,
    IconButton,
    TableSortLabel
} from '@mui/material'
import { Search } from '@mui/icons-material'
import { productData } from '../data/data'

const Products = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [sortField, setSortField] = useState('')
    const [sortOrder, setSortOrder] = useState('asc')

    const handleSearch = (e) => {
        setSearchTerm(e.target.value)
    }

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortOrder('asc')
        }
    }

    const filteredData = productData.filter((item) =>
        Object.values(item).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase()))
    )

    const sortedData = filteredData.sort((a, b) => {
        const aValue = String(a[sortField] || '') // Ensure a string value
        const bValue = String(b[sortField] || '') // Ensure a string value

        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    })

    return (
        <div className="container mx-auto my-10">
            <TextField
                label="Search"
                variant="outlined"
                fullWidth
                margin="normal"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <IconButton>
                                <Search />
                            </IconButton>
                        </InputAdornment>
                    )
                }}
                onChange={handleSearch}
            />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={sortField === 'Column1'}
                                    direction={sortOrder}
                                    onClick={() => handleSort('Column1')}
                                >
                                    وجهە
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel active={sortField === 'قات'} direction={sortOrder}>
                                    قات
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortField === 'رقم_شقه'}
                                    direction={sortOrder}
                                    onClick={() => handleSort('رقم_شقه')}
                                >
                                    رقم شقه
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortField === 'متر'}
                                    direction={sortOrder}
                                    onClick={() => handleSort('متر')}
                                >
                                    متر
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortField === 'سعر_متر'}
                                    direction={sortOrder}
                                    onClick={() => handleSort('سعر_متر')}
                                >
                                    سعر متر
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortField === 'سعر_كلي'}
                                    direction={sortOrder}
                                    onClick={() => handleSort('سعر_كلي')}
                                >
                                    سعر كلي
                                </TableSortLabel>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedData.map((item, index) => (
                            <TableRow key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                                <TableCell>{item.Column1}</TableCell>
                                <TableCell>{item.قات}</TableCell>
                                <TableCell>{item.رقم_شقه}</TableCell>
                                <TableCell>{item.متر}</TableCell>
                                <TableCell>{item.سعر_متر}</TableCell>
                                <TableCell>{item.سعر_كلي}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default Products
