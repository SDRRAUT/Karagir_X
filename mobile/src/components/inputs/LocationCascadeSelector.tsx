import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/typography/Text';
import { Icon } from '@/components/icons/Icon';
import { locationService } from '@/api/locationService';
import { Country, State, District, SubDistrict, Village, LocationHierarchyValue } from '@/api/types';
import { SearchablePickerModal, PickerItem } from '@/components/modals/SearchablePickerModal';
import { useAppStore } from '@/store/useAppStore';
import { voiceGuidance } from '@/utils/voiceGuidance';
import { speechRecognitionService } from '@/services/speechRecognitionService';

interface Props {
  value?: Partial<LocationHierarchyValue>;
  onChange: (val: LocationHierarchyValue) => void;
  showVillage?: boolean;
  showSubDistrict?: boolean;
  accentColor?: string;
  lightBgColor?: string;
  disabled?: boolean;
  helperText?: string;
}

export const LocationCascadeSelector: React.FC<Props> = ({
  value,
  onChange,
  showVillage = true,
  showSubDistrict = true,
  accentColor = '#EA580C',
  lightBgColor = '#FFF7ED',
  disabled = false,
  helperText,
}) => {
  const { locale } = useAppStore();

  // Master lists
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [subDistricts, setSubDistricts] = useState<SubDistrict[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);

  // Active selections
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [selectedSubDistrict, setSelectedSubDistrict] = useState<SubDistrict | null>(null);
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null);
  const [customVillageName, setCustomVillageName] = useState<string>('');

  // Modals visibility
  const [activeModal, setActiveModal] = useState<'STATE' | 'DISTRICT' | 'SUB_DISTRICT' | 'VILLAGE' | null>(null);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isVoiceListening, setIsVoiceListening] = useState(false);

  // Load initial countries and states
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const cList = await locationService.getCountries();
      if (!isMounted) return;
      setCountries(cList);
      const defaultC = cList.find((c) => c.isoCode === 'IN') || cList[0];
      setSelectedCountry(defaultC);

      const sList = await locationService.getStates(defaultC.id);
      if (!isMounted) return;
      setStates(sList);
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync incoming value with local state if matching IDs exist
  useEffect(() => {
    if (!value) return;

    if (value.stateId && states.length > 0 && selectedState?.id !== value.stateId) {
      const foundState = states.find((s) => s.id === value.stateId);
      if (foundState) {
        setSelectedState(foundState);
        locationService.getDistricts(foundState.id).then((dList) => {
          setDistricts(dList);
          if (value.districtId) {
            const foundDistrict = dList.find((d) => d.id === value.districtId);
            if (foundDistrict) {
              setSelectedDistrict(foundDistrict);
              locationService.getSubDistricts(foundDistrict.id).then((sdList) => {
                setSubDistricts(sdList);
                if (value.subDistrictId) {
                  const foundSd = sdList.find((sd) => sd.id === value.subDistrictId);
                  if (foundSd) {
                    setSelectedSubDistrict(foundSd);
                  }
                }
              });
            }
          }
        });
      }
    }
  }, [value, states]);

  const notifyChange = useCallback(
    (
      c: Country | null,
      s: State | null,
      d: District | null,
      sd: SubDistrict | null,
      v: Village | null,
      customV: string
    ) => {
      onChange({
        countryId: c?.id || 1,
        countryName: c?.name || 'India',
        stateId: s?.id,
        stateName: s?.name || '',
        districtId: d?.id,
        districtName: d?.name || '',
        subDistrictId: sd?.id,
        subDistrictName: sd?.name || '',
        villageId: v?.id,
        villageName: v ? v.name : customV,
        pincode: v?.pincode,
      });
    },
    [onChange]
  );

  // 1. Handle State selection
  const handleSelectState = async (item: PickerItem) => {
    const s = states.find((st) => st.id === item.id) || null;
    setSelectedState(s);
    // Reset lower levels
    setSelectedDistrict(null);
    setSelectedSubDistrict(null);
    setSelectedVillage(null);
    setCustomVillageName('');
    setDistricts([]);
    setSubDistricts([]);
    setVillages([]);
    setActiveModal(null);

    notifyChange(selectedCountry, s, null, null, null, '');

    if (s) {
      setIsLoadingList(true);
      const dList = await locationService.getDistricts(s.id);
      setDistricts(dList);
      setIsLoadingList(false);
    }
  };

  // 2. Handle District selection
  const handleSelectDistrict = async (item: PickerItem) => {
    const d = districts.find((dst) => dst.id === item.id) || null;
    setSelectedDistrict(d);
    // Reset lower levels
    setSelectedSubDistrict(null);
    setSelectedVillage(null);
    setCustomVillageName('');
    setSubDistricts([]);
    setVillages([]);
    setActiveModal(null);

    notifyChange(selectedCountry, selectedState, d, null, null, '');

    if (d) {
      setIsLoadingList(true);
      const sdList = await locationService.getSubDistricts(d.id);
      setSubDistricts(sdList);
      setIsLoadingList(false);
    }
  };

  // 3. Handle Sub-District selection
  const handleSelectSubDistrict = async (item: PickerItem) => {
    const sd = subDistricts.find((s) => s.id === item.id) || null;
    setSelectedSubDistrict(sd);
    setSelectedVillage(null);
    setCustomVillageName('');
    setVillages([]);
    setActiveModal(null);

    notifyChange(selectedCountry, selectedState, selectedDistrict, sd, null, '');

    if (sd && showVillage) {
      setIsLoadingList(true);
      const vList = await locationService.searchVillages(sd.id);
      setVillages(vList);
      setIsLoadingList(false);
    }
  };

  // 4. Handle Village selection
  const handleSelectVillage = (item: PickerItem) => {
    const v = villages.find((vi) => vi.id === item.id) || null;
    setSelectedVillage(v);
    setCustomVillageName('');
    setActiveModal(null);
    notifyChange(selectedCountry, selectedState, selectedDistrict, selectedSubDistrict, v, '');
  };

  const handleCustomVillageSubmit = (customName: string) => {
    setSelectedVillage(null);
    setCustomVillageName(customName);
    setActiveModal(null);
    notifyChange(selectedCountry, selectedState, selectedDistrict, selectedSubDistrict, null, customName);
  };

  // Voice Assistant: "Pune, Haveli" or "Kolhapur, Karveer"
  const handleVoiceLocate = () => {
    if (isVoiceListening) {
      speechRecognitionService.stopListening();
      setIsVoiceListening(false);
      return;
    }

    setIsVoiceListening(true);
    voiceGuidance.speakHindi(
      'कृपया अपना ज़िला और तहसील या राज्य का नाम बोलिए।',
      undefined,
      async () => {
        try {
          const hasPerm = await speechRecognitionService.requestMicrophonePermission();
          if (!hasPerm) {
            setIsVoiceListening(false);
            return;
          }

          let capturedText = '';
          const targetLang = locale?.startsWith('mr')
            ? 'mr-IN'
            : locale?.startsWith('hi')
            ? 'hi-IN'
            : 'en-IN';

          const handleFinalSpoken = async (spokenRaw: string) => {
            const spoken = spokenRaw.trim();
            setIsVoiceListening(false);
            speechRecognitionService.stopListening();
            if (!spoken) return;

            const result = await locationService.parseVoiceLocation(spoken);
            if (result && result.stateId) {
              const s = states.find((st) => st.id === result.stateId) || null;
              setSelectedState(s);

              if (result.districtId) {
                const dList = await locationService.getDistricts(result.stateId);
                setDistricts(dList);
                const d = dList.find((dst) => dst.id === result.districtId) || null;
                setSelectedDistrict(d);

                if (result.subDistrictId && d) {
                  const sdList = await locationService.getSubDistricts(d.id);
                  setSubDistricts(sdList);
                  const sd = sdList.find((sdt) => sdt.id === result.subDistrictId) || null;
                  setSelectedSubDistrict(sd);

                  notifyChange(selectedCountry, s, d, sd, null, '');
                } else {
                  notifyChange(selectedCountry, s, d, null, null, '');
                }
              } else {
                notifyChange(selectedCountry, s, null, null, null, '');
              }
            }
          };

          speechRecognitionService.startListening(
            {
              onResult: (text: string, isFinal: boolean) => {
                capturedText = text;
                if (isFinal) {
                  handleFinalSpoken(text);
                }
              },
              onEnd: () => {
                if (capturedText) {
                  handleFinalSpoken(capturedText);
                } else {
                  setIsVoiceListening(false);
                }
              },
              onError: () => {
                setIsVoiceListening(false);
              },
            },
            targetLang
          );
        } catch {
          setIsVoiceListening(false);
        }
      }
    );
  };

  const getItemLabel = (item: { name: string; nameHi?: string; nameMr?: string; lgdCode?: number }) => {
    const localized = locationService.getLocalizedName(item, locale);
    const codeStr = item.lgdCode ? ` (LGD: ${item.lgdCode})` : '';
    if (localized !== item.name) {
      return `${localized} / ${item.name}${codeStr}`;
    }
    return `${item.name}${codeStr}`;
  };

  return (
    <View style={styles.container}>
      {/* Country Header & Voice Button */}
      <View style={styles.topRow}>
        <View style={styles.countryPill}>
          <Text variant="caption" weight="bold" color="#047857">
            🇮🇳 {selectedCountry ? locationService.getLocalizedName(selectedCountry, locale) : 'India'}
          </Text>
          <Text variant="caption" color="#059669" style={{ marginLeft: 4, fontSize: 10 }}>
            • National LGD
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleVoiceLocate}
          disabled={disabled || isVoiceListening}
          style={[styles.voiceBtn, { backgroundColor: lightBgColor }]}
          activeOpacity={0.8}
          accessibilityLabel="Voice location search"
        >
          {isVoiceListening ? (
            <ActivityIndicator size="small" color={accentColor} />
          ) : (
            <>
              <Icon name="microphone" size={15} color={accentColor} />
              <Text variant="caption" weight="bold" color={accentColor} style={{ marginLeft: 4 }}>
                🎙️ Bolkar Batayein
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* 1. STATE SELECTOR */}
      <View style={styles.fieldGroup}>
        <Text variant="caption" weight="bold" color="#475569" style={styles.fieldLabel}>
          STATE / राज्य
        </Text>
        <TouchableOpacity
          testID="location-state-btn"
          onPress={() => setActiveModal('STATE')}
          disabled={disabled}
          style={[
            styles.selectorBtn,
            selectedState && { borderColor: accentColor },
          ]}
          activeOpacity={0.8}
        >
          <View style={{ flex: 1 }}>
            {selectedState ? (
              <Text variant="bodyMedium" weight="bold" color="#0F172A">
                {getItemLabel(selectedState)}
              </Text>
            ) : (
              <Text variant="bodyMedium" color="#94A3B8">
                Select State / राज्य चुनें
              </Text>
            )}
          </View>
          {selectedState ? (
            <TouchableOpacity
              onPress={() => handleSelectState({ id: 0, name: '' })}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Icon name="close" size={16} color="#94A3B8" />
            </TouchableOpacity>
          ) : (
            <Icon name="chevronDown" size={16} color="#64748B" />
          )}
        </TouchableOpacity>
      </View>

      {/* 2. DISTRICT SELECTOR (Disabled until state selected) */}
      <View style={styles.fieldGroup}>
        <Text variant="caption" weight="bold" color="#475569" style={styles.fieldLabel}>
          DISTRICT / ज़िला
        </Text>
        <TouchableOpacity
          testID="location-district-btn"
          onPress={() => setActiveModal('DISTRICT')}
          disabled={disabled || !selectedState}
          style={[
            styles.selectorBtn,
            !selectedState && styles.selectorBtnDisabled,
            selectedDistrict && { borderColor: accentColor },
          ]}
          activeOpacity={0.8}
        >
          <View style={{ flex: 1 }}>
            {selectedDistrict ? (
              <Text variant="bodyMedium" weight="bold" color="#0F172A">
                {getItemLabel(selectedDistrict)}
              </Text>
            ) : (
              <Text variant="bodyMedium" color={selectedState ? '#94A3B8' : '#CBD5E1'}>
                {selectedState ? 'Select District / ज़िला चुनें' : 'Pehle State chunein'}
              </Text>
            )}
          </View>
          {selectedDistrict ? (
            <TouchableOpacity
              onPress={() => handleSelectDistrict({ id: 0, name: '' })}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Icon name="close" size={16} color="#94A3B8" />
            </TouchableOpacity>
          ) : (
            <Icon name="chevronDown" size={16} color={selectedState ? '#64748B' : '#CBD5E1'} />
          )}
        </TouchableOpacity>
      </View>

      {/* 3. SUB-DISTRICT / TALUKA SELECTOR (Optional / Role Dependent) */}
      {showSubDistrict && (
        <View style={styles.fieldGroup}>
          <Text variant="caption" weight="bold" color="#475569" style={styles.fieldLabel}>
            TALUKA / TEHSIL / तहसील
          </Text>
          <TouchableOpacity
            testID="location-subdistrict-btn"
            onPress={() => setActiveModal('SUB_DISTRICT')}
            disabled={disabled || !selectedDistrict}
            style={[
              styles.selectorBtn,
              !selectedDistrict && styles.selectorBtnDisabled,
              selectedSubDistrict && { borderColor: accentColor },
            ]}
            activeOpacity={0.8}
          >
            <View style={{ flex: 1 }}>
              {selectedSubDistrict ? (
                <Text variant="bodyMedium" weight="bold" color="#0F172A">
                  {getItemLabel(selectedSubDistrict)}
                </Text>
              ) : (
                <Text variant="bodyMedium" color={selectedDistrict ? '#94A3B8' : '#CBD5E1'}>
                  {selectedDistrict ? 'Select Taluka / तहसील चुनें' : 'Pehle District chunein'}
                </Text>
              )}
            </View>
            {selectedSubDistrict ? (
              <TouchableOpacity
                onPress={() => handleSelectSubDistrict({ id: 0, name: '' })}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Icon name="close" size={16} color="#94A3B8" />
              </TouchableOpacity>
            ) : (
              <Icon name="chevronDown" size={16} color={selectedDistrict ? '#64748B' : '#CBD5E1'} />
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* 4. VILLAGE / CLUSTER SELECTOR */}
      {showVillage && (
        <View style={styles.fieldGroup}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text variant="caption" weight="bold" color="#475569" style={styles.fieldLabel}>
              VILLAGE / CRAFT CLUSTER / गाँव
            </Text>
            <Text variant="caption" color="#94A3B8" style={{ fontSize: 11 }}>
              (Optional)
            </Text>
          </View>
          <TouchableOpacity
            testID="location-village-btn"
            onPress={() => setActiveModal('VILLAGE')}
            disabled={disabled || !selectedSubDistrict}
            style={[
              styles.selectorBtn,
              !selectedSubDistrict && styles.selectorBtnDisabled,
              (selectedVillage || customVillageName) && { borderColor: accentColor },
            ]}
            activeOpacity={0.8}
          >
            <View style={{ flex: 1 }}>
              {selectedVillage ? (
                <Text variant="bodyMedium" weight="bold" color="#0F172A">
                  {getItemLabel(selectedVillage)}
                </Text>
              ) : customVillageName ? (
                <Text variant="bodyMedium" weight="bold" color="#0F172A">
                  {customVillageName}
                </Text>
              ) : (
                <Text variant="bodyMedium" color={selectedSubDistrict ? '#94A3B8' : '#CBD5E1'}>
                  {selectedSubDistrict ? 'Select Village or search cluster' : 'Pehle Taluka chunein'}
                </Text>
              )}
            </View>
            {selectedVillage || customVillageName ? (
              <TouchableOpacity
                onPress={() => {
                  setSelectedVillage(null);
                  setCustomVillageName('');
                  notifyChange(selectedCountry, selectedState, selectedDistrict, selectedSubDistrict, null, '');
                }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Icon name="close" size={16} color="#94A3B8" />
              </TouchableOpacity>
            ) : (
              <Icon name="chevronDown" size={16} color={selectedSubDistrict ? '#64748B' : '#CBD5E1'} />
            )}
          </TouchableOpacity>
        </View>
      )}

      {helperText ? (
        <Text variant="caption" color="#64748B" style={{ marginTop: 6, fontSize: 11.5 }}>
          {helperText}
        </Text>
      ) : null}

      {/* STATE MODAL */}
      <SearchablePickerModal
        visible={activeModal === 'STATE'}
        title="Select State / राज्य चुनें"
        items={states.map((s) => ({
          id: s.id,
          name: s.name,
          nameHi: s.nameHi,
          nameMr: s.nameMr,
          lgdCode: s.lgdCode,
          subtitle: s.stateType,
        }))}
        selectedId={selectedState?.id}
        onSelect={handleSelectState}
        onClose={() => setActiveModal(null)}
        searchPlaceholder="Search State name or code..."
      />

      {/* DISTRICT MODAL */}
      <SearchablePickerModal
        visible={activeModal === 'DISTRICT'}
        title={selectedState ? `Districts in ${selectedState.name}` : 'Select District'}
        items={districts.map((d) => ({
          id: d.id,
          name: d.name,
          nameHi: d.nameHi,
          nameMr: d.nameMr,
          lgdCode: d.lgdCode,
        }))}
        selectedId={selectedDistrict?.id}
        onSelect={handleSelectDistrict}
        onClose={() => setActiveModal(null)}
        isLoading={isLoadingList}
        searchPlaceholder="Search District or LGD..."
      />

      {/* SUB-DISTRICT MODAL */}
      <SearchablePickerModal
        visible={activeModal === 'SUB_DISTRICT'}
        title={selectedDistrict ? `Talukas in ${selectedDistrict.name}` : 'Select Taluka / Tehsil'}
        items={subDistricts.map((sd) => ({
          id: sd.id,
          name: sd.name,
          nameHi: sd.nameHi,
          nameMr: sd.nameMr,
          lgdCode: sd.lgdCode,
          subtitle: sd.subDistrictType,
        }))}
        selectedId={selectedSubDistrict?.id}
        onSelect={handleSelectSubDistrict}
        onClose={() => setActiveModal(null)}
        isLoading={isLoadingList}
        searchPlaceholder="Search Taluka / Tehsil..."
      />

      {/* VILLAGE MODAL */}
      <SearchablePickerModal
        visible={activeModal === 'VILLAGE'}
        title={selectedSubDistrict ? `Villages & Clusters in ${selectedSubDistrict.name}` : 'Select Village / Cluster'}
        items={villages.map((v) => ({
          id: v.id,
          name: v.name,
          nameHi: v.nameHi,
          nameMr: v.nameMr,
          lgdCode: v.lgdCode,
          subtitle: v.craftSpecialty || (v.pincode ? `PIN: ${v.pincode}` : undefined),
          isCraftCluster: v.isCraftCluster,
        }))}
        selectedId={selectedVillage?.id}
        onSelect={handleSelectVillage}
        onClose={() => setActiveModal(null)}
        isLoading={isLoadingList}
        searchPlaceholder="Search village, cluster or PIN..."
        allowCustomInput={true}
        onCustomSubmit={handleCustomVillageSubmit}
        customButtonLabel="Add custom village / town"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  countryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 10,
    paddingVertical: 4.5,
    borderRadius: 14,
  },
  voiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(234, 88, 12, 0.25)',
  },
  fieldGroup: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 11,
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  selectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  selectorBtnDisabled: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
    opacity: 0.7,
  },
});
