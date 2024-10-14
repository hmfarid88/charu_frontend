"use client"
import React, { useEffect, useState } from 'react'
import Select from "react-select";
import { toast } from 'react-toastify';

const AddRetailer = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const [pending, setPending] = useState(false);
    const [retailerName, setRetailerName] = useState("");
    const [thanaName, setThanaName] = useState("");
    const [zillaName, setZillaName] = useState("");
    const [areaName, setAreaName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [salesPerson, setSalesPerson] = useState("");

    const handleRetailerSubmit = async (e: any) => {
        e.preventDefault();
        if (!retailerName || !thanaName || !zillaName || !areaName || !mobileNumber || !salesPerson) {
            toast.warning("Item is empty !")
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/api/addRetailerInfo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ retailerName, thanaName, zillaName, areaName, mobileNumber, salesPerson }),
            });

            if (!response.ok) {
                const error = await response.json();
                toast.error(error.message);
            } else {
                toast.success("Retailer added successfully !");
            }

        } catch (error) {
            toast.error("Invalid retailer item !")
        } finally {
            setPending(false);
            setRetailerName("")
            setThanaName("")
            setZillaName("")
            setAreaName("")
            setMobileNumber("")
            setSalesPerson("")
        }
    };
    const [personOption, setPersonOption] = useState([]);
    useEffect(() => {

        fetch(`${apiBaseUrl}/api/getEmployeeInfo`)
            .then(response => response.json())
            .then(data => {
                const transformedData = data.map((item: any) => ({
                    id: item.id,
                    value: item.employeeName,
                    label: item.employeeName
                }));
                setPersonOption(transformedData);
            })
            .catch(error => console.error('Error fetching products:', error));

    }, [apiBaseUrl]);
    return (
        <div className='container'>
            <div className="flex flex-col w-full items-center p-5">
                <label className="form-control w-full max-w-xs pt-2">
                    <div className="label">
                        <span className="label-text-alt">RETAILER NAME</span>
                    </div>
                    <input type='text' name='retailer' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={retailerName} onChange={(e) => setRetailerName(e.target.value)} placeholder='Type Here' />
                </label>
                <label className="form-control w-full max-w-xs pt-2">
                    <div className="label">
                        <span className="label-text-alt">THANA NAME</span>
                    </div>
                    <input type='text' name='thana' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={thanaName} onChange={(e) => setThanaName(e.target.value)} placeholder='Type Here' />
                </label>
                <label className="form-control w-full max-w-xs pt-2">
                    <div className="label">
                        <span className="label-text-alt">ZILLA NAME</span>
                    </div>
                    <input type='text' name='zilla' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={zillaName} onChange={(e) => setZillaName(e.target.value)} placeholder='Type Here' />
                </label>
                <label className="form-control w-full max-w-xs pt-2">
                    <div className="label">
                        <span className="label-text-alt">AREA NAME</span>
                    </div>
                    <input type='text' name='area' className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={areaName} onChange={(e) => setAreaName(e.target.value)} placeholder='Type Here' />
                </label>
                <label className="form-control w-full max-w-xs pt-2">
                    <div className="label">
                        <span className="label-text-alt">MOBILE NUMBER</span>
                    </div>
                    <input type='text' maxLength={11} minLength={11} className='input input-md h-[40px] bg-white text-black border rounded-md border-slate-300' value={mobileNumber} onChange={(e: any) => setMobileNumber(e.target.value.replace(/\D/g, ""))} placeholder='Type Here' />
                </label>
                <label className="form-control w-full max-w-xs pt-2">
                    <div className="label">
                        <span className="label-text-alt">SALES PERSON</span>
                    </div>
                    <Select className="text-black" name="sales person" onChange={(selectedOption: any) => setSalesPerson(selectedOption.value)} options={personOption} />
                    
                </label>
                <label className="form-control w-full max-w-xs pt-5">
                    <button className="btn btn-success rounded-md btn-sm h-[40px] w-full max-w-xs" onClick={handleRetailerSubmit} disabled={pending} >{pending ? "Submitting..." : "ADD RETAILER"}</button>
                </label>
            </div>
        </div>
    )
}

export default AddRetailer