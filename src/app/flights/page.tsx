import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlaneTakeoff, Search, Map, Calendar, Users } from "lucide-react";

export default function FlightsPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Search Header */}
      <div className="bg-[var(--color-brand-navy)] py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-6">Search Flights</h1>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
             <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="tripType" defaultChecked className="text-[var(--color-brand-green)] focus:ring-[var(--color-brand-green)]" />
                    <span className="text-sm font-medium">Round trip</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="tripType" className="text-[var(--color-brand-green)] focus:ring-[var(--color-brand-green)]" />
                    <span className="text-sm font-medium">One way</span>
                  </label>
                </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">From</label>
                  <div className="relative">
                    <Input placeholder="Origin" className="pl-10" />
                    <PlaneTakeoff className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">To</label>
                  <div className="relative">
                    <Input placeholder="Destination" className="pl-10" />
                    <Map className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Dates</label>
                  <div className="relative">
                    <Input type="date" className="pl-10" />
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Travelers</label>
                  <div className="relative">
                    <Input placeholder="1 Adult" className="pl-10" />
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </div>
                <div className="lg:col-span-1">
                  <Button className="w-full h-10 gap-2">
                    <Search className="h-4 w-4" />
                    Search
                  </Button>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Mock Results */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
             <div className="bg-white p-6 rounded-xl shadow-sm border">
               <h3 className="font-semibold text-lg mb-4">Filters</h3>
               {/* Stops */}
               <div className="mb-6">
                 <h4 className="text-sm font-medium text-slate-700 mb-2">Stops</h4>
                 <div className="space-y-2">
                   <label className="flex items-center gap-2 cursor-pointer text-sm">
                     <input type="checkbox" className="rounded text-[var(--color-brand-green)] focus:ring-[var(--color-brand-green)]" />
                     Direct
                   </label>
                   <label className="flex items-center gap-2 cursor-pointer text-sm">
                     <input type="checkbox" className="rounded text-[var(--color-brand-green)] focus:ring-[var(--color-brand-green)]" />
                     1 Stop
                   </label>
                 </div>
               </div>
             </div>
          </div>

          {/* Results List */}
          <div className="lg:col-span-3 space-y-4">
             <div className="bg-white p-6 rounded-xl shadow-sm border flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600 text-xs">QA</div>
                      <span className="font-semibold">Qatar Airways</span>
                    </div>
                    <span className="text-sm text-slate-500">Economy</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-center">
                      <div className="text-xl font-bold text-[var(--color-brand-navy)]">14:30</div>
                      <div className="text-sm text-slate-500">KAN</div>
                    </div>
                    <div className="flex-1 px-8 relative flex flex-col items-center">
                      <div className="text-xs text-slate-400 mb-1">13h 45m</div>
                      <div className="w-full border-t border-slate-300 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-slate-400">1 Stop</div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-[var(--color-brand-navy)]">06:15</div>
                      <div className="text-sm text-slate-500">DXB <span className="text-xs text-red-500">+1</span></div>
                    </div>
                  </div>
                </div>
                
                <div className="w-full md:w-auto md:border-l md:pl-6 flex flex-col items-end justify-center">
                  <div className="text-2xl font-bold text-[var(--color-brand-green)] mb-1">₦850,000</div>
                  <div className="text-xs text-slate-500 mb-4">Total price for all travelers</div>
                  <Button className="w-full">Select</Button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
