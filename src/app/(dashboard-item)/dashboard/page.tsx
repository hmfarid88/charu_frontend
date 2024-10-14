"use client"

import Areachart from "@/app/components/Areachart";
import Barchart from "@/app/components/Barchart";
import Linechart from "@/app/components/Linechart";

export default function Home() {

  const dashboardData = [
    {
      id: 1,
      title: "Product Stock"
    },
    {
      id: 2,
      title: "Distribution Today"
    },
    
    {
      id: 3,
      title: "Monthly Total"
    },
   
    {
      id: 4,
      title: "Payment Today"
    },

    {
      id: 5,
      title: "Cash Balance"
    }

  ]
  return (
    <main>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row  gap-5 p-4 items-center justify-center">
          {dashboardData?.map((item) =>
            <div key={item.id} className="card shadow-md shadow-slate-700 border border-accent text-center font-bold h-32 w-60 p-2">
              {item.title}
            </div>
          )}
        </div>
                
          <div className="flex flex-col items-center justify-center pb-10">
            <div className="p-5"><h4>Last Six month Sales Analysis</h4></div>
            <div><Barchart /></div>
          </div>
      
      
      </div>
    </main>
  );
}
