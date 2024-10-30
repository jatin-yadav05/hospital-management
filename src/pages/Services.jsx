import React from 'react';
import { motion } from 'framer-motion';
import { 
  HeartIcon, 
  UserGroupIcon,
  BeakerIcon,
  ClipboardDocumentCheckIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import AnimationWrapper from '../components/AnimationWrapper';

function Services() {
  const services = [
    {
      icon: <HeartIcon className="h-8 w-8" />,
      title: "Cardiology",
      description: "Comprehensive heart care services including diagnostics, treatment, and prevention.",
      features: ["ECG/EKG", "Heart Surgery", "Cardiac Rehabilitation"]
    },
    {
      icon: <UserGroupIcon className="h-8 w-8" />,
      title: "Pediatrics",
      description: "Specialized healthcare services for infants, children, and adolescents.",
      features: ["Vaccinations", "Growth Monitoring", "Pediatric Surgery"]
    },
    {
      icon: <BeakerIcon className="h-8 w-8" />,
      title: "Laboratory",
      description: "State-of-the-art diagnostic testing and laboratory services.",
      features: ["Blood Tests", "Pathology", "Genetic Testing"]
    },
    {
      icon: <ClipboardDocumentCheckIcon className="h-8 w-8" />,
      title: "Preventive Care",
      description: "Comprehensive health screenings and preventive medicine services.",
      features: ["Health Screenings", "Immunizations", "Wellness Programs"]
    },
    {
      icon: <SparklesIcon className="h-8 w-8" />,
      title: "Emergency Care",
      description: "24/7 emergency medical services with rapid response capabilities.",
      features: ["Trauma Care", "Critical Care", "Emergency Surgery"]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <AnimationWrapper>
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-3xl font-bold text-gray-900">Our Services</h1>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              We offer a comprehensive range of medical services using the latest 
              technology and expert healthcare professionals.
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-center items-center w-12 h-12 bg-blue-100 rounded-lg text-blue-600 mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-500 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 * idx }}
                      className="flex items-center text-gray-600"
                    >
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                      {feature}
                    </motion.li>
                  ))}
                </ul>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  Learn More
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </AnimationWrapper>
  );
}

export default Services; 