import React from "react";

const CommonModal = ({ modalShow, handleCloseModal, title, children }) => {
  if (!modalShow) return null; // Don't render if modal is hidden

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Modal Container */}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h5 className="text-lg font-medium">{title}</h5>
          <button
            onClick={handleCloseModal}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CommonModal;
