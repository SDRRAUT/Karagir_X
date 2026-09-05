import React, { act } from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { OnboardingScreen } from '@/screens/auth/OnboardingScreen';
import { ThemeProvider } from '@/theme/ThemeProvider';

const mockNavigation: any = {
  navigate: jest.fn(),
  replace: jest.fn(),
};

describe('OnboardingScreen', () => {
  it('renders without errors and advances through slides', async () => {
    const { getByText, getByTestId } = await render(
      <ThemeProvider>
        <OnboardingScreen navigation={mockNavigation} route={{} as any} />
      </ThemeProvider>
    );

    expect(getByText(/1 Photo = Instant/i)).toBeTruthy();

    // Tap continue to go to slide 2
    await act(async () => {
      fireEvent.press(getByTestId('onboarding-next-btn'));
    });
    expect(getByText(/Speak Naturally/i)).toBeTruthy();

    // Tap continue to go to slide 3
    await act(async () => {
      fireEvent.press(getByTestId('onboarding-next-btn'));
    });
    expect(getByText(/Doorstep Pickup/i)).toBeTruthy();

    // Tap Get Started to navigate to AuthPhone
    await act(async () => {
      fireEvent.press(getByTestId('onboarding-next-btn'));
    });
    expect(mockNavigation.replace).toHaveBeenCalledWith('AuthPhone', { role: 'ARTISAN' });
  });
});
