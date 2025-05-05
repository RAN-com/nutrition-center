import React, { useEffect, useState } from 'react';
import { db } from './Firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const AdminScreen = () => {
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);

  // Fetch appointments from Firestore
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

  // Fetch reports from Firestore
  useEffect(() => {
    const fetchReports = async () => {
      const snapshot = await getDocs(collection(db, 'reports'));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setReports(data);
    };

    fetchReports();
  }, []);

  // Mark appointment as completed
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

  // Send WhatsApp message for appointment
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

  // Send WhatsApp message for report
  const handleSendReportWhatsApp = (report) => {
    const { name, bmi, bmr, bodyFat, idealWeight, weightStatus, phoneNumber } = report;

    const message = `Health Report for ${name}:
BMI: ${bmi}
BMR: ${bmr}
Body Fat Percentage: ${bodyFat}%
Ideal Weight: ${idealWeight} kg
Status: ${weightStatus}

Dear ${name},

Please find your health report above. If you have any questions or need further assistance, feel free to reach out.

Best regards,
MrHealth Nutrition Centre`;

    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">Admin Panel</h2>

      {/* Appointment List Section */}
      <h3 className="text-xl font-semibold mb-4 text-gray-700">Appointment List</h3>
      <ul className="space-y-4">
        {appointments.map((appointment) => (
          <li key={appointment.id} className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
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

      {/* Reports Section */}
      <h3 className="text-xl font-semibold mb-4 text-gray-700 mt-6">Health Reports</h3>
      <div className="overflow-auto bg-white rounded-xl shadow-lg">
        <table className="min-w-full table-auto border text-sm">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Height</th>
              <th className="p-2">Weight</th>
              <th className="p-2">Age</th>
              <th className="p-2">Gender</th>
              <th className="p-2">Ideal</th>
              <th className="p-2">BMI</th>
              <th className="p-2">BMR</th>
              <th className="p-2">Fat %</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="border-t">
                <td className="p-2">{report.name}</td>
                <td className="p-2">{report.height}</td>
                <td className="p-2">{report.weight}</td>
                <td className="p-2">{report.age}</td>
                <td className="p-2 capitalize">{report.gender}</td>
                <td className="p-2">{report.idealWeight} kg</td>
                <td className="p-2">{report.bmi}</td>
                <td className="p-2">{report.bmr}</td>
                <td className="p-2">{report.bodyFat}%</td>
                <td className="p-2 font-medium">{report.weightStatus}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleSendReportWhatsApp(report)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Send Report via WhatsApp
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminScreen;
