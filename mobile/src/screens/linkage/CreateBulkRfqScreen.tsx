import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { Card } from '@/components/cards/Card';
import { AppHeader } from '@/components/navigation/AppHeader';
import { marketLinkageService } from '@/api/marketLinkageService';
import { CRAFT_CATEGORIES } from '@/api/marketplaceService';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateBulkRfq'>;

export const CreateBulkRfqScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();

  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(CRAFT_CATEGORIES[0].code);
  const [quantity, setQuantity] = useState('500');
  const [targetBudget, setTargetBudget] = useState('650');
  const [deadlineDays, setDeadlineDays] = useState('30');
  const [specs, setSpecs] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitRfq = async () => {
    if (!companyName || !contactPerson || !phone || !quantity) {
      Alert.alert('अपूर्ण फॉर्म', 'कृपया कंपनी का नाम, संपर्क व्यक्ति, फोन और संख्या भरें।');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await marketLinkageService.createBulkRfq({
        companyName,
        contactPerson,
        email,
        phone,
        craftCategoryCode: selectedCategory,
        requiredQuantity: parseInt(quantity, 10) || 500,
        targetBudgetPerUnit: parseInt(targetBudget, 10) || 650,
        deliveryDeadlineDays: parseInt(deadlineDays, 10) || 30,
        specifications: specs,
      });

      setIsSubmitting(false);
      Alert.alert(
        'RFQ सफलतापूर्वक प्रसारित!',
        `आपकी मांग (ID: ${res.rfqId}) AI क्लस्टर इंजन द्वारा संबंधित शिल्पकारों से मिला दी गई है। कारीगरों से जल्द ही कोटेशन प्राप्त होंगे।`,
        [{ text: 'ठीक है', onPress: () => navigation.navigate('MarketplaceHome') }]
      );
    } catch (_err) {
      setIsSubmitting(false);
      Alert.alert('त्रुटि', 'RFQ दर्ज करने में समस्या हुई। कृपया पुनः प्रयास करें।');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface.sand }]} edges={['top']}>
      <AppHeader
        title="संस्थागत थोक खरीद"
        subtitle="Corporate RFQ & Cluster Sourcing"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        onVoicePress={() => {}}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <Card style={[styles.banner, { backgroundColor: theme.colors.terracotta.primary }]}>
          <View style={styles.bannerBadge}>
            <Text variant="labelSmall" weight="bold" color="#FFFFFF">
              🏢 कॉर्पोरेट उपहार व थोक क्लस्टर आपूर्ति
            </Text>
          </View>
          <Text variant="headlineSmall" weight="bold" color="#FFFFFF" style={{ marginVertical: 4 }}>
            सीधे ग्रामीण कारीगर क्लस्टर्स से थोक खरीद
          </Text>
          <Text variant="labelSmall" color="#FFE8DF">
            जीआई प्रमाणित शिल्प, डिजिटल शिल्प पासपोर्ट और जीएसटी चालान सहित।
          </Text>
        </Card>

        {/* Form Card */}
        <Card style={styles.formCard}>
          <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary} style={{ marginBottom: 14 }}>
            मांग का विवरण (Requirement Details)
          </Text>

          <Text variant="labelSmall" weight="bold" color={theme.colors.text.secondary} style={styles.fieldLabel}>
            कंपनी / संस्थान का नाम (Organization Name) *
          </Text>
          <TextInput
            style={[styles.input, { borderColor: theme.colors.border.subtle, color: theme.colors.text.primary }]}
            value={companyName}
            onChangeText={setCompanyName}
            placeholder="उदा. Tata Consultancy Services या Taj Hotels"
            placeholderTextColor="#8D7168"
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 6 }}>
              <Text variant="labelSmall" weight="bold" color={theme.colors.text.secondary} style={styles.fieldLabel}>
                संपर्क व्यक्ति (Contact Person) *
              </Text>
              <TextInput
                style={[styles.input, { borderColor: theme.colors.border.subtle, color: theme.colors.text.primary }]}
                value={contactPerson}
                onChangeText={setContactPerson}
                placeholder="नाम दर्ज करें"
                placeholderTextColor="#8D7168"
              />
            </View>

            <View style={{ flex: 1, marginLeft: 6 }}>
              <Text variant="labelSmall" weight="bold" color={theme.colors.text.secondary} style={styles.fieldLabel}>
                फ़ोन नंबर (Phone) *
              </Text>
              <TextInput
                style={[styles.input, { borderColor: theme.colors.border.subtle, color: theme.colors.text.primary }]}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="10 अंक"
                placeholderTextColor="#8D7168"
              />
            </View>
          </View>

          <Text variant="labelSmall" weight="bold" color={theme.colors.text.secondary} style={styles.fieldLabel}>
            ईमेल (Email ID):
          </Text>
          <TextInput
            style={[styles.input, { borderColor: theme.colors.border.subtle, color: theme.colors.text.primary }]}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="उदा. procurement@company.com"
            placeholderTextColor="#8D7168"
          />

          {/* Craft Category Chips */}
          <Text variant="labelSmall" weight="bold" color={theme.colors.text.secondary} style={styles.fieldLabel}>
            शिल्प श्रेणी (Craft Category) *
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 6 }}>
            {CRAFT_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.code;
              return (
                <TouchableOpacity
                  key={cat.code}
                  onPress={() => setSelectedCategory(cat.code)}
                  style={[
                    styles.catChip,
                    {
                      backgroundColor: isSelected ? theme.colors.terracotta.primary : theme.colors.surface.card,
                      borderColor: isSelected ? theme.colors.terracotta.primary : theme.colors.border.subtle,
                    },
                  ]}
                  activeOpacity={0.8}
                >
                  <Text
                    variant="labelSmall"
                    weight={isSelected ? 'bold' : 'normal'}
                    color={isSelected ? '#FFFFFF' : theme.colors.text.primary}
                  >
                    {cat.icon} {cat.nameHi}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 6 }}>
              <Text variant="labelSmall" weight="bold" color={theme.colors.text.secondary} style={styles.fieldLabel}>
                कुल संख्या (Quantity) *
              </Text>
              <TextInput
                style={[styles.input, { borderColor: theme.colors.border.subtle, color: theme.colors.text.primary }]}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                placeholder="उदा. 500"
                placeholderTextColor="#8D7168"
              />
            </View>

            <View style={{ flex: 1, marginLeft: 6 }}>
              <Text variant="labelSmall" weight="bold" color={theme.colors.text.secondary} style={styles.fieldLabel}>
                बजट प्रति पीस (₹ Target)
              </Text>
              <TextInput
                style={[styles.input, { borderColor: theme.colors.border.subtle, color: theme.colors.text.primary }]}
                value={targetBudget}
                onChangeText={setTargetBudget}
                keyboardType="numeric"
                placeholder="उदा. 650"
                placeholderTextColor="#8D7168"
              />
            </View>
          </View>

          <Text variant="labelSmall" weight="bold" color={theme.colors.text.secondary} style={styles.fieldLabel}>
            आवश्यक डिलीवरी समय सीमा (दिन / Days):
          </Text>
          <TextInput
            style={[styles.input, { borderColor: theme.colors.border.subtle, color: theme.colors.text.primary }]}
            value={deadlineDays}
            onChangeText={setDeadlineDays}
            keyboardType="numeric"
            placeholder="उदा. 30 दिन"
            placeholderTextColor="#8D7168"
          />

          <Text variant="labelSmall" weight="bold" color={theme.colors.text.secondary} style={styles.fieldLabel}>
            विशेष निर्देश / लोगो ब्रांडिंग आवश्यकताएं:
          </Text>
          <TextInput
            style={[styles.input, styles.textArea, { borderColor: theme.colors.border.subtle, color: theme.colors.text.primary }]}
            value={specs}
            onChangeText={setSpecs}
            multiline
            numberOfLines={3}
            placeholder="आकार, रंग, कस्टमाइज़ेशन, पैकेजिंग आवश्यकता..."
            placeholderTextColor="#8D7168"
          />
        </Card>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={[styles.bottomBar, { backgroundColor: '#FFFFFF' }]}>
        <Button
          label={isSubmitting ? 'प्रसारित हो रहा है...' : 'AI क्लस्टर मैचिंग शुरू करें 🚀'}
          variant="primary"
          isLoading={isSubmitting}
          onPress={handleSubmitRfq}
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
    paddingBottom: 110,
  },
  banner: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  bannerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 4,
  },
  formCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  fieldLabel: {
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    marginRight: 8,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 6,
  },
});
