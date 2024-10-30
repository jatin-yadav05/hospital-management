import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserData, getUserAppointments, getUserMedicalRecords } from '../services/firestore';

export const useUserData = () => {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser?.uid) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch user profile
        const userProfile = await getUserData(currentUser.uid);
        setUserData(userProfile);

        // Fetch appointments
        const userAppointments = await getUserAppointments(currentUser.uid);
        setAppointments(userAppointments);

        // Fetch medical records
        const userMedicalRecords = await getUserMedicalRecords(currentUser.uid);
        setMedicalRecords(userMedicalRecords);

      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  return {
    userData,
    appointments,
    medicalRecords,
    loading,
    error
  };
}; 