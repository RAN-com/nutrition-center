import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { addDoc, collection } from 'firebase/firestore';
import { db } from './Firebase';
import ServiceCards from './Services';

const IdealWeightCalculator = () => {
  const [name, setName] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [idealWeight, setIdealWeight] = useState(null);
  const [bmi, setBmi] = useState(null);
  const [bmr, setBmr] = useState(null);
  const [bodyFat, setBodyFat] = useState(null);
  const [weightStatus, setWeightStatus] = useState('');

  const round = (num) => parseFloat(num.toFixed(2));

  const calculateAll = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const a = parseInt(age);
    if (h > 0 && w > 0) {
      const ideal = gender === 'male' ? (h - 100) * 0.9 : (h - 100) * 0.85;
      setIdealWeight(round(ideal));
      if (w < ideal) setWeightStatus('Under Ideal Weight');
      else if (w === ideal) setWeightStatus('Ideal Weight');
      else setWeightStatus('Over Ideal Weight');
      setBmi(round(w / ((h / 100) ** 2)));
    }
    if (h > 0 && w > 0 && a > 0) {
      const bmrResult =
        gender === 'male'
          ? 10 * w + 6.25 * h - 5 * a + 5
          : 10 * w + 6.25 * h - 5 * a - 161;
      setBmr(round(bmrResult));
      const fatResult =
        gender === 'male'
          ? 1.2 * (w / ((h / 100) ** 2)) + 0.23 * a - 16.2
          : 1.2 * (w / ((h / 100) ** 2)) + 0.23 * a - 5.4;
      setBodyFat(round(fatResult));
    }
  };

  const getStatusColor = () => {
    if (weightStatus === 'Ideal Weight') return 'text-green-600';
    if (weightStatus === 'Over Ideal Weight') return 'text-red-600';
    if (weightStatus === 'Under Ideal Weight') return 'text-orange-500';
    return '';
  };

  const saveReport = async () => {
    try {
      await addDoc(collection(db, 'reports'), {
        name,
        height,
        weight,
        age,
        gender,
        phoneNumber,
        idealWeight,
        bmi,
        bmr,
        bodyFat,
        weightStatus,
        createdAt: new Date(),
      });
    } catch (err) {
      console.error('Error saving report:', err);
    }
  };

  const chartData = [
    { name: 'BMI', value: bmi || 0 },
    { name: 'BMR', value: bmr || 0 },
    { name: 'Body Fat %', value: bodyFat || 0 },
    { name: 'Ideal Weight', value: idealWeight || 0 },
  ];

  // Regular expression for phone number validation
  const phoneNumberRegex = /^[0-9]{10}$/;  // Example for a 10-digit number

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-emerald-100 to-indigo-200 px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow-2xl rounded-3xl p-6 w-full max-w-lg mx-auto border-t-4 border-indigo-400"
        >
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-2xl font-bold text-center mb-6 text-indigo-700"
          >
            Nutrition Centre
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-4 mb-6"
          >
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-xl"
            />
            <input
              type="number"
              placeholder="Height (cm)"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full p-3 border rounded-xl"
            />
            <input
              type="number"
              placeholder="Weight (kg)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full p-3 border rounded-xl"
            />
            <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full p-3 border rounded-xl"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full p-3 border rounded-xl"
            />
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full p-3 border rounded-xl"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                calculateAll();
                saveReport();
              }}
              className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-xl font-semibold"
            >
              Calculate All & Save
            </motion.button>
          </motion.div>

          <div className="bg-indigo-50 p-4 rounded-xl shadow-inner">
            <table className="w-full text-left">
              <tbody>
                <tr>
                  <td className="font-semibold py-1">Ideal Weight:</td>
                  <td>{idealWeight ? `${idealWeight} kg` : '-'}</td>
                </tr>
                <tr>
                  <td className="font-semibold py-1">BMI:</td>
                  <td>{bmi ? `${bmi}` : '-'}</td>
                </tr>
                <tr>
                  <td className="font-semibold py-1">BMR:</td>
                  <td>{bmr ? `${bmr} kcal/day` : '-'}</td>
                </tr>
                <tr>
                  <td className="font-semibold py-1">Body Fat %:</td>
                  <td>{bodyFat ? `${bodyFat}%` : '-'}</td>
                </tr>
                <tr>
                  <td className="font-semibold py-1">Status:</td>
                  <td className={getStatusColor()}>
                    {weightStatus || 'Not Calculated'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {bmi && bmr && (
            <div className="mt-6">
              <h3 className="text-center text-lg font-semibold mb-3">
                Health Summary Chart
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#6366F1"
                    fillOpacity={1}
                    fill="url(#colorVal)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>
      </div>

      <ServiceCards />
    </>
  );
};

export default IdealWeightCalculator;
