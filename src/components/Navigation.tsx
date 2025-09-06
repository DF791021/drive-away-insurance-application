import React from 'react';
import { ChevronLeft, ChevronRight, Send, Save, HelpCircle, AlertCircle } from 'lucide-react';

interface NavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  canProceed: boolean;
  isLoading: boolean;
  onSave?: () => void;
  onHelp?: () => void;
  hasErrors?: boolean;
}

export function Navigation({ 
  currentStep, 
  totalSteps, 
  onPrevious, 
  onNext, 
  onSubmit, 
  canProceed,
  isLoading,
  onSave,
  onHelp,
  hasErrors
}: NavigationProps) {
  const isFirstStep = currentStep === 0;
  const isReviewStep = currentStep === totalSteps - 1;
  
  return (
    <div className="pt-8 mt-8 border-t border-gray-200/50">
      {/* Error Alert */}
      {hasErrors && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800">Please correct the errors above before continuing.</p>
              <p className="text-xs text-red-600 mt-1">All required fields must be completed.</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions Bar */}
      <div className="flex items-center justify-between mb-4 text-sm">
        <div className="flex items-center space-x-4">
          {onSave && (
            <button
              type="button"
              onClick={onSave}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              aria-label="Save current progress"
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Save Progress</span>
            </button>
          )}
          {onHelp && (
            <button
              type="button"
              onClick={onHelp}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
              aria-label="Get help with this section"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Need Help?</span>
            </button>
          )}
        </div>
        
        {/* Progress Indicator */}
        <div className="text-sm font-medium text-gray-600 bg-gray-100/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50 shadow-sm">
          <span className="text-blue-600 font-semibold">Step {currentStep + 1}</span> of {totalSteps}
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onPrevious}
          disabled={isFirstStep}
          className={`
            inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 text-sm font-medium rounded-xl transition-all duration-200 shadow-sm focus:ring-2 focus:ring-offset-2
            ${isFirstStep 
              ? 'text-gray-400 cursor-not-allowed bg-gray-100' 
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 hover:shadow-md focus:ring-gray-500'
            }
          `}
          aria-label={isFirstStep ? "Previous step (disabled)" : "Go to previous step"}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden">Back</span>
        </button>
      
        <button
          type="button"
          onClick={isReviewStep ? onSubmit : onNext}
          disabled={!canProceed || isLoading}
          className={`
            inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 text-sm font-medium rounded-xl transition-all duration-200 shadow-lg focus:ring-2 focus:ring-offset-2 focus:outline-none
            ${canProceed && !isLoading
              ? isReviewStep 
                ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 focus:ring-green-500 hover:shadow-xl transform hover:scale-105' 
                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500 hover:shadow-xl transform hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
          aria-label={isLoading ? "Submitting application" : isReviewStep ? "Submit application" : "Continue to next step"}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" aria-hidden="true" />
              <span className="hidden sm:inline">Submitting...</span>
              <span className="sm:hidden">Sending...</span>
            </>
          ) : isReviewStep ? (
            <>
              <span className="hidden sm:inline">Submit Application</span>
              <span className="sm:hidden">Submit</span>
              <Send className="ml-2 w-4 h-4" aria-hidden="true" />
            </>
          ) : (
            <>
              <span className="hidden sm:inline">Continue</span>
              <span className="sm:hidden">Next</span>
              <ChevronRight className="ml-2 w-4 h-4" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
      
      {/* Keyboard Navigation Hint */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        <p className="hidden sm:block">Use <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Tab</kbd> to navigate, <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Enter</kbd> to continue</p>
      </div>
    </div>
  );
}