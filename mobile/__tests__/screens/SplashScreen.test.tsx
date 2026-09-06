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

  it('renders brand subtitle and auto-redirects directly to MainTabs', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <SplashScreen navigation={mockNavigation} route={{} as any} />
      </ThemeProvider>
    );

    expect(getByText(/Direct from India's Master Artisans/i)).toBeTruthy();

    await waitFor(
      () => {
        expect(mockNavigation.replace).toHaveBeenCalledWith('MainTabs', {
          screen: 'HomeTab',
          params: { role: 'ARTISAN' },
        });
      },
      { timeout: 5000 }
    );
  });

  it('allows user to tap anywhere to navigate immediately to MainTabs', async () => {
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

    expect(mockNavigation.replace).toHaveBeenCalledWith('MainTabs', {
      screen: 'HomeTab',
      params: { role: 'ARTISAN' },
    });
  });

  it('does not render dev buttons or start buttons', async () => {
    const { queryByTestId } = await render(
      <ThemeProvider>
        <SplashScreen navigation={mockNavigation} route={{} as any} />
      </ThemeProvider>
    );

    expect(queryByTestId('dev-jump-artisan')).toBeNull();
    expect(queryByTestId('dev-jump-buyer')).toBeNull();
    expect(queryByTestId('dev-jump-admin')).toBeNull();
    expect(queryByTestId('splash-start-btn')).toBeNull();
  });
});

