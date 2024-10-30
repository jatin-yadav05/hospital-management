import { db } from '../config/firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  updateDoc,
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';

// User related operations
export const getUserData = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId, data) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Appointments related operations
export const getUserAppointments = async (userId) => {
  try {
    const appointmentsRef = collection(db, 'appointments');
    const q = query(appointmentsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

export const createAppointment = async (appointmentData) => {
  try {
    const docRef = await addDoc(collection(db, 'appointments'), {
      ...appointmentData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
};

// Medical records operations
export const getUserMedicalRecords = async (userId) => {
  try {
    const recordsRef = collection(db, 'medicalRecords');
    const q = query(recordsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching medical records:', error);
    throw error;
  }
};

// Initialize sample user data
export const initializeSampleUser = async () => {
  const sampleUserData = {
    fullName: "Jatin Yadav",
    email: "jatin05yd@gmail.com",
    role: "patient",
    phone: "+1234567890",
    dateOfBirth: "1995-05-15",
    gender: "male",
    address: "123 Healthcare Street, Medical City",
    emergencyContact: "+1987654321",
    bloodGroup: "O+",
    createdAt: serverTimestamp(),
    medicalHistory: {
      allergies: ["Penicillin"],
      chronicConditions: [],
      currentMedications: [],
      pastSurgeries: []
    }
  };

  const sampleAppointments = [
    {
      userId: "sample_user_id", // This will be replaced with actual user ID
      appointmentType: "Regular Checkup",
      department: "General Medicine",
      doctor: "Dr. Sarah Johnson",
      preferredDate: "2024-02-25",
      preferredTime: "10:00",
      symptoms: "Regular health checkup",
      status: "scheduled",
      createdAt: serverTimestamp()
    }
  ];

  const sampleMedicalRecords = [
    {
      userId: "sample_user_id", // This will be replaced with actual user ID
      type: "Lab Report",
      date: "2024-02-15",
      doctor: "Dr. Michael Chen",
      description: "Annual blood work results",
      results: {
        bloodPressure: "120/80",
        heartRate: "72",
        bloodSugar: "95"
      },
      createdAt: serverTimestamp()
    }
  ];

  try {
    // Create user document
    const userRef = doc(db, 'users', 'jatin_sample_id');
    await setDoc(userRef, sampleUserData);

    // Create appointments
    for (const appointment of sampleAppointments) {
      appointment.userId = 'jatin_sample_id';
      await addDoc(collection(db, 'appointments'), appointment);
    }

    // Create medical records
    for (const record of sampleMedicalRecords) {
      record.userId = 'jatin_sample_id';
      await addDoc(collection(db, 'medicalRecords'), record);
    }

    console.log('Sample data initialized successfully');
  } catch (error) {
    console.error('Error initializing sample data:', error);
    throw error;
  }
}; 