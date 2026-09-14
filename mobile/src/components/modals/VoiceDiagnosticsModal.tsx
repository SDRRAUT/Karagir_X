import React, { useState, useEffect } from 'react';
import {
  View,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Text } from '@/components/typography/Text';
import { Card } from '@/components/cards/Card';
import { Button } from '@/components/buttons/Button';
import { useTheme } from '@/theme/ThemeProvider';
import {
  speechRecognitionService,
  SpeechDiagnostics,
} from '@/services/speechRecognitionService';
import { bhashiniService } from '@/services/bhashiniService';
import { useAppStore } from '@/store/useAppStore';

interface VoiceDiagnosticsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const VoiceDiagnosticsModal: React.FC<VoiceDiagnosticsModalProps> = ({
  visible,
  onClose,
}) => {
  const theme = useTheme();
  const { locale, isOnline } = useAppStore();

  const [diagnostics, setDiagnostics] = useState<SpeechDiagnostics | null>(null);
  const [bhashiniDiag, setBhashiniDiag] = useState<any>(null);
  const [testingMic, setTestingMic] = useState(false);
  const [testingSpeech, setTestingSpeech] = useState(false);
  const [testingBhashini, setTestingBhashini] = useState(false);
  const [testLog, setTestLog] = useState<string>('');

  const refreshDiagnostics = async () => {
    try {
      const diag = await speechRecognitionService.getDiagnostics();
      setDiagnostics(diag);
      const bDiag = bhashiniService.getDiagnostics();
      setBhashiniDiag(bDiag);
    } catch (e: any) {
      setTestLog(`Diagnostics refresh error: ${e?.message}`);
    }
  };

  useEffect(() => {
    if (visible) {
      refreshDiagnostics();
    }
  }, [visible]);

  const handleTestMic = async () => {
    setTestingMic(true);
    setTestLog('Requesting microphone permission...');
    try {
      const granted = await speechRecognitionService.requestMicrophonePermission();
      setTestLog(granted ? 'Microphone permission: GRANTED' : 'Microphone permission: DENIED');
      await refreshDiagnostics();
    } catch (err: any) {
      setTestLog(`Mic test error: ${err?.message}`);
    } finally {
      setTestingMic(false);
    }
  };

  const handleTestSpeech = async () => {
    setTestingSpeech(true);
    setTestLog('Starting 5-second native speech test... Speak now.');

    const activeLocale = locale === 'hi_IN' ? 'hi-IN' : locale === 'mr_IN' ? 'mr-IN' : 'en-IN';

    const started = speechRecognitionService.startListening(
      {
        onStart: () => {
          setTestLog('Listening started! Speak into microphone...');
        },
        onResult: (transcript, isFinal) => {
          setTestLog(`Transcript received (final=${isFinal}): "${transcript}"`);
        },
        onError: (err) => {
          setTestLog(`Speech error received: ${err}`);
          setTestingSpeech(false);
          refreshDiagnostics();
        },
        onEnd: () => {
          setTestLog((prev) => `${prev} [Speech ended]`);
          setTestingSpeech(false);
          refreshDiagnostics();
        },
      },
      activeLocale as any
    );

    if (!started) {
      setTestLog('Failed to initiate speech recognition. Module reported unavailable or denied.');
      setTestingSpeech(false);
      await refreshDiagnostics();
    } else {
      // Automatically stop after 6 seconds
      setTimeout(() => {
        speechRecognitionService.stopListening();
        setTestingSpeech(false);
        refreshDiagnostics();
      }, 6000);
    }
  };

  const handleTestBhashini = async () => {
    setTestingBhashini(true);
    setTestLog('Testing Bhashini translation service...');
    try {
      const res = await bhashiniService.translate('हस्तशिल्प', 'hi', 'en');
      setTestLog(
        `Bhashini result: "${res.sourceText}" -> "${res.translatedText}" (Engine: ${res.engine})`
      );
      await refreshDiagnostics();
    } catch (err: any) {
      setTestLog(`Bhashini test error: ${err?.message}`);
      await refreshDiagnostics();
    } finally {
      setTestingBhashini(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text variant="headlineSmall" weight="bold" color="#1e293b">
                Voice & Speech Diagnostics
              </Text>
              <Text variant="bodySmall" color="#64748b">
                Development & runtime diagnostic monitor
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* System Overview Card */}
            <Card style={styles.card} variant="outlined">
              <Text variant="bodyMedium" weight="bold" color="#0f172a" style={styles.cardTitle}>
                Runtime Environment
              </Text>

              <View style={styles.row}>
                <Text style={styles.label}>Platform:</Text>
                <Text style={styles.value}>{Platform.OS.toUpperCase()} (API {Platform.Version || 'N/A'})</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Native Speech Module:</Text>
                <Text
                  style={[
                    styles.value,
                    diagnostics?.moduleAvailable ? styles.textGreen : styles.textRed,
                  ]}
                >
                  {diagnostics?.moduleAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Microphone Permission:</Text>
                <Text
                  style={[
                    styles.value,
                    diagnostics?.permissionGranted ? styles.textGreen : styles.textAmber,
                  ]}
                >
                  {diagnostics?.permissionGranted ? 'GRANTED' : `DENIED (${diagnostics?.permissionStatus || 'unknown'})`}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Speech Recognition Engine:</Text>
                <Text
                  style={[
                    styles.value,
                    diagnostics?.isRecognitionAvailable ? styles.textGreen : styles.textRed,
                  ]}
                >
                  {diagnostics?.isRecognitionAvailable ? 'AVAILABLE' : 'DEVICE SPEECH ENGINE UNAVAILABLE'}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Internet Status:</Text>
                <Text style={[styles.value, isOnline ? styles.textGreen : styles.textRed]}>
                  {isOnline ? 'ONLINE' : 'OFFLINE'}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Selected Locale:</Text>
                <Text style={styles.value}>{locale}</Text>
              </View>
            </Card>

            {/* Android Speech Providers Card */}
            <Card style={styles.card} variant="outlined">
              <Text variant="bodyMedium" weight="bold" color="#0f172a" style={styles.cardTitle}>
                Android Speech Provider Packages
              </Text>

              <View style={styles.row}>
                <Text style={styles.label}>Default Service:</Text>
                <Text style={styles.value}>
                  {diagnostics?.defaultServicePackage || 'None detected'}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Assistant Service:</Text>
                <Text style={styles.value}>
                  {diagnostics?.assistantServicePackage || 'None detected'}
                </Text>
              </View>

              <View style={styles.col}>
                <Text style={styles.label}>Queried Service Packages:</Text>
                {diagnostics?.availableServices && diagnostics.availableServices.length > 0 ? (
                  diagnostics.availableServices.map((pkg, idx) => (
                    <Text key={idx} style={styles.codeText}>
                      • {pkg}
                    </Text>
                  ))
                ) : (
                  <Text style={styles.subtext}>
                    {Platform.OS === 'android'
                      ? 'No speech packages returned by PackageManager. (May need Speech Services by Google installed/enabled)'
                      : 'N/A on this platform'}
                  </Text>
                )}
              </View>
            </Card>

            {/* Speech State & Last Activity */}
            <Card style={styles.card} variant="outlined">
              <Text variant="bodyMedium" weight="bold" color="#0f172a" style={styles.cardTitle}>
                Recent Speech Recognition Activity
              </Text>

              <View style={styles.row}>
                <Text style={styles.label}>Last Event:</Text>
                <Text style={styles.value}>{diagnostics?.lastEvent || 'None'}</Text>
              </View>

              <View style={styles.col}>
                <Text style={styles.label}>Last Native Speech Error:</Text>
                <Text style={[styles.value, diagnostics?.lastError ? styles.textAmber : styles.textMuted]}>
                  {diagnostics?.lastError || 'No error recorded'}
                </Text>
              </View>

              <View style={styles.col}>
                <Text style={styles.label}>Last Transcript:</Text>
                <Text style={[styles.codeText, { fontStyle: 'italic' }]}>
                  {diagnostics?.lastTranscript ? `"${diagnostics.lastTranscript}"` : 'None'}
                </Text>
              </View>
            </Card>

            {/* Bhashini Gateway Card */}
            <Card style={styles.card} variant="outlined">
              <Text variant="bodyMedium" weight="bold" color="#0f172a" style={styles.cardTitle}>
                Digital India Bhashini Gateway
              </Text>

              <View style={styles.row}>
                <Text style={styles.label}>Bhashini Cloud Config:</Text>
                <Text
                  style={[
                    styles.value,
                    bhashiniDiag?.isConfigured ? styles.textGreen : styles.textAmber,
                  ]}
                >
                  {bhashiniDiag?.isConfigured ? 'CONFIGURED' : 'UNCONFIGURED (Offline Indic Fallback)'}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Endpoint URL:</Text>
                <Text style={styles.codeText}>{bhashiniDiag?.endpointUrl || 'N/A'}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>Last HTTP Status:</Text>
                <Text style={styles.value}>
                  {bhashiniDiag?.lastHttpStatus ? `HTTP ${bhashiniDiag.lastHttpStatus}` : 'None'}
                </Text>
              </View>

              <View style={styles.col}>
                <Text style={styles.label}>Last Bhashini Note / Error:</Text>
                <Text style={[styles.value, styles.textMuted]}>
                  {bhashiniDiag?.lastError || 'None'}
                </Text>
              </View>
            </Card>

            {/* Live Interactive Tests */}
            <Card style={styles.card} variant="outlined">
              <Text variant="bodyMedium" weight="bold" color="#0f172a" style={styles.cardTitle}>
                Diagnostic Actions
              </Text>

              <View style={styles.buttonRow}>
                <Button
                  label={testingMic ? 'Checking...' : 'Test Microphone'}
                  onPress={handleTestMic}
                  variant="outlined"
                  size="sm"
                  disabled={testingMic || testingSpeech}
                />
                <Button
                  label={testingSpeech ? 'Listening (6s)...' : 'Test Native Speech'}
                  onPress={handleTestSpeech}
                  variant="filled"
                  size="sm"
                  disabled={testingMic || testingSpeech}
                />
                <Button
                  label={testingBhashini ? 'Testing...' : 'Test Bhashini'}
                  onPress={handleTestBhashini}
                  variant="tonal"
                  size="sm"
                  disabled={testingBhashini}
                />
              </View>

              {testLog ? (
                <View style={styles.logBox}>
                  <Text style={styles.logText}>{testLog}</Text>
                </View>
              ) : null}
            </Card>
          </ScrollView>

          <View style={styles.footer}>
            <Button label="Refresh Diagnostics" variant="ghost" size="sm" onPress={refreshDiagnostics} />
            <Button label="Close" variant="filled" size="sm" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalBox: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderColor: '#e2e8f0',
  },
  cardTitle: {
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  col: {
    paddingVertical: 4,
  },
  label: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  subtext: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 12,
    color: '#334155',
  },
  textGreen: {
    color: '#16a34a',
  },
  textAmber: {
    color: '#d97706',
  },
  textRed: {
    color: '#dc2626',
  },
  textMuted: {
    color: '#64748b',
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 8,
  },
  logBox: {
    backgroundColor: '#1e293b',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  logText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 12,
    color: '#38bdf8',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#ffffff',
  },
});
