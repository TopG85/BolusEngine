Carb Counter App
A React Native + Expo app that helps calculate a meal insulin dose from total carbohydrates.

What the app does
Lets you add multiple foods from a built-in food library (40+ options)
Supports manual custom carb entry for foods not in the library
Builds a "current plate" basket and totals carbs automatically
Calculates suggested insulin dose using your insulin-to-carb ratio
Shows exact dose plus rounded dose selection (0.5 or 1.0 unit steps)
Includes optional BG correction dose inputs (mmol/L or mg/dL)
Breaks down meal dose and correction dose in results/history
Flags high calculated doses to prompt a manual double-check
Includes quick clear-plate action
Saves personal defaults (ratio, rounding, BG unit, target BG, correction factor)
Stores a simple in-app history log of dose calculations for the current session
History entries include the foods selected and allow deleting individual entries
Provides in-app Help and BG explanation modals for key terms
Tech stack
Expo ~57.0.22
React 19.2.3
React Native 0.86.3
@react-native-picker/picker
lucide-react-native
@react-native-async-storage/async-storage (for saving personal settings)
Getting started
Install dependencies:
Start the Expo development server:
Run on your preferred platform:
Note: If you plan to use web, react-dom and react-native-web must be installed for Expo web support.

How to use
Open the food library and add one or more foods to your meal plate.
Optionally add manual carbs with the custom input.
Enter your insulin-to-carb ratio (g/unit), for example 10.
Choose a dose rounding step (0.5 or 1.0 units).
(Optional) For a correction bolus: enter Current BG, Target BG, and Correction Factor (use the same unit as your meter — mmol/L or mg/dL).
Optionally save these values as your personal defaults using "Save My Personal Settings".
Tap Calculate Total Meal Dose.
The app shows:
Meal dose (covers carbs)
Correction dose (if inputs provided and current BG > target)
Exact total and rounded suggested dose
Review the session history (logbook). Each entry lists the selected foods and allows deleting that entry.
Tap the in-app Help button or the "?" next to the BG section for explanations of the terms.
Safety & notes
This app is a calculation aid only. Always follow your healthcare professional’s guidance before dosing.
If calculated dose is high (>= 20 units), the app shows a warning to double-check entries.
If current BG is at or below the target, correction dose is set to 0 to avoid hypoglycaemia risk.
Deleting a history entry removes it from the current session only. If you add persistent history storage later, update the delete behavior accordingly.
Scripts
npm run start – start Expo
npm run ios – open in iOS simulator/device
npm run android – open in Android emulator/device
npm run web – run in browser