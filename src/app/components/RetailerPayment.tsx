"use client"
import React, { useEffect, useState } from 'react'
import { toast } from "react-toastify";
import { useAppSelector } from '@/app/store';
import Select from "react-select";

const RetailerPayment = () => {
  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [pending, setPending] = useState(false);
  const [date, setDate] = useState("");
  const [maxDate, setMaxDate] = useState('');
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    setMaxDate(formattedDate);
    setDate(formattedDate);
  }, []);
  const [retailerName, setRetailerName] = useState("");
  const [retailerNote, setRetailerNote] = useState("");
  const [retailerAmount, setRetailerAmount] = useState("");

  const handleRetailerSubmit = async (e: any) => {
    e.preventDefault();
    if (!retailerName || !retailerNote || !retailerAmount) {
      toast.warning("Item is empty !");
      return;
    }
    setPending(true);
    try {
      const response = await fetch(`${apiBaseUrl}/paymentApi/retailerPayment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, retailerName, amount: retailerAmount, note: retailerNote, username }),
      });

      if (response.ok) {
        toast.success("Amount added successfully !");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Invalid transaction !")
    } finally {
      setPending(false);
      setRetailerNote("");
      setRetailerAmount("");
    }
  };

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
  }, [apiBaseUrl, username]);
  return (
    <div className='flex flex-col gap-3 items-center justify-center'>
      
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text-alt">DATE</span>
          </div>
          <input type="date" name="date" onChange={(e: any) => setDate(e.target.value)} max={maxDate} value={date} className="border rounded-md p-2 mt-1.5 bg-white text-black  w-full max-w-xs h-[40px]" />
        </label>
     
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text-alt">PICK RETAILER</span>
          </div>
          <Select className="text-black h-[38px] w-full max-w-xs" onChange={(selectedOption: any) => setRetailerName(selectedOption.value)} options={retailerOption} />
        </label>
     
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text-alt">NOTE / MONEY RECEPT NO</span>
          </div>
          <input type="text" name='retailerNote' autoComplete='retailerNote' value={retailerNote} onChange={(e) => setRetailerNote(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
        </label>
     
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text-alt">PAYMENT AMOUNT</span>
          </div>
          <input type="number" value={retailerAmount} onChange={(e) => setRetailerAmount(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
        </label>
      
        <label className="form-control w-full max-w-xs">
          <button onClick={handleRetailerSubmit} className="btn btn-success btn-outline max-w-xs" disabled={pending} >{pending ? "Submitting..." : "SUBMIT"}</button>
        </label>

    </div>
  )
}

export default RetailerPayment