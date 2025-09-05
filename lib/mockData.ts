export interface CivicReport {
  id: string;
  category: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  imageUrl: string;
  timestamp: number;
  status: "pending" | "resolved" | "in-progress";
  city: string;
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

export const mockReports: CivicReport[] = [
  // Sanitation and Waste Management
  {
    id: "1",
    category: "Sanitation and Waste Management",
    description: "Overflowing garbage bins near main market",
    location: { lat: 23.3441, lng: 85.3096, address: "Main Market, Ranchi" },
    imageUrl: "/garbage.jpg",
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    status: "pending",
    city: "Ranchi",
    district: "Ranchi"
  },
  {
    id: "2", 
    category: "Sanitation and Waste Management",
    description: "Public toilet not cleaned for days",
    location: { lat: 22.8046, lng: 86.2029, address: "Steel City, Jamshedpur" },
    imageUrl: "/sanitation.jpg",
    timestamp: Date.now() - 5 * 60 * 60 * 1000,
    status: "pending",
    city: "Jamshedpur",
    district: "East Singhbhum"
  },
  {
    id: "3",
    category: "Sanitation and Waste Management", 
    description: "Illegal dumping site near residential area",
    location: { lat: 23.7957, lng: 86.4304, address: "Coal City, Dhanbad" },
    imageUrl: "/garbage.jpg",
    timestamp: Date.now() - 8 * 60 * 60 * 1000,
    status: "in-progress",
    city: "Dhanbad",
    district: "Dhanbad"
  },

  // Roads and Infrastructure  
  {
    id: "4",
    category: "Roads and Infrastructure",
    description: "Large pothole causing traffic issues",
    location: { lat: 23.6702, lng: 85.3136, address: "City Center, Bokaro" },
    imageUrl: "/road.jpeg", 
    timestamp: Date.now() - 1 * 60 * 60 * 1000,
    status: "pending",
    city: "Bokaro Steel City",
    district: "Bokaro"
  },
  {
    id: "5",
    category: "Roads and Infrastructure",
    description: "Broken road divider creating safety hazard",
    location: { lat: 24.5937, lng: 85.3647, address: "Main Road, Hazaribagh" },
    imageUrl: "/road.jpeg",
    timestamp: Date.now() - 12 * 60 * 60 * 1000,
    status: "resolved",
    city: "Hazaribagh",
    district: "Hazaribagh"
  },
  {
    id: "6", 
    category: "Roads and Infrastructure",
    description: "Missing speed breakers near school zone",
    location: { lat: 24.1854, lng: 86.3009, address: "School Road, Giridih" },
    imageUrl: "/road.jpeg",
    timestamp: Date.now() - 18 * 60 * 60 * 1000,
    status: "pending",
    city: "Giridih",
    district: "Giridih"
  },

  // Drainage and Sewerage
  {
    id: "7",
    category: "Drainage and Sewerage",
    description: "Blocked drainage causing waterlogging",
    location: { lat: 23.6693, lng: 86.1511, address: "Sector 4, Bokaro" },
    imageUrl: "/sanitation.jpg",
    timestamp: Date.now() - 3 * 60 * 60 * 1000,
    status: "pending",
    city: "Bokaro Steel City", 
    district: "Bokaro"
  },
  {
    id: "8",
    category: "Drainage and Sewerage",
    description: "Open sewage line near residential area",
    location: { lat: 24.4823, lng: 86.6977, address: "Civil Lines, Deoghar" },
    imageUrl: "/sanitation.jpg",
    timestamp: Date.now() - 6 * 60 * 60 * 1000,
    status: "in-progress",
    city: "Deoghar",
    district: "Deoghar"
  },

  // Public Health and Hygiene
  {
    id: "9",
    category: "Public Health and Hygiene", 
    description: "Stagnant water breeding mosquitoes",
    location: { lat: 23.8103, lng: 86.4669, address: "ISM Campus, Dhanbad" },
    imageUrl: "/sanitation.jpg",
    timestamp: Date.now() - 4 * 60 * 60 * 1000,
    status: "pending",
    city: "Dhanbad",
    district: "Dhanbad"
  },
  {
    id: "10",
    category: "Public Health and Hygiene",
    description: "Dead animal on roadside causing health hazard", 
    location: { lat: 23.2599, lng: 85.8491, address: "Main Road, Ramgarh" },
    imageUrl: "/sanitation.jpg",
    timestamp: Date.now() - 7 * 60 * 60 * 1000,
    status: "resolved",
    city: "Ramgarh",
    district: "Ramgarh"
  },

  // Water Supply
  {
    id: "11", 
    category: "Water Supply",
    description: "No water supply for 3 days in residential area",
    location: { lat: 24.0734, lng: 84.0687, address: "Gandhi Chowk, Palamu" },
    imageUrl: "/fs.jpg",
    timestamp: Date.now() - 9 * 60 * 60 * 1000,
    status: "pending",
    city: "Daltonganj",
    district: "Palamu"
  },
  {
    id: "12",
    category: "Water Supply", 
    description: "Burst water pipeline wasting clean water",
    location: { lat: 23.3569, lng: 85.3358, address: "Doranda, Ranchi" },
    imageUrl: "/fs.jpg",
    timestamp: Date.now() - 11 * 60 * 60 * 1000,
    status: "in-progress",
    city: "Ranchi",
    district: "Ranchi"
  },
  {
    id: "13",
    category: "Water Supply",
    description: "Contaminated water supply causing illness",
    location: { lat: 24.2049, lng: 84.9123, address: "New Area, Chatra" },
    imageUrl: "/fs.jpg", 
    timestamp: Date.now() - 15 * 60 * 60 * 1000,
    status: "pending",
    city: "Chatra",
    district: "Chatra"
  },
  {
    id: "14",
    category: "Water Supply",
    description: "Contaminated water supply causing illness",
    location: { lat: 22.7868, lng: 86.1848, address: "Bistupur, Jamshedpur" },
    imageUrl: "/garbage.jpg",
    timestamp: Date.now() - 13 * 60 * 60 * 1000,
    status: "pending",
    city: "Jamshedpur", 
    district: "East Singhbhum"
  },

  // Illegal Construction and Encroachments
  {
    id: "15",
    category: "Illegal Construction and Encroachments",
    description: "Street vendors encroaching footpath",
    location: { lat: 23.3729, lng: 85.3350, address: "Albert Ekka Chowk, Ranchi" },
    imageUrl: "/garbage.jpg",
    timestamp: Date.now() - 16 * 60 * 60 * 1000,
    status: "resolved",
    city: "Ranchi",
    district: "Ranchi"
  },

  // Public Property and Utilities
  {
    id: "16",
    category: "Public Property and Utilities",
    description: "Broken streetlight creating safety issue",
    location: { lat: 23.7307, lng: 86.4296, address: "Bank More, Dhanbad" },
    imageUrl: "/strretlight.webp",
    timestamp: Date.now() - 14 * 60 * 60 * 1000,
    status: "pending", 
    city: "Dhanbad",
    district: "Dhanbad"
  },
  {
    id: "17",
    category: "Public Property and Utilities",
    description: "Vandalized bus stop needs repair",
    location: { lat: 23.6236, lng: 85.2733, address: "Sector 1, Bokaro" },
    imageUrl: "/strretlight.webp",
    timestamp: Date.now() - 17 * 60 * 60 * 1000,
    status: "in-progress",
    city: "Bokaro Steel City",
    district: "Bokaro"
  },
  {
    id: "18",
    category: "Public Property and Utilities",
    description: "Public park equipment damaged",
    location: { lat: 24.6208, lng: 85.3647, address: "Canary Hill, Hazaribagh" },
    imageUrl: "/strretlight.webp",
    timestamp: Date.now() - 19 * 60 * 60 * 1000,
    status: "pending",
    city: "Hazaribagh", 
    district: "Hazaribagh"
  },

  // Traffic and Parking
  {
    id: "19",
    category: "Traffic and Parking",
    description: "Illegal parking blocking main road",
    location: { lat: 22.8077, lng: 86.2030, address: "Jubilee Park, Jamshedpur" },
    imageUrl: "/road.jpeg",
    timestamp: Date.now() - 20 * 60 * 60 * 1000,
    status: "pending",
    city: "Jamshedpur",
    district: "East Singhbhum"
  },
  {
    id: "20", 
    category: "Traffic and Parking",
    description: "Missing traffic signal causing accidents",
    location: { lat: 24.1767, lng: 86.3028, address: "Station Road, Giridih" },
    imageUrl: "/road.jpeg",
    timestamp: Date.now() - 21 * 60 * 60 * 1000,
    status: "resolved",
    city: "Giridih",
    district: "Giridih"
  },

  // Additional entries
  {
    id: "21",
    category: "Sanitation and Waste Management",
    description: "Medical waste improperly disposed",
    location: { lat: 24.2900, lng: 86.3800, address: "Hospital Road, Deoghar" },
    imageUrl: "/sanitation.jpg",
    timestamp: Date.now() - 22 * 60 * 60 * 1000,
    status: "pending",
    city: "Deoghar",
    district: "Deoghar"
  },
  {
    id: "22",
    category: "Roads and Infrastructure",
    description: "Bridge railing damaged posing danger",
    location: { lat: 24.0500, lng: 84.0500, address: "Bridge Road, Palamu" },
    imageUrl: "/road.jpeg", 
    timestamp: Date.now() - 23 * 60 * 60 * 1000,
    status: "pending",
    city: "Daltonganj",
    district: "Palamu"
  },
  {
    id: "23",
    category: "Drainage and Sewerage",
    description: "Manhole cover missing creating safety hazard",
    location: { lat: 24.2200, lng: 84.8900, address: "Main Road, Chatra" },
    imageUrl: "/sanitation.jpg",
    timestamp: Date.now() - 24 * 60 * 60 * 1000,
    status: "in-progress",
    city: "Chatra",
    district: "Chatra"
  },
  {
    id: "24",
    category: "Public Health and Hygiene",
    description: "Overflowing septic tank spreading diseases",
    location: { lat: 23.2400, lng: 85.8200, address: "Colony Road, Ramgarh" },
    imageUrl: "/sanitation.jpg",
    timestamp: Date.now() - 25 * 60 * 60 * 1000,
    status: "pending",
    city: "Ramgarh",
    district: "Ramgarh"
  },
  {
    id: "25",
    category: "Water Supply",
    description: "Hand pump not working in rural area",
    location: { lat: 23.1000, lng: 85.5000, address: "Village Road, Ranchi Rural" },
    imageUrl: "/fs.jpg",
    timestamp: Date.now() - 26 * 60 * 60 * 1000,
    status: "pending",
    city: "Ranchi",
    district: "Ranchi"
  }
];
