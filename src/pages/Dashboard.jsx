import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    CalendarIcon,
    ClockIcon,
    UserIcon,
    DocumentTextIcon,
    ChartBarIcon,
    BellIcon,
    PlusIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

function Dashboard() {
    const { currentUser } = useAuth();
    const [userData, setUserData] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [healthMetrics, setHealthMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            if (!currentUser?.uid) return;

            try {
                setLoading(true);
                setError(null);

                // Fetch user profile
                const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                }

                // Fetch appointments
                const appointmentsQuery = query(
                    collection(db, 'appointments'),
                    where('userId', '==', currentUser.uid)
                );
                const appointmentsSnapshot = await getDocs(appointmentsQuery);
                const appointmentsData = appointmentsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setAppointments(appointmentsData);

                // Fetch medical records
                const recordsQuery = query(
                    collection(db, 'medicalRecords'),
                    where('userId', '==', currentUser.uid)
                );
                const recordsSnapshot = await getDocs(recordsQuery);
                const recordsData = recordsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setMedicalRecords(recordsData);

                // Fetch health metrics
                const metricsDoc = await getDoc(doc(db, 'healthMetrics', currentUser.uid));
                if (metricsDoc.exists()) {
                    setHealthMetrics(metricsDoc.data());
                }

            } catch (err) {
                console.error('Error fetching user data:', err);
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [currentUser]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-center text-red-600">
                <p>{error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                    Retry
                </button>
            </div>
        );
    }

    // If no data exists, show empty state
    if (!appointments.length && !medicalRecords.length && !healthMetrics) {
        return (
            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg shadow-lg p-8"
                    >
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            Welcome to Your Health Dashboard
                        </h1>
                        <p className="text-gray-600 mb-8">
                            Looks like you're new here! Let's get started by setting up your health profile.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="p-6 bg-blue-50 rounded-lg cursor-pointer"
                                onClick={() => navigate('/appointments')}
                            >
                                <CalendarIcon className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900">Book Appointment</h3>
                                <p className="mt-2 text-sm text-gray-500">Schedule your first consultation</p>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="p-6 bg-blue-50 rounded-lg cursor-pointer"
                                onClick={() => navigate('/profile')}
                            >
                                <UserIcon className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900">Complete Profile</h3>
                                <p className="mt-2 text-sm text-gray-500">Add your medical history</p>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="p-6 bg-blue-50 rounded-lg cursor-pointer"
                                onClick={() => navigate('/health-metrics')}
                            >
                                <ChartBarIcon className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900">Add Health Metrics</h3>
                                <p className="mt-2 text-sm text-gray-500">Track your vital signs</p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    // Add this function at the beginning of the Dashboard component
    const renderHealthSummary = () => {
        if (!userData?.medicalHistory && !healthMetrics) {
            return null;
        }

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow mb-8"
            >
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Health Summary</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Medical History Summary */}
                        {userData?.medicalHistory && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">Medical History</h3>
                                {userData.medicalHistory.allergies?.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Allergies</p>
                                        <p className="text-gray-900">{userData.medicalHistory.allergies.join(', ')}</p>
                                    </div>
                                )}
                                {userData.medicalHistory.chronicConditions?.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Chronic Conditions</p>
                                        <p className="text-gray-900">{userData.medicalHistory.chronicConditions.join(', ')}</p>
                                    </div>
                                )}
                                {userData.medicalHistory.currentMedications?.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Current Medications</p>
                                        <p className="text-gray-900">{userData.medicalHistory.currentMedications.join(', ')}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Latest Health Metrics */}
                        {healthMetrics?.metrics?.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-900">Latest Health Metrics</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Blood Pressure</p>
                                        <p className="text-gray-900">{healthMetrics.metrics[0].bloodPressure}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Heart Rate</p>
                                        <p className="text-gray-900">{healthMetrics.metrics[0].heartRate} bpm</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Weight</p>
                                        <p className="text-gray-900">{healthMetrics.metrics[0].weight} kg</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">BMI</p>
                                        <p className="text-gray-900">{healthMetrics.metrics[0].bmi}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    };

    // Main dashboard UI with data
    return (
        <div className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 mb-8 text-white"
                >
                    <h1 className="text-2xl font-bold">Welcome back, {userData?.fullName}</h1>
                    <p className="mt-2 text-blue-100">Here's your health overview</p>
                </motion.div>

                {/* Health Summary Section */}
                {renderHealthSummary()}

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg shadow p-6"
                    >
                        <div className="flex items-center">
                            <CalendarIcon className="h-8 w-8 text-blue-600" />
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Upcoming Appointments</p>
                                <p className="text-2xl font-semibold text-gray-900">{appointments.length}</p>
                            </div>
                        </div>
                    </motion.div>
                    {/* Add more stats cards here */}
                </div>

                {/* Appointments Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-lg shadow mb-8"
                >
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Appointments</h2>
                        <div className="space-y-4">
                            {appointments.map((appointment) => (
                                <div
                                    key={appointment.id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-center">
                                        <CalendarIcon className="h-10 w-10 text-blue-600" />
                                        <div className="ml-4">
                                            <p className="font-medium text-gray-900">{appointment.doctor}</p>
                                            <p className="text-sm text-gray-500">
                                                {appointment.preferredDate} at {appointment.preferredTime}
                                            </p>
                                            <p className="text-sm text-blue-600">{appointment.appointmentType}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => navigate(`/appointments/${appointment.id}`)}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                    >
                                        View Details
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Medical Records Section */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-lg shadow mb-8"
                >
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Medical Records</h2>
                        <div className="space-y-4">
                            {medicalRecords.map((record) => (
                                <div
                                    key={record.id}
                                    className="p-4 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900">{record.type}</p>
                                            <p className="text-sm text-gray-500">{record.date}</p>
                                            <p className="text-sm text-blue-600">{record.doctor}</p>
                                        </div>
                                        <button 
                                            onClick={() => navigate(`/medical-records/${record.id}`)}
                                            className="px-4 py-2 text-blue-600 hover:text-blue-700"
                                        >
                                            View Record
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Health Metrics Section */}
                {healthMetrics && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg shadow"
                    >
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Health Metrics</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {healthMetrics.metrics.map((metric, index) => (
                                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-500">{metric.date}</p>
                                        <p className="text-lg font-medium text-gray-900">
                                            BP: {metric.bloodPressure}
                                        </p>
                                        <p className="text-sm text-blue-600">
                                            Heart Rate: {metric.heartRate}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;