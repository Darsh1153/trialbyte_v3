# Therapeutic Form System

This directory contains a multi-step form for creating therapeutic trials using React Context for state management.

## Architecture

### Context-Based State Management

- **File**: `context/therapeutic-form-context.tsx`
- **Purpose**: Centralized state management for all 8 form steps
- **Benefits**:
  - No more localStorage management in individual components
  - Real-time data synchronization between steps
  - Cleaner, more maintainable code
  - Better performance (no JSON parsing on every render)

### Form Steps

1. **5-1**: Trial Overview - Basic trial information
2. **5-2**: Purpose & Design - Trial objectives and structure
3. **5-3**: Eligibility - Patient criteria
4. **5-4**: Population - Patient population details
5. **5-5**: Study Sites - Research locations
6. **5-6**: Timeline - Key dates and milestones
7. **5-7**: Results - Trial outcomes
8. **5-8**: Notes - Documentation and final submission

### Key Components

#### FormProgress

- **File**: `components/form-progress.tsx`
- **Purpose**: Visual progress indicator showing current step and completion status
- **Features**:
  - Step-by-step progress visualization
  - Completion status for each step
  - Current step highlighting

#### Context Provider

- **File**: `layout.tsx`
- **Purpose**: Wraps all form steps with the context provider
- **Usage**: Automatically available to all child components

### State Management Functions

The context provides these key functions:

```typescript
// Update a single field in a specific step
updateField(step: keyof TherapeuticFormData, field: string, value: any)

// Update multiple fields in a step
updateStep(step: keyof TherapeuticFormData, data: Partial<TherapeuticFormData[keyof TherapeuticFormData]>)

// Handle array fields (add/remove/update items)
addArrayItem(step: keyof TherapeuticFormData, field: string)
removeArrayItem(step: keyof TherapeuticFormData, field: string, index: number)
updateArrayItem(step: keyof TherapeuticFormData, field: string, index: number, value: string)

// Form management
resetForm() // Clear all form data
loadForm(data: TherapeuticFormData) // Load existing form data
getFormData() // Get current form state
```

### Data Flow

1. **User Input** → Context state updates
2. **Real-time Sync** → All components see changes immediately
3. **Final Submission** → All data collected from context and sent to API
4. **Form Reset** → Context cleared after successful submission

### Benefits Over Previous Approach

| Previous (localStorage)                     | New (Context)                     |
| ------------------------------------------- | --------------------------------- |
| ❌ Data fragmented across localStorage keys | ✅ Centralized state management   |
| ❌ Manual data collection in final step     | ✅ Direct access to all form data |
| ❌ JSON parsing on every render             | ✅ No parsing overhead            |
| ❌ Complex data synchronization             | ✅ Automatic synchronization      |
| ❌ Error-prone data combination             | ✅ Type-safe data access          |
| ❌ No real-time updates                     | ✅ Immediate state updates        |

### Usage Example

```typescript
import { useTherapeuticForm } from "../context/therapeutic-form-context";

export default function MyFormStep() {
  const { formData, updateField } = useTherapeuticForm();
  const form = formData.step5_1; // Access specific step data

  return (
    <Input
      value={form.title}
      onChange={(e) => updateField("step5_1", "title", e.target.value)}
    />
  );
}
```

### Migration Notes

- **Removed**: All `useState` and `useEffect` for localStorage management
- **Added**: Context hooks for state management
- **Simplified**: Form submission logic (no more manual data collection)
- **Enhanced**: Progress tracking and user experience

This new system provides a much more robust and maintainable foundation for the multi-step therapeutic form.

