import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { forwardRef } from 'react';

const Modal = forwardRef(({ title, isOpen, onClose, children }, ref) => {
    if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-10 scale-95">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <button onClick={onClose} className="text-gray-600 text-lg hover:text-gray-900">
            <FaTimes />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
})

export default Modal
