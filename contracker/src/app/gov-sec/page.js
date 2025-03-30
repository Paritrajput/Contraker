"use client";
import { useEffect, useState } from "react";
import Page1 from "@/Components/gov/page1";
import Page2 from "@/Components/gov/page2";
import Page3 from "@/Components/gov/page3";
import UserProfile from "@/Components/UserProfile/public-profile";
import { useGovUser } from "@/Context/govUser";
import { useRouter } from "next/navigation";
import axios from "axios";

const ContractBottom = () => {
  const [activeTab, setActiveTab] = useState("Issue");
  const router = useRouter();

  const {
    govProfile,
    setGovProfile,
    isOwner,
    isSuperOwner,
    setIsOwner,
    setIsSuperOwner,
  } = useGovUser();

  useEffect(() => {
    const token = localStorage.getItem("gov-token");
    if (!token) {
      router.push("/authenticate/gov-auth/login");
    } else {
      if (token) {
        axios
          .get("/api/gov-sec/profile", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            console.log(res.data);
            setGovProfile(res.data.user);
            if (res.data.owner) {
              if (res.data.isSuperOwner) {
                setIsSuperOwner(true);
              }
              setIsOwner(true);
            }
            //  setUser(res.data)
          })
          .catch(() => localStorage.removeItem("gov-token"));
      }
      console.log(token);
    }
  }, []);
  const handleLogout = async () => {
    // await axios.post("/api/contractor/logout");
    localStorage.removeItem("gov-token");
    router.push("/authenticate/gov-auth/login");
  };

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
    <div className="flex flex-col  bg-black text-white">
      {/* Owner Panel */}
      <div className="fixed top-[4.2rem] left-0 w-full bg-gray-900 text-white p-2 shadow-md flex items-center justify-between z-50">
        <div className="flex items-center gap-4">
          {/* Profile Picture */}
          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-lg font-bold">👤</span>
          </div>

          {/* User Info */}
          <div>
            <p className="text-lg font-semibold">
              {govProfile?.name || "Owner Name"}
            </p>
            <p className="text-sm text-gray-400">
              {govProfile?.email || "owner@example.com"}
            </p>
          </div>
        </div>
        {/* Owner Status Messages */}
        <div className=" p-4 text-center">
          {isOwner && (
            <div>
              {govProfile.isSuperOwner ? (
                <div className="text-purple-500 ">You are a SuperOwner</div>
              ) : (
                <div className="text-teal-500">You are an Owner</div>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-12">
          <button
            onClick={handleLogout}
            className="  bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
          {/* Dashboard Button */}
          {(isOwner || isSuperOwner) && (
            <button
              onClick={() =>
                router.push(`/gov-sec/owner-dashboard/${govProfile._id}`)
              }
              className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition"
            >
              Owner Dashboard
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 mt-20">{renderScene()}</div>

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
