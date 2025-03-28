// import { FiX } from 'react-icons/fi';

// const PricingModal = ({ onClose }) => {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
//             Unlock Unlimited Image Generation!
//           </h2>
//           <button
//             onClick={onClose}
//             aria-label="Close modal"
//             className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
//           >
//             <FiX className="h-6 w-6" />
//           </button>
//         </div>

//         {/* Body */}
//         <p className="mb-4 text-gray-600 dark:text-gray-300">
//           You've used your 3 free image generations. Upgrade to a premium plan for unlimited access and exclusive features!
//         </p>
//         <ul className="list-disc list-inside mb-6 text-gray-700 dark:text-gray-200">
//           <li>Unlimited image generations</li>
//           <li>Higher resolution outputs</li>
//           <li>Priority processing</li>
//           <li>Access to exclusive styles and filters</li>
//         </ul>

//         {/* Footer with Buttons */}
//         <div className="flex justify-between items-center">
//           <button
//             onClick={() => {
//               console.log('User clicked to see pricing plans'); // Replace with actual navigation if needed
//               onClose();
//             }}
//             className="btn btn-primary px-6 py-2"
//           >
//             See Pricing Plans
//           </button>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm"
//           >
//             Continue with Free Plan
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PricingModal;

import React from 'react';
import { FiX, FiCheck } from 'react-icons/fi';

const PricingModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-100/50 to-purple-100/50 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-sm p-4">
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 max-w-md w-full transform transition-all duration-300 ease-in-out hover:scale-[1.02]">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-full p-2 transition-all hover:rotate-90"
        >
          <FiX className="h-5 w-5" />
        </button>

        {/* Content Container */}
        <div className="p-8 text-center">
          {/* Decorative Gradient Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
            <h2 className="text-3xl font-extrabold mb-2">
              Unlock Unlimited Creativity
            </h2>
          </div>

          {/* Subheader */}
          <p className="text-gray-600 dark:text-gray-300 mb-6 text-base">
            You've reached your free image generation limit. Upgrade for more!
          </p>

          {/* Features List */}
          <div className="space-y-3 mb-6">
            {[
              "Unlimited Image Generations",
              "High-Resolution Outputs",
              "Priority Processing",
              "Exclusive Styles & Filters"
            ].map((feature, index) => (
              <div 
                key={index} 
                className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl transition-all hover:shadow-sm"
              >
                <FiCheck className="text-blue-500 h-5 w-5" />
                <span className="text-gray-700 dark:text-gray-200">{feature}</span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => {
                console.log('User clicked to see pricing plans');
                onClose();
              }}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all transform active:scale-95 shadow-lg hover:shadow-xl"
            >
              Explore Premium Plans
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
            >
              Continue with Free Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;