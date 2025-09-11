import { CivicReport } from './mockData';

// Utility functions for the project
export const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
  return date.toLocaleDateString();
};

export const updateReportStatus = (reportId: string, newStatus: 'Pending' | 'In-Progress' | 'Marked' | 'Resolved') => {
  // This will be implemented to update the mockData
  console.log(`Updating report ${reportId} to ${newStatus}`);
  return true;
};

export const getReportsFromLast5Days = (reports: CivicReport[]) => {
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
  
  return reports.filter(report => {
    const reportDate = new Date(report.timestamp);
    return reportDate >= fiveDaysAgo;
  });
};
