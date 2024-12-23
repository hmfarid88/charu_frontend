"use client"
import React, { useEffect, useState } from 'react'
import { RiDeleteBin6Line } from "react-icons/ri";
import Select from "react-select";
import { uid } from "uid";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { addProducts, deleteProduct, deleteAllProducts } from "@/app/store/orderSlice";
import { toast } from 'react-toastify';

const OrderCreate = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [pending, setPending] = useState(false);

    const dispatch = useAppDispatch();
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';

    const orderProducts = useAppSelector((state) => state.orderProducts.products);
    const filteredProducts = orderProducts.filter((p) => p.username === username);

    const [maxDate, setMaxDate] = useState('');
    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        setMaxDate(formattedDate);
        setOrderDate(formattedDate)
    }, []);

    const [orderDate, setOrderDate] = useState("");
    const [retailer, setRetailer] = useState("");
    const [productName, setProductName] = useState("");
    const [saleRate, setSaleRate] = useState("");
    const [orderQty, setOrderQty] = useState("");
    const [orderNote, setOrderNote] = useState("");

    const handleOrderSubmit = (e: any) => {
        e.preventDefault();
        if (!orderDate || !retailer || !productName || !saleRate || !orderQty || !orderNote) {
            toast.warning("Item is empty !");
            return;
        }
        const product = { id: uid(), date: orderDate, retailer, orderNote, productName, saleRate, orderQty, deliveredQty: 0, username }
        dispatch(addProducts(product));
        setOrderNote("")
        setSaleRate("")
        setOrderQty("")

    }
    const handleDeleteProduct = (id: any) => {
        dispatch(deleteProduct(id));
    };

    const handleFinalOrderSubmit = async (e: any) => {
        e.preventDefault();
        if (filteredProducts.length === 0) {
            toast.warning("Sorry, your order list is empty!");
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/api/addAllOrders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(filteredProducts),
            });

            if (!response.ok) {
                const error = await response.json();
                toast.error(error.message);
            } else {
                dispatch(deleteAllProducts());
                toast.success("Order added successfully !");
            }

        } catch (error) {
            toast.error("Invalid order item !")
        } finally {
            setPending(false);
        }
    };

    const [itemOption, setItemOption] = useState([]);
    useEffect(() => {

        const fetchMadeProducts = () => {
            fetch(`${apiBaseUrl}/api/getProductName`)
                .then(response => response.json())
                .then(data => {
                    const transformedData = data.map((product: any) => ({
                        value: product.productName,
                        label: product.productName
                    }));
                    setItemOption(transformedData);
                })
                .catch(error => console.error('Error fetching products:', error));
        };

        // Fetch data initially
        fetchMadeProducts();
    }, [apiBaseUrl, username]);

    const [retailerOption, setRetailerOption] = useState([]);
    useEffect(() => {

        fetch(`${apiBaseUrl}/api/getRetailerInfo`)
            .then(response => response.json())
            .then(data => {
                const transformedData = data.map((item: any) => ({
                    id: item.id,
                    value: item.retailerName,
                    label: `${item.retailerName} (${item.retailerCode})`
                }));
                setRetailerOption(transformedData);
            })
            .catch(error => console.error('Error fetching products:', error));

    }, [apiBaseUrl]);
    return (
        <div className="container w-full">
            <div className="flex flex-col md:flex-row gap-5 w-full items-center p-3">
                <div className="flex flex-col min-h-80 w-1/2 items-center gap-2">
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text-alt">ORDER DATE</span>
                        </div>
                        <input type="date" name="date" onChange={(e: any) => setOrderDate(e.target.value)} max={maxDate} value={orderDate} className="border rounded-md p-2 mt-1.5 bg-white text-black  w-full max-w-xs h-[40px]" />
                    </label>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text-alt">RETAILER NAME</span>
                        </div>
                        <Select className="text-black" name="retailer" onChange={(selectedOption: any) => setRetailer(selectedOption.value)} options={retailerOption} />
                    </label>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text-alt">ORDER NOTE</span>
                        </div>
                        <input type='text' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={orderNote} onChange={(e) => setOrderNote(e.target.value)} placeholder='Type Here' />
                    </label>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text-alt">PRODUCT NAME</span>
                        </div>
                        <Select className="text-black" name="pname" onChange={(selectedOption: any) => setProductName(selectedOption.value)} options={itemOption} />

                    </label>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text-alt">QUANTITY</span>
                        </div>
                        <input type='number' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={orderQty} onChange={(e) => setOrderQty(e.target.value)} placeholder='00' />
                    </label>
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text-alt">SALE RATE</span>
                        </div>
                        <input type='number' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={saleRate} onChange={(e) => setSaleRate(e.target.value)} placeholder='00' />
                    </label>

                    <label className="form-control w-full max-w-xs pt-5">
                        <button onClick={handleOrderSubmit} className="btn btn-success rounded-md btn-sm h-[40px] w-full max-w-xs" >ADD ORDER</button>
                    </label>
                </div>

                <div className="flex flex-col w-1/2 items-center p-5">
                    <div className="overflow-x-auto h-auto">
                        <table className="table table-pin-rows table-xs">
                            <thead>
                                <tr className="font-bold">
                                    <th>SN</th>
                                    <th>Date</th>
                                    <th>Retailer</th>
                                    <th>Note</th>
                                    <th>Products</th>
                                    <th>Qty</th>
                                    <th>Rate</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts?.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.date}</td>
                                        <td>{item.retailer}</td>
                                        <td>{item.orderNote}</td>
                                        <td>{item.productName}</td>
                                        <td>{item.orderQty}</td>
                                        <td>{item.saleRate}</td>
                                        
                                        <td>
                                            <button onClick={() => {
                                                handleDeleteProduct(item.id);
                                            }} className="btn-xs rounded-md btn-outline btn-error"><RiDeleteBin6Line size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                    </div>
                    <div className="flex items-center justify-center pt-10">
                        <button onClick={handleFinalOrderSubmit} className="btn btn-success btn-outline btn-sm max-w-xs" disabled={pending} >{pending ? "Submitting..." : "SUBMIT ALL"}</button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default OrderCreate