import React from 'react';
import { ProcessingStep } from '../types';
import { Check, Circle } from 'lucide-react';

interface StepIndicatorProps {
  steps: ProcessingStep[];
}

export default function StepIndicator({ steps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center space-x-4 mb-12">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`
              w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2
              ${step.completed 
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 border-emerald-500 shadow-lg shadow-emerald-500/25' 
                : step.active 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-500 shadow-lg shadow-blue-500/25' 
                  : 'bg-gray-100 border-gray-300'
              }
            `}>
              {step.completed ? (
                <Check className="w-6 h-6 text-white" />
              ) : (
                <Circle className={`w-6 h-6 ${step.active ? 'text-white' : 'text-gray-400'}`} />
              )}
            </div>
            <div className="mt-2 text-center">
              <div className={`text-sm font-medium ${step.active || step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                {step.title}
              </div>
              <div className="text-xs text-gray-500 mt-1 max-w-24 leading-tight">
                {step.description}
              </div>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div className={`
              w-16 h-0.5 mx-4 transition-colors duration-300
              ${steps[index + 1].completed || steps[index + 1].active ? 'bg-gradient-to-r from-blue-300 to-blue-400' : 'bg-gray-200'}
            `} />
          )}
        </div>
      ))}
    </div>
  );
}