import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Hero from '../components/Hero';
import About from '../components/About';
import AnimationWrapper from '../components/AnimationWrapper';

function Home() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    if (currentUser) {
      navigate('/appointments');
    } else {
      navigate('/patient-portal');
    }
  };

  return (
    <AnimationWrapper>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Hero />
        <About />
        
        {/* Featured Services Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900">Featured Services</h2>
              <p className="mt-4 text-lg text-gray-500">
                Experience comprehensive healthcare with our specialized medical services
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {/* Emergency Care */}
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Emergency Care</h3>
                <p className="text-gray-600">24/7 emergency medical services with rapid response capabilities.</p>
              </div>

              {/* Primary Care */}
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Primary Care</h3>
                <p className="text-gray-600">Comprehensive primary healthcare services for all age groups.</p>
              </div>

              {/* Specialized Care */}
              <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Specialized Care</h3>
                <p className="text-gray-600">Expert care in various medical specialties and treatments.</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Call to Action Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-blue-600 py-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-8">
              Ready to experience better healthcare?
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
              onClick={handleBookAppointment}
            >
              {currentUser ? 'Schedule an Appointment' : 'Get Started'}
            </motion.button>
          </div>
        </motion.section>

        {/* User Dashboard Link */}
        {currentUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-8 text-center"
          >
            <button
              onClick={() => navigate('/dashboard')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Go to Dashboard →
            </button>
          </motion.div>
        )}
      </motion.div>
    </AnimationWrapper>
  );
}

export default Home; 