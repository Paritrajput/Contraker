"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ContractDesc() {
  const searchParams = useSearchParams();
  const contracts = searchParams.get("contract");
  const contractData = contracts ? JSON.parse(contracts) : null;
  console.log("contract data:", contractData);

  const [paymentMade, setPaymentMade] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [otherText, setOtherText] = useState(null);
  const [requestedPayments, setRequestedPayments] = useState([]);
  const [pendingPayment, setPendingPayment] = useState({
    contractorId: "",
    contractId: "",
    bidAmount: "",
    amountUsed: "",
    reason: "",
    paymentMade: "",
    status: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedPayment = {
      contractorId: contractData.contractorMongoId,
      contractorWallet: contractData.contractor,
      contractId: contractData.mongoContractId,
      bidAmount: contractData.contractAmount,
      reason: otherText ? otherText : selectedOption,
      paymentMade: paymentMade,
      status: "Pending",
    };

    setPendingPayment(updatedPayment);

    try {
      const response = await fetch("/api/payment/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPayment), // Use updatedPayment instead of pendingPayment
      });

      const data = await response.json();
      if (data.success) {
        alert("Payment details saved!");
        setPendingPayment({
          contractorId: "",
          contractId: "",
          bidAmount: "",
          amountUsed: "",
          reason: "",
          paymentMade: "",
          status: "",
        });
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Payment submission failed", error);
      alert("Failed to submit payment details.");
    }
  };

  const getPayments = async () => {
    const contractId = contractData.mongoContractId;

    try {
      const response = await fetch(`/api/payment/get-payments/${contractId}`, {
        method: "GET",
      });

      const data = await response.json();

      if (data) {
        console.log(data);
        setRequestedPayments(data);
      } else {
        alert("Error: " + data.massage);
      }
    } catch (error) {
      console.error("Payment submission failed", error);
      alert("Failed to submit payment details.");
    }
  };
  useEffect(() => {
    getPayments();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-[#1a1a1a] shadow-lg rounded-lg p-6 border border-gray-700">
        <h1 className="text-3xl font-bold text-teal-400 mb-4 text-center">
          Contract Details
        </h1>

        <div className="space-y-4">
          <InfoRow label="Contract Title" value={contractData.projectTitle} />
          <InfoRow label="Reference ID" value={contractData.contractId} />
          <InfoRow
            label="Bid Amount"
            value={`₹${contractData.contractAmount}`}
          />
        </div>

        <div className="mt-6">
          <label className="block text-gray-300 font-semibold mb-1">
            Select Material:
          </label>
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

        <div className="mt-6">
          <label className="block text-gray-300 font-semibold mb-1">
            Payment Required:
          </label>
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

        <h2 className="text-2xl font-bold text-teal-400 mt-8 text-center">
          Pending Payment Approvals
        </h2>
        {requestedPayments.length>0 && requestedPayments.map((payment, index) => (
          <div
            key={index}
            className="bg-[#222] p-4 mt-4 rounded-lg shadow-md border border-gray-700"
          >
            <InfoRow label="Bid Amount" value={`₹${payment.bidAmount}`} />
            <InfoRow
              label="Requested Amount"
              value={`₹${payment.paymentMade}`}
            />
            <InfoRow
              label="Remaining Amount"
              value={`₹${payment.bidAmount - payment.paymentMade}`}
            />
            <InfoRow
              label="Status"
              value={
                payment.status == "Approve" ? (
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

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between border-b border-gray-700 py-2">
      <span className="text-gray-300 font-semibold">{label}:</span>
      <span className="text-white">{value}</span>
    </div>
  );
}
