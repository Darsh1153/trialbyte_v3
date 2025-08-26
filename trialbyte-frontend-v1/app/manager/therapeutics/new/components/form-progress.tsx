"use client";

import { useTherapeuticForm } from "../context/therapeutic-form-context";
import { Check } from "lucide-react";

interface FormProgressProps {
  currentStep: number;
}

const steps = [
  {
    number: 1,
    title: "Trial Overview",
    description: "Basic trial information",
  },
  {
    number: 2,
    title: "Purpose & Design",
    description: "Trial objectives and structure",
  },
  { number: 3, title: "Eligibility", description: "Patient criteria" },
  { number: 4, title: "Population", description: "Patient population details" },
  { number: 5, title: "Study Sites", description: "Research locations" },
  { number: 6, title: "Timeline", description: "Key dates and milestones" },
  { number: 7, title: "Results", description: "Trial outcomes" },
  { number: 8, title: "Notes", description: "Documentation and submit" },
];

export default function FormProgress({ currentStep }: FormProgressProps) {
  const { formData } = useTherapeuticForm();

  const isStepCompleted = (stepNumber: number) => {
    const stepKey = `step5_${stepNumber}` as keyof typeof formData;
    const stepData = formData[stepKey];

    if (!stepData) return false;

    // Check if the step has any meaningful data
    const hasData = Object.values(stepData).some((value) => {
      if (Array.isArray(value)) {
        return value.some((item) => item && item.trim() !== "");
      }
      return value && value.toString().trim() !== "";
    });

    return hasData;
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex flex-col items-center">
            {/* Step Circle */}
            <div className="relative">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors ${
                  currentStep === step.number
                    ? "bg-primary text-primary-foreground border-primary"
                    : isStepCompleted(step.number)
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-muted text-muted-foreground border-muted"
                }`}
              >
                {isStepCompleted(step.number) ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.number
                )}
              </div>

              {/* Progress Line */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-1/2 left-full w-16 h-0.5 transform -translate-y-1/2 transition-colors ${
                    isStepCompleted(step.number + 1)
                      ? "bg-green-500"
                      : "bg-muted"
                  }`}
                />
              )}
            </div>

            {/* Step Title */}
            <div className="mt-2 text-center">
              <div
                className={`text-sm font-medium ${
                  currentStep === step.number
                    ? "text-primary"
                    : isStepCompleted(step.number)
                    ? "text-green-600"
                    : "text-muted-foreground"
                }`}
              >
                {step.title}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {step.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Current Step Indicator */}
      <div className="mt-6 text-center">
        <div className="text-lg font-semibold text-primary">
          Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}
        </div>
        <div className="text-sm text-muted-foreground mt-1">
          {steps[currentStep - 1]?.description}
        </div>
      </div>
    </div>
  );
}

