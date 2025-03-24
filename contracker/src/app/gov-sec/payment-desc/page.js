"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const AdminPaymentPage = () => {
  const searchParams = useSearchParams();
  const contract = searchParams.get("contract");
  const contractData = contract ? JSON.parse(contract) : null;
  const referenceId = contractData?.referenceId || null;

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Dummy Data for testing
  const dummyPayments = [
    {
      _id: "pay001",
      referenceId: "REF-123",
      bidAmount: 50000,
      amountUsed: 30000,
      paymentMade: 20000,
      status: "Pending",
    },
    {
      _id: "pay002",
      referenceId: "REF-456",
      bidAmount: 80000,
      amountUsed: 60000,
      paymentMade: 50000,
      status: "Pending",
    },
  ];

  useEffect(() => {
    const fetchPayments = async () => {
      if (!referenceId) {
        setError("No reference ID found in contract data.");
        return;
      }

      setLoading(true);
      try {
        // const res = await fetch(`/api/payments/${referenceId}`);
        // const data = await res.json();
        // setPayments(data);
        setPayments(dummyPayments); // Use dummy data for now
      } catch (err) {
        setError("Failed to fetch payments.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [referenceId]);

  const handleUpdateStatus = async (status, id) => {
    try {
      console.log("Updating status for:", id);
      // const res = await fetch(`/api/payments`, {
      //   method: "PUT",
      //   body: JSON.stringify({ id, status }),
      //   headers: { "Content-Type": "application/json" },
      // });

      // const updatedPayment = await res.json();
      // setPayments((prev) =>
      //   prev.map((p) => (p._id === id ? { ...p, status: updatedPayment.status } : p))
      // );

      setPayments((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status: status ? "Approved" : "Denied" } : p))
      );
      alert(`Payment ${status ? "Approved" : "Denied"} successfully!`);
    } catch (error) {
      console.error("Error updating payment:", error);
      alert("Failed to update payment.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Admin Payment Dashboard</h1>

      {loading ? (
        <p className="text-center text-gray-400">Loading payments...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : payments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {payments.map((payment) => (
            <div key={payment._id} className="bg-gray-900 p-6 rounded-lg shadow-md">
              <p className="text-lg text-teal-400">Reference ID: {payment.referenceId}</p>
              <p className="text-gray-400">Bid Amount: ₹{payment.bidAmount.toLocaleString()}</p>
              <p className="text-gray-400">Amount Used: ₹{payment.amountUsed.toLocaleString()}</p>
              <p className="text-gray-400">Payment Made: ₹{payment.paymentMade.toLocaleString()}</p>
              <p className="text-yellow-400">Status: {payment.status}</p>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleUpdateStatus(true, payment._id)}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-md"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleUpdateStatus(false, payment._id)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md"
                >
                  Deny
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
