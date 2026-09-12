# Carb Counter App

A React Native + Expo app that helps calculate a meal insulin dose from total carbohydrates.

## What the app does

- Lets you add multiple foods from a built-in food library (40+ options)
- Supports manual custom carb entry for foods not in the library
- Builds a "current plate" basket and totals carbs automatically
- Calculates suggested insulin dose using your insulin-to-carb ratio
- Stores a simple in-app history log of dose calculations for the current session

## Tech stack

- Expo `~57.0.22`
- React `19.2.3`
- React Native `0.86.3`
- `@react-native-picker/picker`
- `lucide-react-native`

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Start the Expo development server:

```bash
npm run start
```

3. Run on your preferred platform:

```bash
npm run ios
# or
npm run android
# or
npm run web
```

## How to use

1. Open the food library and add one or more foods to your meal plate.
2. Optionally add manual carbs with the custom input.
3. Enter your insulin-to-carb ratio (g/unit), for example `10`.
4. Tap **Calculate Total Meal Dose**.
5. Review the suggested dose and session history log.

## Current scripts

- `npm run start` – start Expo
- `npm run ios` – open in iOS simulator/device
- `npm run android` – open in Android emulator/device
- `npm run web` – run in browser

## Notes

- This app provides a calculation aid only.
- Always follow your healthcare professional’s guidance for insulin dosing.
