"use client";
import { useEffect, useState } from "react";
import Page1 from "@/Components/Gov/Payment/page1";
import Page2 from "@/Components/Gov/Payment/page2";
import UserProfile from "@/Components/UserProfile/public-profile";
import { useGovUser } from "@/Context/govUser";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

const ContractBottom = () => {
  const [activeTab, setActiveTab] = useState("Active Payments");
  const router = useRouter();

  const searchParams = useSearchParams();
  const contract = searchParams.get("contract");
  const contractData = contract ? JSON.parse(contract) : null;
  const renderScene = () => {
    switch (activeTab) {
      case "Active Payments":
        return <Page1 contract={contractData} />;
      case "Contract Status":
        return <Page2 contract={contractData}/>;
      default:
        return <Page1 contract={contractData}/>;
    }
  };

  return (
    <div className="flex flex-col  bg-black text-white">
      <div className="flex-1 p-4 ">{renderScene()}</div>

      <div className="flex justify-around bg-gray-900 p-4 fixed bottom-0 w-full border-t border-gray-700">
        {["Active Payments", "Contract Status"].map((tab) => (
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
