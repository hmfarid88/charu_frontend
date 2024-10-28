 "use client"

import Areachart from "@/app/components/Areachart";
import Barchart from "@/app/components/Barchart";
import HomeSummary from "@/app/components/HomeSummary";
import Linechart from "@/app/components/Linechart";

export default function Home() {

 
  return (
    <main>
      <div className="container mx-auto">
      <div className="flex">
          <HomeSummary />
        </div>
                
          <div className="flex flex-col items-center justify-center pb-10">
            <div className="p-5"><h4>Last Six Month Sales Analysis</h4></div>
            <div><Barchart /></div>
          </div>
      
      
      </div>
    </main>
  );
}
