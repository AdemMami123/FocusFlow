import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet } from "react-native";
import { useState, useEffect, useRef } from "react";
import React from "react";
import axios from "axios";
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

// Default times in seconds
const DEFAULT_WORK_TIME = 25 * 60;
const DEFAULT_BREAK_TIME = 5 * 60;

const saveOnline = async (sessions) => {
  try {
    await axios.post("http://10.0.2.2:5000/sessions", sessions);
  } catch (error) {
    console.error("Error saving session:", error);
  }
};

export default function timerScreen() {
  const { theme } = useTheme();
  
  const [onBreak, setonBreak] = useState(false);
  const [isRunning, setisRunning] = useState(false);
  const [workTime, setWorkTime] = useState(DEFAULT_WORK_TIME);
  const [breakTime, setBreakTime] = useState(DEFAULT_BREAK_TIME);
  const [secondsLeft, setSecondsLeft] = useState(workTime);
  const [showSettings, setShowSettings] = useState(false);
  const [tempWorkMinutes, setTempWorkMinutes] = useState(String(Math.floor(workTime / 60)));
  const [tempBreakMinutes, setTempBreakMinutes] = useState(String(Math.floor(breakTime / 60)));
  
  const intervalRef = useRef(null);

  // Initialize the timer with Work_Time
  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev === 1) {
            setisRunning(false);
            setonBreak(!onBreak);
            return onBreak ? workTime : breakTime;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isRunning, onBreak, workTime, breakTime]);

  // Save session data when the timer reaches 1 second left
  useEffect(() => {
    if (secondsLeft === 1) {
      const sessionData = {
        type: onBreak ? "break" : "work",
        duration: onBreak ? breakTime : workTime,
        date: new Date().toISOString(),
        notes: onBreak ? "Break session" : "Work session",
      };
      saveOnline(sessionData);
    }
  }, [secondsLeft, onBreak, workTime, breakTime]);

  const Formattime = (s) => {
    const minutes = Math.floor(s / 60);
    const seconds = s % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  // Reset timer
  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setisRunning(false);
    setSecondsLeft(onBreak ? breakTime : workTime);
  };

  // Save custom timer settings
  const saveSettings = () => {
    // Convert minutes to seconds
    const newWorkTime = Math.max(1, parseInt(tempWorkMinutes) || 0) * 60;
    const newBreakTime = Math.max(1, parseInt(tempBreakMinutes) || 0) * 60;
    
    setWorkTime(newWorkTime);
    setBreakTime(newBreakTime);
    
    // If timer is not running, update the current countdown
    if (!isRunning) {
      setSecondsLeft(onBreak ? newBreakTime : newWorkTime);
    }
    
    setShowSettings(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.text }]}>
        Focus Flow
      </Text>
      
      <View style={[styles.timerCard, { backgroundColor: theme.surface }]}>
        <View style={styles.statusContainer}>
          <View 
            style={[styles.statusIndicator, { 
              backgroundColor: onBreak ? "#38D9A9" : "#4263EB" 
            }]} 
          />
          <Text style={styles.title}>{onBreak ? "Break Time" : "Focus Time"}</Text>
        </View>
        
        <Text style={[styles.timer, { color: theme.text }]}>
          {Formattime(secondsLeft)}
        </Text>
        
        <View style={styles.progressBarContainer}>
          <View 
            style={[
              styles.progressBar, 
              {
                width: `${(secondsLeft / (onBreak ? breakTime : workTime)) * 100}%`,
                backgroundColor: onBreak ? "#38D9A9" : "#4263EB"
              }
            ]}
          />
        </View>
      </View>
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: isRunning ? "#FF6B6B" : "#38D9A9" }]} 
          onPress={() => setisRunning(!isRunning)}>
          <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>
            {isRunning ? "Pause" : "Start"}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.resetButton} 
          onPress={resetTimer}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.settingsButton} 
        onPress={() => setShowSettings(true)}>
        <FontAwesome5 name="cog" size={20} color="#6C757D" />
        <Text style={styles.settingsText}>Customize Timer</Text>
      </TouchableOpacity>
      
      {/* Settings Modal */}
      <Modal
        visible={showSettings}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSettings(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Custom Timer Settings</Text>
            
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Work Duration (minutes):</Text>
              <TextInput
                style={styles.settingInput}
                value={tempWorkMinutes}
                onChangeText={setTempWorkMinutes}
                keyboardType="numeric"
                maxLength={3}
              />
            </View>
            
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Break Duration (minutes):</Text>
              <TextInput
                style={styles.settingInput}
                value={tempBreakMinutes}
                onChangeText={setTempBreakMinutes}
                keyboardType="numeric"
                maxLength={3}
              />
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setShowSettings(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]} 
                onPress={saveSettings}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // ...existing styles...
  
  // New styles for settings
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    padding: 10,
  },
  settingsText: {
    color: '#6C757D',
    fontSize: 16,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 20,
    textAlign: 'center',
  },
  settingRow: {
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 16,
    color: '#495057',
    marginBottom: 8,
  },
  settingInput: {
    borderWidth: 1,
    borderColor: '#CED4DA',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#212529',
    backgroundColor: '#F8F9FA',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#4263EB',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#F1F3F5',
  },
  cancelButtonText: {
    color: '#495057',
    fontWeight: '600',
    fontSize: 16,
  },
  
  // Original styles
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    color: "#212529",
    marginTop: 40,
    marginBottom: 40,
    letterSpacing: 0.5,
  },
  timerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 30,
    width: '90%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  title: { 
    fontSize: 20, 
    fontWeight: "600", 
    marginBottom: 15,
    color: "#495057",
    letterSpacing: 0.5,
  },
  timer: {
    fontSize: 76,
    fontWeight: "700",
    color: "#212529",
    marginVertical: 25,
    letterSpacing: 2,
    fontVariant: ["tabular-nums"]
  },
  progressBarContainer: {
    height: 8,
    width: '100%',
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 10,
  },
  progressBar: {
    height: '100%',
    borderRadius: 8,
  },
  buttonsContainer: {
    flexDirection: "row",
    marginTop: 40,
    width: '90%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resetButton: {
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 16,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: "#CED4DA",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  resetButtonText: {
    color: "#495057",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  }
});