import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const THEME_GREEN = '#008080';

export default function ProfileScreen() {
  const router = useRouter();
  const [isNotifEnabled, setIsNotifEnabled] = React.useState(true);

  const StatBox = ({ label, value, icon, color }) => (
    <View style={styles.statBox}>
      <View style={[styles.statIconCircle, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const MenuBtn = ({ icon, title, subtitle, color = "#555", onPress, isLast = false, toggle = false }) => (
    <TouchableOpacity 
      style={[styles.menuItem, isLast && { borderBottomWidth: 0 }]} 
      onPress={onPress}
      disabled={toggle}
    >
      <View style={[styles.menuIconBg, { backgroundColor: color + '10' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={styles.menuTextContainer}>
        <Text style={[styles.menuTitle, color === '#F44336' && { color: '#F44336' }]}>{title}</Text>
        {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
      </View>
      {toggle ? (
        <Switch 
          value={isNotifEnabled} 
          onValueChange={setIsNotifEnabled} 
          trackColor={{ false: "#DDD", true: THEME_GREEN }}
        />
      ) : (
        <Ionicons name="chevron-forward" size={18} color="#CCC" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={26} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.editBtn}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* PROFILE CARD */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={50} color="#FFF" />
            </View>
            <TouchableOpacity style={styles.cameraIcon}>
              <Ionicons name="camera" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>User Name</Text>
          <Text style={styles.userJoinDate}>Joined May 2024</Text>
        </View>

        {/* STATS ROW */}
        

        {/* SETTINGS MENU */}
        <View style={styles.sectionWrapper}>
          <Text style={styles.sectionLabel}>Learning Preferences</Text>
          <View style={styles.menuCard}>
            <MenuBtn 
              icon="notifications" 
              title="Daily Reminders" 
              subtitle="Get notified for practice" 
              color="#2196F3"
              toggle={true}
            />
            <MenuBtn 
              icon="language" 
              title="Secondary Language" 
              subtitle="Urdu / English" 
              color="#4CAF50"
              onPress={() => {}}
            />
          </View>

          <Text style={styles.sectionLabel}>Support & Legal</Text>
          <View style={styles.menuCard}>
            <MenuBtn icon="help-circle" title="Help Center" color="#795548" onPress={() => {}} />
            <MenuBtn icon="shield-checkmark" title="Privacy Policy" color="#607D8B" onPress={() => {}} />
            <MenuBtn 
              icon="log-out" 
              title="Logout" 
              color="#607D8BF" 
              isLast={true} 
              onPress={() => alert('Logged out')} 
            />
          </View>
        </View>
        
        <Text style={styles.versionText}>UrSign AI v1.0.4</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  editText: { color: THEME_GREEN, fontWeight: '700' },

  profileSection: { alignItems: 'center', marginVertical: 20 },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: THEME_GREEN, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  cameraIcon: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#333', padding: 8, borderRadius: 15, borderWidth: 2, borderColor: '#FFF' },
  userName: { fontSize: 24, fontWeight: 'bold', marginTop: 15, color: '#333' },
  userJoinDate: { fontSize: 14, color: '#888', marginTop: 4 },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 10 },
  statBox: { width: '30%', backgroundColor: '#FFF', borderRadius: 20, padding: 15, alignItems: 'center', elevation: 2 },
  statIconCircle: { width: 45, height: 45, borderRadius: 22.5, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  statLabel: { fontSize: 12, color: '#999' },

  sectionWrapper: { paddingHorizontal: 20, marginTop: 30 },
  sectionLabel: { fontSize: 14, fontWeight: 'bold', color: '#BBB', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },
  menuCard: { backgroundColor: '#FFF', borderRadius: 22, paddingHorizontal: 15, marginBottom: 20, elevation: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  menuIconBg: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  menuTextContainer: { flex: 1, marginLeft: 15 },
  menuTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  menuSubtitle: { fontSize: 12, color: '#AAA', marginTop: 2 },
  
  versionText: { textAlign: 'center', color: '#CCC', fontSize: 12, marginBottom: 30 }
});