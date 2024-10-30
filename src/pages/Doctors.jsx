import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { 
  UserIcon, 
  StarIcon, 
  CalendarIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { initializeDoctorsData } from '../utils/initializeDoctorsData';

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [initializing, setInitializing] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const departments = [
    "all",
    "Cardiology",
    "Neurology",
    "Pediatrics",
    "Orthopedics",
    "Dermatology",
    "General Medicine",
    "Dentistry",
    "Ophthalmology"
  ];

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const doctorsRef = collection(db, 'doctors');
      const doctorsSnapshot = await getDocs(doctorsRef);
      const doctorsData = doctorsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDoctors(doctorsData);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleInitializeDoctors = async () => {
    try {
      setInitializing(true);
      await initializeDoctorsData();
      await fetchDoctors(); // Refresh the doctors list
      alert('Sample doctors data initialized successfully!');
    } catch (error) {
      console.error('Error initializing doctors:', error);
      alert('Failed to initialize doctors data');
    } finally {
      setInitializing(false);
    }
  };

  const handleBookAppointment = (doctor) => {
    if (!currentUser) {
      navigate('/patient-portal');
      return;
    }

    navigate('/appointments', {
      state: {
        preselectedDoctor: doctor.name,
        preselectedDepartment: doctor.department
      }
    });
  };

  const filteredDoctors = selectedDepartment === 'all'
    ? doctors
    : doctors.filter(doctor => doctor.department === selectedDepartment);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Our Medical Experts</h1>
          <p className="mt-4 text-lg text-gray-500">
            Choose from our team of experienced healthcare professionals
          </p>

        </div>

        {/* Department Filter */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDepartment(dept)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedDepartment === dept
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {dept.charAt(0).toUpperCase() + dept.slice(1)}
            </button>
          ))}
        </div>

        {/* Doctors Grid */}
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDoctors.map((doctor) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img 
                src={doctor.image} 
                alt={doctor.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
                    <p className="text-blue-600">{doctor.specialty}</p>
                  </div>
                  <div className="flex items-center">
                    <StarIcon className="h-5 w-5 text-yellow-400" />
                    <span className="ml-1 text-gray-600">{doctor.ratings}</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-gray-600">
                    <BriefcaseIcon className="h-5 w-5 mr-2" />
                    <span>{doctor.experience}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <AcademicCapIcon className="h-5 w-5 mr-2" />
                    <span>{doctor.education}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                    <span>{doctor.languages.join(', ')}</span>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="text-gray-600">
                    <span className="font-medium text-lg">₹{doctor.consultationFee}</span>
                    <span className="text-sm"> per visit</span>
                  </div>
                  <button
                    onClick={() => handleBookAppointment(doctor)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Book Appointment
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Doctors;