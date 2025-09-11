// lib/reportData.ts
import { getAllReports } from "./mockData";
// For Firebase in future: const { fetchReportsFromDb } = "../firebaseApi";

export const useReports = () => {
  // In future, add runtime switch between mock/Firebase here
  return getAllReports();
};
