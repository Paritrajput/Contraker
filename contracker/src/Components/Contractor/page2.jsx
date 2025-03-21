"use client";
import { useRouter } from "next/navigation";

export default function ContractsPage() {
  const router = useRouter();
  const [contracts, setContracts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/tender/get-tender");
        setContracts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Could not get tenders", error);
        setError("Could not get tenders");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  // Dummy Data
  const data = [
    { referenceId: "CNT-101", organisationChain: "Metro Rail Project" },
    { referenceId: "CNT-102", organisationChain: "Highway Expansion" },
    { referenceId: "CNT-103", organisationChain: "Water Treatment Plant" },
    { referenceId: "CNT-104", organisationChain: "Smart City Infrastructure" },
  ];

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-black text-white">
      <h1 className="text-3xl font-bold mb-6 text-teal-400">Your Contracts</h1>
      <div className="w-full max-w-3xl">
        {data.map((item) => (
          <CardComponent
            key={item.referenceId}
            title={item.organisationChain}
            content={item.referenceId}
            onClick={() =>
              router.push(
                `/contract-desc?contract=${encodeURIComponent(JSON.stringify(item))}`
              )
            }
          />
        ))}
      </div>
    </div>
  );
}

function CardComponent({ title, content, onClick }) {
  return (
    <div
      className="bg-gray-900 p-4 rounded-lg shadow-lg mb-4 cursor-pointer transition-transform transform hover:scale-105 hover:bg-gray-800 border border-gray-700"
      onClick={onClick}
    >
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <p className="text-green-400 font-medium">{content}</p>
    </div>
  );
}









// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import config from "../../../postcss.config.mjs";

// export default function ContractsPage() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const router = useRouter();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get(`http://${config.ipAddress}:4000/contracts`);
//         setData(response.data);
//       } catch (error) {
//         setError("Failed to fetch data");
//         console.error("Error fetching data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) {
//     return <p className="text-lg text-center mt-6 text-gray-800">Loading...</p>;
//   }

//   if (error) {
//     return <p className="text-lg text-center mt-6 text-red-500">{error}</p>;
//   }

//   return (
//     <div className="flex flex-col items-center min-h-screen p-6 bg-gray-100">
//       <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Contracts</h1>
//       <div className="w-full max-w-3xl">
//         {data.map((item) => (
//           <CardComponent
//             key={item.referenceId}
//             title={item.organisationChain}
//             content={item.referenceId}
//             onClick={() =>
//               router.push(`/contractdesc?contract=${encodeURIComponent(JSON.stringify(item))}`)
//             }
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// function CardComponent({ title, content, onClick }) {
//   return (
//     <div
//       className="bg-white p-4 rounded-lg shadow-md mb-4 cursor-pointer transition-transform transform hover:scale-105"
//       onClick={onClick}
//     >
//       <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
//       <p className="text-green-600">{content}</p>
//     </div>
//   );
// }
