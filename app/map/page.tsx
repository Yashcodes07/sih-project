"use client";

import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import L from "leaflet";

// ✅ Red marker icon (works out of the box).
// If you want an arrow, put /public/red-arrow.png and change iconUrl to "/red-arrow.png".
const redMarkerIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const issues = [
  {
    id: 1,
    type: "Garbage",
    description: "Garbage pile not cleared",
    location: [23.3441, 85.3096], // Ranchi
    image: "/garbage.jpg",
    city: "Ranchi",
    time: "2 hours ago",
  },
  {
    id: 2,
    type: "Road",
    description: "Road pothole",
    location: [23.6102, 85.2799], // Bokaro
    image: "/road.jpeg",
    city: "Bokaro",
    time: "2 hours ago",
  },
  {
    id: 3,
    type: "Streetlight",
    description: "Streetlight outage",
    location: [23.7957, 86.4304], // Dhanbad
    image: "/strretlight.webp",
    city: "Dhanbad",
    time: "30 mins ago",
  },
  {
    id: 4,
    type: "Sanitation",
    description: "Public toilet not cleaned",
    location: [24.4800, 86.7000], // near Deoghar
    image: "/sanitation.jpg",
    city: "Deoghar",
    time: "50 mins ago",
  },
  {
    id: 5,
    type: "Food security",
    description: "Ration shop closed",
    location: [22.8046, 86.2029], // Jamshedpur
    image: "/fs.jpg",
    city: "Jamshedpur",
    time: "40 mins ago",
  },
  {
    id: 6,
    type: "Sanitation",
    description: "Drainage blocked",
    location: [23.6693, 86.1511], // Bokaro Steel City
    image: "/sanitation.jpg",
    city: "Bokaro",
    time: "24 mins ago",
  },
];

const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28", "#FFBB36"];

export default function Dashboard() {
  const [selected, setSelected] = useState<any>(null);

  const chartData = [
    { name: "Road", value: issues.filter((i) => i.type === "Road").length },
    { name: "Garbage", value: issues.filter((i) => i.type === "Garbage").length },
    { name: "Streetlight", value: issues.filter((i) => i.type === "Streetlight").length },
    { name: "Sanitation", value: issues.filter((i) => i.type === "Sanitation").length },
    { name: "Others", value: issues.filter((i) => !["Road","Garbage","Streetlight","Sanitation"].includes(i.type)).length },
  ];

  return (
    <div className="flex h-screen gap-4 p-4">
      {/* Sidebar */}
      <div className="w-1/5 bg-gray-200 p-4 border rounded-lg overflow-auto">
        <h1 className="text-xl text-black font-bold mb-4">Main Civic Issues</h1>
        <div className="space-y-2">
          <div className="border p-2 rounded-lg">
            <img src="/road.jpeg" className="h-20 w-full object-cover rounded" alt="Road" />
            <p className="font-semibold text-black">Road</p>
          </div>
          <div className="border p-2 rounded-lg">
            <img src="/garbage.jpg" className="h-20 w-full object-cover rounded" alt="Garbage" />
            <p className="font-semibold text-black">Garbage</p>
          </div>
          <div className="border p-2 rounded-lg">
            <img src="/strretlight.webp" className="h-20 w-full object-cover rounded" alt="Streetlight" />
            <p className="font-semibold text-black">Streetlight</p>
          </div>
          <div className="border p-2 rounded-lg">
            <img src="/watersupplky.jpg" className="h-20 w-full object-cover rounded" alt="Water Supply" />
            <p className="font-semibold text-black">Water-Supply</p>
          </div>
          <div className="border p-2 rounded-lg">
            <img src="/fs.jpg" className="h-20 w-full object-cover rounded" alt="Food Security" />
            <p className="font-semibold text-black">Food Security</p>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 rounded-lg overflow-hidden shadow relative">
        <MapContainer
          center={[23.6102, 85.2799]} // Center of Jharkhand (near Ranchi)
          zoom={7.5}
          className="h-full w-full"
          maxBounds={[
            [21.97, 83.34], // SW corner of Jharkhand
            [25.32, 87.98], // NE corner of Jharkhand
          ]}
          maxBoundsViscosity={1.0} // lock user inside Jharkhand
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {issues.map((issue) => (
            <Marker key={issue.id} position={issue.location as any} icon={redMarkerIcon}>
              <Popup>
                <div className="w-44">
                  <img
                    src={issue.image}
                    className="h-20 w-full object-cover rounded"
                    alt={issue.type}
                  />
                  <h2 className="font-bold mt-1">{issue.description}</h2>
                  <p className="text-sm text-gray-600">{issue.type} • {issue.city}</p>
                  <button
                    className="mt-2 bg-blue-500 text-white text-sm px-2 py-1 rounded"
                    onClick={() => setSelected(issue)}
                  >
                    Mark Resolved
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Right panel */}
      <div className="w-80 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-lg shadow h-[50vh]">
          <h2 className="font-bold mb-2 text-black">Issue Categories</h2>
          <PieChart width={300} height={250}>
            <Pie
              data={chartData}
              cx={145}
              cy={120}
              innerRadius={50}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        <div className="bg-white p-4 rounded-lg shadow h-[65vh] overflow-auto">
          <h2 className="font-bold mb-2 text-black">Incoming Feed</h2>
          {issues.map((issue) => (
            <div key={issue.id} className="flex items-center gap-2 mb-2">
              <img src={issue.image} className="h-10 w-10 object-cover rounded" alt="" />
              <div>
                <p className="text-sm font-semibold text-black/90">{issue.description}</p>
                <p className="text-xs text-gray-900">
                  {issue.city} • {issue.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
