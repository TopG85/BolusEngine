import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard } from 'react-native';

export default function App() {
  const [carbs, setCarbs] = useState('');
  const [ratio, setRatio] = useState('');
  const [result, setResult] = useState(null);

  const calculateDose = () => {
    Keyboard.dismiss();
    const totalCarbs = parseFloat(carbs);
    const insulinRatio = parseFloat(ratio);

    if (isNaN(totalCarbs) || isNaN(insulinRatio) || insulinRatio <= 0) {
      setResult('Please enter valid numbers');
      return;
    }

    // Core Calculation: Carbs divided by Insulin Ratio
    const dose = totalCarbs / insulinRatio;
    
    // Rounds the final dose to 1 decimal place (e.g., 5.5 units)
    setResult(`${dose.toFixed(1)} Units`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Carb Counter & Insulin Calculator</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Total Carbohydrates (grams):</Text>
        <TextInput 
          style={styles.input}
          keyboardType="numeric"
          placeholder="e.g., 60"
          value={carbs}
          onChangeText={setCarbs}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Insulin-to-Carb Ratio (g/Unit):</Text>
        <TextInput 
          style={styles.input}
          keyboardType="numeric"
          placeholder="e.g., 10"
          value={ratio}
          onChangeText={setRatio}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={calculateDose}>
        <Text style={styles.buttonText}>Calculate Dose</Text>
      </TouchableOpacity>

      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>Suggested Insulin Dose:</Text>
          <Text style={styles.resultValue}>{result}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 80, paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 30, textAlign: 'center' },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#555', marginBottom: 8 },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 8, fontSize: 18, borderWidth: 1, borderColor: '#ddd' },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  resultContainer: { marginTop: 40, padding: 20, backgroundColor: '#e3f2fd', borderRadius: 8, alignItems: 'center' },
  resultLabel: { fontSize: 16, color: '#0d47a1', marginBottom: 5 },
  resultValue: { fontSize: 32, fontWeight: 'bold', color: '#0d47a1' },
});
