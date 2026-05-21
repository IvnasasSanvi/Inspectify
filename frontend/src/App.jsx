import React, { useState } from 'react'
import "./App.css"
import Navbar from './components/Navbar'
import Editor from '@monaco-editor/react'
import { FaCss3Alt, FaHtml5, FaJava, FaPython } from "react-icons/fa";
import { IoLogoJavascript } from "react-icons/io5";
import { BsTypescript } from "react-icons/bs";
import axios from "axios";


const App = () => {
  

  const [darkMode, setDarkMode] = useState(true)
  const [language, setLanguage] = useState("javascript")
  const [code, setCode] = useState("// Write your code here");
  const [output, setOutput] = useState("");

  const callAPI = async (route) => {
  try {
    setOutput("Loading...");

    const response = await axios.post(
      `${import.meta.env.VITE_BACK_END}/${route}`,
      {
        code: code,
        language: language,
      }
    );

    setOutput(response.data.reply);

  } catch (error) {
    console.log(error);

    setOutput("Something went wrong");
  }
};


  return (

  
    <div
      className={`transition-all duration-500 ${
        darkMode ? "bg-[#07071E]" : "bg-gray-100"
      }`}
    >

      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />


      <div className="w-full h-10 flex gap-10">

      <div className="left w-1/2 h-full flex justify-end items-center gap-4">

        <button 
          onClick={() => callAPI("fix-code")}
          className="border w-[120px] text-amber-400 px-4 py-1 rounded hover:cursor-pointer hover:text-purple-500"
        >
          Fix
        </button>

        <button 
          onClick={() => callAPI("review")}
          className="border w-[120px] text-amber-400 px-4 py-1 rounded hover:cursor-pointer hover:text-purple-500"
        >
          Review
        </button>
        <button 
          onClick={() => callAPI("run")}
          className="border w-[120px] bg-amber-500/80 text-white-400 px-4 py-1 rounded hover:cursor-pointer hover:text-gray-300 "
        >
          Run
        </button>
      </div>

      <div className="right w-1/2 h-full flex justify-between items-center">
        
        <div
          className={`text-2xl font-bold transition-all duration-500 ${
            darkMode
              ? "bg-[#0f172a] text-white"
              : "bg-white text-black"
          }`}
        >
          Output
        </div>

        <button 
          onClick={()=> setOutput("")} 
          className="border w-[120px] text-amber-600 px-4 py-1 rounded hover:cursor-pointer hover:text-purple-500">
          Clear
        </button>

      </div>

      </div>
          

      <div
        className="main flex"
        style={{ height: "calc(100vh - 90px)" }}
      >

        <div className="left w-1/2 h-full border-r border-gray-700 flex" >

          <div
            className={`w-[50px] h-full flex flex-col items-center gap-10 ${
              darkMode ? "bg-[#111827]" : "bg-gray-200"
            }`}
          >

          <button
            onClick={() => setLanguage("java")} 
            className="text-4xl transition-all hover:cursor-pointer"
          >
            <FaJava
              className={`${
              language === "java"
                ? "text-purple-500"
                : "text-blue-400"
              } hover:text-purple-500`}
            />
          </button>

          <button  
            onClick={() => setLanguage("python")} 
            className="text-3xl transition-all hover:cursor-pointer"
          >
            <FaPython 
              className={`${
              language === "python"
                ? "text-purple-500"
                : "text-blue-400"
              } hover:text-purple-500`}
            />
          </button>

          <button  
            onClick={() => setLanguage("javascript")} 
            className="text-3xl transition-all hover:cursor-pointer"
          >
            <IoLogoJavascript 
              className={`${
              language === "javascript"
                ? "text-purple-500"
                : "text-blue-400"
              } hover:text-purple-500`}
            />
          </button>

          <button  
            onClick={() => setLanguage("html")} 
            className="text-4xl transition-all hover:cursor-pointer"
          >
            <FaHtml5 
              className={`${
              language === "html"
                ? "text-purple-500"
                : "text-blue-400"
              } hover:text-purple-500`}
            />
          </button>

          <button  
            onClick={() => setLanguage("css")} 
            className="text-4xl transition-all hover:cursor-pointer"
          >
            <FaCss3Alt 
              className={`${
              language === "css"
                ? "text-purple-500"
                : "text-blue-400"
              } hover:text-purple-500`}
            />
          </button>

          <button
            onClick={() => setLanguage("typescript")}
            className="text-2xl transition-all hover:cursor-pointer"
          >
            <BsTypescript  
              className={`${
              language === "typescript"
                ? "text-purple-500"
                : "text-blue-400"
              } hover:text-purple-500`}
            />
          </button>

          <button  
            onClick={() => setLanguage("c")} 
            className={`text-3xl transition-all hover:cursor-pointer ${
              language === "c"
                ? "text-purple-500"
                : "text-blue-400"
            }`}
          >
            C
          </button>

          <button  
            onClick={() => setLanguage("c++")} 
            className={`text-3xl transition-all hover:cursor-pointer ${
              language === "c++"
                ? "text-purple-500"
                : "text-blue-400"
            }`}
          >
            C++
          </button>

        </div>

          <div className="flex-1 h-full">
           <Editor
            width="100%"
            height="100%"
            language={language}
            value={code}
            onChange={(value) => setCode(value || "")}
            theme={darkMode ? "vs-dark" : "light"}
          />
          </div>

        </div>

         <div className="w-[1px] bg-gray-700 gap-10"></div>

        <div
          className={`right w-1/2 h-full p-3 overflow-auto transition-all duration-500 ${
            darkMode
              ? "bg-[#0f172a] text-white"
              : "bg-white text-black"
          }`}
        >

          <h1 className="text-2xl font-bold  text-center  ">
            AI Review Output

          </h1>

          <div className="object-contain">
            <h1 className="wrap-break-word p-4 ">{output}</h1>
          </div>
        </div>

      </div>

    </div>
  )
}

export default App