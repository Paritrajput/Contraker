"use client";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function issueDetail() {
  const [issueData, setIssueData] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const issueParam = searchParams.get("issue");
  console.log(issueParam);
  const parsedIssue = issueParam
    ? JSON.parse(decodeURIComponent(issueParam))
    : null;
  useEffect(() => {
    if (parsedIssue) {
      setIssueData(parsedIssue);
    }
  }, []);
  const handleRejectIssue = async () => {
    try {
      const response = await fetch(
        `/api/public-issue/issue-update/${parsedIssue._id}`,
        {
          method: "PUT",
        }
      );
      if(response.ok){
        router.push("/gov-sec")
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="my-16">
      {issueData && (
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-lg justify-self-center">
          <h2 className="text-2xl font-bold text-teal-400">Issue Details</h2>

          {parsedIssue.image && (
            <img
              src={parsedIssue.image}
              alt="Issue"
              className="w-full h-48 object-cover mt-3 rounded-md shadow-md"
            />
          )}
          <p className="mt-2">
            <strong className="text-teal-400">Type:</strong>{" "}
            {parsedIssue.issue_type}
          </p>
          <p>
            <strong className="text-teal-400">Description:</strong>{" "}
            {parsedIssue.description}
          </p>
          <p className="mt-2">
            <strong className="text-teal-400">Location:</strong>{" "}
            {parsedIssue.placename}
          </p>
          <p className="mt-2">
            <strong className="text-teal-400">Coordinate:</strong>{" "}
            {`${parsedIssue.location.lat}/${parsedIssue.location.lng}`}
          </p>
          <p className="mt-2">
            <strong className="text-teal-400">Public Votes:</strong>{" "}
            {`Approvals : ${parsedIssue.approval}   , Denials : ${parsedIssue.denial}`}
          </p>
          <p className="mt-2">
            <strong className="text-teal-400">Issue Status:</strong>{" "}
            {parsedIssue.status}
          </p>

          <p className="mt-2">
            <strong className="text-teal-400">Date:</strong>{" "}
            {parsedIssue.date_of_complaint}
          </p>

          <div className="gap-20 flex mt-5 items-center  justify-self-center">
            <button
              onClick={() => {
                router.push(
                  `/make-tender?issue=${encodeURIComponent(
                    JSON.stringify(parsedIssue)
                  )}`
                );
              }}
              className="bg-green-600 rounded-xl py-2 px-3"
            >
              Resolve
            </button>
            <button onClick={handleRejectIssue} className="bg-red-600 rounded-xl py-2 px-3">Reject</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default issueDetail;
