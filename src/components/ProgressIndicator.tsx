import React, { useState } from 'react';
import { Check, ChevronDown, ChevronRight, FileText, ArrowLeft, Clock, CheckCircle, List } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description: string;
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep: number;
  completedSteps: Set<number>;
  onStepClick: (stepIndex: number) => void;
  estimatedTimeRemaining?: number;
}

export function ProgressIndicator({ 
  steps, 
  currentStep, 
  completedSteps, 
  onStepClick,
  estimatedTimeRemaining 
}: ProgressIndicatorProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const currentStepData = steps[currentStep];
  const completedCount = completedSteps.size;
  const progressPercentage = ((completedCount + (currentStep > completedCount ? 1 : 0)) / steps.length) * 100;

  return (
    <div className="mb-8">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-visible" role="navigation" aria-label="Form progress">
        {/* Header with current step info and progress */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-white bg-opacity-10 transform -skew-y-2 origin-top-left"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Drive-Away Insurance Application</h2>
                  <p className="text-blue-100">Complete your application in simple steps</p>
                  {estimatedTimeRemaining && (
                    <div className="flex items-center space-x-2 mt-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{estimatedTimeRemaining} min remaining</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{currentStep + 1}</div>
                <div className="text-sm text-blue-100">of {steps.length}</div>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mb-4" role="progressbar" aria-valuenow={Math.round(progressPercentage)} aria-valuemin={0} aria-valuemax={100} aria-label={`Application progress: ${Math.round(progressPercentage)}% complete`}>
              <div className="flex items-center justify-between text-sm text-blue-100 mb-2">
                <span>Progress</span>
                <span>{Math.round(progressPercentage)}% complete</span>
              </div>
              <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-500 ease-out shadow-sm"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Current Step Info */}
        <div className="p-6 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center justify-between">
            {/* Breadcrumb - Desktop Only */}
            <div className="flex items-center space-x-2 mb-4 lg:mb-0">
              <nav className="hidden sm:flex items-center space-x-2 text-sm text-gray-500" aria-label="Breadcrumb">
                <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
                <span>/</span>
                <a href="/apply" className="hover:text-blue-600 transition-colors">Apply</a>
                <span>/</span>
                <span className="text-blue-600 font-medium">Step {currentStep + 1}</span>
              </nav>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-4 flex-1">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 shadow-md
                ${completedSteps.has(currentStep)
                  ? 'bg-green-500 text-white' 
                  : 'bg-blue-500 text-white'
                }
              `}>
                {completedSteps.has(currentStep) ? (
                  <Check size={20} className="animate-in zoom-in duration-300" />
                ) : (
                  <span className="font-semibold text-sm">{currentStep + 1}</span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{currentStepData?.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{currentStepData?.description}</p>
                
                {/* Step Status Indicator */}
                <div className="flex items-center space-x-2">
                  {completedSteps.has(currentStep) ? (
                    <div className="flex items-center space-x-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Completed</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 text-blue-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">In Progress</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Step Navigation Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 w-full md:w-auto px-4 py-3 bg-blue-600 text-white border border-blue-700 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                aria-haspopup="listbox"
                aria-expanded={isDropdownOpen}
                aria-label="Navigate between form steps"
              >
                <List className="w-4 h-4" />
                <span className="text-sm font-medium">View All Steps</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                  isDropdownOpen ? 'transform rotate-180' : ''
                }`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden" style={{ zIndex: 9999 }}>
                  <div className="p-2 bg-gray-50 border-b border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 px-3 py-1">Application Steps</h4>
                    <p className="text-xs text-gray-500 px-3">Click any step to navigate (if accessible)</p>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {steps.map((step, index) => {
                      const isCompleted = completedSteps.has(index);
                      const isCurrent = index === currentStep;
                      const isClickable = index <= currentStep || completedSteps.has(index);
                      
                      return (
                        <button
                          key={step.id}
                          onClick={() => {
                            if (isClickable) {
                              onStepClick(index);
                              setIsDropdownOpen(false);
                            }
                          }}
                          disabled={!isClickable}
                          className={`
                            w-full text-left p-4 transition-colors duration-200 border-l-4 hover:bg-gray-50
                            ${isCurrent 
                              ? 'border-l-blue-500 bg-blue-50' 
                              : isCompleted 
                                ? 'border-l-green-500'
                                : 'border-l-transparent'
                            }
                            ${!isClickable 
                              ? 'opacity-50 cursor-not-allowed' 
                              : 'cursor-pointer'
                            }
                          `}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`
                              flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all duration-200
                              ${isCompleted
                                ? 'bg-green-100 text-green-700' 
                                : isCurrent
                                  ? 'bg-blue-100 text-blue-700'
                                  : isClickable
                                    ? 'bg-gray-100 text-gray-600'
                                    : 'bg-gray-50 text-gray-400'
                              }
                            `}>
                              {isCompleted ? (
                                <Check size={16} />
                              ) : (
                                <span>{index + 1}</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className={`font-medium text-sm ${
                                isCurrent ? 'text-blue-900' : 'text-gray-900'
                              }`}>
                                <span className="inline-block w-6 text-center text-xs text-gray-400 mr-2">
                                  {index + 1}.
                                </span>
                                <span>{step.title}</span>
                              </h5>
                              <p className={`text-xs mt-1 ${
                                isCurrent ? 'text-blue-700' : 'text-gray-500'
                              }`}>
                                {step.description}
                              </p>
                            </div>
                            {isCurrent && (
                              <ChevronRight className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="p-3 bg-gray-50 border-t border-gray-200 text-center">
                    <p className="text-xs text-gray-500">
                      {completedCount} of {steps.length} steps completed • {Math.round(progressPercentage)}% done
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown - FIXED */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0"
          style={{ zIndex: 9998 }}
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
      
      {/* Mobile Compact View */}
      <div className="lg:hidden mt-4">
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
            <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
            <span>/</span>
            <a href="/apply" className="hover:text-blue-600 transition-colors">Apply</a>
            <span>/</span>
            <span className="text-blue-600 font-medium">Step {currentStep + 1}</span>
            <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              {completedCount + 1}/{steps.length}
            </span>
          </nav>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span className="font-medium">{Math.round(progressPercentage)}% complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
              {currentStep > 0 && (
                <button
                  onClick={() => onStepClick(currentStep - 1)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
              )}
              {estimatedTimeRemaining && (
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>~{estimatedTimeRemaining} min remaining</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}