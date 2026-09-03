import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { Card } from '@/components/cards/Card';
import { useCartStore } from '@/store/useCartStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

export const CheckoutScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const total = useCartStore((s) => s.getTotalPayable());

  const [fullName, setFullName] = useState('रोहन शर्मा (Rohan Sharma)');
  const [phone, setPhone] = useState('9876543210');
  const [pincode, setPincode] = useState('110001');
  const [city, setCity] = useState('New Delhi');
  const [state, setState] = useState('Delhi');
  const [addressLine, setAddressLine] = useState('मकान नं. 42, बाराखंभा रोड, कनाट प्लेस');

  const handlePincodeChange = (text: string) => {
    setPincode(text);
    if (text.length === 6) {
      if (text.startsWith('11')) {
        setCity('New Delhi');
        setState('Delhi');
      } else if (text.startsWith('56')) {
        setCity('Bengaluru');
        setState('Karnataka');
      } else if (text.startsWith('70')) {
        setCity('Kolkata');
        setState('West Bengal');
      } else if (text.startsWith('40')) {
        setCity('Mumbai');
        setState('Maharashtra');
      }
    }
  };

  const handleProceedToPayment = () => {
    if (!fullName || !phone || !pincode || !addressLine) {
      Alert.alert('अपूर्ण पता', 'कृपया पूरा डिलीवरी पता और पिनकोड दर्ज करें।');
      return;
    }
    navigation.navigate('Payment');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface.parchment }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={styles.backBtn}
        >
          <Text variant="headlineMedium" color={theme.colors.text.primary}>
            ← वापस
          </Text>
        </TouchableOpacity>
        <Text variant="headlineMedium" weight="bold" color={theme.colors.text.primary}>
          डिलीवरी पता (Shipping Address)
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Postal Reach Guarantee Banner */}
        <View style={[styles.postalBanner, { backgroundColor: theme.colors.surface.card }]}>
          <Text style={{ fontSize: 26, marginRight: 10 }}>📮</Text>
          <View style={{ flex: 1 }}>
            <Text variant="bodySmall" weight="bold" color={theme.colors.primary.emerald700}>
              इंडिया पोस्ट स्पीड पोस्ट सुरक्षित डिलीवरी
            </Text>
            <Text variant="bodySmall" color={theme.colors.text.secondary}>
              देश के 1,55,000+ शाखा डाकघरों और दूरदराज गांवों तक पहुंच।
            </Text>
          </View>
        </View>

        {/* Address Input Form */}
        <Card style={styles.formCard}>
          <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary} style={{ marginBottom: 14 }}>
            पता विवरण (Address Details)
          </Text>

          <Text variant="bodySmall" weight="bold" color={theme.colors.text.secondary} style={styles.fieldLabel}>
            पूरा नाम (Full Name) *
          </Text>
          <TextInput
            style={[styles.input, { borderColor: theme.colors.surface.border }]}
            value={fullName}
            onChangeText={setFullName}
            placeholder="नाम दर्ज करें"
          />

          <Text variant="bodySmall" weight="bold" color={theme.colors.text.secondary} style={styles.fieldLabel}>
            मोबाइल नंबर (Phone Number) *
          </Text>
          <TextInput
            style={[styles.input, { borderColor: theme.colors.surface.border }]}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="10 अंकों का मोबाइल नंबर"
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text variant="bodySmall" weight="bold" color={theme.colors.text.secondary} style={styles.fieldLabel}>
                पिनकोड (6-Digit PIN) *
              </Text>
              <TextInput
                style={[styles.input, { borderColor: theme.colors.surface.border }]}
                value={pincode}
                onChangeText={handlePincodeChange}
                keyboardType="numeric"
                maxLength={6}
                placeholder="उदा. 110001"
              />
            </View>

            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text variant="bodySmall" weight="bold" color={theme.colors.text.secondary} style={styles.fieldLabel}>
                शहर व राज्य (City, State)
              </Text>
              <TextInput
                style={[styles.input, { borderColor: theme.colors.surface.border, backgroundColor: '#F9F9F9' }]}
                value={`${city}, ${state}`}
                editable={false}
              />
            </View>
          </View>

          <Text variant="bodySmall" weight="bold" color={theme.colors.text.secondary} style={styles.fieldLabel}>
            मकान नंबर, गली व लैंडमार्क (Full Address) *
          </Text>
          <TextInput
            style={[styles.input, styles.textArea, { borderColor: theme.colors.surface.border }]}
            value={addressLine}
            onChangeText={setAddressLine}
            multiline
            numberOfLines={3}
            placeholder="मकान संख्या, कॉलोनी, लैंडमार्क..."
          />
        </Card>

        {/* Delivery Timeline Card */}
        <Card style={styles.shippingCard}>
          <View style={styles.shippingRow}>
            <Text style={{ fontSize: 24, marginRight: 10 }}>🚚</Text>
            <View style={{ flex: 1 }}>
              <Text variant="bodyLarge" weight="bold" color={theme.colors.primary.emerald700}>
                स्पीड पोस्ट एक्सप्रेस (Speed Post)
              </Text>
              <Text variant="bodySmall" color={theme.colors.text.secondary}>
                अनुमानित डिलीवरी: 3-5 कार्य दिवस • बारकोड ट्रैकिंग उपलब्ध
              </Text>
            </View>
            <Text variant="bodyLarge" weight="bold" color={theme.colors.primary.emerald700}>
              शामिल
            </Text>
          </View>
        </Card>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={[styles.bottomBar, { backgroundColor: theme.colors.surface.card, ...theme.shadows.level4 }]}>
        <View style={styles.bottomPriceInfo}>
          <Text variant="bodySmall" color={theme.colors.text.secondary}>
            कुल देय (Total):
          </Text>
          <Text variant="headlineMedium" weight="bold" color={theme.colors.primary.emerald700}>
            ₹{total.toLocaleString('en-IN')}
          </Text>
        </View>

        <Button
          label="भुगतान करें (Proceed to Payment) 💳"
          variant="primary"
          size="default"
          onPress={handleProceedToPayment}
          style={styles.payBtn}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    padding: 4,
  },
  headerSpacer: {
    width: 32,
  },
  content: {
    padding: 16,
    paddingBottom: 110,
  },
  postalBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  formCard: {
    padding: 16,
    marginBottom: 16,
  },
  fieldLabel: {
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  shippingCard: {
    padding: 14,
    marginBottom: 16,
  },
  shippingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1.5,
    borderTopColor: '#E0D7C9',
  },
  bottomPriceInfo: {
    flex: 1,
  },
  payBtn: {
    flex: 1.6,
  },
});
