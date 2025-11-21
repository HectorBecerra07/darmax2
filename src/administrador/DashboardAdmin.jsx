import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import SidebarAdmin from "./components/SidebarAdmin";
import { 
  Bars3Icon, 
  XMarkIcon,
  ChevronDoubleLeftIcon
}
 from "@heroicons/react/24/outline";

const DashboardAdmin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Correctly initialize theme state from localStorage
  const [theme, setTheme] = useState(() => localStorage.getItem('adminTheme') || 'dark');

  // Effect to persist theme and apply class to <html> element
  useEffect(() => {
    localStorage.setItem('adminTheme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      {/* --- Mobile Sidebar (Drawer) --- */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex w-64 transform transition-transform duration-300 ease-in-out md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="relative flex w-full max-w-xs flex-1 flex-col">
          <div className="absolute top-0 right-0 -mr-14 p-1">
            <button
              type="button"
              className="flex h-12 w-12 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          <SidebarAdmin collapsed={false} theme={theme} setTheme={setTheme} />
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/60 backdrop-blur-sm md:hidden"
          aria-hidden="true"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* --- Desktop Sidebar (Collapsible) --- */}
      <div
        className={`hidden md:fixed md:inset-y-0 md:flex md:flex-col transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? "md:w-20" : "md:w-64"
        }`}
      >
        <SidebarAdmin collapsed={sidebarCollapsed} theme={theme} setTheme={setTheme} />
      </div>

      {/* --- Main Content --- */}
      <div
        className={`flex flex-1 flex-col transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? "md:pl-20" : "md:pl-64"
        }`}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-30 flex h-16 flex-shrink-0 items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 shadow-sm sm:px-6">
          <div className="flex items-center">
            {/* Mobile Hamburger */}
            <button
              type="button"
              className="-ml-2 rounded-md p-2 text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            {/* Desktop Collapse Toggle */}
            <button
              type="button"
              className="hidden md:flex -ml-2 rounded-md p-2 text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <ChevronDoubleLeftIcon className={`h-6 w-6 transition-transform duration-300 ${sidebarCollapsed && "rotate-180"}`} />
            </button>
            <h1 className="ml-4 text-lg font-semibold text-slate-800 dark:text-slate-100">Dashboard</h1>
          </div>
        </div>

        <main className="flex-1">
          <div className="p-4 sm:p-6 md:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardAdmin;
