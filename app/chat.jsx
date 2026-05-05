import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const THEME_GREEN = '#008080';

export default function ChatScreen() {
  const router = useRouter();
  const scrollViewRef = useRef(); // To auto-scroll to bottom
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([
    { id: 1, text: "Assalam-o-Alaikum! I'm your UrSign AI tutor. How can I help you learn PSL today?", sender: 'ai' }
  ]);

  const sendMessage = () => {
    if (message.trim().length === 0) return;
    
    const userMsg = { id: Date.now(), text: message, sender: 'user' };
    setChatLog([...chatLog, userMsg]);
    setMessage('');

    // Auto-scroll to bottom when user sends message
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    // Simulate AI response
    setTimeout(() => {
      const aiMsg = { 
        id: Date.now() + 1, 
        text: "This feature coming soon ...", 
        sender: 'ai' 
      };
      setChatLog(prev => [...prev, aiMsg]);
      // Auto-scroll to bottom when AI responds
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>UrSign AI Bot</Text>
        <View style={{ width: 40 }} /> 
      </View>

      {/* KeyboardAvoidingView is the secret sauce here */}
      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={styles.chatContainer}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {chatLog.map((item) => (
            <View key={item.id} style={[
              styles.bubble, 
              item.sender === 'user' ? styles.userBubble : styles.aiBubble
            ]}>
              <Text style={[
                styles.chatText, 
                item.sender === 'user' ? styles.userText : styles.aiText
              ]}>
                {item.text}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* This Input Area will now push UP above the keyboard */}
        <View style={styles.inputWrapper}>
          <View style={styles.inputArea}>
            <TextInput 
              style={styles.input}
              placeholder="Ask anything about PSL..."
              placeholderTextColor="#999"
              value={message}
              onChangeText={setMessage}
              multiline={false}
            />
            <TouchableOpacity 
              style={[styles.sendBtn, !message.trim() && { opacity: 0.5 }]} 
              onPress={sendMessage}
              disabled={!message.trim()}
            >
              <Ionicons name="send" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  backBtn: { padding: 5 },
  
  chatContainer: { padding: 20, paddingBottom: 10 },
  
  bubble: { maxWidth: '85%', padding: 14, borderRadius: 20, marginBottom: 15 },
  userBubble: { 
    alignSelf: 'flex-end', 
    backgroundColor: THEME_GREEN, 
    borderBottomRightRadius: 4 
  },
  aiBubble: { 
    alignSelf: 'flex-start', 
    backgroundColor: '#F0F3F3', 
    borderBottomLeftRadius: 4 
  },
  
  chatText: { fontSize: 15, lineHeight: 22 },
  userText: { color: '#FFF' },
  aiText: { color: '#333' },

 

  inputWrapper: {
    paddingHorizontal: 15,
    paddingTop: 10,
    // Increase this value to move it higher up from the mobile home buttons
    paddingBottom: Platform.OS === 'android' ? 55 : 10, 
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  inputArea: { 
    flexDirection: 'row', 
    alignItems: 'center',
    backgroundColor: '#F5F7F7',
    borderRadius: 30,
    paddingHorizontal: 5,
    paddingVertical: 5,
    // Add a slight shadow to make it look distinct from the background
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: -2 }
  },


  input: { 
    flex: 1, 
    height: 45, 
    paddingHorizontal: 15, 
    color: '#333',
    fontSize: 15
  },
  sendBtn: { 
    backgroundColor: THEME_GREEN, 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center' 
  }
});