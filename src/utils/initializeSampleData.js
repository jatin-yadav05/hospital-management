import { db } from '../config/firebase';
import { 
  doc, 
  setDoc, 
  collection, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';

export const initializeJatinData = async () => {
  try {
    // User Data
    const userData = {
      fullName: "Jatin Yadav",
      email: "jatin05yd@gmail.com",
      role: "patient",
      phone: "+91 9876543210",
      dateOfBirth: "1995-05-15",
      gender: "male",
      address: "123 Healthcare Street, Medical City, Delhi",
      emergencyContact: "+91 9876543211",
      bloodGroup: "O+",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      medicalHistory: {
        allergies: ["Penicillin"],
        chronicConditions: ["None"],
        currentMedications: ["Vitamin D3"],
        pastSurgeries: ["None"]
      }
    };

    // Appointments Data
    const appointments = [
      {
        userId: "jatin_user",
        appointmentType: "Regular Checkup",
        department: "General Medicine",
        doctor: "Dr. Sarah Johnson",
        preferredDate: "2024-02-25",
        preferredTime: "10:00",
        symptoms: "Annual health checkup",
        status: "scheduled",
        createdAt: serverTimestamp()
      },
      {
        userId: "jatin_user",
        appointmentType: "Follow-up",
        department: "Cardiology",
        doctor: "Dr. Michael Chen",
        preferredDate: "2024-03-05",
        preferredTime: "14:30",
        symptoms: "Follow-up for blood pressure monitoring",
        status: "pending",
        createdAt: serverTimestamp()
      }
    ];

    // Medical Records
    const medicalRecords = [
      {
        userId: "jatin_user",
        type: "Lab Report",
        date: "2024-02-15",
        doctor: "Dr. Sarah Johnson",
        category: "Blood Test",
        description: "Annual blood work results",
        results: {
          bloodPressure: "120/80",
          heartRate: "72",
          bloodSugar: "95",
          cholesterol: "180",
          hemoglobin: "14.5"
        },
        recommendations: "Continue with current diet and exercise routine",
        nextCheckup: "2024-08-15",
        createdAt: serverTimestamp()
      },
      {
        userId: "jatin_user",
        type: "Prescription",
        date: "2024-02-15",
        doctor: "Dr. Sarah Johnson",
        medications: [
          {
            name: "Vitamin D3",
            dosage: "60,000 IU",
            frequency: "Once a week",
            duration: "8 weeks"
          }
        ],
        notes: "Take with meals",
        createdAt: serverTimestamp()
      }
    ];

    // Health Metrics
    const healthMetrics = {
      userId: "jatin_user",
      metrics: [
        {
          date: "2024-02-15",
          bloodPressure: "120/80",
          heartRate: "72",
          weight: "70",
          temperature: "98.6",
          oxygenLevel: "98",
          createdAt: serverTimestamp()
        }
      ]
    };

    // Create user document
    await setDoc(doc(db, 'users', 'jatin_user'), userData);
    console.log('User data added successfully');

    // Add appointments
    for (const appointment of appointments) {
      await addDoc(collection(db, 'appointments'), appointment);
    }
    console.log('Appointments added successfully');

    // Add medical records
    for (const record of medicalRecords) {
      await addDoc(collection(db, 'medicalRecords'), record);
    }
    console.log('Medical records added successfully');

    // Add health metrics
    await setDoc(doc(db, 'healthMetrics', 'jatin_user'), healthMetrics);
    console.log('Health metrics added successfully');

    return true;
  } catch (error) {
    console.error('Error initializing sample data:', error);
    throw error;
  }
};

// Function to check if data exists
export const checkUserDataExists = async (userId) => {
  try {
    const userDoc = await doc(db, 'users', userId);
    const userSnapshot = await getDoc(userDoc);
    return userSnapshot.exists();
  } catch (error) {
    console.error('Error checking user data:', error);
    return false;
  }
}; 