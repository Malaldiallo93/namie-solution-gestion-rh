import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";

import SidebarLinkGroup from "./SidebarLinkGroup";

function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  variant = 'default',
}) {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(storedSidebarExpanded === null ? true : storedSidebarExpanded === "true");

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded);
    if (sidebarExpanded) {
      document.querySelector("body").classList.add("sidebar-expanded");
    } else {
      document.querySelector("body").classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <div className="min-w-fit">
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-gray-900/30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex lg:flex! flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-[100dvh] overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:w-64! shrink-0 bg-white dark:bg-gray-800 p-4 transition-all duration-200 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-64"} ${variant === 'v2' ? 'border-r border-gray-200 dark:border-gray-700/60' : 'rounded-r-2xl shadow-xs'}`}
      >
        {/* Sidebar header */}
        <NavLink to="/" className="flex items-center mb-10 pr-3 sm:px-2 gap-2 group focus:outline-none">
          {/* Logo Namie */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover:scale-105">
            <rect width="32" height="32" rx="8" fill="#2563eb"/>
            <path d="M8 20c4-4 12-4 16 0" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            <path d="M8 12c4-4 12-4 16 0" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="16" cy="16" r="3" fill="#fff"/>
          </svg>
          <span className="text-xl font-bold text-blue-700 tracking-tight">Namie</span>
        </NavLink>

        {/* Links */}
        <div className="space-y-8">
          {/* Pages group */}
          <div>
            <h3 className="text-xs uppercase text-gray-400 dark:text-gray-500 font-semibold pl-3">
              <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6" aria-hidden="true">
                •••
              </span>
              <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">Pages</span>
            </h3>
            <ul className="mt-3">
              {/* Home */}
              <li className="px-3 py-2">
                <NavLink
                  end
                  to="/"
                  className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                    pathname === "/" ? 'hover:text-gray-900 dark:hover:text-white' : 'hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center">
                    <svg className={`shrink-0 ${pathname === "/" ? 'text-violet-500' : 'text-gray-400 dark:text-gray-500'}`} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M3 12L2 13m1-1l9-9 9 9m-9-9v18" />
                      <path d="M9 21V9h6v12" />
                    </svg>
                    <span className="text-base font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Accueil
                    </span>
                  </div>
                </NavLink>
              </li>
              {/* Dashboard RH */}
              <li className="px-3 py-2">
                <NavLink
                  end
                  to="/dashboard"
                  className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                    pathname === "/dashboard" ? "hover:text-gray-900 dark:hover:text-white" : "hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center">
                    {/* BarChart icon */}
                    <svg className={`shrink-0 ${pathname === "/dashboard" ? 'text-violet-500' : 'text-gray-400 dark:text-gray-500'}`} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <rect x="3" y="12" width="4" height="8" rx="1" />
                      <rect x="9" y="8" width="4" height="12" rx="1" />
                      <rect x="15" y="4" width="4" height="16" rx="1" />
                    </svg>
                    <span className="text-base font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Dashboard RH
                    </span>
                  </div>
                </NavLink>
              </li>

              {/* Employees */}
              <li className="px-3 py-2">
                <NavLink
                  end
                  to="/employees"
                  className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                    pathname === "/employees" ? "hover:text-gray-900 dark:hover:text-white" : "hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center">
                    {/* Users icon */}
                    <svg className={`shrink-0 ${pathname === "/employees" ? 'text-violet-500' : 'text-gray-400 dark:text-gray-500'}`} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span className="text-base font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Employés
                    </span>
                  </div>
                </NavLink>
              </li>
              {/* Congés & Absences */}
              <li className="px-3 py-2">
                <NavLink
                  end
                  to="/conges-absences"
                  className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                    pathname === "/conges-absences" ? "hover:text-gray-900 dark:hover:text-white" : "hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center">
                    {/* Calendar icon */}
                    <svg className={`shrink-0 ${pathname === "/conges-absences" ? 'text-violet-500' : 'text-gray-400 dark:text-gray-500'}`} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span className="text-base font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Congés & Absences
                    </span>
                  </div>
                </NavLink>
              </li>
              {/* Feuilles de Temps */}
              <li className="px-3 py-2">
                <NavLink
                  end
                  to="/feuilles-temps"
                  className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                    pathname === "/feuilles-temps" ? "hover:text-gray-900 dark:hover:text-white" : "hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center">
                    {/* Clock icon */}
                    <svg className={`shrink-0 ${pathname === "/feuilles-temps" ? 'text-violet-500' : 'text-gray-400 dark:text-gray-500'}`} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span className="text-base font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Feuilles de Temps
                    </span>
                  </div>
                </NavLink>
              </li>
              {/* Bulletins de paie */}
              <li className="px-3 py-2">
                <NavLink
                  end
                  to="/bulletins-paie"
                  className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                    pathname === "/bulletins-paie" ? "hover:text-gray-900 dark:hover:text-white" : "hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center">
                    {/* FileText icon */}
                    <svg className={`shrink-0 ${pathname === "/bulletins-paie" ? 'text-violet-500' : 'text-gray-400 dark:text-gray-500'}`} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                    <span className="text-base font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Bulletins de Paie
                    </span>
                  </div>
                </NavLink>
              </li>
              {/* Notes de frais */}
              <li className="px-3 py-2">
                <NavLink
                  end
                  to="/notes-frais"
                  className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                    pathname === "/notes-frais" ? "hover:text-gray-900 dark:hover:text-white" : "hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center">
                    {/* Receipt icon */}
                    <svg className={`shrink-0 ${pathname === "/notes-frais" ? 'text-violet-500' : 'text-gray-400 dark:text-gray-500'}`} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M4 21v-2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2" />
                      <path d="M20 7V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2" />
                      <rect x="4" y="7" width="16" height="13" rx="2" />
                      <path d="M8 10h8M8 14h8" />
                    </svg>
                    <span className="text-base font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Notes de Frais
                    </span>
                  </div>
                </NavLink>
              </li>
              {/* Talents & Formations */}
              <li className="px-3 py-2">
                <NavLink
                  end
                  to="/talents-formations"
                  className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                    pathname === "/talents-formations" ? "hover:text-gray-900 dark:hover:text-white" : "hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center">
                    {/* Sparkles icon */}
                    <svg className={`shrink-0 ${pathname === "/talents-formations" ? 'text-violet-500' : 'text-gray-400 dark:text-gray-500'}`} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M5 3L2 17h20L19 3z" />
                      <path d="M12 9v4" />
                      <path d="M12 17h.01" />
                    </svg>
                    <span className="text-base font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Talents & Formations
                    </span>
                  </div>
                </NavLink>
              </li>
              {/* Documents */}
              <li className="px-3 py-2">
                <NavLink
                  end
                  to="/documents"
                  className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                    pathname === "/documents" ? "hover:text-gray-900 dark:hover:text-white" : "hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center">
                    {/* Folder icon */}
                    <svg className={`shrink-0 ${pathname === "/documents" ? 'text-violet-500' : 'text-gray-400 dark:text-gray-500'}`} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
                    </svg>
                    <span className="text-base font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Documents
                    </span>
                  </div>
                </NavLink>
              </li>
              {/* Permissions */}
              <li className="px-3 py-2">
                <NavLink
                  end
                  to="/permissions"
                  className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                    pathname === "/permissions" ? "hover:text-gray-900 dark:hover:text-white" : "hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center">
                    {/* Shield icon */}
                    <svg className={`shrink-0 ${pathname === "/permissions" ? 'text-violet-500' : 'text-gray-400 dark:text-gray-500'}`} width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <span className="text-base font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Permissions
                    </span>
                  </div>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Sidebar toggle button */}
        <div className="pt-3 mt-auto">
          <div className="px-3 space-y-1">
            <button
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className="block w-full text-left text-gray-800 dark:text-gray-100 hover:text-gray-900 dark:hover:text-white transition duration-150"
            >
              <div className="flex items-center">
                <svg className="shrink-0 text-gray-400 dark:text-gray-500" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  {sidebarExpanded ? (
                    <path d="M15 18l-6-6 6-6" />
                  ) : (
                    <path d="M9 18l6-6-6-6" />
                  )}
                </svg>
                <span className="text-base font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                  {sidebarExpanded ? 'Réduire' : 'Étendre'}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
