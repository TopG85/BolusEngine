# Carb Counter App

A personal-use React Native + Expo app for quick carb counting and insulin dose estimation.

[![Expo](https://img.shields.io/badge/Expo-~57-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.86-61DAFB?logo=react&logoColor=white)](https://reactnative.dev/)
[![Platform](https://img.shields.io/badge/Platform-iOS%20%7C%20Android%20%7C%20Web-4CAF50)](https://github.com/TopG85/carb-counter-app)

Carb Counter App helps estimate insulin needs for meals, correction doses, or a combination of both. It includes a built-in food library, a live library delete option, saved personal settings, and a recent dose history log.

## Why this app?

This project was created to make carb and correction calculations easier to manage in everyday life.

It is designed for:
- meal bolus planning
- correction dose support when blood glucose is high
- saving common settings so the app feels familiar every time you use it
- quickly managing a food list without needing a spreadsheet or paper notes

## Features

- Built-in food library with 40+ items
- Add new foods to the library
- Delete any item directly from the live food library list
- Calculate meal-only, correction-only, or combined doses
- Enter insulin-to-carb ratio in g per unit
- Supports mmol/L and mg/dL BG units
- Inline correction-factor help text under BG correction inputs
- Exact dose and rounded suggestion display
- 0.5 unit and 1.0 unit rounding options
- Save personal defaults with AsyncStorage
- Review recent calculations in a history log
- Delete individual history entries
- Built-in help text and BG guidance
- High-dose warning for unusually large totals

## How it works

1. Open the food library and add foods to your meal plate.
2. Enter your insulin-to-carb ratio, such as `10` for 1 unit per 10g carbs.
3. Optional: enter current BG, target BG, and correction factor for a correction dose.
4. Tap `Calculate Dose`.
5. Review the meal dose, correction dose, exact total, and rounded recommendation.
6. Save your personal settings so the app loads them automatically next time.

## Example calculations

### Meal-only
- Bagel: 48g
- Orange: 12g
- Total carbs: 60g
- Ratio: 10 g/unit
- Meal dose: 60 / 10 = 6.0 units

### Correction-only
- Current BG: 11.0 mmol/L
- Target BG: 6.0 mmol/L
- Correction factor: 2.0 mmol/L per unit
- Correction dose: (11.0 - 6.0) / 2.0 = 2.5 units

### Meal + correction
- Meal dose: 6.0 units
- Correction dose: 2.5 units
- Exact total: 8.5 units
- Rounded suggestion: 8.5 units (0.5 step)

## Getting started

### Prerequisites

- Node.js
- npm
- Expo CLI

### Install and run

```bash
npm install
npm run start
```

Run on your platform:

```bash
npm run ios
npm run android
npm run web
```

If web support is needed:

```bash
npx expo install react-dom react-native-web
```

### Web build output

You can generate a static web build with:

```bash
npx expo export --platform web
```

This creates a `dist/` folder that can be hosted on static hosting providers (for example, GitHub Pages).

## Project structure

- `App.js` — main app logic and UI
- `package.json` — project scripts and dependencies
- `README.md` — project documentation

## Safety notes

This app is a calculation aid only and should not be treated as medical advice.

- Always double-check values before dosing.
- If current BG is at or below target, the correction dose is set to zero.
- High-dose warnings appear for unusually large results.
- Please confirm insulin decisions with a healthcare professional when appropriate.

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
- Added direct delete controls in the live food library list
- Improved food-library management and persistence
- Added stronger validation for meal and correction calculations
- Added saved personal defaults and history
- Improved overall app clarity and help text
- Enabled Expo web support with `react-dom` and `react-native-web`

## License

This project does not currently include a license file. If you plan to publish or share it publicly, add a license that matches your intended usage.
