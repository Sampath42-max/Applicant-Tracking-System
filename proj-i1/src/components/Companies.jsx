import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import companies from '../data/companies.js';

const Companies = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter companies based on search term (company name or skills)
  const filteredCompanies = companies.filter((company) => {
    const searchLower = searchTerm.toLowerCase();
    const companyNameMatch = company.name.toLowerCase().includes(searchLower);
    const skillsMatch = company.skill_set.some((skill) =>
      skill.toLowerCase().includes(searchLower)
    );
    return companyNameMatch || skillsMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 py-12 px-4 sm:px-6 lg:px-8 font-inter">
      <h1 className="text-center text-4xl sm:text-5xl font-bold text-gray-900 mb-8 relative">
        Companies
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-blue-500 to-teal-400 rounded"></span>
      </h1>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto mb-10 relative">
        <input
          type="text"
          placeholder="Search by company name or skill (e.g., Python, Java)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-3 pl-10 pr-4 text-gray-900 bg-white/80 border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm"
        />
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 text-lg">🔍</span>
      </div>

      {/* Company Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {filteredCompanies.length > 0 ? (
          filteredCompanies.map((company) => (
            <Link
              to={`/company/${company.id}`}
              key={company.id}
              className="group bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 border border-gray-100"
              style={{ textDecoration: 'none' }}
            >
              <img
                src={company.image}
                alt={company.name}
                className="w-full h-48 object-cover rounded-t-2xl group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                  {company.name}
                </h3>
                <p className="text-gray-600 mt-2 line-clamp-3">{company.info}</p>
                <p className="mt-3 text-sm text-gray-700">
                  <strong className="font-medium text-gray-900">Skills:</strong>{' '}
                  {company.skill_set.join(' • ')}
                </p>
                <p className="mt-2 text-sm text-gray-700">
                  <strong className="font-medium text-gray-900">Roles & Packages:</strong>{' '}
                  {company.roles_and_packages}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-lg text-gray-600">No companies found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;