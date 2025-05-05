import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import companies from '../data/companies.js'; // Adjust path if needed
import {
  FaArrowLeft,
  FaTools,
  FaGraduationCap,
  FaBriefcase,
  FaMoneyBillWave,
  FaFileAlt,
  FaBrain,
  FaLaptopCode,
  FaComments,
} from 'react-icons/fa';

const CompanyDetails = () => {
  const { id } = useParams();
  const company = companies.find((c) => c.id === parseInt(id));
  const [activeTab, setActiveTab] = useState('info');

  if (!company) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 flex items-center justify-center">
        <p className="text-lg text-gray-600">Company not found!</p>
      </div>
    );
  }

  // Map selection process steps to icons
  const processIcons = {
    'Resume Shortlisting': <FaFileAlt />,
    'Aptitude Test': <FaBrain />,
    'Technical Interview': <FaLaptopCode />,
    'HR Interview': <FaComments />,
    'Online Test': <FaLaptopCode />,
    'Coding Test': <FaLaptopCode />,
    'Technical Rounds': <FaLaptopCode />,
    'Final Interview': <FaComments />,
    'Coding Challenge': <FaLaptopCode />,
  };

  // Render progress bar for selection process
  const renderProgressBar = (step, index, totalSteps) => {
    const progress = ((index + 1) / totalSteps) * 100;
    return (
      <div key={index} className="flex items-center mb-6">
        <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center mr-4">
          {index + 1}
        </div>
        <div className="flex-1">
          <p className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="mr-2 text-blue-500">{processIcons[step] || <FaLaptopCode />}</span>
            {step}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      {/* Top Bar */}
      <div className="max-w-5xl mx-auto mb-8">
        <Link
          to="/companies"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-lg transition-colors duration-200"
        >
          <FaArrowLeft />
          Back to Companies
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-8 animate-fadeIn">
        {/* Header with Logo and Name */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <img
              src={company.image}
              alt={company.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-white/30"
              onError={(e) => (e.target.src = 'https://via.placeholder.com/150')}
            />
            <h2 className="text-3xl font-bold text-gray-900">{company.name}</h2>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex border-b border-gray-200">
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'info'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
              onClick={() => setActiveTab('info')}
            >
              Company Info
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm ${
                activeTab === 'skills'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
              onClick={() => setActiveTab('skills')}
            >
              Personal Skills
            </button>
          </div>
        </div>

        {/* Dual-Box Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Box: Company Information or Personal Skills */}
          <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {activeTab === 'info' ? 'Company Information' : 'Personal Skills'}
            </h3>
            {activeTab === 'info' ? (
              <div className="space-y-6">
                {/* Skills Required */}
                <div className="bg-white/50 rounded-lg p-4 hover:bg-white/70 transition-colors duration-200">
                  <p className="text-gray-700 flex items-center text-lg font-semibold">
                    <FaTools className="text-blue-500 mr-3" />
                    Skills Required
                  </p>
                  <p className="text-gray-600 mt-2 ml-8">{company.skill_set.join(' • ')}</p>
                </div>

                {/* Eligibility Criteria */}
                <div className="bg-white/50 rounded-lg p-4 hover:bg-white/70 transition-colors duration-200">
                  <p className="text-gray-700 flex items-center text-lg font-semibold">
                    <FaGraduationCap className="text-blue-500 mr-3" />
                    Eligibility Criteria
                  </p>
                  <p className="text-gray-600 mt-2 ml-8">{company.eligibility}</p>
                </div>

                {/* Roles Offered */}
                <div className="bg-white/50 rounded-lg p-4 hover:bg-white/70 transition-colors duration-200">
                  <p className="text-gray-700 flex items-center text-lg font-semibold">
                    <FaBriefcase className="text-blue-500 mr-3" />
                    Roles Offered
                  </p>
                  <p className="text-gray-600 mt-2 ml-8">{company.roles_and_packages}</p>
                </div>

                {/* Package Details */}
                <div className="bg-white/50 rounded-lg p-4 hover:bg-white/70 transition-colors duration-200">
                  <p className="text-gray-700 flex items-center text-lg font-semibold">
                    <FaMoneyBillWave className="text-blue-500 mr-3" />
                    Package Details
                  </p>
                  <p className="text-gray-600 mt-2 ml-8">{company.roles_and_packages}</p>
                </div>
              </div>
            ) : (
              <div className="bg-white/50 rounded-lg p-4">
                <p className="text-gray-600">{company.personal_skills.join(' • ')}</p>
              </div>
            )}
          </div>

          {/* Right Box: Selection Process */}
          <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Selection Process</h3>
            {company.selection_process.split(', ').map((step, index) =>
              renderProgressBar(step, index, company.selection_process.split(', ').length)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;