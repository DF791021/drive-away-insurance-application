import React from 'react';
import { X, HelpCircle, Phone, Mail, MessageCircle } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep: number;
  stepTitle?: string;
}

export function HelpModal({ isOpen, onClose, currentStep, stepTitle }: HelpModalProps) {
  if (!isOpen) return null;

  const getStepHelp = (step: number) => {
    const helpContent: Record<number, { title: string; content: string; tips: string[] }> = {
      0: {
        title: "Company Information Help",
        content: "This section collects basic information about your business and its legal structure.",
        tips: [
          "Enter your business name exactly as it appears on legal documents",
          "DBA is only needed if you operate under a different name",
          "Use your primary business phone number for faster communication",
          "The contact person should be available for inspection scheduling"
        ]
      },
      1: {
        title: "Business Operations Help",
        content: "Tell us about your drive-away operations and business experience.",
        tips: [
          "Describe your services in detail - types of vehicles, routes, etc.",
          "Include both commercial and personal vehicle experience",
          "Be honest about financial information - it helps us provide accurate quotes",
          "Multiple state operations may require additional documentation"
        ]
      },
      2: {
        title: "Coverage Selection Help",
        content: "Choose the insurance coverage that best protects your business.",
        tips: [
          "Combined limits are simpler but split limits offer more flexibility",
          "Higher liability limits provide better protection",
          "Physical damage coverage protects the vehicles you're transporting",
          "Consider your typical vehicle values when selecting deductibles"
        ]
      },
      3: {
        title: "Driver Information Help",
        content: "Add all drivers who will be operating under this policy.",
        tips: [
          "Include all drivers, even part-time or occasional operators",
          "Accurate driving records help us calculate proper premiums",
          "Commercial experience is valued - include all relevant background",
          "Be thorough with violation and accident details"
        ]
      },
      4: {
        title: "Insurance History Help",
        content: "Your insurance history helps us understand your risk profile.",
        tips: [
          "Include all previous carriers, even short-term policies",
          "Honest disclosure prevents issues during claims",
          "Claims history affects pricing - accuracy is important",
          "Previous Columbia customers may qualify for special rates"
        ]
      },
      5: {
        title: "Drive-Away Operations Help",
        content: "Detailed information about your specific drive-away services.",
        tips: [
          "Be specific about vehicle types and percentages",
          "Include all pickup and delivery locations",
          "Payment method affects coverage structure",
          "Annual mileage estimates should be realistic"
        ]
      },
      6: {
        title: "Additional Operations Help",
        content: "Safety requirements and additional operational details.",
        tips: [
          "DOT regulations may apply to certain operations",
          "Driver hour limits are important for safety compliance",
          "Towing operations require specific coverage considerations",
          "Family member restrictions help control risk"
        ]
      },
      7: {
        title: "Plate Information Help",
        content: "Details about transporter plates and their management.",
        tips: [
          "Transporter plates have specific coverage requirements",
          "Accurate plate counts ensure proper coverage",
          "Return procedures affect liability exposure",
          "All plates should be properly documented"
        ]
      },
      8: {
        title: "Vehicle Specific Details Help",
        content: "Information specific to the types of vehicles you handle.",
        tips: [
          "Different vehicle types have different risk profiles",
          "Luxury vehicles require special handling procedures",
          "Piggyback operations have unique coverage needs",
          "Percentage breakdowns should total 100%"
        ]
      },
      9: {
        title: "Review & Submit Help",
        content: "Final review before submitting your application.",
        tips: [
          "Double-check all information for accuracy",
          "Ensure all required fields are completed",
          "Review coverage selections carefully",
          "Contact us if you need clarification on any section"
        ]
      }
    };

    return helpContent[step] || {
      title: "General Help",
      content: "Need assistance with this section?",
      tips: ["Contact our support team for personalized help"]
    };
  };

  const stepHelp = getStepHelp(currentStep);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="help-modal-title">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          aria-hidden="true"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <HelpCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="help-modal-title">
                  {stepHelp.title}
                </h3>
                {stepTitle && (
                  <p className="text-sm text-gray-500 mt-1">Step {currentStep + 1}: {stepTitle}</p>
                )}
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-4">{stepHelp.content}</p>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-900">Helpful Tips:</h4>
                    <ul className="space-y-2">
                      {stepHelp.tips.map((tip, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close help modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Contact Options */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Still need help?</h4>
            <div className="space-y-2">
              <a
                href="tel:9034079474"
                className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Call us: (903) 407-9474</span>
              </a>
              <a
                href="mailto:support@greenliteinsurance.com"
                className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Email: support@greenliteinsurance.com</span>
              </a>
              <button
                className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                onClick={() => {
                  // In a real implementation, this could open a live chat
                  alert('Live chat feature coming soon! Please call or email for immediate assistance.');
                }}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Start live chat</span>
              </button>
            </div>
          </div>

          <div className="bg-white px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}