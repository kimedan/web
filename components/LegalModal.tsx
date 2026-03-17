
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, title, content }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      <div 
        className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden transform transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div 
            className="prose prose-sm prose-blue max-w-none text-gray-600"
            dangerouslySetInnerHTML={{ __html: content }} 
          />
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-black transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
