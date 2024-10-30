import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import {
  HeartIcon,
  ScaleIcon,
  BeakerIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

function HealthMetrics() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [metrics, setMetrics] = useState({
    bloodPressure: '',
    heartRate: '',
    weight: '',
    height: '',
    temperature: '',
    bloodSugar: '',
    oxygenLevel: '',
    bmi: '',
    notes: ''
  });

  // Fetch existing metrics
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const metricsDoc = await getDoc(doc(db, 'healthMetrics', currentUser.uid));
        if (metricsDoc.exists()) {
          const latestMetric = metricsDoc.data().metrics[0];
          setMetrics(prev => ({
            ...prev,
            ...latestMetric
          }));
        }
      } catch (err) {
        console.error('Error fetching metrics:', err);
      }
    };

    if (currentUser?.uid) {
      fetchMetrics();
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMetrics(prev => ({
      ...prev,
      [name]: value
    }));

    // Calculate BMI if both height and weight are present
    if ((name === 'height' || name === 'weight') && metrics.height && metrics.weight) {
      const heightInMeters = parseFloat(metrics.height) / 100;
      const weightInKg = parseFloat(metrics.weight);
      if (!isNaN(heightInMeters) && !isNaN(weightInKg) && heightInMeters > 0) {
        const bmi = (weightInKg / (heightInMeters * heightInMeters)).toFixed(1);
        setMetrics(prev => ({
          ...prev,
          bmi: bmi
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const metricsRef = doc(db, 'healthMetrics', currentUser.uid);
      const metricsDoc = await getDoc(metricsRef);
      
      const newMetric = {
        ...metrics,
        date: new Date().toISOString(),
        createdAt: serverTimestamp()
      };

      if (metricsDoc.exists()) {
        // Add new metrics to the beginning of the array
        const existingMetrics = metricsDoc.data().metrics || [];
        await setDoc(metricsRef, {
          userId: currentUser.uid,
          metrics: [newMetric, ...existingMetrics].slice(0, 10) // Keep only last 10 records
        });
      } else {
        // Create new document with first metrics
        await setDoc(metricsRef, {
          userId: currentUser.uid,
          metrics: [newMetric]
        });
      }

      setSuccess('Health metrics saved successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Error saving metrics:', err);
      setError('Failed to save health metrics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-white hover:text-blue-100 transition-colors"
              >
                <ArrowLeftIcon className="h-6 w-6" />
              </button>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-white">Health Metrics</h1>
                <p className="mt-2 text-blue-100">
                  Track and monitor your vital health measurements
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 text-red-700">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 text-green-700">
                {success}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Blood Pressure */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center">
                    <HeartIcon className="h-5 w-5 text-gray-400 mr-2" />
                    Blood Pressure (mmHg)
                  </div>
                </label>
                <input
                  type="text"
                  name="bloodPressure"
                  value={metrics.bloodPressure}
                  onChange={handleChange}
                  placeholder="120/80"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Heart Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center">
                    <HeartIcon className="h-5 w-5 text-gray-400 mr-2" />
                    Heart Rate (bpm)
                  </div>
                </label>
                <input
                  type="number"
                  name="heartRate"
                  value={metrics.heartRate}
                  onChange={handleChange}
                  placeholder="72"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center">
                    <ScaleIcon className="h-5 w-5 text-gray-400 mr-2" />
                    Weight (kg)
                  </div>
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="weight"
                  value={metrics.weight}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Height */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center">
                    <ScaleIcon className="h-5 w-5 text-gray-400 mr-2" />
                    Height (cm)
                  </div>
                </label>
                <input
                  type="number"
                  name="height"
                  value={metrics.height}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* BMI (Calculated) */}
              <div>
                <label className="block text-sm font-medium text-gray-700">BMI</label>
                <input
                  type="text"
                  value={metrics.bmi}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                />
              </div>

              {/* Blood Sugar */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center">
                    <BeakerIcon className="h-5 w-5 text-gray-400 mr-2" />
                    Blood Sugar (mg/dL)
                  </div>
                </label>
                <input
                  type="number"
                  name="bloodSugar"
                  value={metrics.bloodSugar}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Oxygen Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Oxygen Level (%)
                </label>
                <input
                  type="number"
                  name="oxygenLevel"
                  value={metrics.oxygenLevel}
                  onChange={handleChange}
                  max="100"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Temperature */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Temperature (°F)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="temperature"
                  value={metrics.temperature}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={metrics.notes}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Any additional information about your health metrics..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Metrics'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default HealthMetrics; 