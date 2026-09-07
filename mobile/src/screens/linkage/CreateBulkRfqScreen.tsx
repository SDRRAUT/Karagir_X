import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { VoiceTextInput as TextInput } from '@/components/inputs/VoiceTextInput';
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
      Alert.alert('Incomplete Form', 'Please fill in organization name, contact person, phone, and quantity.');
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
        'RFQ Broadcasted Successfully!',
        `Your requirement (ID: ${res.rfqId}) has been matched with artisan clusters via our AI cluster engine. Artisans and facilitators will respond shortly.`,
        [{ text: 'OK', onPress: () => navigation.navigate('MarketplaceHome') }]
      );
    } catch (_err) {
      setIsSubmitting(false);
      Alert.alert('Error', 'Failed to submit RFQ. Please try again.');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface.sand }]} edges={['top']}>
      <AppHeader
        title="Corporate Bulk RFQ"
        subtitle="Cluster Sourcing & Institutional Demand"
        showBack={true}
        onBackPress={() => navigation.goBack()}
        onVoicePress={() => {}}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <Card style={[styles.banner, { backgroundColor: theme.colors.terracotta.primary }]}>
          <View style={styles.bannerBadge}>
            <Text variant="labelSmall" weight="bold" color="#FFFFFF">
              🏢 Corporate Gifting & Institutional Cluster Supply
            </Text>
          </View>
          <Text variant="headlineSmall" weight="bold" color="#FFFFFF" style={{ marginVertical: 4 }}>
            Direct Bulk Sourcing from Rural Artisan Clusters
          </Text>
          <Text variant="labelSmall" color="#E0DCFF">
            GI certified crafts, digital provenance passports, and GST-compliant invoicing.
          </Text>
        </Card>

        {/* Form Card */}
        <Card style={styles.formCard}>
          <Text variant="headlineSmall" weight="bold" color={theme.colors.text.primary} style={{ marginBottom: 14 }}>
            Requirement Details
          </Text>

          <Text variant="labelSmall" weight="bold" color={theme.colors.text.secondary} style={styles.fieldLabel}>
            Organization / Company Name *
          </Text>
          <TextInput
            style={[styles.input, { borderColor: theme.colors.border.subtle, color: theme.colors.text.primary }]}
            value={companyName}
            onChangeText={setCompanyName}
            placeholder="e.g. Tata Consultancy Services or Taj Hotels"
            placeholderTextColor="#8D7168"
          />

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 6 }}>
              <Text variant="labelSmall" weight="bold" color={theme.colors.text.secondary} style={styles.fieldLabel}>
                Contact Person *
              </Text>
              <TextInput
                style={[styles.input, { borderColor: theme.colors.border.subtle, color: theme.colors.text.primary }]}
                value={contactPerson}
                onChangeText={setContactPerson}
                placeholder="Full Name"
                placeholderTextColor="#8D7168"
              />
            </View>

            <View style={{ flex: 1, marginLeft: 6 }}>
              <Text variant="labelSmall" weight="bold" color={theme.colors.text.secondary} style={styles.fieldLabel}>
                Phone Number *
              </Text>
              <TextInput
                style={[styles.input, { borderColor: theme.colors.border.subtle, color: theme.colors.text.primary }]}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="10-digit number"
                placeholderTextColor="#8D7168"
              />
            </View>
          </View>

          <Text variant="labelSmall" weight="bold" color={theme.colors.text.secondary} style={styles.fieldLabel}>
            Email Address:
          </Text>
          <TextInput
            style={[styles.input, { borderColor: theme.colors.border.subtle, color: theme.colors.text.primary }]}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="e.g. procurement@company.com"
            placeholderTextColor="#8D7168"
          />

          {/* Craft Category Chips */}
          <Text variant="labelSmall" weight="bold" color={theme.colors.text.secondary} style={styles.fieldLabel}>
            Craft Category *
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
                    {cat.icon} {cat.nameEn || cat.nameHi}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 6 }}>
              <Text variant="labelSmall" weight="bold" color={theme.colors.text.secondary} style={styles.fieldLabel}>
                Target Quantity *
              </Text>
              <TextInput
                style={[styles.input, { borderColor: theme.colors.border.subtle, color: theme.colors.text.primary }]}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
                placeholder="e.g. 500"
                placeholderTextColor="#8D7168"
              />
            </View>

            <View style={{ flex: 1, marginLeft: 6 }}>
              <Text variant="labelSmall" weight="bold" color={theme.colors.text.secondary} style={styles.fieldLabel}>
                Target Budget (₹/Unit)
              </Text>
              <TextInput
                style={[styles.input, { borderColor: theme.colors.border.subtle, color: theme.colors.text.primary }]}
                value={targetBudget}
                onChangeText={setTargetBudget}
                keyboardType="numeric"
                placeholder="e.g. 650"
                placeholderTextColor="#8D7168"
              />
            </View>
          </View>

          <Text variant="labelSmall" weight="bold" color={theme.colors.text.secondary} style={styles.fieldLabel}>
            Required Delivery Timeline (Days):
          </Text>
          <TextInput
            style={[styles.input, { borderColor: theme.colors.border.subtle, color: theme.colors.text.primary }]}
            value={deadlineDays}
            onChangeText={setDeadlineDays}
            keyboardType="numeric"
            placeholder="e.g. 30"
            placeholderTextColor="#8D7168"
          />

          <Text variant="labelSmall" weight="bold" color={theme.colors.text.secondary} style={styles.fieldLabel}>
            Special Instructions & Branding Specifications:
          </Text>
          <TextInput
            style={[styles.input, styles.textArea, { borderColor: theme.colors.border.subtle, color: theme.colors.text.primary }]}
            value={specs}
            onChangeText={setSpecs}
            multiline
            numberOfLines={3}
            placeholder="Size, colors, custom engraving, packaging preferences..."
            placeholderTextColor="#8D7168"
          />
        </Card>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View style={[styles.bottomBar, { backgroundColor: '#FFFFFF' }]}>
        <Button
          label={isSubmitting ? 'Broadcasting...' : 'Launch AI Cluster Matching 🚀'}
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
