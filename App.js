import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Keyboard } from 'react-native';

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
  popcorn: { name: '🍿 Popcorn (Plain - 30g Bag)', carbs: 17 },
  walkersCrisps: { name: '🥔 Walkers Crisps (25g Bag)', carbs: 13 },
  pringles: { name: '🥔 Pringles (Portion - 30g)', carbs: 16 },
  digestive: { name: '🍪 Digestive Biscuit (1)', carbs: 9 },
  kitkat: { name: '🍫 KitKat (2 Finger Bar)', carbs: 13 },
  snickers: { name: '🍫 Snickers (Standard 48g)', carbs: 24 },
};

export default function App() {
  const [showMenu, setShowMenu] = useState(false);
  const [ratio, setRatio] = useState('');
  const [customCarbs, setCustomCarbs] = useState('');
  const [mealPlate, setMealPlate] = useState([]);
  const [history, setHistory] = useState([]);
  const [calculatedDose, setCalculatedDose] = useState(null);

  const addFoodToPlate = (foodKey, isCustom = false) => {
    if (isCustom) {
      const carbsAmount = parseFloat(customCarbs);
      if (isNaN(carbsAmount) || carbsAmount <= 0) {
        alert('Please enter a valid carbohydrate number');
        return;
      }
      setMealPlate([...mealPlate, { id: Date.now().toString(), name: '✏️ Custom Manual Food', carbs: carbsAmount }]);
      setCustomCarbs('');
    } else {
      const foodItem = FOOD_DATABASE[foodKey];
      setMealPlate([...mealPlate, { id: Date.now().toString(), name: foodItem.name, carbs: foodItem.carbs }]);
      setShowMenu(false);
    }
  };

  const removeFoodFromPlate = (id) => {
    setMealPlate(mealPlate.filter(item => item.id !== id));
    setCalculatedDose(null);
  };

  const totalCarbsOnPlate = mealPlate.reduce((sum, item) => sum + item.carbs, 0);

  const calculateTotalMealDose = () => {
    Keyboard.dismiss();
    const insulinRatio = parseFloat(ratio);

    if (mealPlate.length === 0) {
      alert('Your meal plate is empty! Add foods from the database first.');
      return;
    }
    if (isNaN(insulinRatio) || insulinRatio <= 0) {
      alert('Please enter a valid Insulin-to-Carb Ratio');
      return;
    }

    const dose = totalCarbsOnPlate / insulinRatio;
    const finalDoseString = `${dose.toFixed(1)} Units`;
    setCalculatedDose(finalDoseString);

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setHistory([{
      id: Date.now().toString(),
      time: currentTime,
      totalCarbs: totalCarbsOnPlate.toFixed(0),
      dose: finalDoseString
    }, ...history]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <View style={{ backgroundColor: '#fff', paddingTop: 50, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#dee2e6', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1a1a1a' }}>Multi-Select Carb Counter</Text>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 15 }} keyboardShouldPersistTaps="handled">
        <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#495057', marginTop: 10, marginBottom: 8 }}>1. Add Foods to Your Meal Plate:</Text>
        <TouchableOpacity style={{ backgroundColor: '#fff', padding: 14, borderRadius: 8, borderWidth: 1, borderColor: '#dee2e6', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }} onPress={() => setShowMenu(!showMenu)}>
          <Text style={{ fontSize: 14, color: '#6c757d', fontWeight: '500' }}>Tap to Open Food Library (40+ Options)...</Text>
          <Text style={{ fontSize: 12, color: '#6c757d' }}>{showMenu ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {showMenu && (
          <View style={{ backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#dee2e6', marginBottom: 10, height: 200, overflow: 'hidden' }}>
            <ScrollView style={{ flex: 1 }} nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
              {Object.keys(FOOD_DATABASE).map((key) => (
                <TouchableOpacity key={key} style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: '#f1f3f5', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} onPress={() => addFoodToPlate(key)}>
                  <Text style={{ fontSize: 14, color: '#212529' }}>{FOOD_DATABASE[key].name}</Text>
                  <Text style={{ color: '#007AFF', fontWeight: 'bold', fontSize: 13 }}>[ADD]</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
          <TextInput
            style={{ flex: 1, backgroundColor: '#fff', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#dee2e6', fontSize: 14 }}
            keyboardType="numeric"
            placeholder="Type custom carbs manually (g)"
            value={customCarbs}
            onChangeText={setCustomCarbs}
          />
          <TouchableOpacity style={{ backgroundColor: '#007AFF', paddingHorizontal: 15, borderRadius: 8, justifyContent: 'center', alignItems: 'center' }} onPress={() => addFoodToPlate(null, true)}>
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>Add Custom</Text>
          </TouchableOpacity>
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

        <TouchableOpacity style={{ backgroundColor: '#28a745', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 5 }} onPress={calculateTotalMealDose}>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Calculate Total Meal Dose</Text>
        </TouchableOpacity>

        {calculatedDose && (
          <View style={{ marginTop: 20, padding: 15, backgroundColor: '#e8f0fe', borderRadius: 8, alignItems: 'center' }}>
            <Text style={{ fontSize: 14, color: '#185abc' }}>Suggested Combined Dose:</Text>
            <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#185abc', marginTop: 2 }}>{calculatedDose}</Text>
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
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
} 
