import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './header'
import Sidebar from './sidebar'

const ProductPage = () => {
    return (
        <div>
            <Header />
            <div className="flex ">
                <Sidebar />
                <Outlet />
            </div>
        </div>
    )
}

export default ProductPage