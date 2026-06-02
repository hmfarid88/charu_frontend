"use client"
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { useSearchParams } from 'next/navigation';
import { useAppSelector } from '@/app/store';
import Select from "react-select";


const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [pending, setPending] = useState(false);
    const [maxDate, setMaxDate] = useState('');

    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        setMaxDate(formattedDate);
       
    }, []);
        const [date, setDate] = useState("");
        const [retailer, setRetailer] = useState("");
        const [productName, setProductName] = useState("");
        const [orderNote, setOrderNote] = useState("");
        const [orderQty, setOrderQty] = useState("");
        const [saleRate, setSaleRate] = useState("");
        

    useEffect(() => {
        if (!orderId) return;
        fetch(`${apiBaseUrl}/api/getSingleOrder/${orderId}`)
            .then(response => response.json())
            .then(data => {
                setDate(data.date);
                setRetailer(data.retailer);
                setProductName(data.productName);
                setOrderNote(data.orderNote);
                setOrderQty(data.orderQty);
                setSaleRate(data.saleRate);
            })
            .catch(error => console.error('Error fetching products:', error));

    }, [apiBaseUrl, orderId]);

    const handleUpdateSubmit = async (e: any) => {
        e.preventDefault();
        if (!date || !retailer || !productName || !orderNote || !orderQty || !saleRate) {
            toast.warning("Item is empty !")
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/api/updateOrderInfo/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ date, retailer, productName, orderNote, orderQty, saleRate }),
            });

            if (!response.ok) {
                const error = await response.json();
                toast.error(error.message);
             } else {
                toast.success("Information updated successfully.");

            }

        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setPending(false);

        }
    };
    const handleDeleteSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const response = await fetch(`${apiBaseUrl}/api/deleteOrderInfo/${orderId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },

            });

            if (!response.ok) {
                const error = await response.json();
                toast.error(error.message);
            } else {
                toast.success("Item deleted successfully.");

            }

        } catch (error: any) {
            toast.error(error.message)
        }
    }
    const [retailerOption, setRetailerOption] = useState([]);
    useEffect(() => {
        fetch(`${apiBaseUrl}/api/getRetailerInfo`)
            .then(response => response.json())
            .then(data => {
                const transformedData = data.map((item: any) => ({
                    id: item.id,
                    value: item.retailerName,
                    label: item.retailerName
                }));
                setRetailerOption(transformedData);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username]);

    const [itemOption, setItemOption] = useState([]);
        useEffect(() => {
    
            const fetchMadeProducts = () => {
                fetch(`${apiBaseUrl}/api/getProductName?username=${username}`)
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
    return (
        <div className='container-2xl min-h-screen pb-5'>
            <div className="flex flex-col w-full items-center justify-center p-2">

                <label className="form-control w-full max-w-xs pt-2">
                    <div className="label">
                        <span className="label-text-alt">DATE</span>
                    </div>
                    <div className="flex gap-2">
                        <input type='text' className='input input-md h-[40px] w-[50%] bg-white text-black border rounded-md border-slate-300' value={date} readOnly />
                        <input type='date' className='input input-bordered h-[40px] w-[50%] bg-white text-black' max={maxDate} onChange={(e) => setDate(e.target.value)} />
                    </div>
                </label>
                <label className="form-control w-full max-w-xs pt-2">
                    <div className="label">
                        <span className="label-text-alt">RETAILER</span>
                    </div>
                    <div className="flex justify-between gap-2">
                        <p className='capitalize w-[50%] p-2 bg-white text-black rounded-md'>{retailer}</p>
                        <Select className="text-black w-[50%]" name="retailer" onChange={(selectedOption: any) => setRetailer(selectedOption.value)} options={retailerOption} />
                    </div>
                </label>
                <label className="form-control w-full max-w-xs pt-2">
                    <div className="label">
                        <span className="label-text-alt">PRODUCT NAME</span>
                    </div>
                    <div className="flex justify-between gap-2">
                        <p className='capitalize w-[50%] p-2 bg-white text-black rounded-md'>{productName}</p>
                        <Select className="text-black w-[50%]" name="retailer" onChange={(selectedOption: any) => setProductName(selectedOption.value)} options={itemOption} />
                    </div>
                 
                </label>
                <label className="form-control w-full max-w-xs pt-2">
                    <div className="label">
                        <span className="label-text-alt">ORDER NOTE</span>
                    </div>
                    <input type='text' name='orderNote' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={orderNote} onChange={(e) => setOrderNote(e.target.value)} placeholder='Type Here' />
                </label>
                <label className="form-control w-full max-w-xs pt-2">
                    <div className="label">
                        <span className="label-text-alt">SALE PRICE</span>
                    </div>
                    <input type='number' step="any" name='rate' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={saleRate} onChange={(e) => setSaleRate(e.target.value)} placeholder='Type Here' />
                </label>
                <label className="form-control w-full max-w-xs pt-2">
                    <div className="label">
                        <span className="label-text-alt">ORDER QTY</span>
                    </div>
                    <input type='number' step="any" name='rate' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={orderQty} onChange={(e) => setOrderQty(e.target.value)} placeholder='Type Here' />
                </label>
                <label className="form-control w-full max-w-xs pt-5">
                    <button
                        className="btn btn-success w-full"
                        onClick={(e) => {
                            if (window.confirm("Are you sure you want to update this item?")) {
                                handleUpdateSubmit(e);
                            }
                        }}
                        disabled={pending}
                    >
                        {pending ? "Updating..." : "UPDATE"}
                    </button>
                </label>
            </div>
            <div className="flex items-center justify-center p-2">
                <label className="form-control w-full max-w-xs pt-5">
                    <button className="btn btn-error"
                        onClick={(e) => {
                            if (window.confirm("Are you sure you want to delete this item?")) {
                                handleDeleteSubmit(e);
                            }
                        }}

                    >
                        DELETE THIS ITEM
                    </button>

                </label>
            </div>
        </div>
    )
}

export default Page