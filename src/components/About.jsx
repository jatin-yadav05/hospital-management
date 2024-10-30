import React from 'react';
import { 
  UserGroupIcon, 
  HeartIcon, 
  BuildingOffice2Icon, 
  ClockIcon 
} from '@heroicons/react/24/outline';

function About() {
  const features = [
    {
      icon: <UserGroupIcon className="h-8 w-8 text-blue-600" />,
      title: "Expert Doctors",
      description: "Our team consists of highly qualified and experienced medical professionals."
    },
    {
      icon: <HeartIcon className="h-8 w-8 text-blue-600" />,
      title: "Quality Care",
      description: "We provide personalized care with a focus on patient comfort and recovery."
    },
    {
      icon: <BuildingOffice2Icon className="h-8 w-8 text-blue-600" />,
      title: "Modern Facilities",
      description: "State-of-the-art medical facilities equipped with the latest technology."
    },
    {
      icon: <ClockIcon className="h-8 w-8 text-blue-600" />,
      title: "24/7 Service",
      description: "Round-the-clock emergency services and patient support."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Why Choose MediCare?
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            We are committed to providing exceptional healthcare services with a focus on patient comfort and well-being.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex justify-center">{feature.icon}</div>
              <h3 className="mt-4 text-xl font-medium text-gray-900 text-center">
                {feature.title}
              </h3>
              <p className="mt-2 text-gray-500 text-center">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About; 