import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
  const [calculated, setCalculated] = useState(false);
  const [formError, setFormError] = useState('');

  const navigate = useNavigate();

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

    setCalculated(true);
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

  const getStatusColor = () => {
    if (weightStatus === 'Ideal Weight') return 'text-green-600';
    if (weightStatus === 'Over Ideal Weight') return 'text-red-600';
    if (weightStatus === 'Under Ideal Weight') return 'text-orange-500';
    return '';
  };

  const handleBookingRedirect = () => {
    navigate('/book-appointment');
  };

  const handleCalculateClick = () => {
    if (!name || !height || !weight || !age || !phoneNumber) {
      setFormError('All fields are required. Please complete the form.');
      return;
    }

    setFormError('');
    calculateAll();
    saveReport();
  };

  const handleClearClick = () => {
    setName('');
    setHeight('');
    setWeight('');
    setAge('');
    setPhoneNumber('');
    setGender('male');
    setIdealWeight(null);
    setBmi(null);
    setBmr(null);
    setBodyFat(null);
    setWeightStatus('');
    setCalculated(false);
    setFormError('');
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-emerald-100 to-indigo-200 px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white shadow-2xl rounded-3xl p-6 max-w-7xl mx-auto border-t-4 border-indigo-400"
        >
          <h2 className="text-3xl font-bold text-center mb-10 text-indigo-700">Check your Ideal Weight</h2>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Form Section */}
            <div className="flex-1 space-y-4">
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

              {formError && (
                <p className="text-red-600 text-sm text-center">{formError}</p>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCalculateClick}
                className="w-full bg-indigo-600 text-white py-2 rounded-xl font-semibold"
              >
                Report
              </motion.button>

              {calculated && (
                <motion.button
                  onClick={handleBookingRedirect}
                  className="w-full mt-4 bg-green-600 text-white py-2 rounded-xl font-semibold"
                >
                  Visits Our Centre
                </motion.button>
              )}

              {/* Clear Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClearClick}
                className="w-full mt-4 bg-gray-600 text-white py-2 rounded-xl font-semibold"
              >
                Clear
              </motion.button>
            </div>

            {/* Result Section */}
            <div className="flex-1">
              <div className="bg-indigo-50 p-4 rounded-xl shadow-inner mb-6">
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
                      <td className={getStatusColor()}>{weightStatus || 'Not Calculated'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {bmi && bmr && (
                <>
                  <h3 className="text-center text-lg font-semibold mb-3">Health Summary Chart</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart
                      data={[ 
                        { name: 'BMI', value: bmi || 0 },
                        { name: 'BMR', value: bmr || 0 },
                        { name: 'Body Fat %', value: bodyFat || 0 },
                        { name: 'Ideal Weight', value: idealWeight || 0 },
                      ]}
                    >
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
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <ServiceCards />
    </>
  );
};

export default IdealWeightCalculator;
