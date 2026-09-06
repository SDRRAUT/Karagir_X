import React, { act } from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { OtpVerificationScreen } from '@/screens/auth/OtpVerificationScreen';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { useAuthStore } from '@/store/useAuthStore';
import { voiceGuidance } from '@/utils/voiceGuidance';

const mockNavigation: any = {
  navigate: jest.fn(),
  replace: jest.fn(),
  goBack: jest.fn(),
};

describe('OtpVerificationScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modern 6-digit OTP UI and phone details', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <OtpVerificationScreen
          navigation={mockNavigation}
          route={{
            params: {
              phoneNumber: '9876543210',
              sessionId: 'test_sess_123',
              role: 'ARTISAN',
            },
          } as any}
        />
      </ThemeProvider>
    );

    expect(getByText('Number Verify Karein')).toBeTruthy();
    expect(getByText('OTP bheja gaya hai')).toBeTruthy();
    expect(getByText('+91 98765 43210')).toBeTruthy();
    expect(getByText(/Resend OTP in 00:/)).toBeTruthy();
  });

  it('auto-fills 6 digits and verifies successfully', async () => {
    const { getByText, getByTestId } = await render(
      <ThemeProvider>
        <OtpVerificationScreen
          navigation={mockNavigation}
          route={{
            params: {
              phoneNumber: '9876543210',
              sessionId: 'test_sess_123',
              role: 'ARTISAN',
            },
          } as any}
        />
      </ThemeProvider>
    );

    // Tap Auto-read pill
    await act(async () => {
      fireEvent.press(getByText('Auto-read'));
    });

    // Tap Verify button
    await act(async () => {
      fireEvent.press(getByTestId('verify-submit-btn'));
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      'ProfileSetup',
      expect.objectContaining({ role: 'ARTISAN' })
    );
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it('calls voiceGuidance when "OTP sunayein" is pressed', async () => {
    const speakSpy = jest.spyOn(voiceGuidance, 'speakHindi').mockImplementation(() => true);

    const { getByText } = await render(
      <ThemeProvider>
        <OtpVerificationScreen
          navigation={mockNavigation}
          route={{
            params: {
              phoneNumber: '9876543210',
              sessionId: 'test_sess_123',
              role: 'BUYER',
            },
          } as any}
        />
      </ThemeProvider>
    );

    await act(async () => {
      fireEvent.press(getByText('OTP sunayein'));
    });

    expect(speakSpy).toHaveBeenCalled();
    speakSpy.mockRestore();
  });

  it('allows user to go back and change mobile number', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <OtpVerificationScreen
          navigation={mockNavigation}
          route={{
            params: {
              phoneNumber: '9876543210',
              sessionId: 'test_sess_123',
              role: 'FACILITATOR',
            },
          } as any}
        />
      </ThemeProvider>
    );

    await act(async () => {
      fireEvent.press(getByText('Number change karein'));
    });

    expect(mockNavigation.goBack).toHaveBeenCalled();
  });
});
