import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { getRandomSign } from '../services/lessonData';

export default function PracticeScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [showFeedback, setShowFeedback] = useState(false);
  const [targetSign, setTargetSign] = useState({ title: 'Hello' });
  const [cameraDisabled, setCameraDisabled] = useState(false);

  const THEME_COLOR = '#008080'; 

  useEffect(() => {
    requestPermission();
    loadNewSign();
  }, []);

  const loadNewSign = async () => {
    const sign = await getRandomSign();
    if (sign) setTargetSign(sign);
  };

  const handleStop = () => {
    setShowFeedback(true);
  };

  if (!permission) return <View style={styles.center}><Text>Loading...</Text></View>;
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={{ marginBottom: 20, textAlign: 'center' }}>We need permission to use your camera</Text>
        <TouchableOpacity onPress={requestPermission} style={[styles.stopBtn, { backgroundColor: THEME_COLOR }]}>
          <Text style={styles.stopBtnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (showFeedback) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView contentContainerStyle={styles.feedbackScroll}>
          <Text style={[styles.headerTitle, { color: THEME_COLOR }]}>Practice Feedback</Text>
          <Text style={styles.subTitle}>AI Validation Results</Text>

          <View style={[styles.resultCard, { backgroundColor: '#FF3B30' }]}>
             <Ionicons name="close-circle-outline" size={80} color="#FFF" />
             <Text style={styles.resultText}>Incorrect</Text>
             <Text style={styles.resultSubText}>Sign: {targetSign.title}</Text>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.rowBetween}>
                <View style={styles.row}>
                    <Ionicons name="trending-up" size={20} color={THEME_COLOR} />
                    <Text style={styles.cardLabel}> Confidence Score</Text>
                </View>
                <Text style={styles.scoreText}>73%</Text>
            </View>
            <View style={styles.progressBg}>
                <View style={[styles.progressFill, { width: '73%', backgroundColor: '#006666' }]} />
            </View>
          </View>

          <View style={[styles.correctionCard, { backgroundColor: '#E0F2F2' }]}>
            <Text style={styles.correctionTitle}>Suggested Corrections</Text>
            <CorrectionItem theme={THEME_COLOR} num="1" text="Keep your palm facing outward" />
            <CorrectionItem theme={THEME_COLOR} num="2" text="Move your hand closer to the camera" />
          </View>

          <TouchableOpacity style={[styles.retryBtn, { backgroundColor: THEME_COLOR }]} onPress={() => { setShowFeedback(false); loadNewSign(); }}>
            <Text style={styles.retryBtnText}>Try Another Sign</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: THEME_COLOR }]}>Practice Mode</Text>
        <Text style={[styles.subTitle, { color: '#006666' }]}>Learn sign language with UrSign AI</Text>
      </View>

      <View style={styles.cameraOuterContainer}>
        {!cameraDisabled ? (
          <View style={styles.cameraWrapper}>
            <CameraView style={styles.camera} facing="front" />
            <View style={styles.recordingBadge}>
               <View style={styles.dot} />
               <Text style={styles.recordingText}>Recording</Text>
            </View>
          </View>
        ) : (
          <View style={styles.cameraPlaceholder}>
             <Ionicons name="videocam-off" size={60} color="#444" />
             <Text style={{color: '#666', marginTop: 10}}>Camera is Disabled</Text>
          </View>
        )}
      </View>

      <View style={[styles.instructionBox, { backgroundColor: THEME_COLOR }]}>
        <Text style={styles.instructionLabel}>Current Sign:</Text>
        <Text style={styles.instructionMain}>Show sign for "{targetSign.title}"</Text>
      </View>

      <TouchableOpacity style={[styles.stopBtn, { backgroundColor: THEME_COLOR }]} onPress={handleStop}>
        <Ionicons name="square" size={20} color="#FFF" />
        <Text style={styles.stopBtnText}> Stop Practice</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.disableBtn} onPress={() => setCameraDisabled(!cameraDisabled)}>
        <Ionicons name={cameraDisabled ? "videocam" : "videocam-off"} size={20} color="#666" />
        <Text style={styles.disableBtnText}> {cameraDisabled ? "Enable Camera" : "Disable Camera"}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const CorrectionItem = ({ num, text, theme }) => (
    <View style={styles.correctionRow}>
        <View style={[styles.numberCircle, { backgroundColor: theme }]}><Text style={styles.numberText}>{num}</Text></View>
        <Text style={styles.correctionLabel}>{text}</Text>
    </View>
);

const styles = StyleSheet.create({
  // ADDED: paddingBottom: 120 to clear the navigation bar
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FA', 
    paddingBottom: 120 
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { alignItems: 'center', paddingVertical: 10, marginTop: 15 },
  headerTitle: { fontSize: 28, fontWeight: 'bold' },
  subTitle: { fontSize: 15, fontWeight: '500', marginTop: 2 },
  
  cameraOuterContainer: { marginHorizontal: 20, height: 350, borderRadius: 25, overflow: 'hidden', backgroundColor: '#000', marginTop: 10, elevation: 5 },
  cameraWrapper: { flex: 1 },
  camera: { flex: 1 },
  recordingBadge: { position: 'absolute', top: 15, left: 15, flexDirection: 'row', alignItems: 'center', backgroundColor: '#EF4444', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#FFF', marginRight: 6 },
  recordingText: { color: '#FFF', fontWeight: '600', fontSize: 12 },
  cameraPlaceholder: { flex: 1, backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center' },
  
  instructionBox: { marginHorizontal: 20, marginVertical: 15, padding: 18, borderRadius: 20, elevation: 4 },
  instructionLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '600' },
  instructionMain: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginTop: 5 },
  
  stopBtn: { marginHorizontal: 20, height: 55, borderRadius: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', elevation: 3 },
  stopBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
  disableBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 12 },
  disableBtnText: { color: '#666', marginLeft: 8, fontSize: 14 },
  
  feedbackScroll: { padding: 20, alignItems: 'center', paddingBottom: 140 },
  resultCard: { width: '100%', padding: 30, borderRadius: 25, alignItems: 'center', marginBottom: 20 },
  resultText: { color: '#FFF', fontSize: 32, fontWeight: 'bold', marginTop: 10 },
  resultSubText: { color: '#FFF', fontSize: 18, opacity: 0.9 },
  infoCard: { width: '100%', backgroundColor: '#FFF', padding: 18, borderRadius: 20, marginBottom: 15, elevation: 2 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  row: { flexDirection: 'row', alignItems: 'center' },
  cardLabel: { fontSize: 16, color: '#444' },
  scoreText: { fontSize: 22, fontWeight: 'bold' },
  progressBg: { height: 10, backgroundColor: '#EEE', borderRadius: 5, marginTop: 10 },
  progressFill: { height: 10, borderRadius: 5 },
  correctionCard: { width: '100%', padding: 20, borderRadius: 20 },
  correctionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  correctionRow: { flexDirection: 'row', marginBottom: 12, alignItems: 'center' },
  numberCircle: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  numberText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  correctionLabel: { flex: 1, color: '#444', fontSize: 14 },
  retryBtn: { marginTop: 20, padding: 18, borderRadius: 15, width: '100%', alignItems: 'center' },
  retryBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});