"use client";

import { useEditTherapeuticForm } from "../context/edit-form-context";
import { Check } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

interface FormProgressProps {
  currentStep: number;
}

const steps = [
  { number: 1, title: "Trial Overview", path: "/admin/therapeutics/edit/[id]/5-1" },
  { number: 2, title: "Outcome Measured", path: "/admin/therapeutics/edit/[id]/5-2" },
  { number: 3, title: "Participation Criteria", path: "/admin/therapeutics/edit/[id]/5-3" },
  { number: 4, title: "Timing", path: "/admin/therapeutics/edit/[id]/5-4" },
  { number: 5, title: "Results", path: "/admin/therapeutics/edit/[id]/5-5" },
  { number: 6, title: "Sites", path: "/admin/therapeutics/edit/[id]/5-6" },
  { number: 7, title: "Other Sources", path: "/admin/therapeutics/edit/[id]/5-7" },
  { number: 8, title: "Logs", path: "/admin/therapeutics/edit/[id]/5-8" },
];

export default function FormProgress({ currentStep }: FormProgressProps) {
  const { formData } = useEditTherapeuticForm();
  const router = useRouter();
  const params = useParams();

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

  const handleStepClick = (step: typeof steps[0]) => {
    const path = step.path.replace('[id]', params.id as string);
    router.push(path);
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
                onClick={() => handleStepClick(step)}
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

    </div>
  );
}
