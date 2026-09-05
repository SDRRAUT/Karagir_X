import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { Card } from '@/components/cards/Card';
import { AppHeader } from '@/components/navigation/AppHeader';
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.sand[50] }]}>
      <AppHeader
        title="डिलीवरी पता"
        subtitle="Shipping & Postal Delivery"
        onBackPress={() => navigation.goBack()}
        showDevanagariLogo
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Postal Reach Guarantee Banner */}
        <View style={[styles.postalBanner, { backgroundColor: '#FFFFFF', borderColor: theme.colors.sand[200] }]}>
          <View style={styles.postalIconBox}>
            <Text style={{ fontSize: 24 }}>📮</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.postalTagRow}>
              <Text style={styles.postalTagText}>INDIA POST CONNECT</Text>
            </View>
            <Text variant="bodyMedium" weight="bold" color={theme.colors.charcoal[900]}>
              स्पीड पोस्ट सुरक्षित डिलीवरी
            </Text>
            <Text variant="bodySmall" color={theme.colors.charcoal[600]} style={{ marginTop: 2 }}>
              देश के 1,55,000+ शाखा डाकघरों और दूरदराज गांवों तक सीधी पहुंच।
            </Text>
          </View>
        </View>

        {/* Address Input Form */}
        <Card style={styles.formCard} variant="elevated">
          <View style={styles.cardHeaderRow}>
            <Text variant="headlineSmall" weight="bold" color={theme.colors.charcoal[900]}>
              पता विवरण (Address Details)
            </Text>
            <View style={styles.badgeStep}>
              <Text style={styles.badgeStepText}>चरण 1 / 2</Text>
            </View>
          </View>

          <Text variant="bodySmall" weight="bold" color={theme.colors.charcoal[700]} style={styles.fieldLabel}>
            पूरा नाम (Full Name) *
          </Text>
          <TextInput
            style={[styles.input, { borderColor: theme.colors.sand[300], color: theme.colors.charcoal[900] }]}
            value={fullName}
            onChangeText={setFullName}
            placeholder="नाम दर्ज करें"
            placeholderTextColor={theme.colors.charcoal[400]}
          />

          <Text variant="bodySmall" weight="bold" color={theme.colors.charcoal[700]} style={styles.fieldLabel}>
            मोबाइल नंबर (Phone Number) *
          </Text>
          <TextInput
            style={[styles.input, { borderColor: theme.colors.sand[300], color: theme.colors.charcoal[900] }]}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="10 अंकों का मोबाइल नंबर"
            placeholderTextColor={theme.colors.charcoal[400]}
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text variant="bodySmall" weight="bold" color={theme.colors.charcoal[700]} style={styles.fieldLabel}>
                पिनकोड (6-Digit PIN) *
              </Text>
              <TextInput
                style={[styles.input, { borderColor: theme.colors.sand[300], color: theme.colors.charcoal[900] }]}
                value={pincode}
                onChangeText={handlePincodeChange}
                keyboardType="numeric"
                maxLength={6}
                placeholder="उदा. 110001"
                placeholderTextColor={theme.colors.charcoal[400]}
              />
            </View>

            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text variant="bodySmall" weight="bold" color={theme.colors.charcoal[700]} style={styles.fieldLabel}>
                शहर व राज्य (City, State)
              </Text>
              <TextInput
                style={[styles.input, { borderColor: theme.colors.sand[200], backgroundColor: theme.colors.sand[100], color: theme.colors.charcoal[700] }]}
                value={`${city}, ${state}`}
                editable={false}
              />
            </View>
          </View>

          <Text variant="bodySmall" weight="bold" color={theme.colors.charcoal[700]} style={styles.fieldLabel}>
            मकान नंबर, गली व लैंडमार्क (Full Address) *
          </Text>
          <TextInput
            style={[styles.input, styles.textArea, { borderColor: theme.colors.sand[300], color: theme.colors.charcoal[900] }]}
            value={addressLine}
            onChangeText={setAddressLine}
            multiline
            numberOfLines={3}
            placeholder="मकान संख्या, कॉलोनी, लैंडमार्क..."
            placeholderTextColor={theme.colors.charcoal[400]}
          />
        </Card>

        {/* Delivery Timeline Card */}
        <Card style={styles.shippingCard} variant="outlined">
          <View style={styles.shippingRow}>
            <View style={styles.shippingIconBox}>
              <Text style={{ fontSize: 22 }}>🚚</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="bodyLarge" weight="bold" color={theme.colors.charcoal[900]}>
                स्पीड पोस्ट एक्सप्रेस (Speed Post)
              </Text>
              <Text variant="bodySmall" color={theme.colors.charcoal[600]} style={{ marginTop: 2 }}>
                अनुमानित डिलीवरी: 3-5 कार्य दिवस • बारकोड ट्रैकिंग उपलब्ध
              </Text>
            </View>
            <View style={styles.freeBadge}>
              <Text style={styles.freeBadgeText}>शामिल</Text>
            </View>
          </View>
        </Card>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={[styles.bottomBar, { backgroundColor: '#FFFFFF', borderTopColor: theme.colors.sand[200] }]}>
        <View style={styles.bottomPriceInfo}>
          <Text variant="bodySmall" color={theme.colors.charcoal[500]} weight="medium">
            कुल देय (Total)
          </Text>
          <Text variant="headlineMedium" weight="bold" color={theme.colors.charcoal[900]}>
            ₹{total.toLocaleString('en-IN')}
          </Text>
        </View>

        <Button
          label="भुगतान करें (Payment) →"
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
  content: {
    padding: 16,
    paddingBottom: 120,
  },
  postalBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  postalIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F0EEFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  postalTagRow: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
  },
  postalTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9C6E00',
    letterSpacing: 0.5,
  },
  formCard: {
    padding: 18,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderColor: '#E0DCFF',
    borderWidth: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  badgeStep: {
    backgroundColor: '#F3EFE9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeStepText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B6B8D',
  },
  fieldLabel: {
    marginBottom: 6,
    marginTop: 12,
    fontSize: 13,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Manrope',
  },
  textArea: {
    minHeight: 74,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  shippingCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderColor: '#E0DCFF',
    borderWidth: 1,
  },
  shippingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shippingIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#E8F5EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  freeBadge: {
    backgroundColor: '#E8F5EE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  freeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6C63FF',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    shadowColor: '#1A1A2E',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 8,
  },
  bottomPriceInfo: {
    flex: 1,
  },
  payBtn: {
    flex: 1.5,
  },
});

