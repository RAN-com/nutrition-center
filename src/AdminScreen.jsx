import React, { useEffect, useState } from 'react';
import { db } from './Firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const AdminScreen = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const snapshot = await getDocs(collection(db, 'appointments'));
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    })();
  }, []);

  const handleMarkAsCompleted = async (id) => {
    try {
      const appointmentRef = doc(db, 'appointments', id);
      await updateDoc(appointmentRef, { status: 'Completed' });

      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === id ? { ...appointment, status: 'Completed' } : appointment
        )
      );
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const handleSendWhatsApp = (appointment) => {
    const { name, number, date, services = [] } = appointment;

    const message = `To: ${name}
Date: ${date}
Service: ${services.join(', ') || 'General Consultation'}

Dear ${name},

This is to confirm your appointment scheduled for ${date}, regarding your ${services.join(', ') || 'consultation'} program. Please ensure you arrive on time and bring any necessary documents or prior medical records for a smoother consultation.

If you have any questions or need to reschedule, feel free to contact us in advance.

Looking forward to assisting you in your health journey.

Best regards,
MrHealth Nutrition Centre`;

    const whatsappURL = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">Admin Panel</h2>
      <h3 className="text-xl font-semibold mb-4 text-gray-700">Appointment List</h3>

      <ul className="space-y-4">
        {appointments.map((appointment) => (
          <li
            key={appointment.id}
            className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
          >
            <p className="font-semibold text-lg text-indigo-600">
              {appointment.name} – {appointment.number} – {appointment.date}
            </p>
            <p className="text-sm text-gray-600 mb-1">
              Status: <span className="font-medium">{appointment.status}</span>
            </p>
            <p className="text-sm text-gray-600 mb-3">
              <strong>Services:</strong>{' '}
              {appointment.services && appointment.services.length > 0
                ? appointment.services.join(', ')
                : 'None'}
            </p>

            <div className="flex flex-wrap gap-3">
              {appointment.status !== 'Completed' && (
                <button
                  onClick={() => handleMarkAsCompleted(appointment.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  Mark as Completed
                </button>
              )}

              <button
                onClick={() => handleSendWhatsApp(appointment)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Send WhatsApp Message
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminScreen;
