"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import GovProfile from "@/Components/UserProfile/gov-profile";
import axios from "axios";

export default function ContractorLayout({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("gov-token");
    if (!token) {
      router.push("/authenticate/gov-auth/login"); // Redirect to login if no token
    } else {
      if (token) {
        axios
          .get("/api/gov-sec/profile", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            console.log(res.data);
            // if(res.data.owner){

            // }
            //  setUser(res.data)
          })
          .catch(() => localStorage.removeItem("gov-token"));
      }
      console.log(token);
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) return null; // Prevent rendering content until auth check is done

  return (
    <>
      {children}
      <GovProfile />
    </>
  );
}
