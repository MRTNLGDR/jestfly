
import React from 'react';

export type BookingStep = 'type' | 'date' | 'time' | 'form' | 'confirmation';

interface BookingProgressProps {
  currentStep: BookingStep;
}

const BookingProgress: React.FC<BookingProgressProps> = ({ currentStep }) => {
  const steps: BookingStep[] = ['type', 'date', 'time', 'form', 'confirmation'];
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center relative">
        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-white/10 -z-10"></div>
        
        {steps.map((step, index) => (
          <div 
            key={step}
            className={`flex flex-col items-center ${currentStep === step ? 'text-white' : (
              steps.indexOf(currentStep) >= steps.indexOf(step) 
                ? 'text-purple-400' 
                : 'text-white/40'
            )}`}
          >
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 
                ${currentStep === step 
                  ? 'bg-purple-600 text-white' 
                  : (
                    steps.indexOf(currentStep) >= steps.indexOf(step) 
                      ? 'bg-purple-900/50 text-white' 
                      : 'bg-white/10 text-white/40'
                  )
                }`}
            >
              {index + 1}
            </div>
            <span className="text-sm hidden md:block">
              {step === 'type' && 'Tipo'}
              {step === 'date' && 'Data'}
              {step === 'time' && 'Horário'}
              {step === 'form' && 'Dados'}
              {step === 'confirmation' && 'Confirmação'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingProgress;
