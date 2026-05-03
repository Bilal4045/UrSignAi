import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera'; 
import { Ionicons } from '@expo/vector-icons';

// Import your services
import { getRandomSign } from '../services/lessonData';
import { submitPractice, restartPractice } from '../services/practiceSessionService'; 

const THEME_GREEN = '#008080';

export default function PracticeScreen() {
  const cameraRef = useRef(null);
  
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();

  const [isRecording, setIsRecording] = useState(false);
  const [canStop, setCanStop] = useState(false); 
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [targetSign, setTargetSign] = useState({ title: 'Hello' });
  const [evaluation, setEvaluation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSign();
  }, []);

  const loadSign = async () => {
    const sign = await getRandomSign();
    if (sign) setTargetSign(sign);
  };

  const startRecording = async () => {
    if (!cameraPermission?.granted || !micPermission?.granted) {
      const camRes = await requestCameraPermission();
      const micRes = await requestMicPermission();
      if (!camRes.granted || !micRes.granted) {
        Alert.alert('Permission Required', 'Camera and Mic permissions are needed.');
        return;
      }
    }

    try {
      setRecordedVideo(null);
      setIsRecording(true);
      setCanStop(false); 

      if (cameraRef.current) {
        setTimeout(() => setCanStop(true), 1000);
        const video = await cameraRef.current.recordAsync({ maxDuration: 10 });
        if (video?.uri) setRecordedVideo(video.uri);
      }
    } catch (err) {
      if (err.message.includes("stopped before any data could be produced")) {
        console.log("Recording stopped too early.");
      } else {
        console.error(err);
        Alert.alert('Error', 'Failed to record.');
      }
      setIsRecording(false);
    } finally {
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (!canStop) return;
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
    }
  };

  const handleShowResult = async () => {
    if (!recordedVideo) {
      Alert.alert('Error', 'No sign captured.');
      return;
    }
    setIsLoading(true);
    try {
      const result = await submitPractice(recordedVideo, targetSign.title);
      setEvaluation(result);
    } catch (error) {
      Alert.alert("Error", "Evaluation service failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = async () => {
    await restartPractice();
    setRecordedVideo(null);
    setEvaluation(null);
    loadSign();
  };

  if (!cameraPermission || !micPermission) {
    return <View style={styles.center}><ActivityIndicator color={THEME_GREEN} /></View>;
  }

  if (evaluation) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Ionicons name="analytics" size={80} color={THEME_GREEN} />
          <Text style={styles.title}>Evaluation Result</Text>
          <Text style={styles.subtitle}>
            <Text style={{ fontWeight: 'bold' }}>Sign: </Text>{evaluation.targetSign}
          </Text>
          <Text style={[styles.title, {color: evaluation.result === 'Incorrect' ? '#E74C3C' : '#27AE60', marginTop: 10}]}>
            {evaluation.result}
          </Text>
          <Text style={{ color: THEME_GREEN }}>Confidence: {evaluation.confidence}%</Text>
          
          <TouchableOpacity style={[styles.btn, {marginTop: 30, width: '80%'}]} onPress={handleRestart}>
            <Text style={styles.btnText}>Restart</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrapper}>
        <View style={styles.header}>
          {/* Greenish & Bold Title */}
          <Text style={styles.title}>Practice Mode</Text>
          
          {/* Greenish & Bold "Show sign for:" */}
          <Text style={styles.subtitle}>
            <Text style={{ fontWeight: 'bold' }}>Show sign for: </Text>
            <Text style={{ fontWeight: 'bold' }}>{targetSign.title}</Text>
          </Text>
        </View>

        <View style={styles.cameraBox}>
          <CameraView ref={cameraRef} style={styles.camera} facing="front" mode="video" />
          {isRecording && (
            <View style={styles.recordingTag}>
              <View style={styles.dot} />
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Recording...</Text>
            </View>
          )}
        </View>

        <View style={styles.controls}>
          {isLoading ? (
            <ActivityIndicator size="large" color={THEME_GREEN} />
          ) : (
            <>
              {!isRecording && !recordedVideo && (
                <TouchableOpacity style={styles.btn} onPress={startRecording}>
                  <Ionicons name="play" size={20} color="white" style={{marginRight: 10}} />
                  <Text style={styles.btnText}>Start Practice</Text>
                </TouchableOpacity>
              )}

              {isRecording && (
                <TouchableOpacity 
                  style={[styles.btn, { backgroundColor: '#FF3B30', opacity: canStop ? 1 : 0.5 }]} 
                  onPress={stopRecording}
                  disabled={!canStop}
                >
                  <Ionicons name="stop" size={20} color="white" style={{marginRight: 10}} />
                  <Text style={styles.btnText}>Stop Recording</Text>
                </TouchableOpacity>
              )}

              {!isRecording && recordedVideo && (
                <View style={{width: '100%'}}>
                  <TouchableOpacity style={[styles.btn, {backgroundColor: THEME_GREEN}]} onPress={handleShowResult}>
                    <Text style={styles.btnText}>Evaluate Video</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.btn, { backgroundColor: '#666' }]} onPress={handleRestart}>
                    <Ionicons name="refresh" size={20} color="white" style={{marginRight: 10}} />
                    <Text style={styles.btnText}>Restart</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    justifyContent: 'center' 
  },
  contentWrapper: { 
    width: '100%', 
    paddingVertical: 20 
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  header: { 
    alignItems: 'center', 
    marginBottom: 10 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: THEME_GREEN, // Greenish Title
    letterSpacing: 0.5 
  },
  subtitle: { 
    fontSize: 20, 
    marginTop: 5, 
    color: THEME_GREEN, // Greenish Subtitle
    textAlign: 'center'
  },
  cameraBox: { 
    height: 380, 
    margin: 20, 
    borderRadius: 25, 
    overflow: 'hidden', 
    backgroundColor: 'black',
    borderWidth: 2,
    borderColor: THEME_GREEN // Greenish Camera Border
  },
  camera: { flex: 1 },
  recordingTag: { 
    position: 'absolute', 
    top: 15, 
    left: 15, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    padding: 8, 
    borderRadius: 10, 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  dot: { 
    width: 10, 
    height: 10, 
    borderRadius: 5, 
    backgroundColor: 'red', 
    marginRight: 8 
  },
  controls: { paddingHorizontal: 35 },
  btn: { 
    backgroundColor: THEME_GREEN, 
    padding: 18, 
    borderRadius: 15, 
    alignItems: 'center', 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginBottom: 10 
  },
  btnText: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 18 
  },
});