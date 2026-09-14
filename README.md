# Carb Counter App

A simple React Native + Expo app for calculating insulin doses from carbohydrate totals and optional blood glucose correction.

This app is intended for quick personal-use diabetes support, helping with meal dose estimates, correction dose calculations, and saved defaults for common settings.

## Overview

The app lets you:
- select multiple foods and build a meal plate
- calculate a meal dose from your insulin-to-carb ratio
- calculate a correction dose from current BG, target BG, and correction factor
- calculate meal + correction together when needed
- add custom foods to the library and remove custom foods you no longer need
- save personal settings so they load automatically next time
- review and delete recent dose history entries

## Features

### Meal and correction dosing
- Multi-item meal plate with automatic total carb calculation
- Insulin-to-carb ratio input (g per 1 unit)
- Optional BG correction dose using mmol/L or mg/dL
- Meal-only, correction-only, and combined meal + correction calculations
- Exact dose and rounded recommended dose
- 0.5 unit and 1.0 unit rounding options
- High-dose warning for large totals

### Food library and custom foods
- Built-in food library with 40+ common items
- Add custom foods to the library
- Remove custom foods from the library when they are no longer needed
- Add a one-off custom food directly for the current meal
- Save custom library items locally so they remain available on restart

### Personal settings and history
- Save personal defaults for ratio, rounding, BG unit, target BG, and correction factor
- Startup auto-load of saved settings
- Dose history with food breakdowns and total carbs
- Delete individual history entries
- Help screen and BG explanation pop-ups for easier use

## Tech stack

- Expo SDK ~57.0.22
- React 19.2.3
- React Native 0.86.3
- @react-native-async-storage/async-storage
- AsyncStorage for local persistence

## Installation

1. Install dependencies:
   npm install

2. Start the app:
   npm run start

3. Run on a device or emulator:
   npm run ios
   npm run android
   npm run web

If web support is needed, install the required Expo web packages:

npx expo install react-dom react-native-web

## How to use

1. Open the food library and add items to your plate.
2. If needed, add a custom food to the library using the custom food section.
3. For a one-off meal item, use the custom meal entry and enter only the carbs value.
4. Enter your insulin-to-carb ratio, for example `10` = 1 unit for every 10g carbs.
5. Choose the dose rounding step: `0.5` or `1.0` units.
6. Optional: enter BG settings for a correction dose:
   - Current BG
   - Target BG
   - Correction factor
   - BG unit: mmol/L or mg/dL
7. Tap `Calculate Dose`.
8. Review the result:
   - meal dose
   - correction dose
   - exact total dose
   - rounded suggested dose
9. Use the history section to review prior calculations and delete entries as needed.
10. Tap `Save My Personal Settings` to keep your defaults saved for next time.

## Example calculations

### Meal only
- Bagel: 48g
- Orange: 12g
- Total carbs = 60g
- Ratio = 10 g/unit
- Meal dose = 60 / 10 = 6.0 units

### Correction only
- Current BG = 11.0 mmol/L
- Target BG = 6.0 mmol/L
- Correction factor = 2.0 mmol/L per 1 unit
- Correction dose = (11.0 - 6.0) / 2.0 = 2.5 units

### Meal + correction
- Meal dose = 6.0 units
- Correction dose = 2.5 units
- Exact total = 8.5 units
- Rounded suggestion (0.5 unit step) = 8.5 units

## Safety notes

This app is a calculation aid only and does not replace medical advice.

- Always confirm any insulin dose with a healthcare professional when appropriate.
- If current BG is at or below target, the correction dose is set to zero.
- High-dose warnings appear when the calculated value is large.
- Review all values carefully before dosing.

## Local storage and history

The app stores:
- saved personal settings using AsyncStorage
- custom food library entries locally
- recent calculation history in-session

The logbook can be used to review recent entries and remove any that are no longer needed.

## Repository

GitHub repository:
https://github.com/TopG85/carb-counter-app

## Recent updates

- Added correction-only dose calculation without needing meal carbs
- Added delete action for custom foods in the food library
- Added custom food library save and retrieval logic
- Improved meal + correction dose validation and warnings
- Added saved defaults and local persistence
- Improved overall app readability and logging

## License

This project does not currently include a license file. Add a license if you plan to share or publish the project publicly.
