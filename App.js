import React, { useEffect, useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, ScrollView, Keyboard, Modal, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FOOD_DATABASE = {
  // Drinks
  Cappuccino: { name: '☕ Cappuccino (Large Skimmed Milk - 473ml )', carbs: 12.8 },

  // Breakfast Cereals
  porridgeOats: { name: '🥣 Porridge Oats (Dry - 50g)', carbs: 30 },
  weetabix: { name: '🥣 Weetabix (2 Biscuits)', carbs: 26 },
  cornflakes: { name: '🥣 Cornflakes (30g Bowl)', carbs: 25 },
  muesli: { name: '🥣 Muesli (Swiss Style - 50g)', carbs: 33 },

  // Breads
  wholeBread: { name: '🍞 Wholemeal Bread (1 Slice)', carbs: 16 },
  whiteBread: { name: '🍞 White Bread (1 Slice)', carbs: 15 },
  toastieSlice: { name: '🍞 Thick Toastie Bread (1 Slice)', carbs: 22 },
  SourdoughBread: { name: '🍞 Sourdough Bread (1 Slice)', carbs: 22 },
  crumpet: { name: '🍞 Crumpet (1 Standard)', carbs: 20 },
  bagel: { name: '🍞 Plain Bagel (1 Whole)', carbs: 48 },

  // Potatoes & Rice
  sweetPotato: { name: '🥔 Sweet Potato (Baked - 100g)', carbs: 21 },
  whitePotato: { name: '🥔 White Potato (Baked - 100g)', carbs: 17 },

  // Chips & Rice
  chips: { name: '🥔 Oven Chips (Portion - 150g)', carbs: 40 },
  whiteRice: { name: '🍚 White Rice (Cooked - 100g)', carbs: 28 },
  pasta: { name: '🍝 White Pasta (Cooked - 100g)', carbs: 25 },
  bakedBeans: { name: '🥫 Heinz Baked Beans (Half Can)', carbs: 22 },

  // Fruits & Vegetables
  banana: { name: '🍌 Banana (1 Medium)', carbs: 23 },
  apple: { name: '🍎 Apple (1 Medium)', carbs: 15 },
  pear: { name: '🍐 Pear (1 Medium)', carbs: 15 },
  orange: { name: '🍊 Orange (1 Medium)', carbs: 12 },

  // Vegetables 
  carrot: { name: '🥕 Carrot (1 Medium)', carbs: 5 },
  broccoli: { name: '🥦 Broccoli (100g)', carbs: 7 },

  // Snacks
  popcornPlain: { name: '🍿 Popcorn (Plain - 30g Bag)', carbs: 17 },
  popcornSweet: { name: '🍿 Popcorn (Sweet - 100g Bag)', carbs: 69 },
  walkersCrisps: { name: '🥔 Walkers Crisps (25g Bag)', carbs: 13 },
  pringles: { name: '🥔 Pringles (Portion - 30g)', carbs: 16 },
  digestive: { name: '🍪 Digestive Biscuit (1)', carbs: 9 },
  kitkat: { name: '🍫 KitKat (2 Finger Bar)', carbs: 13 },
  snickers: { name: '🍫 Snickers (Standard 48g)', carbs: 24 },
};

const MAX_CUSTOM_CARBS = 300;
const MAX_RATIO = 100;
const HIGH_DOSE_WARNING_UNITS = 20;
const MAX_CORRECTION_FACTOR = 250;
const BG_LIMITS = {
  mmol: { min: 2, max: 33, unitLabel: 'mmol/L' },
  mgdl: { min: 36, max: 600, unitLabel: 'mg/dL' }
};
const SETTINGS_STORAGE_KEY = 'carb-counter-settings-v1';
const CUSTOM_LIBRARY_STORAGE_KEY = 'carb-counter-custom-library-v1';
const HIDDEN_LIBRARY_ITEMS_STORAGE_KEY = 'carb-counter-hidden-library-items-v1';

const roundToStep = (value, step) => Math.round(value / step) * step;
const isValidRoundingStep = (value) => value === '0.5' || value === '1';
const isValidBgUnit = (value) => value === 'mmol' || value === 'mgdl';

export default function App() {
  const [showMenu, setShowMenu] = useState(false);
  const [ratio, setRatio] = useState('');
  const [customCarbs, setCustomCarbs] = useState('');
  const [customFoodName, setCustomFoodName] = useState('');
  const [mealPlate, setMealPlate] = useState([]);
  const [history, setHistory] = useState([]);
  const [roundingStep, setRoundingStep] = useState('0.5');
  const [bgUnit, setBgUnit] = useState('mmol');
  const [currentBg, setCurrentBg] = useState('');
  const [targetBg, setTargetBg] = useState('');
  const [correctionFactor, setCorrectionFactor] = useState('');
  const [calculatedDose, setCalculatedDose] = useState(null);
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const [bgHelpVisible, setBgHelpVisible] = useState(false);
  const [customLibraryFoods, setCustomLibraryFoods] = useState([]);
  const [hiddenLibraryItemIds, setHiddenLibraryItemIds] = useState([]);
  const [newLibraryFoodName, setNewLibraryFoodName] = useState('');
  const [newLibraryFoodCarbs, setNewLibraryFoodCarbs] = useState('');

  const removeHistoryEntry = (id) => {
    setHistory((prev) => prev.filter((e) => e.id !== id));
  };

  const removeFoodFromLibrary = async (foodId, isCustomFood = true) => {
    const updatedHiddenList = Array.from(new Set([...hiddenLibraryItemIds, foodId]));
    setHiddenLibraryItemIds(updatedHiddenList);

    if (isCustomFood) {
      const updatedFoods = customLibraryFoods.filter((food) => food.id !== foodId);
      setCustomLibraryFoods(updatedFoods);

      try {
        await Promise.all([
          AsyncStorage.setItem(CUSTOM_LIBRARY_STORAGE_KEY, JSON.stringify(updatedFoods)),
          AsyncStorage.setItem(HIDDEN_LIBRARY_ITEMS_STORAGE_KEY, JSON.stringify(updatedHiddenList))
        ]);
      } catch (error) {
        console.error('Failed to remove saved custom food', error);
        alert('Could not remove that food from the library. Please try again.');
      }
      return;
    }

    try {
      await AsyncStorage.setItem(HIDDEN_LIBRARY_ITEMS_STORAGE_KEY, JSON.stringify(updatedHiddenList));
    } catch (error) {
      console.error('Failed to hide library food', error);
      alert('Could not remove that food from the library. Please try again.');
    }
  };

  useEffect(() => {
    const loadSavedData = async () => {
      try {
        const [rawSettings, rawCustomLibrary, rawHiddenLibraryItems] = await Promise.all([
          AsyncStorage.getItem(SETTINGS_STORAGE_KEY),
          AsyncStorage.getItem(CUSTOM_LIBRARY_STORAGE_KEY),
          AsyncStorage.getItem(HIDDEN_LIBRARY_ITEMS_STORAGE_KEY)
        ]);

        if (rawSettings) {
          const parsed = JSON.parse(rawSettings);
          if (typeof parsed.ratio === 'string') setRatio(parsed.ratio);
          if (typeof parsed.roundingStep === 'string' && isValidRoundingStep(parsed.roundingStep)) setRoundingStep(parsed.roundingStep);
          if (typeof parsed.bgUnit === 'string' && isValidBgUnit(parsed.bgUnit)) setBgUnit(parsed.bgUnit);
          if (typeof parsed.targetBg === 'string') setTargetBg(parsed.targetBg);
          if (typeof parsed.correctionFactor === 'string') setCorrectionFactor(parsed.correctionFactor);
        }

        if (rawCustomLibrary) {
          const parsedFoods = JSON.parse(rawCustomLibrary);
          if (Array.isArray(parsedFoods)) {
            const validFoods = parsedFoods.filter(
              (item) =>
                item &&
                typeof item.id === 'string' &&
                typeof item.name === 'string' &&
                typeof item.carbs === 'number' &&
                !Number.isNaN(item.carbs)
            );
            setCustomLibraryFoods(validFoods);
          }
        }

        if (rawHiddenLibraryItems) {
          const parsedHidden = JSON.parse(rawHiddenLibraryItems);
          if (Array.isArray(parsedHidden)) {
            const validHidden = parsedHidden.filter((item) => typeof item === 'string');
            setHiddenLibraryItemIds(validHidden);
          }
        }
      } catch (error) {
        console.error('Failed to load saved app data', error);
        alert('Could not load saved settings/library. Please check app storage permissions and try again.');
      }
    };

    loadSavedData();
  }, []);

  const addFoodToPlate = (foodItem, isCustom = false) => {
    if (isCustom) {
      const carbsAmount = parseFloat(customCarbs);
      if (isNaN(carbsAmount) || carbsAmount <= 0 || carbsAmount > MAX_CUSTOM_CARBS) {
        alert(`Please enter a valid carbohydrate amount between 0 and ${MAX_CUSTOM_CARBS}g`);
        return;
      }
      const cleanedCustomName = customFoodName.trim();
      const displayName = cleanedCustomName.length > 0 ? `✏️ ${cleanedCustomName}` : '✏️ Custom Manual Food';
      setMealPlate((prevPlate) => [...prevPlate, { id: Date.now().toString(), name: displayName, carbs: carbsAmount }]);
      setCustomCarbs('');
      setCustomFoodName('');
      return;
    }

    if (!foodItem) {
      alert('Please choose a food from the library.');
      return;
    }

    setMealPlate((prevPlate) => [...prevPlate, { id: Date.now().toString(), name: foodItem.name, carbs: foodItem.carbs }]);
    setShowMenu(false);
  };

  const addFoodToLibrary = async () => {
    const trimmedName = newLibraryFoodName.trim();
    const carbsAmount = parseFloat(newLibraryFoodCarbs);

    if (trimmedName.length === 0) {
      alert('Please enter a food name.');
      return;
    }

    if (isNaN(carbsAmount) || carbsAmount <= 0 || carbsAmount > MAX_CUSTOM_CARBS) {
      alert(`Please enter carbs between 0 and ${MAX_CUSTOM_CARBS}g for the new food.`);
      return;
    }

    const allExistingNames = [
      ...Object.values(FOOD_DATABASE).map((food) => food.name.toLowerCase()),
      ...customLibraryFoods.map((food) => food.name.toLowerCase()),
      ...customLibraryFoods.filter((food) => hiddenLibraryItemIds.includes(food.id)).map((food) => food.name.toLowerCase())
    ];

    if (allExistingNames.includes(trimmedName.toLowerCase())) {
      alert('That food name already exists in your library. Please use a different name.');
      return;
    }

    const newFood = {
      id: Date.now().toString(),
      name: `🆕 ${trimmedName}`,
      carbs: carbsAmount
    };

    const updatedFoods = [...customLibraryFoods, newFood];

    try {
      await AsyncStorage.setItem(CUSTOM_LIBRARY_STORAGE_KEY, JSON.stringify(updatedFoods));
      setCustomLibraryFoods(updatedFoods);
      setNewLibraryFoodName('');
      setNewLibraryFoodCarbs('');
      alert('New food added to your library.');
    } catch (error) {
      console.error('Failed to save custom library food', error);
      alert('Could not save the new food. Please try again.');
    }
  };

  const removeFoodFromPlate = (id) => {
    setMealPlate((prevPlate) => prevPlate.filter((item) => item.id !== id));
    setCalculatedDose(null);
  };

  const clearPlate = () => {
    setMealPlate([]);
    setCalculatedDose(null);
  };

  const savePersonalSettings = async () => {
    const parsedRatio = ratio === '' ? null : parseFloat(ratio);
    const parsedTargetBg = targetBg === '' ? null : parseFloat(targetBg);
    const parsedCorrectionFactor = correctionFactor === '' ? null : parseFloat(correctionFactor);
    const selectedLimits = BG_LIMITS[bgUnit];

    if (parsedRatio !== null && (isNaN(parsedRatio) || parsedRatio <= 0 || parsedRatio > MAX_RATIO)) {
      alert(`Please enter a valid Insulin-to-Carb Ratio between 1 and ${MAX_RATIO} before saving.`);
      return;
    }

    if (parsedTargetBg !== null && (isNaN(parsedTargetBg) || parsedTargetBg < selectedLimits.min || parsedTargetBg > selectedLimits.max)) {
      alert(`Target BG must be between ${selectedLimits.min} and ${selectedLimits.max} ${selectedLimits.unitLabel}.`);
      return;
    }

    if (parsedCorrectionFactor !== null && (isNaN(parsedCorrectionFactor) || parsedCorrectionFactor <= 0 || parsedCorrectionFactor > MAX_CORRECTION_FACTOR)) {
      alert(`Correction factor must be between 0 and ${MAX_CORRECTION_FACTOR}.`);
      return;
    }

    const settingsToSave = {
      ratio,
      roundingStep,
      bgUnit,
      targetBg,
      correctionFactor
    };

    try {
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settingsToSave));
      alert('Personal settings saved. They will load automatically next time.');
    } catch (error) {
      console.error('Failed to save settings', error);
      alert('Could not save settings. Please try again.');
    }
  };

  const totalCarbsOnPlate = mealPlate.reduce((sum, item) => sum + item.carbs, 0);

  const calculateTotalMealDose = () => {
    Keyboard.dismiss();
    const hasMealInput = mealPlate.length > 0;
    const hasCorrectionInput = currentBg !== '' || targetBg !== '' || correctionFactor !== '';

    if (!hasMealInput && !hasCorrectionInput) {
      alert('Add some food or enter BG correction details before calculating.');
      return;
    }

    const insulinRatio = parseFloat(ratio);
    const mealDose = hasMealInput ? totalCarbsOnPlate / insulinRatio : 0;
    let correctionDose = 0;
    let isBelowOrAtTarget = false;

    if (hasMealInput && (isNaN(insulinRatio) || insulinRatio <= 0 || insulinRatio > MAX_RATIO)) {
      alert(`Please enter a valid Insulin-to-Carb Ratio between 1 and ${MAX_RATIO}`);
      return;
    }

    if (hasCorrectionInput) {
      const currentBgValue = parseFloat(currentBg);
      const targetBgValue = parseFloat(targetBg);
      const correctionFactorValue = parseFloat(correctionFactor);
      const selectedLimits = BG_LIMITS[bgUnit];

      if (isNaN(currentBgValue) || isNaN(targetBgValue) || isNaN(correctionFactorValue)) {
        alert('For correction dose, enter valid numbers for current BG, target BG, and correction factor.');
        return;
      }

      if (
        currentBgValue < selectedLimits.min ||
        currentBgValue > selectedLimits.max ||
        targetBgValue < selectedLimits.min ||
        targetBgValue > selectedLimits.max
      ) {
        alert(`BG values must be between ${selectedLimits.min} and ${selectedLimits.max} ${selectedLimits.unitLabel}.`);
        return;
      }

      if (correctionFactorValue <= 0 || correctionFactorValue > MAX_CORRECTION_FACTOR) {
        alert(`Correction factor must be between 0 and ${MAX_CORRECTION_FACTOR}.`);
        return;
      }

      const difference = currentBgValue - targetBgValue;
      isBelowOrAtTarget = difference <= 0;
      correctionDose = isBelowOrAtTarget ? 0 : difference / correctionFactorValue;
    }

    const doseStep = parseFloat(roundingStep);
    const exactDose = mealDose + correctionDose;
    const roundedDose = roundToStep(exactDose, doseStep);
    const finalDoseString = `${roundedDose.toFixed(1)} Units`;

    setCalculatedDose({
      mealDose: mealDose.toFixed(2),
      correctionDose: correctionDose.toFixed(2),
      exactDose: exactDose.toFixed(2),
      roundedDose: roundedDose.toFixed(1),
      step: doseStep,
      correctionUsed: hasCorrectionInput,
      belowOrAtTarget: isBelowOrAtTarget
    });

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const entryFoods = mealPlate.map((item) => ({ name: item.name, carbs: item.carbs }));

    setHistory((prevHistory) => [{
      id: Date.now().toString(),
      time: currentTime,
      totalCarbs: totalCarbsOnPlate.toFixed(1),
      dose: finalDoseString,
      mealDose: mealDose.toFixed(1),
      correctionDose: correctionDose.toFixed(1),
      foods: entryFoods
    }, ...prevHistory]);
  };

  const baseLibraryFoods = Object.keys(FOOD_DATABASE).map((key) => ({
    id: key,
    name: FOOD_DATABASE[key].name,
    carbs: FOOD_DATABASE[key].carbs,
    isCustom: false
  }));
  const fullLibraryFoods = [...baseLibraryFoods, ...customLibraryFoods.map((food) => ({ ...food, isCustom: true }))]
    .filter((food) => !hiddenLibraryItemIds.includes(food.id));

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <View style={{ backgroundColor: '#fff', paddingTop: 50, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#dee2e6', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1a1a1a' }}>Multi-Select Carb Counter</Text>
          <TouchableOpacity onPress={() => setHelpModalVisible(true)} style={{ padding: 6 }}>
            <Text style={{ color: '#6c757d', fontWeight: '700' }}>Help</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 15 }} keyboardShouldPersistTaps="handled">
        <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#495057', marginTop: 10, marginBottom: 8 }}>1. Add Foods to Your Meal Plate:</Text>
        <TouchableOpacity style={{ backgroundColor: '#fff', padding: 14, borderRadius: 8, borderWidth: 1, borderColor: '#dee2e6', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }} onPress={() => setShowMenu(!showMenu)}>
          <Text style={{ fontSize: 14, color: '#6c757d', fontWeight: '500' }}>Tap to Open Food Library ({fullLibraryFoods.length} Options)...</Text>
          <Text style={{ fontSize: 12, color: '#6c757d' }}>{showMenu ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {showMenu && (
          <View style={{ backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#dee2e6', marginBottom: 10, height: 280, overflow: 'hidden' }}>
            <View style={{ paddingHorizontal: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f1f3f5', backgroundColor: '#f8f9fa' }}>
              <Text style={{ fontSize: 12, color: '#6c757d', fontWeight: '700' }}>Custom items have a trash button beside them.</Text>
            </View>
            <ScrollView style={{ flex: 1 }} nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
              {fullLibraryFoods.map((foodItem) => (
                <View key={foodItem.id} style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#f1f3f5', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <TouchableOpacity onPress={() => addFoodToPlate(foodItem)} style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, color: '#212529', flex: 1 }}>{foodItem.name}</Text>
                    <Text style={{ color: '#6c757d', fontSize: 13, marginRight: 8 }}>{foodItem.carbs}g</Text>
                    <Text style={{ color: '#007AFF', fontWeight: 'bold', fontSize: 13 }}>[ADD]</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => removeFoodFromLibrary(foodItem.id, foodItem.isCustom)}
                    style={{
                      backgroundColor: '#dc3545',
                      borderRadius: 8,
                      paddingHorizontal: 10,
                      paddingVertical: 8,
                      minWidth: 76,
                      alignItems: 'center'
                    }}
                  >
                    <Text style={{ color: '#fff', fontWeight: '800', fontSize: 12 }}>🗑 Delete</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={{ backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#dee2e6', padding: 12, marginBottom: 15 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#212529', marginBottom: 8 }}>Add New Food to Library</Text>
          <TextInput
            style={{ backgroundColor: '#fff', padding: 10, borderRadius: 8, fontSize: 14, borderWidth: 1, borderColor: '#dee2e6', marginBottom: 8 }}
            placeholder="Food name (e.g., Chicken Wrap)"
            value={newLibraryFoodName}
            onChangeText={setNewLibraryFoodName}
          />
          <TextInput
            style={{ backgroundColor: '#fff', padding: 10, borderRadius: 8, fontSize: 14, borderWidth: 1, borderColor: '#dee2e6', marginBottom: 10 }}
            keyboardType="numeric"
            placeholder="Carbs per serving (grams only)"
            value={newLibraryFoodCarbs}
            onChangeText={setNewLibraryFoodCarbs}
          />
          <TouchableOpacity style={{ backgroundColor: '#17a2b8', padding: 10, borderRadius: 8, alignItems: 'center' }} onPress={addFoodToLibrary}>
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>Save to Library</Text>
          </TouchableOpacity>
        </View>

        <View style={{ backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#dee2e6', padding: 12, marginBottom: 15 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#212529', marginBottom: 8 }}>My Saved Custom Foods</Text>
          {customLibraryFoods.length === 0 ? (
            <Text style={{ fontStyle: 'italic', color: '#868e96', fontSize: 13, marginBottom: 4 }}>No custom foods saved yet.</Text>
          ) : (
            customLibraryFoods.map((food) => (
              <View key={food.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f8f9fa' }}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={{ fontSize: 14, color: '#212529' }}>{food.name.replace(/^🆕\s*/, '')}</Text>
                  <Text style={{ fontSize: 12, color: '#6c757d' }}>{food.carbs}g carbs</Text>
                </View>
                <TouchableOpacity onPress={() => removeFoodFromLibrary(food.id)} style={{ backgroundColor: '#ffe3e3', borderWidth: 1, borderColor: '#f5c2c7', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 6 }}>
                  <Text style={{ color: '#b02a37', fontWeight: '700', fontSize: 12 }}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        <View style={{ backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#dee2e6', padding: 12, marginBottom: 20 }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#212529', marginBottom: 8 }}>Quick Custom Food for This Meal</Text>
          <TextInput
            style={{ backgroundColor: '#fff', padding: 10, borderRadius: 8, fontSize: 14, borderWidth: 1, borderColor: '#dee2e6', fontSize: 14, marginBottom: 8 }}
            placeholder="Custom food name (optional)"
            value={customFoodName}
            onChangeText={setCustomFoodName}
          />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TextInput
              style={{ flex: 1, backgroundColor: '#fff', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#dee2e6', fontSize: 14 }}
              keyboardType="numeric"
              placeholder="Carbs (grams only)"
              value={customCarbs}
              onChangeText={setCustomCarbs}
            />
            <TouchableOpacity style={{ backgroundColor: '#007AFF', paddingHorizontal: 15, borderRadius: 8, justifyContent: 'center', alignItems: 'center' }} onPress={() => addFoodToPlate(null, true)}>
              <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>Add Custom</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ backgroundColor: '#fff', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#dee2e6', marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#212529' }}>🛒 Your Current Plate Basket:</Text>
          </View>

          {mealPlate.length === 0 ? (
            <Text style={{ fontStyle: 'italic', color: '#868e96', fontSize: 13, textAlign: 'center', marginVertical: 10 }}>Your plate is empty. Add multiple items from the library above!</Text>
          ) : (
            mealPlate.map((item) => (
              <View key={item.id} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f8f9fa' }}>
                <Text style={{ fontSize: 14, color: '#495057', flex: 1 }}>{item.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#212529' }}>{item.carbs}g</Text>
                  <TouchableOpacity onPress={() => removeFoodFromPlate(item.id)}>
                    <Text style={{ color: '#dc3545', fontWeight: 'bold', fontSize: 12 }}>[REMOVE]</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}

          {mealPlate.length > 0 && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, paddingTop: 10, borderTopWidth: 2, borderTopColor: '#dee2e6' }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#212529' }}>Total Combined Carbs:</Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#007AFF' }}>{totalCarbsOnPlate}g</Text>
            </View>
          )}
          {mealPlate.length > 0 && (
            <TouchableOpacity style={{ marginTop: 12, alignSelf: 'flex-end' }} onPress={clearPlate}>
              <Text style={{ color: '#dc3545', fontWeight: '600', fontSize: 13 }}>Clear Plate</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ marginBottom: 15 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#495057', marginBottom: 6 }}>Enter Insulin-to-Carb Ratio (g/Unit):</Text>
          <TextInput
            style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8, fontSize: 16, borderWidth: 1, borderColor: '#dee2e6' }}
            keyboardType="numeric"
            placeholder="e.g., 10"
            value={ratio}
            onChangeText={setRatio}
          />
        </View>

        <View style={{ marginBottom: 15 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#495057', marginBottom: 6 }}>Dose Rounding Step:</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              style={{ backgroundColor: roundingStep === '0.5' ? '#007AFF' : '#fff', borderColor: '#dee2e6', borderWidth: 1, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 14 }}
              onPress={() => setRoundingStep('0.5')}
            >
              <Text style={{ color: roundingStep === '0.5' ? '#fff' : '#212529', fontWeight: '600' }}>0.5 Unit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: roundingStep === '1' ? '#007AFF' : '#fff', borderColor: '#dee2e6', borderWidth: 1, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 14 }}
              onPress={() => setRoundingStep('1')}
            >
              <Text style={{ color: roundingStep === '1' ? '#fff' : '#212529', fontWeight: '600' }}>1.0 Unit</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#dee2e6', padding: 12, marginBottom: 15 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#212529' }}>Optional BG Correction Dose</Text>
            <TouchableOpacity onPress={() => setBgHelpVisible(true)} style={{ padding: 6 }}>
              <Text style={{ color: '#007AFF', fontWeight: '700' }}>?</Text>
            </TouchableOpacity>
          </View>

          <Text style={{ fontSize: 12, color: '#6c757d', marginBottom: 8 }}>
            BG means Blood Glucose. Enter all fields below only when you need a correction bolus.
          </Text>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
            <TouchableOpacity
              style={{ backgroundColor: bgUnit === 'mmol' ? '#007AFF' : '#fff', borderColor: '#dee2e6', borderWidth: 1, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 }}
              onPress={() => setBgUnit('mmol')}
            >
              <Text style={{ color: bgUnit === 'mmol' ? '#fff' : '#212529', fontWeight: '600' }}>mmol/L</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: bgUnit === 'mgdl' ? '#007AFF' : '#fff', borderColor: '#dee2e6', borderWidth: 1, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 }}
              onPress={() => setBgUnit('mgdl')}
            >
              <Text style={{ color: bgUnit === 'mgdl' ? '#fff' : '#212529', fontWeight: '600' }}>mg/dL</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={{ backgroundColor: '#fff', padding: 10, borderRadius: 8, fontSize: 14, borderWidth: 1, borderColor: '#dee2e6', marginBottom: 8 }}
            keyboardType="numeric"
            placeholder={`Current BG (${BG_LIMITS[bgUnit].unitLabel})`}
            value={currentBg}
            onChangeText={setCurrentBg}
          />
          <TextInput
            style={{ backgroundColor: '#fff', padding: 10, borderRadius: 8, fontSize: 14, borderWidth: 1, borderColor: '#dee2e6', marginBottom: 8 }}
            keyboardType="numeric"
            placeholder={`Target BG (${BG_LIMITS[bgUnit].unitLabel})`}
            value={targetBg}
            onChangeText={setTargetBg}
          />
          <TextInput
            style={{ backgroundColor: '#fff', padding: 10, borderRadius: 8, fontSize: 14, borderWidth: 1, borderColor: '#dee2e6' }}
            keyboardType="numeric"
            placeholder={`Correction factor (${BG_LIMITS[bgUnit].unitLabel} per 1 unit)`}
            value={correctionFactor}
            onChangeText={setCorrectionFactor}
          />
        </View>

        <TouchableOpacity
          style={{ backgroundColor: '#6f42c1', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 15 }}
          onPress={savePersonalSettings}
        >
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>Save My Personal Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ backgroundColor: '#28a745', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 5 }} onPress={calculateTotalMealDose}>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Calculate Dose</Text>
        </TouchableOpacity>

        {calculatedDose && (
          <View style={{ marginTop: 20, padding: 15, backgroundColor: '#e8f0fe', borderRadius: 8, alignItems: 'center' }}>
            <Text style={{ fontSize: 14, color: '#185abc' }}>Suggested Combined Dose (rounded to {calculatedDose.step}):</Text>
            <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#185abc', marginTop: 2 }}>{calculatedDose.roundedDose} Units</Text>
            <Text style={{ fontSize: 12, color: '#495057', marginTop: 4 }}>Meal dose: {calculatedDose.mealDose} Units</Text>
            <Text style={{ fontSize: 12, color: '#495057', marginTop: 2 }}>Correction dose: {calculatedDose.correctionDose} Units</Text>
            <Text style={{ fontSize: 12, color: '#495057', marginTop: 2 }}>Exact total: {calculatedDose.exactDose} Units</Text>
            {calculatedDose.correctionUsed && calculatedDose.belowOrAtTarget && (
              <Text style={{ fontSize: 12, color: '#b26a00', marginTop: 6, textAlign: 'center' }}>
                Current BG is at or below target. Correction dose was set to 0.
              </Text>
            )}
            {parseFloat(calculatedDose.roundedDose) >= HIGH_DOSE_WARNING_UNITS && (
              <Text style={{ fontSize: 12, color: '#dc3545', marginTop: 6, textAlign: 'center' }}>
                High-dose result detected. Double-check carbs and ratio before dosing.
              </Text>
            )}
          </View>
        )}

        <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#495057', marginTop: 20, marginBottom: 10 }}>Today's Historical Logbook:</Text>
        <View style={{ marginTop: 5, marginBottom: 40 }}>
          {history.length === 0 ? (
            <Text style={{ fontStyle: 'italic', color: '#868e96', fontSize: 13, textAlign: 'center', marginVertical: 10 }}>
              No doses calculated yet.
            </Text>
          ) : (
            history.map((entry) => (
              <View key={entry.id} style={{ backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#e9ecef' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#212529' }}>{entry.time}</Text>
                  <Text style={{ fontSize: 13, color: '#495057' }}>{entry.totalCarbs}g carbs</Text>
                </View>
                <Text style={{ fontSize: 13, color: '#185abc' }}>Dose: {entry.dose}</Text>
                <Text style={{ fontSize: 12, color: '#495057', marginTop: 2 }}>
                  Meal {entry.mealDose}u + Correction {entry.correctionDose}u
                </Text>

                {entry.foods && entry.foods.length > 0 && (
                  <View style={{ marginTop: 8 }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#212529' }}>Foods:</Text>
                    {entry.foods.map((f, i) => (
                      <Text key={i} style={{ fontSize: 12, color: '#495057' }}>• {f.name} — {f.carbs}g</Text>
                    ))}
                  </View>
                )}

                <View style={{ marginTop: 8, flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
                  <TouchableOpacity onPress={() => removeHistoryEntry(entry.id)} style={{ paddingVertical: 6, paddingHorizontal: 10 }}>
                    <Text style={{ color: '#dc3545', fontWeight: '700' }}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <Modal visible={helpModalVisible} animationType="slide" transparent={true}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ width: '90%', backgroundColor: '#fff', borderRadius: 8, padding: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 8 }}>Help — Terms</Text>
            <Text style={{ marginBottom: 6 }}>BG = Blood Glucose level (your current blood sugar reading).</Text>
            <Text style={{ marginBottom: 6 }}>Insulin-to-Carb Ratio = how many grams of carbs are covered by 1 unit of insulin (e.g., 10 means 1U per 10g carbs).</Text>
            <Text style={{ marginBottom: 6 }}>Correction factor = how much your BG drops for 1 unit of insulin (e.g., 2 mmol/L per unit or 50 mg/dL per unit).</Text>
            <Text style={{ marginBottom: 6 }}>Meal dose = insulin needed to cover carbs. Correction dose = insulin to correct high BG.</Text>
            <Pressable onPress={() => setHelpModalVisible(false)} style={{ marginTop: 12, alignSelf: 'flex-end' }}>
              <Text style={{ color: '#007AFF', fontWeight: '700' }}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal visible={bgHelpVisible} animationType="fade" transparent={true}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ width: '90%', backgroundColor: '#fff', borderRadius: 8, padding: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 8 }}>What does BG mean?</Text>
            <Text style={{ marginBottom: 6 }}>BG stands for Blood Glucose — your current blood sugar measurement. Use the same units your meter shows (mmol/L or mg/dL).</Text>
            <Text style={{ marginBottom: 6 }}>If your current BG is at or below your chosen target, the correction dose will be set to zero to avoid hypoglycaemia risk.</Text>
            <Pressable onPress={() => setBgHelpVisible(false)} style={{ marginTop: 12, alignSelf: 'flex-end' }}>
              <Text style={{ color: '#007AFF', fontWeight: '700' }}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
