import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const THEME_GREEN = '#008080';

export default function QuizScreen() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const questions = [
    { id: 1, question: "What does this sign represent?", options: ["Hello", "Thank You", "Water", "Food"], correct: 1 },
    { id: 2, question: "Which sign is used for 'Family'?", options: ["Option A", "Option B", "Option C", "Option D"], correct: 0 },
    // Add more mock questions here
  ];

  const handleAnswer = (index) => {
    if (index === questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.resultCard}>
          <Ionicons name="trophy" size={80} color="#FFD700" />
          <Text style={styles.resultTitle}>Quiz Completed!</Text>
          <Text style={styles.resultScore}>{score} / {questions.length}</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.progressText}>Question {currentQuestion + 1}/{questions.length}</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.quizContent}>
        {/* VIDEO PLACEHOLDER */}
        <View style={styles.videoBox}>
          <Ionicons name="play-circle" size={50} color={THEME_GREEN} />
          <Text style={{ color: '#888', marginTop: 10 }}>Sign Video Placeholder</Text>
        </View>

        <Text style={styles.questionText}>{questions[currentQuestion].question}</Text>

        <View style={styles.optionsContainer}>
          {questions[currentQuestion].options.map((opt, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.optionBtn} 
              onPress={() => handleAnswer(index)}
            >
              <Text style={styles.optionLabel}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFA', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressText: { fontSize: 16, fontWeight: 'bold', color: '#888' },
  quizContent: { flex: 1, justifyContent: 'center' },
  videoBox: { width: '100%', height: 220, backgroundColor: '#EEE', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 30 },
  questionText: { fontSize: 22, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 30 },
  optionsContainer: { gap: 15 },
  optionBtn: { backgroundColor: '#FFF', padding: 20, borderRadius: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  optionLabel: { fontSize: 16, fontWeight: '600', color: '#444', textAlign: 'center' },
  resultCard: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  resultTitle: { fontSize: 28, fontWeight: 'bold', marginTop: 20 },
  resultScore: { fontSize: 40, fontWeight: '900', color: THEME_GREEN, marginVertical: 10 },
  button: { backgroundColor: THEME_GREEN, paddingHorizontal: 40, paddingVertical: 15, borderRadius: 30, marginTop: 20 },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});