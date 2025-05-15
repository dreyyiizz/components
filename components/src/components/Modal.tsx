import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 relative">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button 
            className="text-gray-500 hover:text-red-500" 
            onClick={onClose}>
            ✖
          </button>
        </div>

        <div className="mt-4">{children}</div>

        <div className="mt-6 text-right">
          <button 
            aria-label="Close"
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600" 
            onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
