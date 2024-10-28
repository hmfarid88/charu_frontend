'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import { FcPrint } from "react-icons/fc";
import { useReactToPrint } from 'react-to-print';
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import CurrentDate from "@/app/components/CurrentDate";
import DateToDate from "@/app/components/DateToDate";

type Product = {
    retailerName: string;
    retailerCode: string;
    salesPerson: string;
    totalProductQty: number;
    totalProductValue: number;
    totalPayment: number;
    totalCommission: number;
};


const Page = () => {
  const router = useRouter();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';

  const contentToPrint = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => contentToPrint.current,
  });
  const [filterCriteria, setFilterCriteria] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [maxDate, setMaxDate] = useState('');
  const [supplierName, setSupplierName] = useState('');
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    setMaxDate(formattedDate);
  }, []);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleDetails = (e:any) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      toast.warning("Start date and end date required !");
      return;
    }
    if (!supplierName) {
      toast.warning("Retailer name is missing!");
      return;
    }
    router.push(`/details-retailer-ledger?startDate=${startDate}&endDate=${endDate}&retailerName=${encodeURIComponent(supplierName)}`);
    setStartDate("");
    setEndDate("");
  }
  
  useEffect(() => {
    fetch(`${apiBaseUrl}/retailer/retailerBalance`)
      .then(response => response.json())
      .then(data => {
        setAllProducts(data);
        setFilteredProducts(data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl]);


  useEffect(() => {
    const filtered = allProducts.filter(product =>
      (product.retailerName.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
      (product.retailerCode.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
      (product.salesPerson.toLowerCase().includes(filterCriteria.toLowerCase()) || '')
    );
    setFilteredProducts(filtered);
  }, [filterCriteria, allProducts]);

  const handleFilterChange = (e: any) => {
    setFilterCriteria(e.target.value);
  };

  const totalQty = filteredProducts.reduce((total, product) => {
    return total + product.totalProductQty;
  }, 0);
  const totalValue = filteredProducts.reduce((total, product) => {
    return total + product.totalProductValue;
  }, 0);
  const totalPayment = filteredProducts.reduce((total, product) => {
    return total + product.totalPayment;
  }, 0);
  const totalCommission = filteredProducts.reduce((total, product) => {
    return total + product.totalCommission;
  }, 0);
  const totalBalance = filteredProducts.reduce((total, product) => {
    return total + product.totalProductValue-product.totalPayment-product.totalCommission;
  }, 0);

  return (
    <div className="container-2xl">
      <div className="flex flex-col w-full min-h-[calc(100vh-228px)] p-4">
      <div className="flex p-5 justify-end items-end"><DateToDate routePath="/datewise-retail-ledger" /></div>
      <div className="flex w-full justify-between pl-5 pr-5 pt-1 items-center">
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
          <h4><CurrentDate/></h4>
          </div>
            <table className="table table-sm">
              <thead>
                <tr>
                  <th>SN</th>
                  <th>RETAILER NAME</th>
                  <th>RETAILER CODE</th>
                  <th>SALE PERSON</th>
                  <th>TOTAL QTY</th>
                  <th>TOTAL VALUE</th>
                  <th>TOTAL PAYMENT</th>
                  <th>TOTAL COMMISSION</th>
                  <th>ACHIEVED</th>
                  <th>BALANCE</th>
                  <th>DETAILS</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts?.map((product, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td className="uppercase">{product?.retailerName}</td>
                    <td className="uppercase">{product?.retailerCode}</td>
                    <td className="uppercase">{product?.salesPerson}</td>
                    <td>{Number(product?.totalProductQty.toFixed(2)).toLocaleString('en-IN')}</td>
                    <td>{Number(product?.totalProductValue.toFixed(2)).toLocaleString('en-IN')}</td>
                    <td>{Number(product?.totalPayment.toFixed(2)).toLocaleString('en-IN')}</td>
                    <td>{Number(product?.totalCommission.toFixed(2)).toLocaleString('en-IN')}</td>
                    <td>{Number((product?.totalPayment*100/product?.totalProductValue).toFixed(2)).toLocaleString('en-IN')} %</td>
                    <td>{Number((product?.totalProductValue-product?.totalPayment-product?.totalCommission).toFixed(2)).toLocaleString('en-IN')}</td>
                    <td><a href="#my_modal_retail_ledger"><button onClick={() => setSupplierName(product?.retailerName)} className="btn btn-xs btn-info">Details</button></a></td>
                   
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-semibold text-lg">
                  <td colSpan={3}></td>
                  <td>TOTAL</td>
                  <td>{totalQty.toLocaleString('en-IN')}</td>
                  <td>{totalValue.toLocaleString('en-IN')}</td>
                  <td>{totalPayment.toLocaleString('en-IN')}</td>
                  <td>{totalCommission.toLocaleString('en-IN')}</td>
                  <td></td>
                  <td>{totalBalance.toLocaleString('en-IN')}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
      <div className="modal sm:modal-middle" role="dialog" id="my_modal_retail_ledger">
        <div className="modal-box">
          <div className='flex flex-col gap-3 items-center justify-center'>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text-alt">START DATE</span>
              </div>
              <input type="date" name="date" onChange={(e: any) => setStartDate(e.target.value)} max={maxDate} value={startDate} className="input input-bordered" />
            </label>

            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text-alt">END DATE</span>
              </div>
              <input type="date" name="date" onChange={(e: any) => setEndDate(e.target.value)} max={maxDate} value={endDate} className="input input-bordered" />
            </label>
            <label className="form-control w-full max-w-xs">

              <button onClick={handleDetails} className='btn btn-outline btn-success'>DETAILS LEDGER</button>
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
  )
}

export default Page