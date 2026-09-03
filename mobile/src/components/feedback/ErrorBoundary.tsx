import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/typography/Text';
import { Button } from '@/components/buttons/Button';
import { logger } from '@/utils/logger';

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error('CRASH_BOUNDARY', 'Unhandled application exception caught', error, {
      componentStack: errorInfo.componentStack,
    });
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: undefined });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <Text style={styles.icon}>🏺</Text>
            <Text variant="headlineLarge" weight="bold" color="#1A1C1E" style={styles.title}>
              चिंता न करें! (Don't Worry)
            </Text>
            <Text variant="bodyLarge" color="#49454F" style={styles.message}>
              कोई डाटा गायब नहीं हुआ है। कृपया दोबारा कोशिश करें।
            </Text>
            <Text variant="bodyMedium" color="#79747E" style={styles.subMessage}>
              Your data is safe on your phone. Please tap below to reload.
            </Text>

            <Button
              label="दोबारा कोशिश करें (Retry)"
              variant="primary"
              onPress={this.handleReset}
              style={styles.retryButton}
            />
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F6F0',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  icon: {
    fontSize: 72,
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subMessage: {
    textAlign: 'center',
    marginBottom: 32,
  },
  retryButton: {
    minWidth: 240,
  },
});
