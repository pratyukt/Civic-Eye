// Import all problem images  
import image1 from "../assets/CivicProblems/image1.png"; 
import image2 from "../assets/CivicProblems/image2.png"; 
import image3 from "../assets/CivicProblems/image3.png"; 
import image4 from "../assets/CivicProblems/image4.png"; 
import image5 from "../assets/CivicProblems/image5.jpeg";
import image6 from "../assets/CivicProblems/image6.png";

// Problem categories data
export const problemCategories = [
    { id: 1, name: "Water Supply", category: "Essential Services", image: image1 },
    { id: 2, name: "Electricity", category: "Power Infrastructure", image: image2 },
    { id: 3, name: "Road Conditions", category: "Transportation", image: image3 },
    { id: 4, name: "Public Facilities", category: "Civic Amenities", image: image4 },
    { id: 5, name: "Corruption", category: "Civic Amenities", image: image5 },
    { id: 6, name: "Transportation", category: "Civic Amenities", image: image6 }
];

// Lighter and warmer background gradients
export const backgroundGradients = [
    // 'bg-gradient-to-br from-blue-400 via-cyan-300 to-teal-400',       
    // 'bg-gradient-to-br from-yellow-400 via-orange-300 to-red-400',    
    // 'bg-gradient-to-br from-gray-400 via-slate-300 to-zinc-400',      
    // 'bg-gradient-to-br from-green-400 via-emerald-300 to-teal-400',   
    // 'bg-gradient-to-br from-purple-400 via-indigo-300 to-blue-400'    
    "#c8d2e0",
    "#c8d2e0",
    "#c8d2e0",
    "#c8d2e0"
];

// Header content for complaint portal
export const headerContent = {
    title1: "Have A Problem To Report?",
    title2: "Your Voice Matters For Change.",
    subtitle: "Help us build a better community by reporting issues",
};
