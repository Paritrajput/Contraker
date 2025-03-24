"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ContractDesc() {
  const router = useRouter();

  // Mock contract data
  const mockContractData = {
    organisationChain: "XYZ Corp",
    referenceId: "REF123456",
    bidAmount: 50000,
  };

  const [paymentMade, setPaymentMade] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [otherText, setOtherText] = useState("");
  const [pendingPayment, setPendingPayment] = useState([
    {
      bidAmount: 50000,
      amountUsed: 20000,
      status: false,
    },
  ]);

  const handleSubmit = () => {
    alert("Payment details submitted!");
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-[#1a1a1a] shadow-lg rounded-lg p-6 border border-gray-700">
        <h1 className="text-3xl font-bold text-teal-400 mb-4 text-center">Contract Details</h1>

        <div className="space-y-4">
          <InfoRow label="Organisation" value={mockContractData.organisationChain} />
          <InfoRow label="Reference ID" value={mockContractData.referenceId} />
          <InfoRow label="Bid Amount" value={`₹${mockContractData.bidAmount.toLocaleString()}`} />
        </div>

        {/* Material Selection */}
        <div className="mt-6">
          <label className="block text-gray-300 font-semibold mb-1">Select Material:</label>
          <select
            className="w-full p-2 border border-gray-600 bg-black rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="">Select</option>
            <option value="rods">Rods</option>
            <option value="sand">Sand</option>
            <option value="cement">Cement</option>
            <option value="other">Other</option>
          </select>

          {selectedOption === "other" && (
            <input
              type="text"
              placeholder="Enter Material"
              value={otherText}
              onChange={(e) => setOtherText(e.target.value)}
              className="w-full mt-2 p-2 border border-gray-600 bg-black rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          )}
        </div>

        {/* Payment Input */}
        <div className="mt-6">
          <label className="block text-gray-300 font-semibold mb-1">Payment Made:</label>
          <input
            type="number"
            value={paymentMade}
            onChange={(e) => setPaymentMade(e.target.value)}
            className="w-full p-2 border border-gray-600 bg-black rounded-md text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-teal-500 text-black font-semibold p-3 mt-4 rounded-lg hover:bg-teal-400 transition duration-200"
        >
          Submit Payment
        </button>

        {/* Pending Payments */}
        <h2 className="text-2xl font-bold text-teal-400 mt-8 text-center">Pending Payment Approvals</h2>
        {pendingPayment.map((payment, index) => (
          <div key={index} className="bg-[#222] p-4 mt-4 rounded-lg shadow-md border border-gray-700">
            <InfoRow label="Bid Amount" value={`₹${payment.bidAmount.toLocaleString()}`} />
            <InfoRow label="Amount Used" value={`₹${payment.amountUsed.toLocaleString()}`} />
            <InfoRow label="Pending Amount" value={`₹${(payment.bidAmount - payment.amountUsed).toLocaleString()}`} />
            <InfoRow
              label="Status"
              value={
                payment.status ? (
                  <span className="text-green-400 font-semibold">Approved</span>
                ) : (
                  <span className="text-red-400 font-semibold">Pending</span>
                )
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Reusable InfoRow component for displaying data
function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between border-b border-gray-700 py-2">
      <span className="text-gray-300 font-semibold">{label}:</span>
      <span className="text-white">{value}</span>
    </div>
  );
}































// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import config from './config';
// import { useSearchParams } from 'next/navigation';

// const ContractDesc = () => {
//   const searchParams = useSearchParams();
//   const contract = searchParams.get('contract');
//   const contractData = contract ? JSON.parse(contract) : {};

//   const [document, setDocument] = useState(null);
//   const [amountUsed, setAmountUsed] = useState(0);
//   const [paymentMade, setPaymentMade] = useState('');
//   const [selectedOption, setSelectedOption] = useState('');
//   const [otherText, setOtherText] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [approvalStatus, setApprovalStatus] = useState(null);
//   const [pendingPayment, setPendingPayment] = useState(null);

//   useEffect(() => {
//     const fetchPendingPayment = async () => {
//       try {
//         const response = await axios.get(`http://${config.ipAddress}:4000/govcontract/${contractData.referenceId}`);
//         if (response.data) setPendingPayment(response.data);
//       } catch (error) {
//         console.error('Error fetching pending payment:', error);
//         alert('Failed to fetch pending payment details.');
//       }
//     };

//     if (contractData.referenceId) fetchPendingPayment();
//   }, [contractData.referenceId]);

//   const handleDocumentUpload = (event) => {
//     const file = event.target.files[0];
//     if (file && file.type === 'application/pdf') {
//       setDocument(file);
//     } else {
//       alert('Please upload a valid PDF document.');
//     }
//   };

//   const handleSubmit = async () => {
//     if (!document) {
//       alert('Please upload a document');
//       return;
//     }

//     const payment = parseFloat(paymentMade);
//     if (isNaN(payment) || payment <= 0) {
//       alert('Please enter a valid amount');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const bidData = {
//         referenceId: contractData.referenceId,
//         bidAmount: contractData.bidAmount,
//         amountUsed: amountUsed + payment,
//         selectedOption: selectedOption === 'other' ? otherText : selectedOption,
//         paymentMade: payment,
//         status: false,
//       };

//       const response = await axios.post(`http://${config.ipAddress}:4000/govcontract`, bidData, {
//         headers: { 'Content-Type': 'application/json' },
//       });

//       setApprovalStatus(response.data.status);
//       alert('Payment details submitted successfully!');
//     } catch (error) {
//       console.error('Error submitting payment details:', error);
//       alert('Failed to submit payment details. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-2xl font-bold text-center mb-6">Contract Details</h1>
//       <div className="bg-white p-4 rounded shadow mb-4">
//         <p><strong>Organisation:</strong> {contractData.organisationChain}</p>
//         <p><strong>Reference ID:</strong> {contractData.referenceId}</p>
//         <p><strong>Bid Amount:</strong> ₹{contractData.bidAmount?.toLocaleString()}</p>
//         <p><strong>Amount Used:</strong> ₹{amountUsed?.toLocaleString()}</p>
//       </div>
//       <div className="mb-4">
//         <label className="block font-semibold">Select Material:</label>
//         <select className="border p-2 w-full" value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
//           <option value="">Select</option>
//           <option value="rods">Rods</option>
//           <option value="sand">Sand</option>
//           <option value="cement">Cement</option>
//           <option value="other">Other</option>
//         </select>
//         {selectedOption === 'other' && (
//           <input className="border p-2 w-full mt-2" type="text" placeholder="Enter Material" value={otherText} onChange={(e) => setOtherText(e.target.value)} />
//         )}
//       </div>
//       <div className="mb-4">
//         <label className="block font-semibold">Payment Made:</label>
//         <input className="border p-2 w-full" type="number" placeholder="Enter Amount" value={paymentMade} onChange={(e) => setPaymentMade(e.target.value)} />
//       </div>
//       <div className="mb-4">
//         <label className="block font-semibold">Upload Document:</label>
//         <input type="file" accept="application/pdf" onChange={handleDocumentUpload} />
//         {document && <p className="text-sm text-gray-600 mt-2">Selected: {document.name}</p>}
//       </div>
//       <button onClick={handleSubmit} disabled={isLoading} className="bg-blue-600 text-white p-2 rounded w-full">
//         {isLoading ? 'Submitting...' : 'Submit Payment Details'}
//       </button>
//       {approvalStatus && <p className="mt-4 text-center text-green-600">Approval Status: {approvalStatus}</p>}
//       {pendingPayment && pendingPayment.length > 0 && pendingPayment.map((payment, index) => (
//         <div key={index} className="bg-white p-4 rounded shadow mt-4">
//           <h2 className="font-bold">Pending Payment #{index + 1}</h2>
//           <p>Bid Amount: ₹{payment.bidAmount.toLocaleString()}</p>
//           <p>Amount Used: ₹{payment.amountUsed.toLocaleString()}</p>
//           <p>Pending Amount: ₹{(payment.bidAmount - payment.amountUsed).toLocaleString()}</p>
//           <p>Status: {payment.status ? 'Approved' : 'Pending'}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ContractDesc;
