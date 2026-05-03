import React, { useState, useCallback, useRef } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, 
  Modal, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router'; 
import { Ionicons } from '@expo/vector-icons';

// Import the Service Layers
import { getDailyProgress } from '../services/progressService';
import { sendMessageToBot } from '../services/chatbotService'; // <-- NEW Chatbot Service

const { width } = Dimensions.get('window');
const THEME_GREEN = '#008080';

export default function HomeScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState({ count: 0, percentage: 0, goal: 10 });

  // Chatbot States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', text: 'Assalam-o-Alaikum! How can I help you today?', isBot: true }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef();

  // Refresh progress whenever this screen is focused
  useFocusEffect(
    useCallback(() => {
      const fetchProgress = async () => {
        const data = await getDailyProgress();
        setProgress(data);
      };
      fetchProgress();
    }, [])
  );

  // Chatbot Send Logic
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    const newUserMsg = { id: Date.now().toString(), text: userText, isBot: false };
    
    // Add user message to UI
    setMessages(prev => [...prev, newUserMsg]);
    setChatInput('');
    setIsTyping(true);

    // Fetch response from Service Layer
    const botResponseText = await sendMessageToBot(userText);

    // Add bot response to UI
    const newBotMsg = { id: (Date.now() + 1).toString(), text: botResponseText, isBot: true };
    setMessages(prev => [...prev, newBotMsg]);
    setIsTyping(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* 1. Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Assalam-o-Alaikum,</Text>
            <Text style={styles.brandText}>UrSign AI</Text>
          </View>
          <TouchableOpacity style={styles.profileBtn}>
            <Ionicons name="person-circle" size={45} color={THEME_GREEN} />
          </TouchableOpacity>
        </View>

        {/* 2. Dynamic Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressTitle}>Daily Progress</Text>
            <Text style={styles.progressSubtitle}>
              {progress.count} of {progress.goal} signs learned today
            </Text>
            <View style={styles.fullProgressBar}>
              <View style={[styles.filledProgressBar, { width: `${progress.percentage}%` }]} />
            </View>
          </View>
          <View style={styles.percentageCircle}>
            <Text style={styles.percentageText}>{Math.round(progress.percentage)}%</Text>
          </View>
        </View>

        {/* 3. Learning Modules Section */}
        <Text style={styles.sectionTitle}>Learning Modules</Text>
        <View style={styles.moduleGrid}>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/PracticeScreen')}>
            <View style={[styles.iconContainer, { backgroundColor: '#E0F2F1' }]}>
              <Ionicons name="fitness" size={30} color={THEME_GREEN} />
            </View>
            <Text style={styles.cardText}>Practice Signs</Text>
            <Text style={styles.cardDesc}>AI-driven feedback</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => router.push('/lesson')}>
            <View style={[styles.iconContainer, { backgroundColor: '#E0F2F1' }]}>
              <Ionicons name="book" size={30} color={THEME_GREEN} />
            </View>
            <Text style={styles.cardText}>Sign Library</Text>
            <Text style={styles.cardDesc}>Watch & Learn</Text>
          </TouchableOpacity>
        </View>

        {/* 4. Translation Tools Section */}
        <Text style={[styles.sectionTitle, { marginTop: 15 }]}>Translation Tools</Text>
        <View style={styles.moduleGrid}>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/urdutosign')}>
            <View style={[styles.iconContainer, { backgroundColor: '#E0F2F1' }]}>
              <Ionicons name="text" size={30} color={THEME_GREEN} />
            </View>
            <Text style={styles.cardText}>Urdu to Sign</Text>
            <Text style={styles.cardDesc}>Text to Video</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => router.push('/signtourdu')}>
            <View style={[styles.iconContainer, { backgroundColor: '#E0F2F1' }]}>
              <Ionicons name="videocam" size={30} color={THEME_GREEN} />
            </View>
            <Text style={styles.cardText}>Sign to Urdu</Text>
            <Text style={styles.cardDesc}>Video to Text</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* ============================================================== */}
      {/* NEW: Floating Chatbot Button (Bottom Left) */}
      {/* ============================================================== */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => setIsChatOpen(true)}
      >
        <Ionicons name="chatbubbles" size={28} color="#FFF" />
      </TouchableOpacity>

      {/* ============================================================== */}
      {/* NEW: Chatbot Modal UI */}
      {/* ============================================================== */}
      <Modal visible={isChatOpen} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.chatContainer}>
          
          {/* Chat Header */}
          <View style={styles.chatHeader}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Ionicons name="logo-electron" size={24} color={THEME_GREEN} style={{marginRight: 10}}/>
              <Text style={styles.chatTitle}>UrSign AI Assistant</Text>
            </View>
            <TouchableOpacity onPress={() => setIsChatOpen(false)}>
              <Ionicons name="close-circle" size={30} color="#999" />
            </TouchableOpacity>
          </View>

          {/* Chat Messages */}
          <ScrollView 
            style={styles.chatBody}
            ref={scrollViewRef}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          >
            {messages.map((msg) => (
              <View 
                key={msg.id} 
                style={[styles.msgBubble, msg.isBot ? styles.msgBot : styles.msgUser]}
              >
                <Text style={[styles.msgText, msg.isBot ? styles.msgTextBot : styles.msgTextUser]}>
                  {msg.text}
                </Text>
              </View>
            ))}
            {isTyping && (
              <View style={[styles.msgBubble, styles.msgBot, { width: 60, alignItems: 'center' }]}>
                <ActivityIndicator size="small" color={THEME_GREEN} />
              </View>
            )}
          </ScrollView>

          {/* Chat Input Area */}
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View style={styles.chatFooter}>
              <TextInput 
                style={styles.chatInput}
                placeholder="Ask about Sign Language..."
                value={chatInput}
                onChangeText={setChatInput}
                onSubmitEditing={handleSendMessage}
              />
              <TouchableOpacity 
                style={[styles.sendBtn, !chatInput.trim() && {opacity: 0.5}]} 
                onPress={handleSendMessage}
                disabled={!chatInput.trim()}
              >
                <Ionicons name="send" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>

        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { padding: 20, paddingBottom: 100 }, // Added extra bottom padding so scroll doesn't hide behind FAB
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  welcomeText: { fontSize: 16, color: '#666' },
  brandText: { fontSize: 28, fontWeight: 'bold', color: THEME_GREEN },
  progressCard: { backgroundColor: THEME_GREEN, borderRadius: 25, padding: 22, flexDirection: 'row', alignItems: 'center', marginBottom: 30, elevation: 8 },
  progressInfo: { flex: 1, marginRight: 15 },
  progressTitle: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  progressSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 4 },
  fullProgressBar: { height: 8, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4, marginTop: 15, width: '100%', overflow: 'hidden' },
  filledProgressBar: { height: '100%', backgroundColor: '#FFF', borderRadius: 4 },
  percentageCircle: { width: 65, height: 65, borderRadius: 35, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
  percentageText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  moduleGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  card: { backgroundColor: '#F9F9F9', width: (width - 60) / 2, padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#F0F0F0', alignItems: 'center', elevation: 2 },
  iconContainer: { width: 60, height: 60, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  cardText: { fontSize: 15, fontWeight: 'bold', color: '#333', textAlign: 'center' },
  cardDesc: { fontSize: 11, color: '#777', marginTop: 4, textAlign: 'center' },
  
  // Floating Action Button (FAB)
  fab: {
    position: 'absolute',
    bottom: 40,
    right : 20,
    backgroundColor: THEME_GREEN,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  // Chat UI Styles
  chatContainer: { flex: 1, backgroundColor: '#F5F5F5' },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  chatTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  chatBody: { flex: 1, padding: 15 },
  msgBubble: { maxWidth: '80%', padding: 12, borderRadius: 15, marginBottom: 10 },
  msgUser: { alignSelf: 'flex-end', backgroundColor: THEME_GREEN, borderBottomRightRadius: 2 },
  msgBot: { alignSelf: 'flex-start', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E0E0E0', borderBottomLeftRadius: 2 },
  msgTextUser: { color: '#FFF', fontSize: 15 },
  msgTextBot: { color: '#333', fontSize: 15 },
  chatFooter: { flexDirection: 'row', padding: 10, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#EEE', alignItems: 'center' },
  chatInput: { flex: 1, backgroundColor: '#F0F0F0', height: 45, borderRadius: 20, paddingHorizontal: 15, fontSize: 15, marginRight: 10 },
  sendBtn: { backgroundColor: THEME_GREEN, width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center' }
});