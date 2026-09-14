# Carb Counter App

A lightweight React Native + Expo app to calculate insulin doses from carbohydrate totals. Designed for quick meal bolus calculations with optional BG (blood glucose) correction and saved personal settings.

## Table of contents
- Quick summary
- Features
- Tech stack
- Install & run
- Quick usage
- Example calculation
- Safety & disclaimers
- Persistence & history
- Troubleshooting
- Development
- Recent changelog

## Quick summary
Multi-select food library (40+ items) + manual carbs, calculates meal bolus with optional BG correction, shows exact and rounded doses, stores session history (with foods) and supports saving personal defaults.

## Features
- Add foods from the built-in library, add your own foods to the library, or enter custom carbs
- Multi-item "plate" with automatic total carbs
- Meal dose calculation using your insulin-to-carb ratio (g per unit)
- Optional BG correction bolus (supports mmol/L and mg/dL)
- Shows exact dose + rounded suggested dose (0.5 or 1.0 unit steps)
- Session logbook that stores selected foods + dose breakdown
- Delete individual history entries
- Save/load personal defaults (ratio, rounding step, BG unit, target BG, correction factor)
- Custom food library items are saved locally and appear in the food picker
- In-app Help and BG explanation modals
- High-dose warning when suggested dose >= 20 units
- Quick clear-plate action

## Tech stack
- Expo SDK ~57.0.22
- React 19.2.3
- React Native 0.86.3
- @react-native-async-storage/async-storage (settings persistence)
- lucide-react-native, @react-native-picker/picker

## Install & run (development)
1. Install dependencies:
   npm install

2. Start Expo:
   npm run start

3. Run on your preferred platform:
   npm run ios
   npm run android
   npm run web

Note: For web support install react-dom and react-native-web compatible with your Expo SDK:
npx expo install react-dom react-native-web

## Quick usage
1. Add foods from the library, or create your own in "Add New Food to Library".
2. For a one-off item, use "Quick Custom Food for This Meal" and enter carbs (grams only).
3. Enter your insulin-to-carb ratio (g/unit), e.g., `10` (1U per 10 g).
4. Choose dose rounding step: 0.5 or 1.0 units.
5. (Optional) For correction bolus:
   - Select BG unit (mmol/L or mg/dL),
   - Enter Current BG, Target BG, and Correction Factor (how much BG falls per 1U).
   - If Current BG ≤ Target BG, correction dose is set to 0.
6. (Optional) Tap "Save My Personal Settings" to persist defaults for next sessions.
7. Tap "Calculate Total Meal Dose" to see meal dose, correction dose, exact total and rounded suggestion.
8. Check the session history: each entry includes foods, carb totals and dose breakdown; you can delete entries.

## Example calculation
- Foods: Bagel (48 g) + Orange (12 g) → Total carbs = 60 g  
- Ratio = 10 g/U → Meal dose = 60 / 10 = 6.0 U  
- Correction example: Current 12.0 mmol/L, Target 6.0 mmol/L, Factor 2 mmol/L per U → Correction = (12 − 6) / 2 = 3.0 U  
- Exact total = 9.0 U → Rounded suggestion (0.5U step) = 9.0 U

## Safety & disclaimers
- This app is a calculation aid only — it is NOT medical advice.
- Always confirm dosing with your healthcare professional before administering insulin.
- Correction dose is disabled when Current BG ≤ Target to reduce hypoglycaemia risk.
- High calculated doses (>= 20 units) show a warning — double-check your inputs before dosing.

## Persistence & history
- Personal settings (ratio, rounding, BG unit, target BG, correction factor) are saved locally using AsyncStorage and auto-loaded on start.
- Session history is kept in-memory for the current session. Deleting a history entry removes it from the session only. If persistent history is required later, it can be stored and exported as CSV.

## Troubleshooting
- Web build error: ensure web deps installed:
  npx expo install react-dom react-native-web
- If UI or logic changes behave unexpectedly: restart Expo and clear the Metro cache:
  expo start -c

## Development & contribution
- Repo: github.com/TopG85/carb-counter-app
- PRs and issues welcome — include platform, Expo SDK, and reproduction steps.

## Recent changelog
- Added BG correction bolus calculation and validation
- Added saved personal settings (AsyncStorage)
- History entries now include the foods logged
- Delete-per-entry button in the logbook
- Help and BG explanation modals added
- Dose rounding options and high-dose warning

License
- (Add your preferred license and attribution here — e.g., MIT)