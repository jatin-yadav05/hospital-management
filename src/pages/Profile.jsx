import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UserCircleIcon,
  KeyIcon,
  BellIcon,
  ShieldCheckIcon,
  CogIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { doc, getDoc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';

function Profile() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    emergencyContact: '',
    bloodGroup: '',
    medicalHistory: {
      allergies: [],
      chronicConditions: [],
      currentMedications: [],
      pastSurgeries: []
    },
    preferences: {
      notifications: {
        email: true,
        sms: true,
        appointments: true,
        reminders: true
      },
      language: 'English',
      timeZone: 'UTC'
    }
  });

  const [isMedicalHistoryEditing, setIsMedicalHistoryEditing] = useState(false);
  const [isPreferencesEditing, setIsPreferencesEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser?.uid) return;

      try {
        setLoading(true);
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(prevData => ({
            ...prevData,
            ...data,
            medicalHistory: {
              ...prevData.medicalHistory,
              ...(data.medicalHistory || {})
            },
            preferences: {
              ...prevData.preferences,
              ...(data.preferences || {}),
              notifications: {
                ...prevData.preferences.notifications,
                ...(data.preferences?.notifications || {})
              }
            }
          }));
        } else {
          await setDoc(doc(db, 'users', currentUser.uid), {
            fullName: currentUser.displayName || '',
            email: currentUser.email,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      
      const updateData = {
        ...userData,
        medicalHistory: {
          allergies: userData.medicalHistory.allergies || [],
          chronicConditions: userData.medicalHistory.chronicConditions || [],
          currentMedications: userData.medicalHistory.currentMedications || [],
          pastSurgeries: userData.medicalHistory.pastSurgeries || []
        },
        preferences: {
          language: userData.preferences.language || 'English',
          timeZone: userData.preferences.timeZone || 'UTC',
          notifications: {
            email: userData.preferences.notifications.email,
            sms: userData.preferences.notifications.sms,
            appointments: userData.preferences.notifications.appointments,
            reminders: userData.preferences.notifications.reminders
          }
        },
        updatedAt: serverTimestamp()
      };

      await updateDoc(userRef, updateData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleMedicalHistoryChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        [field]: Array.isArray(value) ? value : value.split(',').map(item => item.trim())
      }
    }));
  };

  const handlePreferencesChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value
      }
    }));
  };

  const handleNotificationChange = (key) => {
    setUserData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        notifications: {
          ...prev.preferences.notifications,
          [key]: !prev.preferences.notifications[key]
        }
      }
    }));
  };

  const handleMedicalHistorySubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        medicalHistory: userData.medicalHistory,
        updatedAt: serverTimestamp()
      });
      setSuccess('Medical history updated successfully!');
      setIsMedicalHistoryEditing(false);
    } catch (err) {
      console.error('Error updating medical history:', err);
      setError('Failed to update medical history');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        preferences: userData.preferences,
        updatedAt: serverTimestamp()
      });
      setSuccess('Preferences updated successfully!');
      setIsPreferencesEditing(false);
    } catch (err) {
      console.error('Error updating preferences:', err);
      setError('Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  const renderPersonalInfo = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={userData.fullName}
            onChange={handleChange}
            disabled={!isEditing}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            value={userData.email}
            disabled={!isEditing}
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            name="phone"
            value={userData.phone}
            onChange={handleChange}
            disabled={!isEditing}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={userData.dateOfBirth}
            onChange={handleChange}
            disabled={!isEditing}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select
            name="gender"
            value={userData.gender}
            onChange={handleChange}
            disabled={!isEditing}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Blood Group</label>
          <input
            type="text"
            name="bloodGroup"
            value={userData.bloodGroup}
            onChange={handleChange}
            disabled={!isEditing}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <textarea
            name="address"
            value={userData.address}
            onChange={handleChange}
            disabled={!isEditing}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
          <input
            type="text"
            name="emergencyContact"
            value={userData.emergencyContact}
            onChange={handleChange}
            disabled={!isEditing}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-4">
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Edit Profile
          </button>
        )}
      </div>
    </form>
  );

  const tabs = [
    { id: 'personal', icon: UserCircleIcon, label: 'Personal Info' },
    { id: 'medical', icon: DocumentTextIcon, label: 'Medical History' },
    { id: 'preferences', icon: CogIcon, label: 'Preferences' },
    { id: 'security', icon: KeyIcon, label: 'Security' },
    { id: 'notifications', icon: BellIcon, label: 'Notifications' },
    { id: 'privacy', icon: ShieldCheckIcon, label: 'Privacy' }
  ];

  const renderMedicalHistory = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Medical History</h3>
        <button
          onClick={() => setIsMedicalHistoryEditing(!isMedicalHistoryEditing)}
          className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          {isMedicalHistoryEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Allergies</label>
          <input
            type="text"
            value={userData.medicalHistory.allergies.join(', ')}
            onChange={(e) => handleMedicalHistoryChange('allergies', e.target.value)}
            disabled={!isMedicalHistoryEditing}
            placeholder="Enter allergies separated by commas"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Chronic Conditions</label>
          <input
            type="text"
            value={userData.medicalHistory.chronicConditions.join(', ')}
            onChange={(e) => handleMedicalHistoryChange('chronicConditions', e.target.value)}
            disabled={!isMedicalHistoryEditing}
            placeholder="Enter chronic conditions separated by commas"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Current Medications</label>
          <input
            type="text"
            value={userData.medicalHistory.currentMedications.join(', ')}
            onChange={(e) => handleMedicalHistoryChange('currentMedications', e.target.value)}
            disabled={!isMedicalHistoryEditing}
            placeholder="Enter current medications separated by commas"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Past Surgeries</label>
          <input
            type="text"
            value={userData.medicalHistory.pastSurgeries.join(', ')}
            onChange={(e) => handleMedicalHistoryChange('pastSurgeries', e.target.value)}
            disabled={!isMedicalHistoryEditing}
            placeholder="Enter past surgeries separated by commas"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      {isMedicalHistoryEditing && (
        <div className="flex justify-end">
          <button
            onClick={handleMedicalHistorySubmit}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Medical History'}
          </button>
        </div>
      )}
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Account Preferences</h3>
        <button
          onClick={() => setIsPreferencesEditing(!isPreferencesEditing)}
          className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          {isPreferencesEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Language</label>
          <select
            value={userData.preferences.language}
            onChange={(e) => handlePreferencesChange('language', e.target.value)}
            disabled={!isPreferencesEditing}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Chinese">Chinese</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Time Zone</label>
          <select
            value={userData.preferences.timeZone}
            onChange={(e) => handlePreferencesChange('timeZone', e.target.value)}
            disabled={!isPreferencesEditing}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="UTC">UTC</option>
            <option value="EST">Eastern Time</option>
            <option value="CST">Central Time</option>
            <option value="PST">Pacific Time</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Notification Preferences</label>
          <div className="space-y-2">
            {Object.entries(userData.preferences.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center">
                <input
                  type="checkbox"
                  id={key}
                  checked={value}
                  onChange={() => handlePreferencesChange('notifications', {
                    ...userData.preferences.notifications,
                    [key]: !value
                  })}
                  disabled={!isPreferencesEditing}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={key} className="ml-2 block text-sm text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()} Notifications
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isPreferencesEditing && (
        <div className="flex justify-end">
          <button
            onClick={handlePreferencesSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      )}
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
      </div>

      <div className="space-y-6">
        {/* Change Password */}
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-4">Change Password</h4>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Password</label>
              <input
                type="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                type="password"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Update Password
            </button>
          </form>
        </div>

        {/* Two-Factor Authentication */}
        <div className="pt-6 border-t border-gray-200">
          <h4 className="text-md font-medium text-gray-700 mb-4">Two-Factor Authentication</h4>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50">
              Enable 2FA
            </button>
          </div>
        </div>

        {/* Login History */}
        <div className="pt-6 border-t border-gray-200">
          <h4 className="text-md font-medium text-gray-700 mb-4">Recent Login Activity</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Chrome on Windows</span>
              <span className="text-gray-500">Today, 2:45 PM</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Safari on iPhone</span>
              <span className="text-gray-500">Yesterday, 10:30 AM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Notification Settings</h3>
      </div>

      <div className="space-y-6">
        {/* Email Notifications */}
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-4">Email Notifications</h4>
          <div className="space-y-3">
            {[
              { id: 'appointments', label: 'Appointment Reminders' },
              { id: 'prescriptions', label: 'Prescription Refills' },
              { id: 'results', label: 'Test Results' },
              { id: 'updates', label: 'Healthcare Updates' }
            ].map((item) => (
              <div key={item.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`email-${item.id}`}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`email-${item.id}`} className="ml-2 block text-sm text-gray-700">
                  {item.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* SMS Notifications */}
        <div className="pt-6 border-t border-gray-200">
          <h4 className="text-md font-medium text-gray-700 mb-4">SMS Notifications</h4>
          <div className="space-y-3">
            {[
              { id: 'appointments', label: 'Appointment Reminders' },
              { id: 'emergency', label: 'Emergency Alerts' },
              { id: 'confirmations', label: 'Booking Confirmations' }
            ].map((item) => (
              <div key={item.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`sms-${item.id}`}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`sms-${item.id}`} className="ml-2 block text-sm text-gray-700">
                  {item.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Push Notifications */}
        <div className="pt-6 border-t border-gray-200">
          <h4 className="text-md font-medium text-gray-700 mb-4">Push Notifications</h4>
          <div className="space-y-3">
            {[
              { id: 'reminders', label: 'Medication Reminders' },
              { id: 'updates', label: 'Health Updates' },
              { id: 'news', label: 'Healthcare News' }
            ].map((item) => (
              <div key={item.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={`push-${item.id}`}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`push-${item.id}`} className="ml-2 block text-sm text-gray-700">
                  {item.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacy = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Privacy Settings</h3>
      </div>

      <div className="space-y-6">
        {/* Profile Visibility */}
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-4">Profile Visibility</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">Who can see your profile</p>
                <p className="text-sm text-gray-500">Choose who can view your medical history</p>
              </div>
              <select className="mt-1 block w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option>Only My Doctors</option>
                <option>Healthcare Team</option>
                <option>Custom</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Sharing */}
        <div className="pt-6 border-t border-gray-200">
          <h4 className="text-md font-medium text-gray-700 mb-4">Data Sharing</h4>
          <div className="space-y-3">
            {[
              { id: 'research', label: 'Share data for medical research', description: 'Your data will be anonymized' },
              { id: 'insurance', label: 'Share with insurance provider', description: 'Required for claims processing' },
              { id: 'analytics', label: 'Healthcare analytics', description: 'Help improve our services' }
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">{item.label}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={item.id}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Export */}
        <div className="pt-6 border-t border-gray-200">
          <h4 className="text-md font-medium text-gray-700 mb-4">Your Data</h4>
          <div className="space-y-4">
            <button className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50">
              Download Medical Records
            </button>
            <button className="ml-4 px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-md hover:bg-red-50">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'personal':
        return renderPersonalInfo();
      case 'medical':
        return renderMedicalHistory();
      case 'preferences':
        return renderPreferences();
      case 'security':
        return renderSecurity();
      case 'notifications':
        return renderNotifications();
      case 'privacy':
        return renderPrivacy();
      default:
        return renderPersonalInfo();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
        >
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center">
              <UserCircleIcon className="h-12 w-12 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{userData.fullName}</h1>
              <p className="text-gray-500">{userData.email}</p>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-lg shadow">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="h-5 w-5 mr-3" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                {renderActiveTab()}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Profile; 