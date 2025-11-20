import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SidebarAdmin from "./components/SidebarAdmin";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";

const DashboardAdmin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* --- Mobile Sidebar --- */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden" role="dialog" aria-modal="true">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75" 
            aria-hidden="true"
            onClick={() => setSidebarOpen(false)}
          ></div>

          {/* Sidebar content */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
            {/* The actual sidebar content is rendered here for mobile */}
            <SidebarAdmin />
          </div>
          <div className="flex-shrink-0 w-14" aria-hidden="true">
            {/* Dummy element to force sidebar to shrink to fit close icon */}
          </div>
        </div>
      )}

      {/* --- Desktop Sidebar --- */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <SidebarAdmin />
      </div>

      {/* --- Main Content --- */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Mobile header with hamburger button */}
        <div className="sticky top-0 z-10 md:hidden pt-1 pl-1 sm:pl-3 sm:pt-3 bg-gray-50">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <main className="flex-1 p-6 md:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardAdmin;
