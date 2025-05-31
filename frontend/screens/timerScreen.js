import { View, Text, Button, TouchableOpacity } from "react-native";
import { useState, useEffect, useRef } from "react";
import React from "react";
import axios from "axios";

const Work_Time = 0.15 * 60;
const Break_Time = 0.1 * 60;

const saveOnline = async (sessions) => {
  try {
    await axios.post("http://10.0.2.2:5000/sessions", sessions);
  } catch (error) {
    console.error("Error saving session:", error);
  }
};

export default function timerScreen() {
  const [onBreak, setonBreak] = useState(false);
  const [isRunning, setisRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(Work_Time);
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
            return onBreak ? Work_Time : Break_Time;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isRunning, onBreak]);
  // Save session data when the timer reaches 1 second left
  useEffect(() => {
    if (secondsLeft === 1) {
      const sessionData = {
        type: onBreak ? "break" : "work",
        duration: onBreak ? Break_Time : Work_Time,
        date: new Date().toISOString(),
        notes: onBreak ? "Break session" : "Work session",
      };
      saveOnline(sessionData);
    }
  }, [secondsLeft]);

  const Formattime = (s) => {
    const minutes = Math.floor(s / 60);
    const seconds = s % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  //reset timer
  const resetTimer=()=>{
    clearInterval(intervalRef.current);
    setisRunning(false);
    setSecondsLeft(onBreak ? Break_Time : Work_Time);

  }

  return (
  <View style={styles.container}>
    <Text style={styles.header}>Focus Flow</Text>
    
    <View style={styles.timerCard}>
      <View style={styles.statusContainer}>
        <View 
          style={[styles.statusIndicator, { 
            backgroundColor: onBreak ? "#38D9A9" : "#4263EB" 
          }]} 
        />
        <Text style={styles.title}>{onBreak ? "Break Time" : "Focus Time"}</Text>
      </View>
      
      <Text style={styles.timer}>{Formattime(secondsLeft)}</Text>
      
      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBar, 
            {
              width: `${(secondsLeft / (onBreak ? Break_Time : Work_Time)) * 100}%`,
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
        <Text style={styles.buttonText}>{isRunning ? "Pause" : "Start"}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.resetButton} 
        onPress={resetTimer}>
        <Text style={styles.resetButtonText}>Reset</Text>
      </TouchableOpacity>
    </View>
  </View>
);
}

const styles = {
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
};
