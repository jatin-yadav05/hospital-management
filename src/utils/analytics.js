import { getAnalytics, logEvent } from 'firebase/analytics';
import { app } from '../config/firebase';

const analytics = getAnalytics(app);

export const logPageView = (pageName) => {
  logEvent(analytics, 'page_view', {
    page_name: pageName
  });
};

export const logAppointmentBooked = (appointmentData) => {
  logEvent(analytics, 'appointment_booked', {
    department: appointmentData.department,
    doctor: appointmentData.doctor
  });
}; 