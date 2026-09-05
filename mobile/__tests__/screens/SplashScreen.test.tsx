import React, { act } from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SplashScreen } from '@/screens/auth/SplashScreen';
import { ThemeProvider } from '@/theme/ThemeProvider';

const mockNavigation: any = {
  navigate: jest.fn(),
  replace: jest.fn(),
};

describe('SplashScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders brand subtitle and handles press to skip', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <SplashScreen navigation={mockNavigation} route={{} as any} />
      </ThemeProvider>
    );

    expect(getByText(/Direct from India's Master Artisans/i)).toBeTruthy();
    expect(getByText(/Tap to continue/i)).toBeTruthy();

    // Fast-forward timers to 3.0s
    await act(async () => {
      jest.advanceTimersByTime(3000);
    });

    expect(mockNavigation.replace).toHaveBeenCalledWith('Onboarding');
  });

  it('allows user to tap anywhere to transition immediately to Onboarding', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <SplashScreen navigation={mockNavigation} route={{} as any} />
      </ThemeProvider>
    );

    await act(async () => {
      fireEvent.press(getByText(/Tap to continue/i));
    });

    expect(mockNavigation.replace).toHaveBeenCalledWith('Onboarding');
  });
});
