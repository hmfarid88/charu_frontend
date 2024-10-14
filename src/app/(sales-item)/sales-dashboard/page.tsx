"use client"

import Areachart from "@/app/components/Areachart";
import Barchart from "@/app/components/Barchart";
import HomeSummary from "@/app/components/HomeSummary";
import Linechart from "@/app/components/Linechart";

export default function Page() {

  return (
    <main>
      <div className="container mx-auto">
        <div className="flex">
          <HomeSummary />
        </div>
       
          <div className="flex flex-col items-center justify-center w-full">
            <div className="p-5"><h4>Last Six Month Sales Analysis</h4></div>
            <div><Barchart /></div>
          </div>
     
        <div className="flex flex-col items-center justify-center w-full">
          <div className="p-5"><h4>Last 12 Month Profit-Loss Analysis</h4></div>
          <div><Linechart /></div>
        </div>
      </div>
    </main>
  );
}
