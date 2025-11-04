# Results Tab Auto-Fill Debugging Guide

## Issue
The following fields in the Results tab are not auto-filling when editing an existing trial:
1. **Trial Outcome** (dropdown)
2. **Trial Outcome Reference** (date field)
3. **Link** (URL input)
4. **Result type** (dropdown in Results Notes)
5. **Adverse Event Type** (dropdown)

## How to Debug

### Step 1: Open Browser Console
1. Open the edit page for a trial that has Results data
2. Open browser DevTools (F12 or Cmd+Option+I)
3. Go to the Console tab

### Step 2: Look for Loading Logs

When the page loads, you should see these logs:

```
=== LOADING RESULTS DATA FROM API ===
foundTrial.results: [...]
foundTrial.results[0]: {...}

🔍 Results Data - Individual Field Analysis:
  trial_outcome: "Completed – Primary endpoints met." (type: string)
  reference: "2025-02-11" (type: string)
  trial_outcome_content: "..." (type: string)
  trial_outcome_link: "https://..." (type: string)
  adverse_event_reported: "Yes" (type: string)
  adverse_event_type: "Moderate" (type: string)
  treatment_for_adverse_events: "..." (type: string)

📦 Results Data - Complete Object: {...}

Trial Outcome Reference date formatted: 2025-02-11

✅ Final Loaded Results Data: {...}
```

### Step 3: Check Component Rendering

After loading, when the Results tab renders, you should see:

```
📋 ResultsSection - Current form data: {...}

🎯 Key dropdown values: {
  trial_outcome: "Completed – Primary endpoints met.",
  trial_outcome_reference_date: "2025-02-11",
  trial_outcome_link: "https://...",
  adverse_event_reported: "Yes",
  adverse_event_type: "Moderate",
  site_notes_count: 1
}
```

## Common Issues and Solutions

### Issue 1: All fields showing as empty string or null

**Problem**: Data isn't in the database yet
```
  trial_outcome: "" (type: string)
  reference: "" (type: string)
  adverse_event_type: null (type: object)
```

**Solution**: This is normal for new trials. You need to fill and save the data first.

### Issue 2: Data exists but dropdowns are blank

**Problem**: Field value doesn't match dropdown options
```
  trial_outcome: "Completed - Primary endpoints met" (type: string)
  // But dropdown expects: "Completed – Primary endpoints met."
  // Note: Different dash characters
```

**Solution**: Check if the database value exactly matches the dropdown options. Look for:
- Different dash types (- vs –)
- Extra spaces
- Case sensitivity

### Issue 3: Date field not showing

**Problem**: Date format mismatch
```
  reference: "2025-02-11T00:00:00.000Z" (type: string)
  // But after formatting: ""
```

**Solution**: Check the date formatting logs. The formatter should handle ISO dates.

### Issue 4: Result type in notes not showing

**Problem**: Site notes not loading or noteType field missing
```
Site notes raw: "[{...}]" (type: string)
Parsed site_notes successfully: [{date: "...", content: "...", noteType: ""}]
```

**Solution**: The noteType field needs to be saved in the site_notes JSON.

## What to Check in Console

### 1. Check Raw API Data
Look for the first log that shows `foundTrial.results[0]:`
- Are all the fields present?
- What are the exact values?
- Are there any `null` or `undefined` values?

### 2. Check Data Types
Look at the type information in parentheses:
- Dates should be strings: `(type: string)`
- If you see `(type: object)` where it should be string, there's an issue

### 3. Check Field Names
Make sure the API is returning fields with these exact names:
- `trial_outcome`
- `reference`
- `trial_outcome_content`
- `trial_outcome_link`
- `adverse_event_reported`
- `adverse_event_type`
- `treatment_for_adverse_events`
- `site_notes`

### 4. Check Site Notes Structure
Site notes should be a JSON string that parses to:
```json
[
  {
    "id": "1",
    "date": "2025-02-11",
    "noteType": "Interim",
    "content": "...",
    "sourceType": "PubMed",
    "attachments": [],
    "isVisible": true
  }
]
```

## Testing Steps

1. **Fill out the Results tab completely**:
   - Select Trial Outcome
   - Set Trial Outcome Reference date
   - Add Link
   - Add a Result Note with Result type
   - Select Adverse Event Type

2. **Save the trial** (Click "Save Changes")
   - Check console for save logs:
   ```
   === SAVING RESULTS DATA TO API ===
   📤 Form Data - step5_5 (all fields): {...}
   📦 Results payload for API: {...}
   ✅ Results updated successfully
   ```

3. **Reload the page**
   - The fields should now auto-fill
   - If they don't, check the loading logs again

4. **Check for specific field issues**:
   - If Trial Outcome is blank: Check if the saved value matches dropdown options exactly
   - If Date is blank: Check if date format is YYYY-MM-DD
   - If Result type is blank: Check if site_notes JSON has noteType field
   - If Adverse Event Type is blank: Check if adverse_event_type field exists in API

## Need More Help?

Share these logs from your console:
1. The `🔍 Results Data - Individual Field Analysis` section
2. The `🎯 Key dropdown values` section
3. Any red error messages

This will help identify exactly where the data is breaking.

