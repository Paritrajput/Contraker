"use client";
import { useState } from "react";
import Page1 from "@/Components/gov/page1";
import Page2 from "@/Components/gov/page2";
import Page3 from "@/Components/gov/page3";
import UserProfile from "@/Components/UserProfile/public-profile";

const ContractBottom = () => {
  const [activeTab, setActiveTab] = useState("Issue");

  const renderScene = () => {
    switch (activeTab) {
      case "Issue":
        return <Page1 />;
      case "Tender":
        return <Page3 />;
      case "Contract":
        return <Page2 />;
      default:
        return <Page1 />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <div className="fixed bottom-52 right-5 z-50">
       
      </div>
      <div className="flex-1 p-4">{renderScene()}</div>

      {/* Bottom Navigation Bar */}
      <div className="flex justify-around bg-gray-900 p-4 fixed bottom-0 w-full border-t border-gray-700">
        {["Issue", "Tender", "Contract"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold transition ${
              activeTab === tab
                ? "text-teal-400 border-b-2 border-teal-400"
                : "text-gray-400 hover:text-teal-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ContractBottom;
