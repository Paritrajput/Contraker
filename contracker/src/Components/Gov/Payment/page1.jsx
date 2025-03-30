"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const AdminPaymentPage = (contract) => {
  //   const searchParams = useSearchParams();
  //   const contract = searchParams.get("contract");
  //   const contractData = contract ? JSON.parse(contract) : null;
  const contractData = contract.contract;
  console.log(contractData);

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestedPayments, setRequestedPayments] = useState([]);

  const getPayments = async () => {
    const contractId = contractData._id;

    try {
      const response = await fetch(`/api/payment/get-payments/${contractId}`, {
        method: "GET",
      });

      const data = await response.json();
      console.log("data", data);
      if (data) {
        console.log(data);
        setRequestedPayments(data);
        setLoading(false);
      } else {
        alert("Error: " + data.massage);
        setLoading(false);
      }
    } catch (error) {
      console.error("Payment submission failed", error);
      setLoading(false);
      alert("Failed to submit payment details.");
    }
  };
  useEffect(() => {
    getPayments();
  }, []);

  const handleAction = async (action, paymentId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/payment/approve-payment/${paymentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Payment ${action}d successfully!`);
        // if (onUpdate) onUpdate();
      } else {
        alert(data.message || `Failed to ${action} payment`);
      }
    } catch (error) {
      console.error(`Error ${action}ing payment:`, error);
      alert("Something went wrong");
    }
    setLoading(false);
  };
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Admin Payment Dashboard
      </h1>

      {loading ? (
        <p className="text-center text-gray-400">Loading payments...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : requestedPayments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requestedPayments
            .filter((payment) => payment.status === "Pending")
            .map((payment) => (
              <div
                key={payment._id}
                className="bg-gray-900 p-6 rounded-lg shadow-md"
              >
                <p className="text-lg text-teal-400">
                  ID: {payment.contractId}
                </p>
                <p className="text-gray-400">
                  Bid Amount: ₹{payment.bidAmount}
                </p>
                <p className="text-gray-400">
                  Payment Requested: ₹{payment.paymentMade}
                </p>
                <p className="text-gray-400">Reason: {payment.reason}</p>
                <p className="text-yellow-400">Status: {payment.status}</p>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleAction("Approve", payment._id)}
                    disabled={loading}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-md"
                  >
                    {loading ? "Processing..." : "Approve"}
                  </button>
                  <button
                    onClick={() => handleAction("Deny", payment._id)}
                    disabled={loading}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md"
                  >
                    {loading ? "Processing..." : "Deny"}
                  </button>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">No pending payments found.</p>
      )}
    </div>
  );
};

export default AdminPaymentPage;
