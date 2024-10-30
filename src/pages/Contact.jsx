import React from 'react';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon 
} from '@heroicons/react/24/outline';

function Contact() {
  const contactInfo = [
    {
      icon: <PhoneIcon className="h-6 w-6" />,
      title: "Phone",
      details: "+1 (555) 123-4567",
      subDetails: "Mon-Fri from 8am to 6pm"
    },
    {
      icon: <EnvelopeIcon className="h-6 w-6" />,
      title: "Email",
      details: "contact@medicare.com",
      subDetails: "We'll respond within 24 hours"
    },
    {
      icon: <MapPinIcon className="h-6 w-6" />,
      title: "Address",
      details: "123 Medical Center Drive",
      subDetails: "New York, NY 10001"
    }
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
          <p className="mt-4 text-lg text-gray-500">
            We're here to help and answer any questions you might have
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {contactInfo.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="flex justify-center items-center w-12 h-12 mx-auto bg-blue-100 rounded-full">
                <span className="text-blue-600">{item.icon}</span>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">{item.title}</h3>
              <p className="mt-2 text-base text-gray-600">{item.details}</p>
              <p className="mt-1 text-sm text-gray-500">{item.subDetails}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-6 lg:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                  Send Message
                </button>
              </form>
            </div>
            <div className="bg-gray-50 p-6 lg:p-8 rounded-lg">
              <iframe
                title="location"
                className="w-full h-full min-h-[400px] rounded-lg"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.25436351647!2d-74.11976404924044!3d40.69766374873451!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1656543799700!5m2!1sen!2sus"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact; 