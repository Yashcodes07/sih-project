export interface CivicReport {
  id: string;
  category: string;
  description: string;
  location: {
    lat: number;
    lng: number;
  };
  imageUrl: string;
  timestamp: number;
  status: "Pending" | "In-Progress" | "Marked" | "Resolved";
  district: string;
}

export const CATEGORIES = [
  "Sanitation and Waste Management",
  "Roads and Infrastructure", 
  "Drainage and Sewerage",
  "Public Health and Hygiene",
  "Water Supply",
  "Illegal Construction and Encroachments",
  "Public Property and Utilities",
  "Traffic and Parking"
];

export const getAllReports = () => mockReports;

export const mockReports: CivicReport[] = [
  // 1-5 hrs ago (5% - all Pending)
  {
    "id": "1",
    "category": "Sanitation and Waste Management", 
    "description": "Overflowing garbage bins near main market",
    "location": { "lat": 23.3443, "lng": 85.2960 },
    "imageUrl": "/garbage.jpg",
    "timestamp": Date.now() - 3 * 60 * 60 * 1000, // 3 hrs ago
    "status": "Pending",
    "district": "Ranchi"
  },
  {
    "id": "2", 
    "category": "Water Supply",
    "description": "No water supply for 3 days in residential area", 
    "location": { "lat": 23.7954, "lng": 86.4270 },
    "imageUrl": "/fs.jpg",
    "timestamp": Date.now() - 4 * 60 * 60 * 1000, // 4 hrs ago
    "status": "Pending", 
    "district": "Dhanbad"
  },

  // 10-48 hrs ago (30% - 80% Pending, 20% In-Progress)
  {
    "id": "3",
    "category": "Roads and Infrastructure",
    "description": "Large pothole causing traffic issues",
    "location": { "lat": 23.6693, "lng": 86.1511 },
    "imageUrl": "/road.jpeg", 
    "timestamp": Date.now() - 15 * 60 * 60 * 1000, // 15 hrs ago
    "status": "Pending",
    "district": "Bokaro"
  },
  {
    "id": "4",
    "category": "Public Health and Hygiene",
    "description": "Stagnant water breeding mosquitoes",
    "location": { "lat": 22.7785, "lng": 86.2090 },
    "imageUrl": "/sanitation.jpg",
    "timestamp": Date.now() - 22 * 60 * 60 * 1000, // 22 hrs ago
    "status": "Pending",
    "district": "East Singhbhum"
  },
  {
    "id": "5",
    "category": "Sanitation and Waste Management",
    "description": "Medical waste improperly disposed", 
    "location": { "lat": 23.9800, "lng": 85.3500 },
    "imageUrl": "/sanitation.jpg",
    "timestamp": Date.now() - 28 * 60 * 60 * 1000, // 28 hrs ago
    "status": "In-Progress",
    "district": "Hazaribagh"
  },
  {
    "id": "6",
    "category": "Water Supply",
    "description": "Burst water pipeline wasting clean water",
    "location": { "lat": 24.1800, "lng": 86.3000 },
    "imageUrl": "/pipeline.jpg", 
    "timestamp": Date.now() - 35 * 60 * 60 * 1000, // 35 hrs ago
    "status": "Pending",
    "district": "Giridih"
  },
  {
    "id": "7",
    "category": "Drainage and Sewerage",
    "description": "Blocked drainage causing waterlogging",
    "location": { "lat": 24.2710, "lng": 87.2494 },
    "imageUrl": "/sewage.jpg",
    "timestamp": Date.now() - 41 * 60 * 60 * 1000, // 41 hrs ago
    "status": "Pending",
    "district": "Dumka"
  },
  {
    "id": "8",
    "category": "Public Health and Hygiene", 
    "description": "Dead animal on roadside causing health hazard",
    "location": { "lat": 23.6344, "lng": 85.5264 },
    "imageUrl": "/da.webp",
    "timestamp": Date.now() - 44 * 60 * 60 * 1000, // 44 hrs ago
    "status": "In-Progress",
    "district": "Ramgarh"
  },
  {
    "id": "9",
    "category": "Water Supply",
    "description": "Contaminated water supply causing illness", 
    "location": { "lat": 24.1200, "lng": 84.5600 },
    "imageUrl": "/fs.jpg",
    "timestamp": Date.now() - 46 * 60 * 60 * 1000, // 46 hrs ago
    "status": "Pending",
    "district": "Chatra"
  },
  {
    "id": "10",
    "category": "Traffic and Parking",
    "description": "Illegal parking blocking main road",
    "location": { "lat": 24.0200, "lng": 84.0400 },
    "imageUrl": "/parking.jpeg",
    "timestamp": Date.now() - 18 * 60 * 60 * 1000, // 18 hrs ago
    "status": "Pending", 
    "district": "Palamu"
  },
  {
    "id": "11",
    "category": "Sanitation and Waste Management",
    "description": "Garbage not collected for a week",
    "location": { "lat": 23.3200, "lng": 85.2800 },
    "imageUrl": "/garbage.jpg",
    "timestamp": Date.now() - 32 * 60 * 60 * 1000, // 32 hrs ago
    "status": "In-Progress",
    "district": "Ranchi"
  },

  // 1-3 weeks ago (30% - 50% Pending, 40% In-Progress, 10% Marked)
  {
    "id": "12",
    "category": "Water Supply", 
    "description": "Burst water pipeline wasting clean water",
    "location": { "lat": 23.7800, "lng": 86.4100 },
    "imageUrl": "/pipeline.jpg",
    "timestamp": Date.now() - 10 * 24 * 60 * 60 * 1000, // 10 days ago
    "status": "Marked",
    "district": "Dhanbad"
  },
  {
    "id": "13",
    "category": "Roads and Infrastructure",
    "description": "Broken road divider creating safety hazard",
    "location": { "lat": 23.6500, "lng": 86.0800 },
    "imageUrl": "/road.jpeg",
    "timestamp": Date.now() - 12 * 24 * 60 * 60 * 1000, // 12 days ago
    "status": "Pending",
    "district": "Bokaro"
  },
  {
    "id": "14",
    "category": "Public Health and Hygiene",
    "description": "Overflowing septic tank spreading diseases",
    "location": { "lat": 22.8000, "lng": 86.2000 },
    "imageUrl": "/sanitation.jpg", 
    "timestamp": Date.now() - 8 * 24 * 60 * 60 * 1000, // 8 days ago
    "status": "In-Progress",
    "district": "East Singhbhum"
  },
  {
    "id": "15",
    "category": "Drainage and Sewerage",
    "description": "Manhole cover missing creating safety hazard",
    "location": { "lat": 23.9700, "lng": 85.3400 },
    "imageUrl": "/sanitation.jpg",
    "timestamp": Date.now() - 14 * 24 * 60 * 60 * 1000, // 14 days ago
    "status": "Marked", // This is the special one for 70% threshold
    "district": "Hazaribagh"
  },
  {
    "id": "16",
    "category": "Water Supply",
    "description": "No water supply for 3 days in residential area",
    "location": { "lat": 24.1500, "lng": 86.2800 },
    "imageUrl": "/fs.jpg",
    "timestamp": Date.now() - 16 * 24 * 60 * 60 * 1000, // 16 days ago
    "status": "Pending",
    "district": "Giridih"
  },
  {
    "id": "17",
    "category": "Sanitation and Waste Management",
    "description": "Public toilet not cleaned for days",
    "location": { "lat": 23.4300, "lng": 84.6800 },
    "imageUrl": "/sanitation.jpg", 
    "timestamp": Date.now() - 18 * 24 * 60 * 60 * 1000, // 18 days ago
    "status": "In-Progress",
    "district": "Lohardaga"
  },
  {
    "id": "18", 
    "category": "Public Property and Utilities",
    "description": "Broken streetlight creating safety issue",
    "location": { "lat": 23.9600, "lng": 87.2400 },
    "imageUrl": "/streetlight.webp",
    "timestamp": Date.now() - 20 * 24 * 60 * 60 * 1000, // 20 days ago
    "status": "Pending",
    "district": "Dumka"
  },
  {
    "id": "19",
    "category": "Water Supply", 
    "description": "Contaminated water supply causing illness",
    "location": { "lat": 24.0800, "lng": 84.0600 },
    "imageUrl": "/fs.jpg",
    "timestamp": Date.now() - 15 * 24 * 60 * 60 * 1000, // 15 days ago
    "status": "In-Progress",
    "district": "Palamu"
  },
  {
    "id": "20",
    "category": "Roads and Infrastructure",
    "description": "Missing speed breakers near school zone",
    "location": { "lat": 23.6200, "lng": 85.5100 },
    "imageUrl": "/road.jpeg",
    "timestamp": Date.now() - 11 * 24 * 60 * 60 * 1000, // 11 days ago
    "status": "Pending",
    "district": "Ramgarh"
  },
  {
    "id": "21",
    "category": "Water Supply",
    "description": "Burst water pipeline wasting clean water", 
    "location": { "lat": 24.1000, "lng": 84.5200 },
    "imageUrl": "/pipeline.jpg",
    "timestamp": Date.now() - 13 * 24 * 60 * 60 * 1000, // 13 days ago
    "status": "In-Progress",
    "district": "Chatra"
  },

  // 2 months ago (20% - 20% Pending, 60% In-Progress, 20% Marked)
  {
    "id": "22",
    "category": "Water Supply",
    "description": "No water supply for 3 days in residential area",
    "location": { "lat": 23.3400, "lng": 85.2900 },
    "imageUrl": "/fs.jpg", 
    "timestamp": Date.now() - 45 * 24 * 60 * 60 * 1000, // 45 days ago
    "status": "In-Progress",
    "district": "Ranchi"
  },
  {
    "id": "23",
    "category": "Public Health and Hygiene",
    "description": "Stagnant water breeding mosquitoes",
    "location": { "lat": 23.7900, "lng": 86.4200 },
    "imageUrl": "/sanitation.jpg",
    "timestamp": Date.now() - 50 * 24 * 60 * 60 * 1000, // 50 days ago
    "status": "Pending",
    "district": "Dhanbad"
  },
  {
    "id": "24",
    "category": "Water Supply", 
    "description": "Burst water pipeline wasting clean water",
    "location": { "lat": 23.6600, "lng": 86.1400 },
    "imageUrl": "/pipeline.jpg",
    "timestamp": Date.now() - 55 * 24 * 60 * 60 * 1000, // 55 days ago
    "status": "In-Progress",
    "district": "Bokaro"
  },
  {
    "id": "25",
    "category": "Sanitation and Waste Management",
    "description": "Illegal dumping site near residential area",
    "location": { "lat": 22.7700, "lng": 86.1900 },
    "imageUrl": "/garbage.jpg",
    "timestamp": Date.now() - 40 * 24 * 60 * 60 * 1000, // 40 days ago
    "status": "Pending",
    "district": "East Singhbhum"
  },
  {
    "id": "26",
    "category": "Water Supply",
    "description": "Contaminated water supply causing illness",
    "location": { "lat": 23.9500, "lng": 85.3300 },
    "imageUrl": "/fs.jpg",
    "timestamp": Date.now() - 35 * 24 * 60 * 60 * 1000, // 35 days ago
    "status": "In-Progress", 
    "district": "Hazaribagh"
  },
  {
    "id": "27",
    "category": "Traffic and Parking",
    "description": "Missing traffic signal causing accidents",
    "location": { "lat": 24.1700, "lng": 86.2900 },
    "imageUrl": "/parking.jpeg",
    "timestamp": Date.now() - 42 * 24 * 60 * 60 * 1000, // 42 days ago
    "status": "In-Progress",
    "district": "Giridih"
  },
  {
    "id": "28", 
    "category": "Public Health and Hygiene",
    "description": "Overflowing septic tank spreading diseases",
    "location": { "lat": 24.2600, "lng": 87.2300 },
    "imageUrl": "/sanitation.jpg",
    "timestamp": Date.now() - 48 * 24 * 60 * 60 * 1000, // 48 days ago
    "status": "In-Progress",
    "district": "Dumka"
  },

  // 2-5 months ago (10% - 30% In-Progress, 70% Marked)
  {
    "id": "29",
    "category": "Water Supply",
    "description": "No water supply for 3 days in residential area",
    "location": { "lat": 23.6300, "lng": 85.5200 },
    "imageUrl": "/fs.jpg",
    "timestamp": Date.now() - 85 * 24 * 60 * 60 * 1000, // 85 days ago
    "status": "Pending",
    "district": "Ramgarh"
  },
  {
    "id": "30",
    "category": "Illegal Construction and Encroachments",
    "description": "Street vendors encroaching footpath",
    "location": { "lat": 23.3500, "lng": 85.2700 },
    "imageUrl": "/illegalc.jpeg", 
    "timestamp": Date.now() - 95 * 24 * 60 * 60 * 1000, // 95 days ago
    "status": "Pending",
    "district": "Ranchi"
  },
  {
    "id": "31",
    "category": "Water Supply",
    "description": "Burst water pipeline wasting clean water",
    "location": { "lat": 24.0900, "lng": 84.5100 },
    "imageUrl": "/pipeline.jpg",
    "timestamp": Date.now() - 110 * 24 * 60 * 60 * 1000, // 110 days ago
    "status": "In-Progress",
    "district": "Chatra"
  },
  {
    "id": "32",
    "category": "Public Property and Utilities",
    "description": "Public park equipment damaged", 
    "location": { "lat": 24.0100, "lng": 84.0300 },
    "imageUrl": "/streetlight.webp",
    "timestamp": Date.now() - 120 * 24 * 60 * 60 * 1000, // 120 days ago
    "status": "Pending",
    "district": "Palamu"
  },
  {
    "id": "33",
    "category": "Water Supply",
    "description": "Contaminated water supply causing illness",
    "location": { "lat": 23.4200, "lng": 84.6700 },
    "imageUrl": "/fs.jpg",
    "timestamp": Date.now() - 100 * 24 * 60 * 60 * 1000, // 100 days ago
    "status": "Pending", 
    "district": "Lohardaga"
  },
  {
    "id": "34",
    "category": "Traffic and Parking", 
    "description": "Illegal parking blocking main road",
    "location": { "lat": 22.7600, "lng": 86.1800 },
    "imageUrl": "/parking.jpeg",
    "timestamp": Date.now() - 130 * 24 * 60 * 60 * 1000, // 130 days ago
    "status": "Pending",
    "district": "East Singhbhum"
  },
  {
    "id": "35",
    "category": "Illegal Construction and Encroachments",
    "description": "Street vendors encroaching footpath",
    "location": { "lat": 23.9400, "lng": 85.3200 },
    "imageUrl": "/illegalc.jpeg",
    "timestamp": Date.now() - 105 * 24 * 60 * 60 * 1000, // 105 days ago
    "status": "Pending",
    "district": "Hazaribagh"
  },
  {
    "id": "36",
    "category": "Public Property and Utilities",
    "description": "Broken streetlight creating safety issue",
    "location": { "lat": 23.7800, "lng": 86.4000 },
    "imageUrl": "/streetlight.webp",
    "timestamp": Date.now() - 115 * 24 * 60 * 60 * 1000, // 115 days ago
    "status": "Pending",
    "district": "Dhanbad"
  }
];