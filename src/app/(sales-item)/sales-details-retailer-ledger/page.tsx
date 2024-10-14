'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import { FcPrint } from "react-icons/fc";
import { useReactToPrint } from 'react-to-print';
import { useSearchParams } from "next/navigation";

type Product = {
    date: string;
    productName: string;
    productValue: number;
    payment: number;
    commission: number;
    balance: number;
};


const Page = () => {

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';

    const searchParams = useSearchParams();
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const retailerName = searchParams.get('retailerName');

    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });
    const [filterCriteria, setFilterCriteria] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [allProducts, setAllProducts] = useState<Product[]>([]);


    useEffect(() => {
        fetch(`${apiBaseUrl}/retailer/sales-datewise-details?retailerName=${retailerName}&salesPerson=${username}&startDate=${startDate}&endDate=${endDate}`)
            .then(response => response.json())
            .then(data => {
                setAllProducts(data);
                setFilteredProducts(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username, retailerName, startDate, endDate]);


    useEffect(() => {
        const filtered = allProducts.filter(product =>
            (product.date.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
            (product.productName.toLowerCase().includes(filterCriteria.toLowerCase()) || '')
        );
        setFilteredProducts(filtered);
    }, [filterCriteria, allProducts]);

    const handleFilterChange = (e: any) => {
        setFilterCriteria(e.target.value);
    };

    const totalQty = filteredProducts.reduce((total, product) => {
        return total + product.balance;
    }, 0);

    return (
        <div className="container-2xl">
            <div className="flex flex-col w-full min-h-[calc(100vh-228px)] p-4 items-center justify-center">
                <div className="flex w-full justify-between pl-5 pr-5 pt-1">
                    <label className="input input-bordered flex max-w-xs  items-center gap-2">
                        <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                            <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                        </svg>
                    </label>
                    <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
                </div>
                <div className="overflow-x-auto">
                    <div ref={contentToPrint} className="flex-1 p-5">
                        <div className="flex flex-col items-center pb-5"><h4 className="font-bold">RETAILER LEDGER</h4>
                            <h4 className="font-bold capitalize">Retailer : {retailerName}</h4>
                            <h4>{startDate} TO {endDate}</h4>
                        </div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>SN</th>
                                    <th>DATE</th>
                                    <th>PRODUCT NAME</th>
                                    <th>PRODUCT VALUE</th>
                                    <th>PAYMENT</th>
                                    <th>COMMISSION</th>
                                    <th>BALANCE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts?.map((product, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{product?.date}</td>
                                        <td>{product?.productName}</td>
                                        <td>{Number(product?.productValue.toFixed(2)).toLocaleString('en-IN')}</td>
                                        <td>{Number(product?.payment.toFixed(2)).toLocaleString('en-IN')}</td>
                                        <td>{Number(product?.commission.toFixed(2)).toLocaleString('en-IN')}</td>
                                        <td>{Number(product?.balance.toFixed(2)).toLocaleString('en-IN')}</td>

                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="font-semibold text-lg">
                                    <td colSpan={5}></td>
                                    <td>TOTAL</td>
                                    <td>{totalQty.toLocaleString('en-IN')}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Page