import React, { act } from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AuthPhoneScreen } from '@/screens/auth/AuthPhoneScreen';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { useAuthStore } from '@/store/useAuthStore';

const mockNavigation: any = {
  navigate: jest.fn(),
  replace: jest.fn(),
  goBack: jest.fn(),
};

describe('AuthPhoneScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders phone input and quick test login button', async () => {
    const { getByText, getByTestId } = await render(
      <ThemeProvider>
        <AuthPhoneScreen
          navigation={mockNavigation}
          route={{ params: { role: 'ARTISAN' } } as any}
        />
      </ThemeProvider>
    );

    expect(getByText(/अपना मोबाइल नंबर दर्ज करें/)).toBeTruthy();
    expect(getByTestId('quick-demo-btn')).toBeTruthy();
  });

  it('performs 1-click instant login via test credentials', async () => {
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

    expect(mockNavigation.replace).toHaveBeenCalled();
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  it('allows entering digits via keypad and sending OTP', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <AuthPhoneScreen
          navigation={mockNavigation}
          route={{ params: { role: 'BUYER' } } as any}
        />
      </ThemeProvider>
    );

    // Enter 9876543210 via keypad
    const digits = ['9', '8', '7', '6', '5', '4', '3', '2', '1', '0'];
    for (const d of digits) {
      await act(async () => {
        fireEvent.press(getByText(d));
      });
    }

    await act(async () => {
      fireEvent.press(getByText('OTP कोड भेजें (Send OTP) →'));
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('OtpVerification', expect.objectContaining({
      phoneNumber: '9876543210',
      role: 'BUYER',
    }));
  });
});
