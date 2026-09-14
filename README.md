# Carb Counter App

A personal-use React Native and Expo app for quick carb and insulin dose calculations.

[![Expo](https://img.shields.io/badge/Expo-~57-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.86-61DAFB?logo=react&logoColor=white)](https://reactnative.dev/)
[![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android%20%7C%20Web-4CAF50)](https://github.com/TopG85/carb-counter-app)

Carb Counter App helps you estimate insulin requirements for meals, correction doses, or a combination of both. It includes a large food library, custom food support, saved personal settings, and a recent history log for quick reference.

## Why this app?

This project was built to make carb and correction calculations easier to manage in everyday life.

It is designed for:
- meal bolus planning
- correction dose support when blood glucose is high
- saving common settings so the app feels familiar every time you use it
- quickly managing a personal food list without needing a spreadsheet

## Key features

- Built-in food library with 40+ common items
- Add your own foods to the library
- Delete any food from the live library list using the trash button
- Total carb calculation across multiple foods
- Meal-only, correction-only, and combined dose calculations
- Supports mmol/L and mg/dL BG units
- Exact dose and rounded suggestion display
- 0.5 unit or 1.0 unit rounding options
- Saved personal settings using AsyncStorage
- Recent dose history with food breakdowns
- Delete history entries individually
- Built-in help and BG guidance pop-ups
- High-dose warning for unusually large totals

## How it works

1. Add foods to your plate from the built-in library or custom list.
2. Enter your insulin-to-carb ratio, such as `10` for 1 unit per 10g carbs.
3. Optional: add current BG, target BG, and correction factor for correction dosing.
4. Tap `Calculate Dose`.
5. Review the meal dose, correction dose, exact total, and rounded recommendation.
6. Save your personal settings to make future calculations faster.

## Example

### Meal-only example
- Bagel: 48g
- Orange: 12g
- Total carbs: 60g
- Ratio: 10 g/unit
- Meal dose: 60 / 10 = 6.0 units

### Correction-only example
- Current BG: 11.0 mmol/L
- Target BG: 6.0 mmol/L
- Correction factor: 2.0 mmol/L per unit
- Correction dose: (11.0 - 6.0) / 2.0 = 2.5 units

### Combined meal + correction example
- Meal dose: 6.0 units
- Correction dose: 2.5 units
- Exact total: 8.5 units
- Rounded recommendation: 8.5 units (0.5 step)

## Getting started

### Prerequisites

- Node.js
- npm
- Expo CLI

### Installation

```bash
npm install
npm run start
```

Then run on your preferred platform:

```bash
npm run ios
npm run android
npm run web
```

If web support is needed:

```bash
npx expo install react-dom react-native-web
```

## Project structure

- `App.js` — main app logic and UI
- `package.json` — project scripts and dependencies
- `README.md` — project documentation

## Safety notes

This app is a calculation aid only and should not be treated as medical advice.

- Always check values carefully before dosing.
- If current BG is at or below target, the correction dose is automatically set to zero.
- High-dose warnings are shown for unusually large results.
- Please confirm any insulin-related decisions with a healthcare professional when appropriate.

## Local storage

The app stores local data using AsyncStorage for:
- saved personal settings
- custom food library entries
- recent calculation history

## Repository

GitHub:
https://github.com/TopG85/carb-counter-app

## Recent updates

- Added correction-only dose calculation when no meal carbs are present
- Added custom food deletion support
- Improved food library management and custom food persistence
- Added better validation around meal and correction dosing
- Saved personal defaults and recent log history
- Refined app usability and help text for clearer everyday use

## License

This project does not currently include a license file. If you plan to publish or share it publicly, add a license that matches your intended usage.
