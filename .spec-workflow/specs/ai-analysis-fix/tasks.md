# Tasks: AI Analysis Fix

## Task 1: Enhanced Error Logging
- [ ] **Task 1.1**: Add comprehensive logging to `GeminiProvider.js`
  - Files: `src/ai/GeminiProvider.js`
  - Add logging for empty responses, JSON parsing failures
  - Log first 500 chars of raw AI response
  
## Task 2: Fix Consumer Profile Analysis
- [ ] **Task 2.1**: Simplify Consumer Profile prompt in `PromptTemplates.js`
  - Files: `src/ai/PromptTemplates.js`
  - Add "MUST return array" instructions
  - Simplify JSON structure
  - Add minimum data requirements (10 items)

- [ ] **Task 2.2**: Add fallback for Consumer Profile in `DataExpansionService.js`
  - Files: `src/ai/DataExpansionService.js`
  - Create `fallbackConsumerProfile(reviews)` method
  - Return template data when AI fails

- [ ] **Task 2.3**: Add error handling for Consumer Profile in `AnalysisService.js`
  - Files: `src/ai/AnalysisService.js`
  - Wrap with try-catch
  - Use fallback on empty results

## Task 3: Fix Usage Scenarios Analysis
- [ ] **Task 3.1**: Simplify Usage Scenarios prompt
  - Files: `src/ai/PromptTemplates.js`
  - Same improvements as Consumer Profile

- [ ] **Task 3.2**: Add fallback for Usage Scenarios
  - Files: `src/ai/DataExpansionService.js`
  - Create `fallbackUsageScenarios(reviews)` method

- [ ] **Task 3.3**: Add error handling for Usage Scenarios
  - Files: `src/ai/AnalysisService.js`
  - Same pattern as Consumer Profile

## Task 4: Fix Product Experience Analysis
- [ ] **Task 4.1**: Simplify Product Experience prompts
  - Files: `src/ai/PromptTemplates.js`
  - Fix both strengths and weaknesses prompts

- [ ] **Task 4.2**: Add fallbacks for Product Experience
  - Files: `src/ai/DataExpansionService.js`
  - Create `fallbackProductStrengths(reviews)` and `fallbackProductWeaknesses(reviews)`

- [ ] **Task 4.3**: Add error handling for Product Experience
  - Files: `src/ai/AnalysisService.js`
  - Handle both strengths and weaknesses

## Task 5: Chrome Extension Enhancement
- [ ] **Task 5.1**: Add "View Full Report" button to extension
  - Files: `chrome-extension/ui.js`, `chrome-extension/ui.html`
  - Add button after analysis completes
  - Open web dashboard with report link

- [ ] **Task 5.2**: Update extension styles
  - Files: `chrome-extension/ui.css`
  - Style the new button

## Task 6: Testing & Verification
- [ ] **Task 6.1**: Create new test task and verify all modules
  - Test all 7 analysis dimensions
  - Verify no empty arrays
  
- [ ] **Task 6.2**: Test Chrome extension flow
  - Test button click
  - Verify navigation to web dashboard



