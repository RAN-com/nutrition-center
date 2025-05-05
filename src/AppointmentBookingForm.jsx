import React, { useState } from 'react';
import { db } from './Firebase';
import { collection, addDoc } from 'firebase/firestore';

const AppointmentBookingForm = () => {
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [date, setDate] = useState('');
  const [services, setServices] = useState([]);
  const [message, setMessage] = useState('');

  const handleServiceChange = (e) => {
    const { options } = e.target;
    const selectedServices = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedServices.push(options[i].value);
      }
    }
    setServices(selectedServices);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'appointments'), {
        name,
        number,
        date,
        services,
        status: 'Pending',
      });

      setMessage('Appointment booked successfully!');
      setName('');
      setNumber('');
      setDate('');
      setServices([]);
    } catch (error) {
      console.error('Error booking appointment:', error);
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-300 via-purple-300 to-pink-300 p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-lg border-t-8 border-indigo-400 transition duration-500 hover:scale-[1.01]">
        <h2 className="text-3xl font-extrabold text-center mb-8 text-indigo-700 drop-shadow-lg">
          Book an Appointment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
            <input
              type="tel"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
              placeholder="9876543210"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Appointment Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full mt-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />
          </div>

          <div>
  <label className="block text-sm font-semibold text-gray-700 mb-2">
    Selec Services <span className="text-xs text-gray-400">(You can select multiple)</span>
  </label>
  <div className="relative">
    <select
      multiple
      value={services}
      onChange={handleServiceChange}
      className="w-full px-4 py-2 border border-purple-300 rounded-2xl shadow-inner bg-white focus:outline-none focus:ring-2 focus:ring-purple-400 h-44 text-gray-700 font-medium scroll-py-2"
    >
      <option value="weightLoss" className="py-1">💪 Weight Loss</option>
      <option value="weightGain" className="py-1">🍽️ Weight Gain</option>
      <option value="skinCareNutrition" className="py-1">🧴 Skin Care Nutrition</option>
      <option value="immunityHealth" className="py-1">🛡️ Immunity Health</option>
      <option value="heartHealth" className="py-1">❤️ Heart Health</option>
      <option value="fatCheckup" className="py-1">🔍 Fat Checkup</option>
      <option value="wholeBodyCheckup" className="py-1">🧍 Whole Body Checkup</option>
      <option value="wholeBodyCheckup" className="py-1">🧍 Health Consulting</option>
    </select>
    <p className="text-xs text-gray-500 mt-1">Hold Ctrl (Windows) or ⌘ (Mac) to select multiple options.</p>
  </div>
</div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition duration-300 shadow-md"
          >
            Confirm Booking
          </button>

          {message && (
            <p
              className={`text-center mt-4 text-sm font-medium ${
                message.includes('successfully') ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AppointmentBookingForm;
