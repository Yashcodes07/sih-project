"use client";

import { useState } from "react";

interface DistrictReport {
  district: string;
  reports: number;
  status: "Resolved" | "Pending";
}

const initialData: DistrictReport[] = [
  { district: "Ranchi", reports: 42, status: "Resolved" },
  { district: "Jamshedpur", reports: 35, status: "Pending" },
  { district: "Dhanbad", reports: 28, status: "Pending" },
  { district: "Bokaro", reports: 19, status: "Resolved" },
  { district: "Hazaribagh", reports: 15, status: "Pending" },
  { district: "Giridih", reports: 12, status: "Resolved" },
  { district: "Deoghar", reports: 10, status: "Pending" },
  { district: "Palamu", reports: 8, status: "Resolved" },
  { district: "Chatra", reports: 5, status: "Pending" },
  { district: "Other Districts", reports: 20, status: "Pending" },
];

export default function Dashboard() {
  const [reports] = useState(initialData);

  return (
    <main className="min-h-screen p-6 bg-white md:p-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Civic Issue Dashboard – Jharkhand
      </h1>

      <div className="overflow-x-auto bg-black/60 shadow-lg rounded-xl p-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-300 text-gray-800 rounded-xl">
              <th className="py-3 px-4">District</th>
              <th className="py-3 px-4">Reports Received</th>
              <th className="py-3 px-4">Action Status</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((item, idx) => (
              <tr
                key={idx}
                className="border-b hover:bg-gray-500 transition"
              >
                <td className="py-3 px-4 font-medium">{item.district}</td>
                <td className="py-3 px-4">{item.reports}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.status === "Resolved"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
