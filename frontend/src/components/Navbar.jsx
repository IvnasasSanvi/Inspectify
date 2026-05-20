import React from 'react'
import logo from '../assets/download-removebg-preview.png'
import { Moon, Sun } from "lucide-react"

const Navbar = ({ darkMode, setDarkMode }) => {

  return (

    <nav
      className={`flex items-center justify-between h-[90px] shadow-lg transition-all duration-500 ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}
      style={{ padding: "0 150px" }}
    >

      {/* Left */}
      <div className="flex items-center gap-4">

        <div className="w-14 h-14 rounded-2xl overflow-hidden">
          <img
            src={logo}
            alt="logo"
            className="w-full h-full object-contain"
          />
        </div>

        <div>
          <h1 className="text-4xl font-extrabold">
            <span className={darkMode ? "text-white" : "text-black"}>
              Inspect
            </span>

            <span className="text-purple-500">
              ify
            </span>
          </h1>

          <p className="text-gray-400 text-sm mt-1">
            &lt; AI-Powered Code Reviewer /&gt;
          </p>
        </div>

      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`p-3 rounded-full transition-all duration-300 ${
          darkMode
            ? "bg-gray-800 text-yellow-400"
            : "bg-gray-200 text-black"
        }`}
      >
        {darkMode ? <Sun size={22} /> : <Moon size={22} />}
      </button>

    </nav>
  )
}

export default Navbar