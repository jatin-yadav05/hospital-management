import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, 
  UserGroupIcon, 
  CalendarIcon, 
  PhoneIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const dropdownRef = useRef(null);

  const handleBookAppointment = () => {
    navigate('/appointments');
  };

  const handlePatientPortal = () => {
    navigate('/patient-portal');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-blue-600 text-2xl font-bold">MediCare</Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex md:ml-10 space-x-8">
              <NavItem title="Home" icon={<HomeIcon className="w-5 h-5" />} to="/" />
              <NavItem title="Doctors" icon={<UserGroupIcon className="w-5 h-5" />} to="/doctors" />
              <NavItem title="Appointments" icon={<CalendarIcon className="w-5 h-5" />} to="/appointments" />
              <NavItem title="Contact" icon={<PhoneIcon className="w-5 h-5" />} to="/contact" />
              <NavItem 
                title="MediStore" 
                icon={<ShoppingBagIcon className="w-5 h-5" />} 
                to="/medistore" 
              />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              {isOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center">
            {currentUser ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                >
                  <UserCircleIcon className="h-8 w-8" />
                  <span>{currentUser.email}</span>
                </button>
                
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link
                      to="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/appointments"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      My Appointments
                    </Link>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      Profile Settings
                    </Link>
                    <Link
                      to="/order-history"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      Order History
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowProfileMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button 
                  onClick={handleBookAppointment}
                  className="ml-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Book Appointment
                </button>
                <button 
                  onClick={handlePatientPortal}
                  className="ml-4 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
                >
                  Patient Portal
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden absolute w-full bg-white z-50">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <MobileNavItem title="Home" icon={<HomeIcon className="w-5 h-5" />} to="/" />
            <MobileNavItem title="Doctors" icon={<UserGroupIcon className="w-5 h-5" />} to="/doctors" />
            <MobileNavItem title="Appointments" icon={<CalendarIcon className="w-5 h-5" />} to="/appointments" />
            <MobileNavItem title="Contact" icon={<PhoneIcon className="w-5 h-5" />} to="/contact" />
            <MobileNavItem 
              title="MediStore" 
              icon={<ShoppingBagIcon className="w-5 h-5" />} 
              to="/medistore" 
            />
          </div>
          <div className="px-4 py-3 space-y-2">
            {currentUser ? (
              <>
                <div className="flex items-center px-3 py-2 text-base font-medium text-gray-700">
                  <UserCircleIcon className="h-6 w-6 mr-2" />
                  {currentUser.email}
                </div>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-blue-50 rounded-md"
                >
                  Dashboard
                </Link>
                <Link
                  to="/appointments"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-blue-50 rounded-md"
                >
                  My Appointments
                </Link>
                <Link
                  to="/profile"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-blue-50 rounded-md"
                >
                  Profile Settings
                </Link>
                <Link
                  to="/order-history"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-blue-50 rounded-md"
                >
                  Order History
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={handleBookAppointment}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Book Appointment
                </button>
                <button 
                  onClick={handlePatientPortal}
                  className="w-full px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
                >
                  Patient Portal
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

const NavItem = ({ title, icon, to }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      flex items-center px-3 py-2 text-sm font-medium
      ${isActive 
        ? 'text-blue-600 border-b-2 border-blue-600' 
        : 'text-gray-600 hover:text-blue-600'
      }
    `}
  >
    {icon}
    <span className="ml-2">{title}</span>
  </NavLink>
);

const MobileNavItem = ({ title, icon, to }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      flex items-center px-3 py-2 text-base font-medium rounded-md
      ${isActive 
        ? 'text-blue-600 bg-blue-50' 
        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
      }
    `}
  >
    {icon}
    <span className="ml-2">{title}</span>
  </NavLink>
);

export default Navbar;