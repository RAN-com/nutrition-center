// AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './Firebase'; // Import the Firestore database instance

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchAppointments();
    fetchServices();
    fetchUsers();
  }, []);

  const fetchAppointments = async () => {
    const querySnapshot = await getDocs(collection(db, 'appointments'));
    setAppointments(querySnapshot.docs.map((doc) => doc.data()));
  };

  const fetchServices = async () => {
    const querySnapshot = await getDocs(collection(db, 'services'));
    setServices(querySnapshot.docs.map((doc) => doc.data()));
  };

  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, 'users'));
    setUsers(querySnapshot.docs.map((doc) => doc.data()));
  };

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-xl font-semibold">Admin Dashboard</h3>

      <h4 className="font-semibold text-gray-700">Users</h4>
      <ul className="space-y-2">
        {users.map((user, index) => (
          <li key={index} className="border border-gray-300 rounded p-2">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
          </li>
        ))}
      </ul>

      <h4 className="font-semibold text-gray-700">Appointments</h4>
      <ul className="space-y-2">
        {appointments.map((appointment, index) => (
          <li key={index} className="border border-gray-300 rounded p-2">
            <p><strong>Name:</strong> {appointment.name}</p>
            <p><strong>Phone:</strong> {appointment.number}</p>
            <p><strong>Date:</strong> {appointment.date}</p>
            <p><strong>Time:</strong> {appointment.time}</p>
            <p><strong>Status:</strong> {appointment.status}</p>
          </li>
        ))}
      </ul>

      <h4 className="font-semibold text-gray-700">Services</h4>
      <ul className="space-y-2">
        {services.map((service, index) => (
          <li key={index} className="border border-gray-300 rounded p-2">
            <p><strong>{service.title}:</strong> {service.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
