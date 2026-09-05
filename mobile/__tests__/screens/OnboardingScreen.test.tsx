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

    expect(getByText(/Aapka Hunar, Ab Digital/i)).toBeTruthy();

    // Tap continue to go to slide 2
    await act(async () => {
      fireEvent.press(getByTestId('onboarding-next-btn'));
    });
    expect(getByText(/Apne Hunar Ki Sahi Keemat/i)).toBeTruthy();

    // Tap continue to go to slide 3
    await act(async () => {
      fireEvent.press(getByTestId('onboarding-next-btn'));
    });
    expect(getByText(/Ab Buyer Khud Aap Tak/i)).toBeTruthy();

    // Tap Get Started to navigate to AuthPhone
    await act(async () => {
      fireEvent.press(getByTestId('onboarding-next-btn'));
    });
    expect(mockNavigation.replace).toHaveBeenCalledWith('AuthPhone', { role: 'ARTISAN' });
  });

  it('allows user to navigate back using the Back button', async () => {
    const { getByText, getByTestId, queryByTestId } = await render(
      <ThemeProvider>
        <OnboardingScreen navigation={mockNavigation} route={{} as any} />
      </ThemeProvider>
    );

    // Slide 1 has no back button
    expect(queryByTestId('onboarding-prev-btn')).toBeNull();

    // Advance to Slide 2
    await act(async () => {
      fireEvent.press(getByTestId('onboarding-next-btn'));
    });
    expect(getByText(/Apne Hunar Ki Sahi Keemat/i)).toBeTruthy();

    // Slide 2 has back button
    expect(getByTestId('onboarding-prev-btn')).toBeTruthy();

    // Click back button to return to Slide 1
    await act(async () => {
      fireEvent.press(getByTestId('onboarding-prev-btn'));
    });
    expect(getByText(/Aapka Hunar, Ab Digital/i)).toBeTruthy();
  });

  it('opens language dropdown modal and allows selecting a language', async () => {
    const { getByText, getByTestId } = await render(
      <ThemeProvider>
        <OnboardingScreen navigation={mockNavigation} route={{} as any} />
      </ThemeProvider>
    );

    // Dropdown trigger is rendered in top right (replacing Skip)
    const dropdownBtn = getByTestId('language-dropdown-btn');
    expect(dropdownBtn).toBeTruthy();

    // Open language dropdown modal
    await act(async () => {
      fireEvent.press(dropdownBtn);
    });
    expect(getByText(/भाषा चुनें \/ Select Language/i)).toBeTruthy();

    // Choose Hindi
    await act(async () => {
      fireEvent.press(getByTestId('lang-option-hi_IN'));
    });
  });
});
