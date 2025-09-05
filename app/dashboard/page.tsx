"use client";

import { useState, useMemo } from "react";
import { mockReports, CATEGORIES, CivicReport } from "@/lib/mockData";

export default function Dashboard() {
  const [sortBy, setSortBy] = useState<'reports' | 'resolved'>('reports');
  const [filterStatus, setFilterStatus] = useState<'all' | 'resolved' | 'pending'>('all');

  // Calculate district-wise statistics
  const districtStats = useMemo(() => {
    const stats = mockReports.reduce((acc, report) => {
      if (!acc[report.district]) {
        acc[report.district] = {
          district: report.district,
          totalReports: 0,
          resolved: 0,
          pending: 0,
          inProgress: 0
        };
      }
      
      acc[report.district].totalReports++;
      
      if (report.status === 'resolved') acc[report.district].resolved++;
      else if (report.status === 'in-progress') acc[report.district].inProgress++;
      else acc[report.district].pending++;
      
      return acc;
    }, {} as Record<string, any>);

    return Object.values(stats).sort((a: any, b: any) => {
      if (sortBy === 'reports') return b.totalReports - a.totalReports;
      return b.resolved - a.resolved;
    });
  }, [sortBy]);

  // Calculate category-wise statistics
  const categoryStats = useMemo(() => {
    return CATEGORIES.map(category => {
      const categoryReports = mockReports.filter(r => r.category === category);
      return {
        category,
        total: categoryReports.length,
        resolved: categoryReports.filter(r => r.status === 'resolved').length,
        pending: categoryReports.filter(r => r.status === 'pending').length,
        inProgress: categoryReports.filter(r => r.status === 'in-progress').length
      };
    }).sort((a, b) => b.total - a.total);
  }, []);

  // Overall statistics
  const overallStats = useMemo(() => {
    const total = mockReports.length;
    const resolved = mockReports.filter(r => r.status === 'resolved').length;
    const pending = mockReports.filter(r => r.status === 'pending').length;
    const inProgress = mockReports.filter(r => r.status === 'in-progress').length;
    
    return {
      total,
      resolved,
      pending,
      inProgress,
      resolutionRate: Math.round((resolved / total) * 100)
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
            Civic Issue Dashboard – Jharkhand
          </h1>
          <p className="text-gray-600 text-center">
            Real-time monitoring and analytics of civic issues across Jharkhand
          </p>
        </div>

        {/* Overall Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Reports</h3>
                <p className="text-3xl font-bold text-blue-600">{overallStats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Resolved</h3>
                <p className="text-3xl font-bold text-green-600">{overallStats.resolved}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
                <p className="text-3xl font-bold text-yellow-600">{overallStats.inProgress}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100">
                <span className="text-2xl">⏰</span>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Pending</h3>
                <p className="text-3xl font-bold text-red-600">{overallStats.pending}</p>
              </div>
            </div>
          </div>
        </div>

        {/* District-wise Reports Table */}
        <div className="bg-white rounded-xl shadow-md mb-8 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">District-wise Reports</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSortBy('reports')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === 'reports' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Sort by Reports
                </button>
                <button
                  onClick={() => setSortBy('resolved')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === 'resolved' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Sort by Resolved
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    District
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Reports
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resolved
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    In Progress
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pending
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resolution Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {districtStats.map((district: any, idx: number) => {
                  const resolutionRate = Math.round((district.resolved / district.totalReports) * 100);
                  return (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{district.district}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm font-semibold text-gray-900">{district.totalReports}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {district.resolved}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          {district.inProgress}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {district.pending}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${resolutionRate}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{resolutionRate}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category-wise Statistics */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Category-wise Statistics</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categoryStats.map((category, idx) => (
                <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-medium text-gray-800 text-sm mb-3 line-clamp-2">
                    {category.category}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total:</span>
                      <span className="font-semibold">{category.total}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Resolved:</span>
                      <span className="font-semibold text-green-600">{category.resolved}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-yellow-600">In Progress:</span>
                      <span className="font-semibold text-yellow-600">{category.inProgress}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-red-600">Pending:</span>
                      <span className="font-semibold text-red-600">{category.pending}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
