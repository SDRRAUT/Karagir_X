import React, { act } from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AuthPhoneScreen } from '@/screens/auth/AuthPhoneScreen';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/api/authService';

const mockNavigation: any = {
  navigate: jest.fn(),
  replace: jest.fn(),
  goBack: jest.fn(),
};

describe('AuthPhoneScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders quick demo login button and segmented tab options for Mobile and Email', async () => {
    const { getByText, getByTestId } = await render(
      <ThemeProvider>
        <AuthPhoneScreen
          navigation={mockNavigation}
          route={{ params: { role: 'ARTISAN' } } as any}
        />
      </ThemeProvider>
    );

    expect(getByTestId('tab-mobile-btn')).toBeTruthy();
    expect(getByTestId('tab-email-btn')).toBeTruthy();
    expect(getByText(/Mobile Number/)).toBeTruthy();
    expect(getByText(/Email Address/)).toBeTruthy();
    expect(getByTestId('quick-demo-btn')).toBeTruthy();
  });

  it('triggers OTP dispatch and navigates to OtpVerification when quick demo is pressed', async () => {
    const { getByTestId } = await render(
      <ThemeProvider>
        <AuthPhoneScreen
          navigation={mockNavigation}
          route={{ params: { role: 'ARTISAN' } } as any}
        />
      </ThemeProvider>
    );

    await act(async () => {
      fireEvent.press(getByTestId('quick-demo-btn'));
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      'OtpVerification',
      expect.objectContaining({
        phoneNumber: '9876543210',
        role: 'ARTISAN',
      })
    );
  });

  it('switches between Mobile and Email panels on the same screen without route change', async () => {
    const { getByTestId, queryByTestId } = await render(
      <ThemeProvider>
        <AuthPhoneScreen
          navigation={mockNavigation}
          route={{ params: { role: 'ARTISAN' } } as any}
        />
      </ThemeProvider>
    );

    // Initially in mobile mode
    expect(getByTestId('phone-input')).toBeTruthy();
    expect(queryByTestId('email-input')).toBeNull();

    // Switch to Email tab
    await act(async () => {
      fireEvent.press(getByTestId('tab-email-btn'));
    });

    // Does not navigate to any other screen
    expect(mockNavigation.navigate).not.toHaveBeenCalled();
    expect(mockNavigation.replace).not.toHaveBeenCalled();

    // Now Email input is displayed
    expect(getByTestId('email-input')).toBeTruthy();
    expect(queryByTestId('phone-input')).toBeNull();
  });

  it('allows logging in with email and password', async () => {
    jest.spyOn(authService, 'loginWithEmail').mockResolvedValueOnce({
      access_token: 'mock_token',
      refresh_token: 'mock_refresh',
      expires_in_seconds: 3600,
      is_new_user: true,
      user: {
        id: 'usr_test_email_123',
        phoneNumber: '',
        fullName: 'कारीगर',
        role: 'ARTISAN',
        preferredLanguage: 'hi_IN',
        isProfileComplete: false,
      },
    });

    const { getByTestId } = await render(
      <ThemeProvider>
        <AuthPhoneScreen
          navigation={mockNavigation}
          route={{ params: { role: 'ARTISAN' } } as any}
        />
      </ThemeProvider>
    );

    // Switch to Email tab
    await act(async () => {
      fireEvent.press(getByTestId('tab-email-btn'));
    });

    // Enter email & password
    await act(async () => {
      fireEvent.changeText(getByTestId('email-input'), 'artisan@kalakarsetu.com');
      fireEvent.changeText(getByTestId('password-input'), 'Secret123');
    });

    // Submit email login
    await act(async () => {
      fireEvent.press(getByTestId('email-submit-btn'));
    });

    expect(authService.loginWithEmail).toHaveBeenCalledWith(
      'artisan@kalakarsetu.com',
      'Secret123',
      'ARTISAN'
    );
    expect(mockNavigation.navigate).toHaveBeenCalledWith(
      'ProfileSetup',
      expect.objectContaining({ role: 'ARTISAN' })
    );
  });
});
