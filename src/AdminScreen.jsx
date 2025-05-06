// AdminScreen.js
import React, { useEffect, useState } from 'react';
import { db } from './Firebase';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

const AdminScreen = () => {
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);

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

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'reports'));
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setReports(data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };
    fetchReports();
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

  const handleDeleteAppointment = async (id) => {
    try {
      await deleteDoc(doc(db, 'appointments', id));
      setAppointments((prev) => prev.filter((appt) => appt.id !== id));
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const handleDeleteReport = async (id) => {
    try {
      await deleteDoc(doc(db, 'reports', id));
      setReports((prev) => prev.filter((report) => report.id !== id));
    } catch (error) {
      console.error('Error deleting report:', error);
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

Best regards,
MrHealth Nutrition Centre`;

    const whatsappURL = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
  };

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
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">Admin Panel</h2>

      {/* Appointment Section */}
      <h3 className="text-xl font-semibold mb-4 text-gray-700">Appointment List</h3>
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg mb-8">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Number</th>
              <th className="p-2">Date</th>
              <th className="p-2">Services</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id} className="border-t">
                <td className="p-2 font-medium">{appointment.name}</td>
                <td className="p-2">{appointment.number}</td>
                <td className="p-2">{appointment.date}</td>
                <td className="p-2">
                  {appointment.services?.length
                    ? appointment.services.join(', ')
                    : 'None'}
                </td>
                <td className="p-2">{appointment.status}</td>
                <td className="p-2 space-y-2">
                  {appointment.status !== 'Completed' && (
                    <button
                      onClick={() => handleMarkAsCompleted(appointment.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 mr-2"
                    >
                      Mark as Completed
                    </button>
                  )}
                  <button
                    onClick={() => handleSendWhatsApp(appointment)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 mr-2"
                  >
                    WhatsApp
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this appointment?')) {
                        handleDeleteAppointment(appointment.id);
                      }
                    }}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Report Section */}
      <h3 className="text-xl font-semibold mb-4 text-gray-700">Health Reports</h3>
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="min-w-full table-auto text-sm">
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
                <td className="p-2">{report.height} cm</td>
                <td className="p-2">{report.weight} kg</td>
                <td className="p-2">{report.age}</td>
                <td className="p-2 capitalize">{report.gender}</td>
                <td className="p-2">{report.idealWeight} kg</td>
                <td className="p-2">{report.bmi}</td>
                <td className="p-2">{report.bmr}</td>
                <td className="p-2">{report.bodyFat}%</td>
                <td
                  className={`p-2 font-medium ${
                    report.weightStatus === 'Ideal Weight'
                      ? 'text-green-600'
                      : report.weightStatus === 'Over Ideal Weight'
                      ? 'text-red-600'
                      : 'text-yellow-600'
                  }`}
                >
                  {report.weightStatus}
                </td>
                <td className="p-2 flex flex-col gap-2">
                  <button
                    onClick={() => handleSendReportWhatsApp(report)}
                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                  >
                    WhatsApp
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this report?')) {
                        handleDeleteReport(report.id);
                      }
                    }}
                    className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                  >
                    Delete
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
