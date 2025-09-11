"use client";

import React, { useState, useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { formatTime, getReportsFromLast5Days } from '@/lib/utils';
import { getAllReports, CivicReport, CATEGORIES } from '@/lib/mockData';
import { useReports } from '@/lib/reportData';
import L from 'leaflet';

// Dynamic import for Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

const districts = [
  'All Districts', 'Ranchi', 'Dhanbad', 'East Singhbhum', 'Bokaro',
  'Hazaribagh', 'Deoghar', 'Giridih', 'Ramgarh', 'Chatra', 'Palamu'
];

const categories = ['All Categories', ...CATEGORIES];

// Create custom red marker icon
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const COLORS = ['#FF4757', '#2ED573', '#3742FA', '#FFA502', '#FF6B9D', '#5F27CD'];

export default function MapView() {
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [reports, setReports] = useState<CivicReport[]>([]);

  useEffect(() => {
    // Load reports on component mount
    const initialReports = useReports();
    setReports(initialReports);
  }, []);

  // Filter reports based on selections
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const districtMatch = selectedDistrict === 'All Districts' || report.district === selectedDistrict;
      const categoryMatch = selectedCategory === 'All Categories' || report.category === selectedCategory;
      return districtMatch && categoryMatch;
    });
  }, [reports, selectedDistrict, selectedCategory]);

  // Get reports from last 5 days for feed
  const recentReports = useMemo(() => {
    return getReportsFromLast5Days(reports).slice(0, 10);
  }, [reports]);

  // Pie chart data with enhanced colors
  const pieChartData = useMemo(() => {
    const statusCounts = filteredReports.reduce((acc, report) => {
      acc[report.status] = (acc[report.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([status, count], index) => ({
      name: status,
      value: count,
      color: status === 'Pending' ? '#FF4757' :
             status === 'In-Progress' ? '#FFA502' :
             status === 'Marked' ? '#3742FA' : '#2ED573',
      percentage: ((count / filteredReports.length) * 100).toFixed(0)
    }));
  }, [filteredReports]);

  // Timeline data for last 6 months
  const timelineData = useMemo(() => {
    const last6months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return date;
    }).reverse();

    return last6months.map(date => {
      const monthReports = reports.filter(report => {
        const reportDate = new Date(report.timestamp);
        return reportDate.getMonth() === date.getMonth() && reportDate.getFullYear() === date.getFullYear();
      });

      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        reports: monthReports.length
      };
    });
  }, [reports]);

  const handleStatusUpdate = (reportId: string, newStatus: 'In-Progress' | 'Marked') => {
    setReports(prevReports =>
      prevReports.map(report =>
        report.id === reportId ? { ...report, status: newStatus } : report
      )
    );
  };

  const CustomPopup = ({ report }: { report: CivicReport }) => (
    <div className="bg-white rounded-lg p-4 shadow-lg border border-gray-200 min-w-[280px]">
      <div className="flex items-center justify-between mb-3">
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
          report.status === 'Pending' ? 'bg-red-100 text-red-800' :
          report.status === 'In-Progress' ? 'bg-yellow-100 text-yellow-800' :
          report.status === 'Marked' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
        }`}>
          {report.status.toUpperCase()}
        </span>
      </div>
      
      <h3 className="font-bold text-gray-900 text-lg mb-2">{report.category}</h3>
      <p className="text-gray-700 text-sm mb-4 leading-relaxed">{report.description}</p>
      
      <div className="space-y-2 mb-4">
        <div className="text-sm text-gray-600 flex items-center">
          <span className="mr-2">📍</span>
          <span>{report.district}</span>
        </div>
        <div className="text-sm text-gray-600 flex items-center">
          <span className="mr-2">⏰</span>
          <span>{formatTime(report.timestamp)}</span>
        </div>
      </div>

      {report.status === 'Pending' && (
        <div className="flex gap-2">
          <button
            onClick={() => handleStatusUpdate(report.id, 'In-Progress')}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-lg text-sm font-bold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            In-Progress
          </button>
          <button
            onClick={() => handleStatusUpdate(report.id, 'Marked')}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-lg text-sm font-bold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Marked
          </button>
        </div>
      )}
    </div>
  );

  // Custom label renderer for pie chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="font-bold text-sm"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="max-w-[90%] mx-auto">
          <p className="text-gray-600">Real-time monitoring and analytics of civic issues across Jharkhand</p>
        </div>
      </div>

      <div className="max-w-[90%] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Left Column - Map & Timeline (3/5 width) */}
          <div className="xl:col-span-3 flex flex-col gap-6">
            {/* Filters - Full Width */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 font-medium shadow-sm"
              >
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 font-medium shadow-sm"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Map */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex-grow">
              <div style={{ height: '65vh', width: '100%' }}>
                <MapContainer
                  center={[23.6345, 85.3803]}
                  zoom={7}
                  style={{ height: '100%', width: '100%' }}
                  className="rounded-xl"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  {filteredReports.map((report) => (
                    <Marker
                      key={report.id}
                      position={[report.location.lat, report.location.lng]}
                      icon={redIcon}
                    >
                      <Popup>
                        <CustomPopup report={report} />
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Reports Timeline (Last 6 Months)</h3>
              <div style={{ height: '250px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="reports" 
                      stroke="#3b82f6" 
                      fill="url(#colorGradient)" 
                      strokeWidth={2}
                    />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Right Column - Stats and Feed (2/5 width) */}
          <div className="xl:col-span-2 space-y-6">
            {/* Enhanced Pie Chart */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Issue Categories</h3>
              
              <div style={{ height: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      className="pie-chart-enhanced"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color}
                          className="pie-cell-hover"
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0', 
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-1 gap-2 mt-4">
                {pieChartData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: entry.color }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700 flex-1">
                      {entry.name} {entry.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Reports Feed */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Reports (Last 5 Days)</h3>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {recentReports.map((report) => (
                  <div key={report.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{report.category}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        report.status === 'Pending' ? 'bg-red-100 text-red-800' :
                        report.status === 'In-Progress' ? 'bg-yellow-100 text-yellow-800' :
                        report.status === 'Marked' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{report.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>📍 {report.district}</span>
                      <span>⏰ {formatTime(report.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
