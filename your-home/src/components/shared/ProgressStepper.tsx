import React from 'react';

type Step = 'confirmed' | 'accepted' | 'active' | 'arrived' | 'completed';
const STEPS: { id: Step; label: string }[] = [
  { id: 'confirmed', label: 'Booked' },
  { id: 'accepted', label: 'Accepted' },
  { id: 'active', label: 'On the way' },
  { id: 'arrived', label: 'Arrived' },
  { id: 'completed', label: 'Done' },
];

export const ProgressStepper = ({ currentStep }: { currentStep: Step }) => {
  const currentIndex = STEPS.findIndex(s => s.id === currentStep);
  
  return (
    <div className="flex items-center justify-between w-full px-2 py-4 relative">
      <div className="absolute top-1/2 left-[10%] right-[10%] h-[2px] bg-dark-3 -translate-y-[12px] -z-10"></div>
      
      {STEPS.map((step, index) => {
        const isCompleted = index < currentIndex || currentStep === 'completed';
        const isCurrent = index === currentIndex && currentStep !== 'completed';
        
        return (
          <div key={step.id} className="flex flex-col items-center relative z-10 w-full">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-2 z-20 relative ${
              isCompleted ? 'bg-[hsl(var(--trust-green))] text-white' : 
              isCurrent ? 'bg-primary text-primary-foreground' : 
              'bg-dark-3 text-transparent'
            }`}>
              {isCompleted ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              ) : isCurrent ? (
                <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground animate-pulse"></div>
              ) : null}
            </div>
            
            <span className={`text-[10px] whitespace-nowrap ${isCurrent ? 'text-primary font-bold' : isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
              {step.label}
            </span>
            
            {/* Connecting lines */}
            {index < STEPS.length - 1 && (
              <div className={`absolute top-3 left-[50%] w-[100%] h-[2px] -z-10 ${
                index < currentIndex ? 'bg-primary' : 'bg-transparent'
              }`}></div>
            )}
          </div>
        )
      })}
    </div>
  )
}
