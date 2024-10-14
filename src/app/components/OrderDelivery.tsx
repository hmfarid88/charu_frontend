"use client"
import React, { useEffect, useState } from 'react'
import { RiDeleteBin6Line } from "react-icons/ri";
import Select from "react-select";
import { uid } from "uid";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { addProducts, deleteProduct, deleteAllProducts } from "@/app/store/deliverySlice";
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const OrderDelivery = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [pending, setPending] = useState(false);

    const dispatch = useAppDispatch();
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';

    const products = useAppSelector((state) => state.deliveryProducts.products);

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
    const [orderedQty, setOrderedQty] = useState("");
    const [orderId, setOrderId] = useState("");
    const [truckno, setTruckNo] = useState("");
    const router = useRouter();
    const invoiceNo = uid();
    
    const handleOrderSubmit = (e: any) => {
        e.preventDefault();
        if (!orderDate || !retailer || !productName || !saleRate || !orderQty || !orderNote) {
            toast.warning("Item is empty !");
            return;
        }
        const product = { id: uid(), orderId:0, date: orderDate, retailer, orderNote, productName, saleRate, orderQty, username }
        dispatch(addProducts(product));
        setOrderNote("")
        setSaleRate("")
        setOrderQty("")

    }
    const handleDeleteProduct = (id: any) => {
        dispatch(deleteProduct(id));
    };

    const productInfo = products.map(product => ({
        ...product,
        customer: product.retailer,
        dpRate:product.saleRate,
        productQty:product.orderQty,
        invoiceNo: invoiceNo,
        status:'sold',
        truckNo:truckno
    }));

    const handleFinalOrderSubmit = async (e: any) => {
        e.preventDefault();
        if (products.length === 0) {
            toast.warning("Sorry, your order list is empty!");
            return;
        }

        if (!truckno) {
            toast.warning("Truck no is required!");
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/api/productDistribution`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productInfo),
            });

            if (!response.ok) {
                const error = await response.json();
                toast.error(error.message);
            } else {
                dispatch(deleteAllProducts());
                setTruckNo('')
                toast.success("Product delivery successfull !");
                router.push(`/invoice?invoiceNo=${invoiceNo}`);
            }

        } catch (error) {
            toast.error("Invalid product item !")
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
                    label: item.retailerName
                }));
                setRetailerOption(transformedData);
            })
            .catch(error => console.error('Error fetching products:', error));

    }, [apiBaseUrl]);

    const [orderOption, setOrderOption] = useState([]);
    useEffect(() => {

        fetch(`${apiBaseUrl}/api/getExistingAllOrder`)
            .then(response => response.json())
            .then(data => {
                const transformedData = data.map((item: any) => ({
                    id: item.id,
                    value: item[0],
                    label: `${item[1]}, ${item[2]}, ${item[3]}`
                }));
                setOrderOption(transformedData);
            })
            .catch(error => console.error('Error fetching products:', error));

    }, [apiBaseUrl, username]);


    const handleSingleOrder = async (e: any) => {
        e.preventDefault();

        if (!orderId || !orderedQty) {
            toast.warning("Need to select order & quantity!");
            return;
        }
        try {
            const response = await fetch(`${apiBaseUrl}/api/getExistingSingleOrder?orderId=${orderId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const productData = data[0];
            if (productData.orderQty < orderedQty) {
                toast.warning("Sorry, not enough qty!");
                return;
            }
            const productToOrder = {
                id: uid(),
                orderId:productData.orderId,
                date: orderDate,
                retailer: productData.retailer,
                orderNote: productData.orderNote,
                productName: productData.productName,
                saleRate: productData.saleRate,
                orderQty: orderedQty,
                username: username

            };

            dispatch(addProducts(productToOrder));
            setOrderedQty("");
        } catch (error) {
            console.error('Error fetching product:', error);
        }

    };

    return (
        <div className="container w-full">
            <div className="flex items-center justify-center w-full"><a href="#my_modal_orderlist"><button className='btn btn-sm btn-outline btn-ghost'>ORDER LIST</button></a></div>
            <div className="flex flex-col md:flex-row gap-5 w-full">
                <div className="flex flex-col h-80 w-1/2 items-center gap-2">
                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text-alt">DELIVERY DATE</span>
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
                            <span className="label-text-alt">DELIVERY NOTE</span>
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
                            <span className="label-text-alt">SALE RATE</span>
                        </div>
                        <input type='number' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={saleRate} onChange={(e) => setSaleRate(e.target.value)} placeholder='00' />
                    </label>

                    <label className="form-control w-full max-w-xs">
                        <div className="label">
                            <span className="label-text-alt">QUANTITY</span>
                        </div>
                        <input type='number' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={orderQty} onChange={(e) => setOrderQty(e.target.value)} placeholder='00' />
                    </label>

                    <label className="form-control w-full max-w-xs pt-5">
                        <button onClick={handleOrderSubmit} className="btn btn-success rounded-md btn-sm h-[40px] w-full max-w-xs" >ADD PRODUCT</button>
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
                                    <th>Rate</th>
                                    <th>Qty</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products?.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.date}</td>
                                        <td>{item.retailer}</td>
                                        <td>{item.orderNote}</td>
                                        <td>{item.productName}</td>
                                        <td>{item.saleRate}</td>
                                        <td>{item.orderQty}</td>
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
                    <div className="flex flex-col items-center justify-center gap-3 pt-10">
                        <label className="form-control w-full max-w-xs">
                            <div className="label">
                                <span className="label-text-alt">TRUCK NO</span>
                            </div>
                            <input type='text' name='truck' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={truckno} onChange={(e) => setTruckNo(e.target.value)} placeholder='Type Here' />
                        </label>
                        <button onClick={handleFinalOrderSubmit} className="btn btn-success btn-sm w-full max-w-xs" disabled={pending} >{pending ? "Submitting..." : "SUBMIT ALL"}</button>
                    </div>
                </div>
                <div className="modal sm:modal-middle" role="dialog" id="my_modal_orderlist">
                    <div className="modal-box">
                        <div className="flex w-full h-72 p-2">
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text-alt">SELECT ORDER</span>
                                </div>
                                <Select className="text-black" name="retailer" onChange={(selectedOption: any) => setOrderId(selectedOption.value)} options={orderOption} />
                            </label>
                            <label className="form-control w-full max-w-xs">
                                <div className="label ml-3">
                                    <span className="label-text-alt">ORDER QTY</span>
                                </div>
                                <div className="flex gap-3">
                                    <input type="number" value={orderedQty} name="qty" onChange={(e: any) => setOrderedQty(e.target.value)} placeholder="Type here" className="input input-bordered w-[100px] h-[40px] ml-3 max-w-xs bg-white text-black border border-slate-400" />
                                    <button disabled={pending} onClick={handleSingleOrder} className="btn btn-sm btn-success h-[40px]">{pending ? "Adding..." : "ADD"}</button>
                                </div>
                            </label>
                        </div>
                        <div className="modal-action">
                            <a href="#" className="btn btn-square btn-ghost">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-10 h-10">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderDelivery