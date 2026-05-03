import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Audio, Video, ResizeMode } from 'expo-av'; // VIDEO PLAYER IS HERE

// Import Service Layer
import { fetchSignVideo, convertAudioToText } from '../services/urduToSignService';

const THEME_GREEN = '#008080';

export default function UrduToSignScreen() {
  const [inputText, setInputText] = useState('');
  const [videoUri, setVideoUri] = useState(null); // Will hold the video link tomorrow
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  
  const videoRef = useRef(null);

  // Audio Recording States
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);

  // Ask for mic permissions on load
  useEffect(() => {
    (async () => {
      await Audio.requestPermissionsAsync();
    })();
  }, []);

  // Handle Text Translation
  const handleTranslate = async () => {
    if (!inputText.trim()) {
      Alert.alert('Input Required', 'Please enter some text in Urdu.');
      return;
    }

    Keyboard.dismiss();
    setIsLoading(true);
    setErrorMsg(null);
    setVideoUri(null); // Clear previous video

    try {
      const response = await fetchSignVideo(inputText);
      
      if (response.success && response.videoUrl) {
        setVideoUri(response.videoUrl); // Automatically plays video tomorrow!
      } else {
        setErrorMsg(response.message);
      }
    } catch (error) {
      setErrorMsg("An error occurred while fetching the video.");
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission Denied', 'Microphone permission is required.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      
      setRecording(recording);
      setIsRecording(true);
      setErrorMsg(null);
      setVideoUri(null);
      setInputText('');
    } catch (err) {
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecordingAndProcess = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      setIsProcessingVoice(true);

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      const recognizedText = await convertAudioToText(uri);
      setInputText(recognizedText);

    } catch (err) {
      Alert.alert('Error', 'Failed to process voice.');
    } finally {
      setIsProcessingVoice(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecordingAndProcess();
    } else {
      startRecording();
    }
  };

  const clearResult = () => {
    setVideoUri(null);
    setErrorMsg(null);
    setInputText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrapper}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Urdu to Sign</Text>
          <Text style={styles.subtitle}>Type or speak Urdu to see its Sign</Text>
        </View>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="یہاں اردو میں لکھیں..."
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            textAlign="right"
            multiline={false}
          />
          
          <TouchableOpacity 
            style={[styles.micButton, isRecording && styles.micRecording]} 
            onPress={toggleRecording}
            disabled={isProcessingVoice}
          >
            {isProcessingVoice ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : isRecording ? (
              <Ionicons name="stop" size={24} color="#FFF" />
            ) : (
              <Ionicons name="mic" size={24} color="#FFF" />
            )}
          </TouchableOpacity>
        </View>

        {/* Translate Button */}
        <TouchableOpacity style={styles.translateBtn} onPress={handleTranslate}>
          <Ionicons name="sparkles" size={20} color="white" style={{ marginRight: 10 }} />
          <Text style={styles.btnText}>Translate to Sign</Text>
        </TouchableOpacity>

        {/* Video / Result Area */}
        <View style={styles.resultBox}>
          {isLoading ? (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color={THEME_GREEN} />
              <Text style={styles.loadingText}>Searching Database...</Text>
            </View>
          ) : errorMsg ? (
            <View style={styles.centerBox}>
              <Ionicons name="alert-circle-outline" size={60} color="#E74C3C" />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : videoUri ? (
            /* TOMORROW: THIS WILL RENDER WHEN DB SENDS A URL */
            <View style={styles.videoWrapper}>
              <Video
                ref={videoRef}
                style={styles.videoPlayer}
                source={{ uri: videoUri }}
                useNativeControls
                resizeMode={ResizeMode.COVER}
                shouldPlay
                isLooping
              />
              <TouchableOpacity style={styles.clearBtn} onPress={clearResult}>
                <Ionicons name="trash-outline" size={20} color="#FFF" />
                <Text style={styles.clearBtnText}>Clear</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.centerBox}>
              <Ionicons name="videocam-outline" size={60} color="#CCC" />
              <Text style={styles.placeholderText}>Video will appear here</Text>
            </View>
          )}
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  contentWrapper: { flex: 1, paddingHorizontal: 20, paddingTop: 30 },
  header: { alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 28, fontWeight: 'bold', color: THEME_GREEN, letterSpacing: 0.5 },
  subtitle: { fontSize: 16, marginTop: 5, color: '#666', textAlign: 'center' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  textInput: { flex: 1, height: 60, backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 15, paddingHorizontal: 20, fontSize: 20, color: '#333', marginRight: 10 },
  micButton: { width: 60, height: 60, backgroundColor: THEME_GREEN, borderRadius: 15, justifyContent: 'center', alignItems: 'center', elevation: 3 },
  micRecording: { backgroundColor: '#E74C3C' },
  translateBtn: { backgroundColor: THEME_GREEN, padding: 18, borderRadius: 15, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginBottom: 30, elevation: 2 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  resultBox: { flex: 1, backgroundColor: '#FAFAFA', borderRadius: 20, borderWidth: 1, borderColor: '#E0E0E0', overflow: 'hidden', marginBottom: 30 },
  centerBox: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { color: THEME_GREEN, marginTop: 15, fontWeight: 'bold', fontSize: 16 },
  errorText: { color: '#E74C3C', fontSize: 18, textAlign: 'center', marginTop: 15, fontWeight: '500' },
  placeholderText: { color: '#AAA', fontSize: 16, marginTop: 15 },
  videoWrapper: { flex: 1, width: '100%', backgroundColor: '#000' },
  videoPlayer: { flex: 1, width: '100%' },
  clearBtn: { position: 'absolute', bottom: 20, alignSelf: 'center', backgroundColor: 'rgba(231, 76, 60, 0.9)', flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20 },
  clearBtnText: { color: '#FFF', fontWeight: 'bold', marginLeft: 8, fontSize: 16 }
});