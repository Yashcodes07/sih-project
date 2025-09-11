"use client";

import React, { useState, useMemo } from 'react';
import { useReports } from '@/lib/reportData';
import { CivicReport, CATEGORIES } from '@/lib/mockData';
import { formatTime } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Reports() {
  const { data: session } = useSession();
  const [reports, setReports] = useState(() => useReports()); // Make reports state to allow updates
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'In-Progress' | 'Marked' | 'Resolved'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedReport, setSelectedReport] = useState<CivicReport | null>(null);
  const [userVotes, setUserVotes] = useState<{[key: string]: 'up' | 'down' | null}>({});

  const filteredReports = useMemo(() => {
    let filtered = reports;
    if (statusFilter !== 'All') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(r => r.category === selectedCategory);
    }
    return filtered;
  }, [reports, statusFilter, selectedCategory]);

  // Real bar graph data for pending reports by month
  const barGraphData = useMemo(() => {
    const pendingReports = reports.filter(r => r.status === 'Pending');
    const categoryReports = selectedCategory === 'All' 
      ? pendingReports 
      : pendingReports.filter(r => r.category === selectedCategory);

    // Create last 12 months
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      const year = date.getFullYear();
      
      // Count actual reports in this month
      const count = categoryReports.filter(report => {
        const reportDate = new Date(report.timestamp);
        return reportDate.getMonth() === date.getMonth() && 
               reportDate.getFullYear() === date.getFullYear();
      }).length;
      
      months.push({
        month: `${monthName} ${year.toString().slice(-2)}`,
        count,
        fullMonth: monthName
      });
    }
    
    return months;
  }, [reports, selectedCategory]);

  // Fixed vote counts with positive values and totalUsers = 50
  const getVoteData = (reportId: string) => {
    const seed = reportId.charCodeAt(0);
    const upvotes = Math.max(0, Math.floor(Math.abs(Math.sin(seed) * 20)) + 5);
    const downvotes = Math.max(0, Math.floor(Math.abs(Math.cos(seed) * 10)));
    
    // Special case for report ID 15 - set to just below 70% threshold
    if (reportId === '15') {
      return {
        upvotes: 34, // 34/50 = 68% - just below 70% threshold
        downvotes: 3,
        totalUsers: 50
      };
    }
    
    return { upvotes, downvotes, totalUsers: 50 };
  };

  const handleVote = (reportId: string, voteType: 'up' | 'down') => {
    if (!session?.user) return;
    
    const currentVote = userVotes[reportId];
    let newVote: 'up' | 'down' | null = voteType;
    
    if (currentVote === voteType) {
      newVote = null;
    }
    
    setUserVotes(prev => ({
      ...prev,
      [reportId]: newVote
    }));

    // Special logic for report ID 15 - auto-resolve at 70% threshold
    if (reportId === '15' && voteType === 'up' && currentVote !== 'up') {
      // Update the report status to Resolved
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === reportId 
            ? { ...report, status: 'Resolved' as const }
            : report
        )
      );
      
      // Update selected report if it's the one being voted on
      if (selectedReport?.id === reportId) {
        setSelectedReport(prev => prev ? { ...prev, status: 'Resolved' } : null);
      }
    }
  };

  const calculateVerificationRate = (reportId: string) => {
    const { upvotes, totalUsers } = getVoteData(reportId);
    const currentVote = userVotes[reportId];
    
    // Adjust upvotes based on current user vote
    let adjustedUpvotes = upvotes;
    if (currentVote === 'up') {
      adjustedUpvotes += 1;
    }
    
    // Special case for report 15 - if user upvoted, show 70%+
    if (reportId === '15' && currentVote === 'up') {
      return 70; // Just hit the threshold
    }
    
    return Math.round((adjustedUpvotes / totalUsers) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-6">
        <div className="max-w-[85%] mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Reports</h1>
          <p className="text-gray-600">Track and engage with civic issues across Jharkhand</p>
        </div>
      </div>

      <div className="max-w-[85%] mx-auto px-6 py-6">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-4 overflow-x-auto pb-2">
            {['All', 'Pending', 'In-Progress', 'Marked', 'Resolved'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status as any)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 whitespace-nowrap shadow-sm ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="xl:col-span-1 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Live Community Feed</h2>
              <p className="text-sm text-gray-600 mt-1">{filteredReports.length} reports found</p>
            </div>
            
            <div className="max-h-[70vh] overflow-y-auto p-6">
              <div className="space-y-4">
                {filteredReports.map(report => (
                  <div 
                    key={report.id} 
                    onClick={() => setSelectedReport(report)}
                    className={`border rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 ${
                      selectedReport?.id === report.id ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-1">{report.category}</h3>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>📍 {report.district}</span>
                          <span>⏰ {formatTime(report.timestamp)}</span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                        report.status === 'Pending' ? 'bg-red-100 text-red-800' :
                        report.status === 'In-Progress' ? 'bg-yellow-100 text-yellow-800' :
                        report.status === 'Marked' ? 'bg-blue-100 text-blue-800' : 
                        report.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 text-xs leading-relaxed line-clamp-2">{report.description}</p>
                    
                    {report.status === 'Marked' && (
                      <div className="mt-2 flex items-center space-x-2 text-xs text-gray-500">
                        <span>👍 {getVoteData(report.id).upvotes + (userVotes[report.id] === 'up' ? 1 : 0)}</span>
                        <span>👎 {getVoteData(report.id).downvotes + (userVotes[report.id] === 'down' ? 1 : 0)}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="xl:col-span-2 space-y-6">
            {/* Bar Graph */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Pending Reports Analysis</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedCategory === 'All' ? 'All Categories' : selectedCategory} - Last 12 Months
                </p>
              </div>
              
              <div className="p-6" style={{ height: '350px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barGraphData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#1e40af" stopOpacity={1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#64748b"
                      fontSize={12}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis stroke="#64748b" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: 'none', 
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '12px'
                      }}
                      labelStyle={{ color: '#e2e8f0' }}
                    />
                    <Bar 
                      dataKey="count" 
                      fill="url(#barGradient)"
                      radius={[4, 4, 0, 0]}
                      style={{
                        filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Detailed View Panel */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-teal-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Report Details</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedReport ? 'Detailed view with community verification' : 'Select a report from the feed'}
                </p>
              </div>

              <div className="max-h-[50vh] overflow-y-auto p-6">
                {selectedReport ? (
                  <div className="space-y-6">
                    {/* Report Header with Image */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-2xl font-bold text-gray-900">{selectedReport.category}</h3>
                          <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase ${
                            selectedReport.status === 'Pending' ? 'bg-red-100 text-red-800' :
                            selectedReport.status === 'In-Progress' ? 'bg-yellow-100 text-yellow-800' :
                            selectedReport.status === 'Marked' ? 'bg-blue-100 text-blue-800' : 
                            selectedReport.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {selectedReport.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-sm text-gray-600">Location</div>
                            <div className="font-semibold text-gray-900">{selectedReport.district}</div>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3">
                            <div className="text-sm text-gray-600">Reported</div>
                            <div className="font-semibold text-gray-900">{formatTime(selectedReport.timestamp)}</div>
                          </div>
                        </div>
                      </div>

                      {/* Report Image */}
                      <div className="bg-gray-100 rounded-lg overflow-hidden">
                        <img 
                          src={selectedReport.imageUrl} 
                          alt={selectedReport.category}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-image.jpg';
                          }}
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-4">
                        {selectedReport.description}
                      </p>
                    </div>

                    {/* Voting Section - Only for Marked Reports */}
                    {selectedReport.status === 'Marked' && session?.user && (
                      <div className="border-t border-gray-200 pt-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Community Verification</h4>
                        
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">Community Verification Rate</span>
                            <span className="text-2xl font-bold text-green-600">
                              {calculateVerificationRate(selectedReport.id)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${calculateVerificationRate(selectedReport.id)}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            {getVoteData(selectedReport.id).upvotes + (userVotes[selectedReport.id] === 'up' ? 1 : 0)} out of {getVoteData(selectedReport.id).totalUsers} community members verified
                          </p>
                          
                          {selectedReport.id === '15' && calculateVerificationRate(selectedReport.id) >= 70 && (
                            <div className="mt-3 p-3 bg-green-100 border border-green-200 rounded-lg">
                              <p className="text-sm font-semibold text-green-800">
                                🎉 Threshold reached! This report has been automatically resolved.
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex space-x-4">
                          <button
                            onClick={() => handleVote(selectedReport.id, 'up')}
                            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                              userVotes[selectedReport.id] === 'up'
                                ? 'bg-green-600 text-white shadow-lg'
                                : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                            }`}
                          >
                            <span className="text-xl">👍</span>
                            <span>Upvote ({getVoteData(selectedReport.id).upvotes + (userVotes[selectedReport.id] === 'up' ? 1 : 0)})</span>
                          </button>

                          <button
                            onClick={() => handleVote(selectedReport.id, 'down')}
                            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                              userVotes[selectedReport.id] === 'down'
                                ? 'bg-red-600 text-white shadow-lg'
                                : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                            }`}
                          >
                            <span className="text-xl">👎</span>
                            <span>Downvote ({getVoteData(selectedReport.id).downvotes + (userVotes[selectedReport.id] === 'down' ? 1 : 0)})</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {selectedReport.status !== 'Marked' && (
                      <div className="border-t border-gray-200 pt-6">
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <p className="text-gray-600">
                            Community voting is only available for <span className="font-semibold">Marked</span> reports
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Select a Report</h3>
                    <p className="text-gray-500">
                      Click on any report from the community feed to view detailed information.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
