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
import ServiceCards from './Services';

const IdealWeightCalculator = () => {
  const [name, setName] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
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
          ? 1.20 * (w / ((h / 100) ** 2)) + 0.23 * a - 16.2
          : 1.20 * (w / ((h / 100) ** 2)) + 0.23 * a - 5.4;
      setBodyFat(round(fatResult));
    }
  };

  const getStatusColor = () => {
    if (weightStatus === 'Ideal Weight') return 'text-green-600';
    if (weightStatus === 'Over Ideal Weight') return 'text-red-600';
    if (weightStatus === 'Under Ideal Weight') return 'text-orange-500';
    return '';
  };

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

          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-4 mb-6"
          >
            <div>
              <label className="block text-sm font-semibold text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-xl focus:ring-indigo-400"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Height (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-xl focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Weight (kg)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-xl focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-xl focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full mt-1 px-4 py-2 border rounded-xl bg-white"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={calculateAll}
              className="w-full mt-4 bg-indigo-600 text-white py-2 rounded-xl font-semibold"
            >
              Calculate All
            </motion.button>
          </motion.div>

          {/* Report in Table Format */}
          {(idealWeight || bmi || bmr || bodyFat) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-indigo-50 p-4 rounded-xl shadow-md"
            >
              <h3 className="text-lg font-semibold text-indigo-700 mb-4">Your Health Report</h3>

              <table className="w-full table-auto border border-indigo-200 rounded-xl text-sm">
                <tbody>
                  {name && (
                    <tr className="border-b border-indigo-200">
                      <td className="py-2 px-3 font-medium text-gray-700">Name</td>
                      <td className="py-2 px-3 font-semibold">{name}</td>
                    </tr>
                  )}
                  {idealWeight && (
                    <tr className="border-b border-indigo-200">
                      <td className="py-2 px-3 font-medium text-gray-700">Ideal Weight</td>
                      <td className="py-2 px-3 font-semibold">{idealWeight} kg</td>
                    </tr>
                  )}
                  {bmi && (
                    <tr className="border-b border-indigo-200">
                      <td className="py-2 px-3 font-medium text-gray-700">BMI</td>
                      <td className="py-2 px-3 font-semibold">
                        {bmi}
                        {bmi < 18.5 && <span className="text-red-600 ml-2">(Low)</span>}
                        {bmi > 24.9 && <span className="text-red-600 ml-2">(High)</span>}
                      </td>
                    </tr>
                  )}
                  {bmr && (
                    <tr className="border-b border-indigo-200">
                      <td className="py-2 px-3 font-medium text-gray-700">BMR</td>
                      <td className="py-2 px-3 font-semibold">
                        {bmr} kcal/day
                        {gender === 'male' && (bmr < 1500 || bmr > 1900) && (
                          <span className="text-red-600 ml-2">
                            ({bmr < 1500 ? 'Low' : 'High'})
                          </span>
                        )}
                        {gender === 'female' && (bmr < 1200 || bmr > 1600) && (
                          <span className="text-red-600 ml-2">
                            ({bmr < 1200 ? 'Low' : 'High'})
                          </span>
                        )}
                      </td>
                    </tr>
                  )}
                  {bodyFat && (
                    <tr className="border-b border-indigo-200">
                      <td className="py-2 px-3 font-medium text-gray-700">Body Fat</td>
                      <td className="py-2 px-3 font-semibold">
                        {bodyFat}%
                        {gender === 'male' && (bodyFat < 8 || bodyFat > 20) && (
                          <span className="text-red-600 ml-2">
                            ({bodyFat < 8 ? 'Low' : 'High'})
                          </span>
                        )}
                        {gender === 'female' && (bodyFat < 18 || bodyFat > 30) && (
                          <span className="text-red-600 ml-2">
                            ({bodyFat < 18 ? 'Low' : 'High'})
                          </span>
                        )}
                      </td>
                    </tr>
                  )}
                  {weightStatus && (
                    <tr>
                      <td className="py-2 px-3 font-medium text-gray-700">Status</td>
                      <td className={`py-2 px-3 font-semibold ${getStatusColor()}`}>
                        {weightStatus}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {(weightStatus === 'Over Ideal Weight' || weightStatus === 'Under Ideal Weight') && (
                <>
                  <motion.a
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    href="book-appointment"
                    className="inline-block mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg animate-pulse transition"
                  >
                    Book a Personalized Consultation
                  </motion.a>

                  <a
                    href="https://wa.me/9944687081"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-md"
                  >
                    Chat with Us on WhatsApp
                  </a>
                </>
              )}

              {weightStatus === 'Ideal Weight' && (
                <p className="mt-4 text-green-600 font-semibold text-sm">
                  You're at your ideal weight. Keep maintaining it!
                </p>
              )}
            </motion.div>
          )}

          {/* Wave Chart */}
          {(idealWeight || bmi || bmr || bodyFat) && (
            <div className="mt-8 bg-white rounded-2xl p-4 shadow-md">
              <h3 className="text-md font-bold text-indigo-700 mb-4">Visual Health Summary</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart
                  data={[
                    { name: 'Ideal Weight', value: idealWeight || 0 },
                    { name: 'BMI', value: bmi || 0 },
                    { name: 'BMR', value: bmr || 0 },
                    { name: 'Body Fat', value: bodyFat || 0 },
                  ]}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
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

      {/* Services Section */}
      <ServiceCards />
    </>
  );
};

export default IdealWeightCalculator;
