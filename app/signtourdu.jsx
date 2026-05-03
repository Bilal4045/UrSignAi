import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { CameraView, useCameraPermissions, useMicrophonePermissions } from 'expo-camera'; 
import { Ionicons } from '@expo/vector-icons';

// Import your new service layer
import { translateSignVideo, resetTranslationSession } from '../services/signToUrduService';

const THEME_GREEN = '#008080';

export default function SignToUrduScreen() {
  const cameraRef = useRef(null);
  
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();

  const [isRecording, setIsRecording] = useState(false);
  const [canStop, setCanStop] = useState(false); 
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [translationResult, setTranslationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
        // Prevent stopping too quickly to avoid camera crashes
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

  const handleTranslateVideo = async () => {
    if (!recordedVideo) {
      Alert.alert('Error', 'No video captured to translate.');
      return;
    }
    
    setIsLoading(true);
    try {
      // Pass the video URI to the service layer
      const result = await translateSignVideo(recordedVideo);
      setTranslationResult(result);
    } catch (error) {
      Alert.alert("Error", "Translation service failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = async () => {
    await resetTranslationSession();
    setRecordedVideo(null);
    setTranslationResult(null);
  };

  // Loading state while checking permissions
  if (!cameraPermission || !micPermission) {
    return <View style={styles.center}><ActivityIndicator size="large" color={THEME_GREEN} /></View>;
  }

  // Result Screen UI
  if (translationResult) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          {/* Changed 'language' icon to a success checkmark */}
          <Ionicons name="checkmark-circle" size={80} color={THEME_GREEN} />
          <Text style={styles.title}>Translation Result</Text>
          
          <View style={styles.resultCard}>
            <Text style={styles.urduText}>{translationResult.urduTranslation}</Text>
            <Text style={styles.englishText}>({translationResult.englishMeaning})</Text>
          </View>

          <Text style={styles.confidenceText}>
            AI Confidence: {translationResult.confidence}%
          </Text>
          
          <TouchableOpacity style={[styles.btn, {marginTop: 40, width: '80%'}]} onPress={handleRestart}>
            <Ionicons name="refresh" size={20} color="white" style={{marginRight: 10}} />
            <Text style={styles.btnText}>Translate Another</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Main Recording UI
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrapper}>
        <View style={styles.header}>
          <Text style={styles.title}>Sign to Urdu</Text>
          <Text style={styles.subtitle}>Record a sign to get its Urdu meaning</Text>
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
            <View style={{ alignItems: 'center' }}>
              <ActivityIndicator size="large" color={THEME_GREEN} />
              <Text style={{ color: THEME_GREEN, marginTop: 10, fontWeight: 'bold' }}>Translating Video...</Text>
            </View>
          ) : (
            <>
              {/* Start Recording Button */}
              {!isRecording && !recordedVideo && (
                <TouchableOpacity style={styles.btn} onPress={startRecording}>
                  <Ionicons name="videocam" size={20} color="white" style={{marginRight: 10}} />
                  <Text style={styles.btnText}>Start Recording</Text>
                </TouchableOpacity>
              )}

              {/* Stop Recording Button */}
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

              {/* Evaluate & Restart Buttons */}
              {!isRecording && recordedVideo && (
                <View style={{width: '100%'}}>
                  <TouchableOpacity style={[styles.btn, {backgroundColor: THEME_GREEN}]} onPress={handleTranslateVideo}>
                    {/* Changed 'language' icon to 'sparkles' for AI translation */}
                    <Ionicons name="sparkles" size={20} color="white" style={{marginRight: 10}} />
                    <Text style={styles.btnText}>Translate Video</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={[styles.btn, { backgroundColor: '#666' }]} onPress={handleRestart}>
                    <Ionicons name="refresh" size={20} color="white" style={{marginRight: 10}} />
                    <Text style={styles.btnText}>Retake Video</Text>
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
    alignItems: 'center',
    paddingHorizontal: 20
  },
  header: { 
    alignItems: 'center', 
    marginBottom: 10 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: THEME_GREEN,
    letterSpacing: 0.5 
  },
  subtitle: { 
    fontSize: 16, 
    marginTop: 5, 
    color: '#666',
    textAlign: 'center'
  },
  cameraBox: { 
    height: 380, 
    margin: 20, 
    borderRadius: 25, 
    overflow: 'hidden', 
    backgroundColor: 'black',
    borderWidth: 2,
    borderColor: THEME_GREEN 
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
  resultCard: {
    backgroundColor: '#E0F2F1',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: THEME_GREEN
  },
  urduText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: THEME_GREEN,
    textAlign: 'center'
  },
  englishText: {
    fontSize: 18,
    color: '#555',
    marginTop: 5
  },
  confidenceText: {
    color: THEME_GREEN, 
    marginTop: 15, 
    fontSize: 16,
    fontWeight: '500'
  }
});