"use client"

import Barchart from "@/app/components/Barchart";
import EmployeeTargetSummary from "@/app/components/EmployeeTargetSummary";
import Linechart from "@/app/components/Linechart";

export default function Page() {

  return (
    <main>
      <div className="container mx-auto">
        <div className="flex w-full items-center justify-center">
          <EmployeeTargetSummary/>
        </div>
            
      </div>
    </main>
  );
}
