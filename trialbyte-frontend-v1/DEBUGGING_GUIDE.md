# Clinical Trial Edit Form Debugging Guide

## Issue Description
When creating a new clinical trial and filling all 8 tabs, the edit form isn't showing the values in all tabs. But when filling just one tab, that tab's values appear in edit mode.

## Debug Logging Added

### 1. Creating New Trial (`/new` forms)
**Location**: `app/admin/therapeutics/new/context/therapeutic-form-context.tsx`

**What to Check in Console**:
```
🚀 ============ SAVING NEW TRIAL - START ============
📋 All Form Data Being Saved
📊 Form Data Structure Check
  - Shows keys for each step (step5_1 through step5_8)
🌐 API Base URL
👤 Current User ID
📤 Making POST request to
📦 Complete Payload Being Sent
🔍 Individual Sections Check
  - Overview: ✅ Present / ❌ Missing
  - Outcome: ✅ Present / ❌ Missing
  - Criteria: ✅ Present / ❌ Missing
  - Timing: ✅ Present / ❌ Missing
  - Results: ✅ Present / ❌ Missing
  - Sites: ✅ Present / ❌ Missing
  - Other Sources: ✅ Present / ❌ Missing
  - Logs: ✅ Present / ❌ Missing
  - Notes: ✅ Present / ❌ Missing
📨 Response Status
✅ Response Data Received
🆔 Created Trial ID
🏷️ Created Trial Identifier
🎉 ============ SAVING NEW TRIAL - SUCCESS ============
```

### 2. Loading Trial for Edit (`/edit/[id]` form)
**Location**: `app/admin/therapeutics/edit/context/edit-form-context.tsx`

**What to Check in Console**:
```
🔍 ============ LOADING TRIAL DATA - START ============
🆔 Trial ID
🌐 Fetching from URL
📨 Response Status
📦 Raw API Response
🔍 API Response Structure Check
  - trial_id
  - has_data
  - overview_exists
  - outcomes_count
  - criteria_count
  - timing_count
  - results_count
  - sites_count
  - other_count
  - logs_count
  - notes_count
🔄 Mapping API response to form data structure...
📋 Final Mapped Data Being Dispatched
🚀 Dispatching SET_TRIAL_DATA action...
✅ ============ LOADING TRIAL DATA - SUCCESS ============
✅ All 8 steps loaded
🏁 Loading process completed
```

## Debugging Steps

### Step 1: Create New Trial with All 8 Tabs Filled
1. Open browser DevTools Console (F12)
2. Navigate to `/admin/therapeutics/new`
3. Fill in ALL 8 tabs with data
4. Click "Save" or "Create Trial"
5. **Check Console Logs**:
   - Look for `🚀 ============ SAVING NEW TRIAL - START ============`
   - Verify ALL sections show `✅ Present` in the "Individual Sections Check"
   - Note the `🆔 Created Trial ID` value
   - Copy and save the ENTIRE console output

### Step 2: Load Trial in Edit Mode
1. Keep browser console open
2. Navigate to `/admin/therapeutics/edit/[trial_id]` (use the ID from Step 1)
3. **Check Console Logs**:
   - Look for `🔍 ============ LOADING TRIAL DATA - START ============`
   - Check the "API Response Structure Check" - verify all counts > 0
   - Look for `📋 Final Mapped Data Being Dispatched`
   - Verify all 8 steps show values (not 'Missing')
   - Verify `✅ All 8 steps loaded` shows all as `true`

### Step 3: Compare Data
Compare the data sent (Step 1) with data received (Step 2):

**Key Questions**:
1. **Was data sent properly?**
   - Check if all 8 sections were marked `✅ Present` when saving
   - Review the `📦 Complete Payload Being Sent` structure

2. **Did API save it correctly?**
   - Check `✅ Response Data Received` 
   - Verify `🆔 Created Trial ID` was returned

3. **Was data retrieved properly?**
   - Check `📦 Raw API Response` structure
   - Verify all counts in "API Response Structure Check" are > 0
   - If counts are 0, the data wasn't saved to the database

4. **Was data mapped correctly?**
   - Check `📋 Final Mapped Data Being Dispatched`
   - Verify no fields show 'Missing'
   - If fields show 'Missing', the mapping logic needs adjustment

## Common Issues and Solutions

### Issue 1: All sections show ❌ Missing when saving
**Cause**: Form data not properly collected before save
**Solution**: Check that you're navigating through all tabs and triggering onChange events

### Issue 2: Response shows trial created but counts are 0 when loading
**Cause**: Backend API not saving all sections properly
**Solution**: Check backend logs and database to see what was actually saved

### Issue 3: Data loads but doesn't display in UI
**Cause**: Form components not properly connected to context
**Solution**: Check that all section components are using the correct field names from context

### Issue 4: Only some tabs show data
**Cause**: Partial API response or mapping issue
**Solution**: 
- Compare the "API Response Structure Check" counts
- Check which sections have count = 0
- Review the mapping logic for those specific sections

## Testing Scenarios

### Scenario 1: Fill Only One Tab
1. Fill only step5_1 (Basic Info)
2. Save
3. Load in edit mode
4. Check if step5_1 data appears ✅
5. Check console: Only "overview_count" should be > 0

### Scenario 2: Fill All 8 Tabs
1. Fill all tabs with data
2. Save
3. Check console: ALL counts should be > 0
4. Load in edit mode
5. Check console: ALL mapped data should show values
6. Verify all tabs display data in UI ✅

## Log Export Instructions

To share logs for debugging:
1. Right-click in console
2. Select "Save as..."
3. Save as `console-log-[date].txt`
4. Share the file with the development team

## Additional Notes

- Logs are prefixed with emojis for easy identification
- 🚀 = Start of process
- ✅ = Success
- ❌ = Error
- 📋 📦 📊 = Data structure info
- 🔍 = Inspection/checking
- 🌐 = Network/API calls

## Contact

If issues persist after following this guide, provide:
1. Complete console logs from both save and load operations
2. Screenshots of the filled form
3. Screenshots of the edit form showing missing data
4. Browser and version information

