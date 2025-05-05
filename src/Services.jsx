import React from 'react';
import { useNavigate } from 'react-router-dom';

// Importing local images
import weightLossImg from './assets/WeightLoss.avif';
import weightGainImg from './assets/WeightGain.webp';
import skinCareImg from './assets/Skin.webp';
import kidsCareImg from './assets/kids.jpg';
import immunityHealthImg from './assets/body.webp';
import heartHealthImg from './assets/heart-health.webp';
import onlineConsultationImg from './assets/Unlocking-Behavior-Change-as-Health-Coaches-7-Ways-Coaches-Support-Clients-for-Lasting-Change-1024x683.webp';

const services = [
  {
    title: 'Weight Loss',
    image: weightLossImg,
    description: 'Personalized plans to help you lose weight naturally and sustainably.',
  },
  {
    title: 'Weight Gain',
    image: weightGainImg,
    description: 'Nutrition-rich programs to support healthy weight gain and strength.',
  },
  {
    title: 'Skin Care Nutrition',
    image: skinCareImg,
    description: 'Glow from the inside out with customized skin nutrition advice.',
  },
  {
    title: 'Kids Care',
    image: kidsCareImg,
    description: 'Balanced nutrition guidance to support growing children.',
  },
  {
    title: 'Immunity Health',
    image: immunityHealthImg,
    description: 'Boost your immunity with targeted nutrition and wellness tips.',
  },
  {
    title: 'Heart Health',
    image: heartHealthImg,
    description: 'Support cardiovascular health with heart-friendly diets and coaching.',
  },
  {
    title: 'Online Consultation',
    image: onlineConsultationImg,
    description: 'Connect with experts from the comfort of your home for guidance.',
  },
];

const ServiceCards = () => {
  const navigate = useNavigate();

  const handleAppointmentClick = (serviceTitle) => {
    navigate(`/book-appointment?service=${encodeURIComponent(serviceTitle)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 py-10 px-4">
      <h2 className="text-3xl sm:text-4xl font-bold text-center text-indigo-700 mb-10">
        Our Services
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto px-2 sm:px-4">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white shadow-md hover:shadow-xl rounded-2xl overflow-hidden transition-all duration-300 flex flex-col h-full"
          >
            <img
              src={service.image}
              alt={service.title}
              className="w-full h-44 sm:h-48 md:h-52 object-cover"
            />
            <div className="p-4 sm:p-6 flex flex-col flex-grow">
              <h3 className="text-lg sm:text-xl font-semibold text-indigo-600 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base mb-4 flex-grow">
                {service.description}
              </p>
              <button
                onClick={() => handleAppointmentClick(service.title)}
                className="mt-auto bg-indigo-500 text-white text-sm sm:text-base font-medium px-4 py-2 rounded-lg hover:bg-indigo-600 transition duration-200"
              >
                Book Appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceCards;
