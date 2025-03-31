"use client";

import { useState } from "react";
import Page1 from "@/Components/Contractor/page1";
import Page2 from "@/Components/Contractor/page2";


const ContractBottom = () => {
  const [index, setIndex] = useState(0);

  const routes = [
    { key: "Tender", title: "Tenders", icon: "📄" },
    { key: "Contract", title: "Contract", icon: "✍️" },
  ];

  const renderScene = () => {
    switch (index) {
      case 0:
        return <Page1 />;
      case 1:
        return <Page2 />;
      default:
        return <Page1 />;
    }
  };

  return (
    <div className="flex flex-col h-[90vh] bg-black text-white ">
      {/* Main Content */}
      <div className="flex-grow h-[70%] p-6 ">{renderScene()}</div>
      <div className="fixed bottom-52 right-5 z-50">
      
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-around p-4 bg-gray-900 border-t border-gray-700 fixed bottom-0 w-full z-50">
        {routes.map((route, i) => (
          <button
            key={route.key}
            className={`flex flex-col items-center p-2 transition-all duration-300 ${
              index === i
                ? "text-teal-400 scale-110"
                : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setIndex(i)}
          >
            <span className="text-2xl">{route.icon}</span>
            <span className="text-sm">{route.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ContractBottom;

