import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const initializeDoctorsData = async () => {
  const doctors = [
    {
      name: "Dr. Sarah Johnson",
      specialty: "Cardiology",
      department: "Cardiology",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2",
      experience: "15+ years",
      education: "MD - Cardiology, MBBS",
      description: "Specialized in interventional cardiology and heart diseases",
      languages: ["English", "Spanish"],
      availability: {
        monday: ["09:00-13:00", "15:00-18:00"],
        tuesday: ["09:00-13:00", "15:00-18:00"],
        wednesday: ["09:00-13:00"],
        thursday: ["09:00-13:00", "15:00-18:00"],
        friday: ["09:00-13:00", "15:00-18:00"]
      },
      ratings: 4.8,
      reviews: 127,
      consultationFee: "150"
    },
    {
      name: "Dr. Michael Chen",
      specialty: "Neurology",
      department: "Neurology",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d",
      experience: "12+ years",
      education: "MD - Neurology, MBBS",
      description: "Expert in neurological disorders and brain surgery",
      languages: ["English", "Chinese"],
      availability: {
        monday: ["10:00-14:00", "16:00-19:00"],
        tuesday: ["10:00-14:00", "16:00-19:00"],
        wednesday: ["10:00-14:00"],
        thursday: ["10:00-14:00", "16:00-19:00"],
        friday: ["10:00-14:00"]
      },
      ratings: 4.9,
      reviews: 98,
      consultationFee: "180"
    },
    // Add more doctors here...
  ];

  try {
    for (const doctor of doctors) {
      await addDoc(collection(db, 'doctors'), {
        ...doctor,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    console.log('Doctors data initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing doctors data:', error);
    throw error;
  }
}; 