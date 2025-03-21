// "use client";

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ContractsPage() {
  const router = useRouter();
  const [tenders, setTenders] = useState([]);
  const [error, setError] = useState("");

  const dummyContracts = [
    {
      referenceId: "CON-12345",
      organisationChain: "Government Housing Project",
      panelid: 1,
    },
    {
      referenceId: "CON-67890",
      organisationChain: "Road Repair Initiative",
      panelid: 1,
    },
    {
      referenceId: "CON-54321",
      organisationChain: "Water Purification Plant",
      panelid: 1,
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/tender/get-tender");
        setTenders(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Could not get tenders", error);
        setError("Could not get tenders");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-black p-6 text-white">
      <h1 className="text-3xl font-bold text-center mb-6">Your Contracts</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyContracts
          .filter((item) => item.panelid === 1)
          .map(( item) => (
            <div
              key={item.tenderId}
              className="bg-gray-900 p-6 rounded-lg shadow-md transition hover:scale-105 hover:bg-gray-800"
            >
              <h2 className="text-xl font-semibold text-teal-400">
                {item.tenderId}
              </h2>
              <p className="text-gray-400 mt-2">Ref ID: {item.referenceId}</p>
              <button
                onClick={() =>
                  router.push(
                    `/payment-desc?contract=${encodeURIComponent(
                      JSON.stringify(item)
                    )}`
                  )
                }
                className="mt-4 bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition"
              >
                View Details
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function ContractsPage() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const router = useRouter();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contracts`);
//         const contracts = await res.json();
//         setData(contracts);
//       } catch (err) {
//         setError("Failed to fetch data");
//         console.error("Error fetching data:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) return <p className="text-center text-gray-700 text-lg">Loading...</p>;
//   if (error) return <p className="text-center text-red-500 text-lg">{error}</p>;

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Your Contracts</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {data
//           .filter((item) => item.panelid === 1)
//           .map((item) => (
//             <div key={item.referenceId} className="bg-white p-4 rounded-lg shadow-md">
//               <h2 className="text-xl font-semibold text-gray-700">{item.organisationChain}</h2>
//               <p className="text-gray-600 mt-2">{item.referenceId}</p>
//               <button
//                 onClick={() =>
//                   router.push(`/Paymentdesc?contract=${encodeURIComponent(JSON.stringify(item))}`)
//                 }
//                 className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
//               >
//                 View Details
//               </button>
//             </div>
//           ))}
//       </div>
//     </div>
//   );
// }
