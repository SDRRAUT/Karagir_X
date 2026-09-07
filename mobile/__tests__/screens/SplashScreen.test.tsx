import React, { act } from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SplashScreen } from '@/screens/auth/SplashScreen';
import { ThemeProvider } from '@/theme/ThemeProvider';

const mockNavigation: any = {
  navigate: jest.fn(),
  replace: jest.fn(),
};

describe('SplashScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders brand subtitle and auto-navigates to Onboarding after audio finishes', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <SplashScreen navigation={mockNavigation} route={{} as any} />
      </ThemeProvider>
    );

    expect(getByText(/Direct from India's Master Artisans/i)).toBeTruthy();

    // With the expo-av mock, audio fires didJustFinish synchronously.
    // Navigation happens after delay. Use waitFor to catch it.
    await waitFor(
      () => {
        expect(mockNavigation.replace).toHaveBeenCalledWith('Onboarding');
      },
      { timeout: 5000 }
    );
  });

  it('allows user to tap anywhere to navigate immediately to Onboarding without any prompt', async () => {
    const { getByTestId, queryByText } = await render(
      <ThemeProvider>
        <SplashScreen navigation={mockNavigation} route={{} as any} />
      </ThemeProvider>
    );

    // Verify 'Tap to continue' is not rendered
    expect(queryByText(/Tap to continue/i)).toBeNull();

    // User can tap anywhere on screen to smoothly proceed
    await act(async () => {
      fireEvent.press(getByTestId('splash-touchable'));
    });

    expect(mockNavigation.replace).toHaveBeenCalledWith('Onboarding');
  });

  it('allows user to press Get Started button to navigate to Onboarding', async () => {
    const { getByTestId } = await render(
      <ThemeProvider>
        <SplashScreen navigation={mockNavigation} route={{} as any} />
      </ThemeProvider>
    );

    await act(async () => {
      fireEvent.press(getByTestId('splash-start-btn'));
    });

    expect(mockNavigation.replace).toHaveBeenCalledWith('Onboarding');
  });
});
