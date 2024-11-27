import React, { useState } from 'react';
import { FaUser, FaKey, FaEnvelope, FaPhone, FaPlus, FaEdit } from 'react-icons/fa';

export default function Account() {
  const [profilePic, setProfilePic] = useState(null);
  const [password, setPassword] = useState('');
  const [insuranceInfo, setInsuranceInfo] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleProfilePicChange = (e) => {
    setProfilePic(URL.createObjectURL(e.target.files[0]));
  };

  const handleSave = () => {
    // Save changes to profile
  };

  return (
    <div className="max-w-4xl text-gray-600 mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-[1.4rem] font-bold mb-6">Account Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Picture */}
        <div className="flex flex-col items-center">
          <label className="mb-2 font-semibold text-base">Profile Picture</label>
          <div
            className="w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-gray-200 cursor-pointer relative"
            onClick={() => document.getElementById('profilePicInput').click()}
          >
            {profilePic ? (
              <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <FaUser className="text-6xl text-gray-400 absolute inset-0 m-auto" />
            )}
            <input
              type="file"
              accept="image/*"
              id="profilePicInput"
              onChange={handleProfilePicChange}
              className="hidden"
            />
          </div>
        </div>
        {/* Change Password */}
        <div>
          <label className="mb-2 font-semibold text-base flex items-center">
            <FaKey className="mr-2" /> Change Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="New Password"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="New Password"
          />
        </div>
        {/* Email */}
        <div>
          <label className="mb-2 font-semibold text-base flex items-center">
            <FaEnvelope className="mr-2" /> Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
          />
        </div>
        {/* Phone */}
        <div>
          <label className="mb-2 font-semibold text-base flex items-center">
            <FaPhone className="mr-2" /> Phone
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Phone"
          />
        </div>
        {/* Insurance Info */}
        <div className="col-span-1 md:col-span-2">
          <label className="mb-2 font-semibold text-base flex items-center">
            <FaPlus className="mr-2" /> Insurance Info
          </label>
          <textarea
            value={insuranceInfo}
            onChange={(e) => setInsuranceInfo(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add your insurance information here"
          ></textarea>
        </div>
      </div>
      {/* Additional Info */}
      <div>
        <label className="mb-2 font-semibold text-base flex items-center">
          <FaEdit className="mr-2" /> Additional Info
        </label>
        <textarea
          value={insuranceInfo}
          onChange={(e) => setInsuranceInfo(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add any other relevant information here"
        ></textarea>
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
