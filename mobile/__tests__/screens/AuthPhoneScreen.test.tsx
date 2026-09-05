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

  it('renders quick demo login button and role selector', async () => {
    const { getByText, getByTestId } = await render(
      <ThemeProvider>
        <AuthPhoneScreen
          navigation={mockNavigation}
          route={{ params: { role: 'ARTISAN' } } as any}
        />
      </ThemeProvider>
    );

    expect(getByText(/CRAFT • CONNECT • GROW/)).toBeTruthy();
    expect(getByTestId('quick-demo-btn')).toBeTruthy();
  });

  it('performs 1-click instant login via test number and bypasses OTP verification', async () => {
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

    expect(mockNavigation.replace).toHaveBeenCalledWith('ProfileSetup', { role: 'ARTISAN' });
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().user?.phoneNumber).toBe('9876543210');
  });

  it('allows entering digits via keypad and logging in directly without OTP verification', async () => {
    const { getByText, getByTestId } = await render(
      <ThemeProvider>
        <AuthPhoneScreen
          navigation={mockNavigation}
          route={{ params: { role: 'BUYER' } } as any}
        />
      </ThemeProvider>
    );

    // Open keypad
    await act(async () => {
      fireEvent.press(getByText('🔢 कीपैड खोलें'));
    });

    // Enter 9876543210 via keypad
    const digits = ['9', '8', '7', '6', '5', '4', '3', '2', '1', '0'];
    for (const d of digits) {
      await act(async () => {
        fireEvent.press(getByText(d));
      });
    }

    await act(async () => {
      fireEvent.press(getByTestId('login-submit-btn'));
    });

    expect(mockNavigation.replace).toHaveBeenCalledWith('ProfileSetup', { role: 'BUYER' });
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });
});
