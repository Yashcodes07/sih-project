"use client";

import React, { useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import L from "leaflet";
import { mockReports, CATEGORIES, CivicReport } from "@/lib/mockData";

// Red marker icon
const redMarkerIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"];

export default function MapView() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter reports based on selected category
  const filteredReports = useMemo(() => {
    if (!selectedCategory) return mockReports;
    return mockReports.filter(report => report.category === selectedCategory);
  }, [selectedCategory]);

  // Calculate chart data
  const chartData = useMemo(() => {
    return CATEGORIES.map(category => ({
      name: category,
      value: mockReports.filter(report => report.category === category).length,
      shortName: category.split(' ')[0] // For better display
    }));
  }, []);

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return "Just now";
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold text-gray-800">{payload[0].payload.name}</p>
          <p className="text-blue-600">Reports: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar - Categories */}
      <div className="w-80 bg-white shadow-lg overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Categories</h2>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Show All Categories
            </button>
          )}
        </div>
        
        <div className="p-4 space-y-3">
          {CATEGORIES.map((category, index) => {
            const count = mockReports.filter(report => report.category === category).length;
            const isSelected = selectedCategory === category;
            
            return (
              <div
                key={category}
                onClick={() => setSelectedCategory(isSelected ? null : category)}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                  isSelected 
                    ? 'bg-blue-50 border-blue-500 shadow-md' 
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`font-medium text-sm ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>
                    {category}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isSelected ? 'bg-blue-200 text-blue-700' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Center Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={[23.5, 85.5]} // Centered on Jharkhand
          zoom={8}
          className="h-full w-full"
          minZoom={7}
          maxZoom={15}
          maxBounds={[[21.5, 83.5], [25.5, 88.5]]} // Rough bounds for Jharkhand
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {filteredReports.map((report) => (
            <Marker
              key={report.id}
              position={[report.location.lat, report.location.lng]}
              icon={redMarkerIcon}
            >
              <Popup className="custom-popup">
                <div className="p-2 max-w-xs">
                  <img 
                    src={report.imageUrl} 
                    alt="Issue" 
                    className="w-full h-24 object-cover rounded mb-2"
                  />
                  <h3 className="font-bold text-gray-800 text-sm mb-1">
                    {report.description}
                  </h3>
                  <p className="text-xs text-gray-600 mb-1">
                    {report.category} • {report.city}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    {formatTime(report.timestamp)}
                  </p>
                  <button className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded transition-colors">
                    Mark Resolved
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        
        {/* Category Filter Indicator */}
        {selectedCategory && (
          <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg shadow-lg border">
            <p className="text-sm font-medium text-gray-700">
              Showing: <span className="text-blue-600">{selectedCategory}</span>
            </p>
            <p className="text-xs text-gray-500">
              {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>

      {/* Right Panel - Charts and Feed */}
      <div className="w-96 bg-white shadow-lg overflow-y-auto">
        {/* Issue Categories Chart */}
        <div className="p-4 border-b">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Issue Categories</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%" 
                outerRadius={80}
                dataKey="value"
                label={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Incoming Feed */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Reports</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {mockReports
              .sort((a, b) => b.timestamp - a.timestamp)
              .slice(0, 10)
              .map((report) => (
                <div key={report.id} className="flex space-x-3 p-3 bg-gray-50 rounded-lg">
                  <img 
                    src={report.imageUrl} 
                    alt="Issue" 
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {report.description}
                    </p>
                    <p className="text-xs text-gray-600">
                      {report.city} • {formatTime(report.timestamp)}
                    </p>
                    <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                      report.status === 'resolved' ? 'bg-green-100 text-green-700' :
                      report.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
