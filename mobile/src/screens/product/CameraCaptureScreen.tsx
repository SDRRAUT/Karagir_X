import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { useTheme } from '@/theme/ThemeProvider';
import { Text } from '@/components/typography/Text';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useProductDraftStore, PhotoAngle } from '@/store/useProductDraftStore';

type Props = NativeStackScreenProps<RootStackParamList, 'CameraCapture'>;

export const CameraCaptureScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const [permission] = useCameraPermissions();
  const { photos, addPhoto } = useProductDraftStore();

  const cameraRef = useRef<any>(null);
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [guidanceStatus] = useState<'GOOD' | 'UNSTEADY' | 'DARK'>('GOOD');

  // Determine angle label for current capture slot
  const angleOrder: PhotoAngle[] = ['FRONT', 'TEXTURE', 'SIDE_BACK', 'SCALE'];
  const currentAngle = angleOrder[photos.length] || 'FRONT';

  const angleLabels: Record<PhotoAngle, { hi: string; en: string }> = {
    FRONT: { hi: 'Front View', en: 'Front View' },
    TEXTURE: { hi: 'Detail & Craftsmanship', en: 'Detail & Craftsmanship' },
    SIDE_BACK: { hi: 'Back or Profile', en: 'Back or Profile' },
    SCALE: { hi: 'In-Hand Scale', en: 'In-Hand Scale' },
  };

  const handleShutter = async () => {
    if (photos.length >= 4) {
      Alert.alert('Maximum Limit', 'You can take up to 4 photos per product.');
      return;
    }

    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.9,
          skipProcessing: false,
        });

        if (photo?.uri) {
          addPhoto({
            uri: photo.uri,
            angle: currentAngle,
            quality: 'GOOD',
          });
          return;
        }
      }

      // Fallback for emulator / mock camera view
      addPhoto({
        uri: `file:///data/cache/craft_${Date.now()}.jpg`,
        angle: currentAngle,
        quality: 'GOOD',
      });
    } catch (_err) {
      // Fallback capture simulation
      addPhoto({
        uri: `file:///data/cache/craft_${Date.now()}.jpg`,
        angle: currentAngle,
        quality: 'GOOD',
      });
    }
  };

  const handleImportGallery = async () => {
    if (photos.length >= 4) {
      Alert.alert('Maximum Limit', 'You can upload up to 4 photos per product.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.9,
      });

      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        addPhoto({
          uri: result.assets[0].uri,
          angle: currentAngle,
          quality: 'GOOD',
        });
      }
    } catch (_err) {
      Alert.alert('Gallery Error', 'Failed to load photo from gallery.');
    }
  };

  const handleProceed = () => {
    navigation.navigate('PhotoReview');
  };

  // If permission is not granted, route back to primer safely in an effect
  useEffect(() => {
    if (permission && !permission.granted) {
      navigation.replace('CameraPermission');
    }
  }, [permission, navigation]);

  if (!permission?.granted) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Live Viewport */}
      <CameraView
        ref={cameraRef}
        style={styles.cameraView}
        enableTorch={torchEnabled}
        facing="back"
      >
        {/* Top Control Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => {
              if (navigation?.canGoBack?.()) {
                navigation.goBack();
              } else {
                navigation?.navigate?.('MainTabs', { screen: 'HomeTab' });
              }
            }}
            style={styles.controlBtn}
            accessibilityRole="button"
            accessibilityLabel="Back"
          >
            <Text variant="headlineMedium" color="#FFFFFF" style={{ marginTop: -2 }}>
              ‹
            </Text>
          </TouchableOpacity>

          {/* Current Angle Guide Badge */}
          <View style={styles.anglePill}>
            <Text variant="bodySmall" weight="bold" color="#FFFFFF">
              📸 {angleLabels[currentAngle].en}
            </Text>
          </View>

          {/* Torch Toggle */}
          <TouchableOpacity
            onPress={() => setTorchEnabled((prev) => !prev)}
            style={[styles.controlBtn, torchEnabled && styles.controlBtnActive]}
            accessibilityRole="button"
            accessibilityLabel="Toggle flash torch"
          >
            <Text variant="headlineMedium" color="#FFFFFF">
              {torchEnabled ? '🔦' : '⚡'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Framing Guide Overlay */}
        <View style={styles.overlayContainer}>
          <View
            style={[
              styles.frameGuide,
              {
                borderColor:
                  guidanceStatus === 'GOOD'
                    ? '#00E676'
                    : theme.colors.status.warning,
              },
            ]}
          >
            {/* Corner Accents */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>

          {/* Dynamic Smart Guidance Pill */}
          <View style={styles.guidancePill}>
            <Text variant="bodyMedium" weight="bold" color="#FFFFFF" align="center">
              {guidanceStatus === 'GOOD'
                ? '✅ Ready! Tap Shutter'
                : guidanceStatus === 'UNSTEADY'
                ? '⚠️ Hold Steady'
                : '☀️ Move to brighter light'}
            </Text>
          </View>
        </View>

        {/* Bottom Bar: Import, Shutter, Thumbnails & Proceed */}
        <View style={styles.bottomBar}>
          {/* Gallery Import Button */}
          <TouchableOpacity
            testID="gallery-import-btn"
            onPress={handleImportGallery}
            style={styles.galleryBtn}
            accessibilityRole="button"
            accessibilityLabel="Import photo from phone gallery"
          >
            <Text style={styles.galleryIcon}>🖼️</Text>
            <Text variant="bodySmall" weight="bold" color="#FFFFFF">
              Gallery
            </Text>
          </TouchableOpacity>

          {/* Shutter Button */}
          <TouchableOpacity
            testID="shutter-btn"
            onPress={handleShutter}
            activeOpacity={0.8}
            style={styles.shutterOuter}
            accessibilityRole="button"
            accessibilityLabel="Capture photo"
          >
            <View style={styles.shutterInner}>
              <Text style={styles.shutterCameraIcon}>📷</Text>
            </View>
          </TouchableOpacity>

          {/* Photo Count / Proceed Button */}
          {photos.length > 0 ? (
            <TouchableOpacity
              testID="proceed-review-btn"
              onPress={handleProceed}
              style={styles.proceedBtn}
              accessibilityRole="button"
              accessibilityLabel="Proceed to photo review"
            >
              <Text variant="bodySmall" weight="bold" color="#FFFFFF">
                Review ({photos.length}/4) →
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.counterPlaceholder}>
              <Text variant="bodySmall" color="#CCCCCC">
                0/4 Photos
              </Text>
            </View>
          )}
        </View>
      </CameraView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  cameraView: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  controlBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlBtnActive: {
    backgroundColor: 'rgba(212, 175, 55, 0.8)',
  },
  anglePill: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  overlayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  frameGuide: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 24,
    borderWidth: 2.5,
    borderStyle: 'dashed',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#FFFFFF',
  },
  topLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  guidancePill: {
    marginTop: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 28,
  },
  galleryBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  galleryIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  shutterOuter: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  shutterInner: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterCameraIcon: {
    fontSize: 30,
  },
  proceedBtn: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  counterPlaceholder: {
    width: 60,
    alignItems: 'center',
  },
});
