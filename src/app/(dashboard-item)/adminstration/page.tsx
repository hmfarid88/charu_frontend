import AddEmployee from "@/app/components/AddEmployee"
import AddRetailer from "@/app/components/AddRetailer"
import ClosingSetup from "@/app/components/ClosingSetup"
import EmployeeTarget from "@/app/components/EmployeeTarget"
import ShopInfo from "@/app/components/ShopInfo"

const Page = () => {
  return (
    <div className='container min-h-screen'>
      <div className="flex w-full items-center justify-center">
        <div role="tablist" className="tabs tabs-bordered p-3">
          <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="ADD RETAILER" defaultChecked />
          <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
         <AddRetailer/>
          </div>
          <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="ADD EMPLOYEE" />
          <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
            <div className="flex w-full">
              <AddEmployee />
            </div>
          </div>
          <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="ADDRESS SETUP" />
          <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
            <div className="flex w-full">
              <ShopInfo />
            </div>
          </div>
          <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="CLOSING SETUP" />
          <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
            <div className="flex w-full">
              <ClosingSetup />
            </div>
          </div>
          <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="TARGET SETUP" />
          <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
            <div className="flex w-full">
              <EmployeeTarget />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Page