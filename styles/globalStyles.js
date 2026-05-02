import { StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

export const globalStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white, padding: 20 },
  input: {
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: 16,
    color: Colors.textMain,
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
  },
  btnText: { color: Colors.white, fontSize: 18, fontWeight: 'bold' },
  footerText: { textAlign: 'center', marginTop: 20, color: Colors.textSecondary },
  linkText: { color: Colors.primary, fontWeight: 'bold' }
});