"use client";

import { useTherapeuticForm } from "../context/therapeutic-form-context";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation"; // use next/router if in pages dir

interface FormProgressProps {
  currentStep: number;
}

const steps = [
  { number: 1, title: "Trial Overview", path: "/admin/therapeutics/new/5-1" },
  { number: 2, title: "Outcome Measured", path: "/admin/therapeutics/new/5-2" },
  { number: 3, title: "Participation Criteria", path: "/admin/therapeutics/new/5-3" },
  { number: 4, title: "Timing", path: "/admin/therapeutics/new/5-4" },
  { number: 5, title: "Results", path: "/admin/therapeutics/new/5-5" },
  { number: 6, title: "Sites", path: "/admin/therapeutics/new/5-6" },
  { number: 7, title: "Other Sources", path: "/admin/therapeutics/new/5-7" },
  { number: 8, title: "Logs", path: "/admin/therapeutics/new/5-8" },
];

export default function FormProgress({ currentStep }: FormProgressProps) {
  const { formData } = useTherapeuticForm();
  const router = useRouter();

  const isStepCompleted = (stepNumber: number) => {
    const stepKey = `step5_${stepNumber}` as keyof typeof formData;
    const stepData = formData[stepKey];
    if (!stepData) return false;

    return Object.values(stepData).some((value) => {
      if (Array.isArray(value)) {
        return value.some((item) => {
          if (typeof item === 'string') {
            return item && item.trim() !== "";
          } else if (typeof item === 'object' && item !== null) {
            // Handle complex objects (like in step5_7)
            return Object.values(item).some((fieldValue) => {
              if (typeof fieldValue === 'string') {
                return fieldValue && fieldValue.trim() !== "";
              } else if (typeof fieldValue === 'boolean') {
                return fieldValue; // Include boolean fields like isVisible
              }
              return false;
            });
          }
          return false;
        });
      }
      return value && value.toString().trim() !== "";
    });
  };

  return (
    <div className="space-y-4">
      {/* Tab Navigation - Matching drugs design */}
      <div className="rounded-lg" style={{ backgroundColor: '#61CCFA66' }}>
        <div className="flex">
          {steps.map((step) => {
            const isActive = currentStep === step.number;
            const completed = isStepCompleted(step.number);

            return (
              <button
                key={step.number}
                onClick={() => router.push(step.path)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-all border-b-2 ${
                  isActive
                    ? "text-white border-b-transparent"
                    : "text-gray-700 border-b-transparent hover:bg-white hover:bg-opacity-20"
                }`}
                style={{
                  backgroundColor: isActive ? '#204B73' : 'transparent'
                }}
              >
                <div className="flex items-center gap-2">
                  {completed ? <Check className="w-4 h-4" /> : null}
                  {step.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab Content Header */}
      <div 
        className="rounded-lg p-4"
        style={{ backgroundColor: '#204B73' }}
      >
        <h2 className="text-white text-lg font-semibold">
          {steps.find(step => step.number === currentStep)?.title}
        </h2>
      </div>
    </div>
  );
}
