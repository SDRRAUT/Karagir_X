import React, { act } from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { OnboardingScreen } from '@/screens/auth/OnboardingScreen';
import { ThemeProvider } from '@/theme/ThemeProvider';

const mockNavigation: any = {
  navigate: jest.fn(),
  replace: jest.fn(),
};

describe('OnboardingScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without errors and advances through 4 slides to role selection as Artisan', async () => {
    const { getByText, getByTestId } = await render(
      <ThemeProvider>
        <OnboardingScreen navigation={mockNavigation} route={{} as any} />
      </ThemeProvider>
    );

    // Slide 0: Hunar
    expect(getByText(/Aapka Hunar, Ab Digital/i)).toBeTruthy();

    // Advance to Slide 1
    await act(async () => {
      fireEvent.press(getByTestId('onboarding-next-btn'));
    });
    expect(getByText(/Apne Hunar Ki Sahi Keemat/i)).toBeTruthy();

    // Advance to Slide 2
    await act(async () => {
      fireEvent.press(getByTestId('onboarding-next-btn'));
    });
    expect(getByText(/Ab Buyer Khud Aap Tak/i)).toBeTruthy();

    // Advance to Slide 3: Role Selection Screen
    await act(async () => {
      fireEvent.press(getByTestId('onboarding-next-btn'));
    });
    expect(getByText(/Apna Role Chunein/i)).toBeTruthy();
    expect(getByTestId('role-card-ARTISAN')).toBeTruthy();
    expect(getByTestId('role-card-BUYER')).toBeTruthy();
    expect(getByTestId('role-card-FACILITATOR')).toBeTruthy();

    // Default selected role is ARTISAN, CTA reflects Artisan
    expect(getByText(/Artisan Safar Shuru Karein/i)).toBeTruthy();

    // Tap CTA to navigate to AuthPhone with role ARTISAN
    await act(async () => {
      fireEvent.press(getByTestId('onboarding-next-btn'));
    });
    expect(mockNavigation.replace).toHaveBeenCalledWith('AuthPhone', { role: 'ARTISAN' });
  });

  it('allows selecting Buyer role and navigates with BUYER role', async () => {
    const { getByText, getByTestId } = await render(
      <ThemeProvider>
        <OnboardingScreen navigation={mockNavigation} route={{} as any} />
      </ThemeProvider>
    );

    // Advance to Slide 3 (Role Selection)
    await act(async () => {
      fireEvent.press(getByTestId('onboarding-next-btn'));
    });
    await act(async () => {
      fireEvent.press(getByTestId('onboarding-next-btn'));
    });
    await act(async () => {
      fireEvent.press(getByTestId('onboarding-next-btn'));
    });

    expect(getByText(/Apna Role Chunein/i)).toBeTruthy();

    // Tap Buyer role card
    await act(async () => {
      fireEvent.press(getByTestId('role-card-BUYER'));
    });

    // Button should now show Buyer CTA
    expect(getByText(/Buyer Portal Me Jaayein/i)).toBeTruthy();

    // Proceed to AuthPhone
    await act(async () => {
      fireEvent.press(getByTestId('onboarding-next-btn'));
    });
    expect(mockNavigation.replace).toHaveBeenCalledWith('AuthPhone', { role: 'BUYER' });
  });

  it('allows selecting Sahyogi role and navigates with FACILITATOR role', async () => {
    const { getByText, getByTestId } = await render(
      <ThemeProvider>
        <OnboardingScreen navigation={mockNavigation} route={{} as any} />
      </ThemeProvider>
    );

    // Advance to Slide 3 (Role Selection)
    await act(async () => {
      fireEvent.press(getByTestId('onboarding-next-btn'));
    });
    await act(async () => {
      fireEvent.press(getByTestId('onboarding-next-btn'));
    });
    await act(async () => {
      fireEvent.press(getByTestId('onboarding-next-btn'));
    });

    // Tap Sahyogi role card
    await act(async () => {
      fireEvent.press(getByTestId('role-card-FACILITATOR'));
    });

    // Button should now show Sahyogi CTA
    expect(getByText(/Sahyogi Desk Shuru Karein/i)).toBeTruthy();

    // Proceed to AuthPhone
    await act(async () => {
      fireEvent.press(getByTestId('onboarding-next-btn'));
    });
    expect(mockNavigation.replace).toHaveBeenCalledWith('AuthPhone', { role: 'FACILITATOR' });
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

    // Advance to Slide 3
    await act(async () => {
      fireEvent.press(getByTestId('onboarding-next-btn'));
    });
    expect(getByText(/Ab Buyer Khud Aap Tak/i)).toBeTruthy();

    // Advance to Slide 4 (Role Selection)
    await act(async () => {
      fireEvent.press(getByTestId('onboarding-next-btn'));
    });
    expect(getByText(/Apna Role Chunein/i)).toBeTruthy();

    // Click back button to return to Slide 3
    await act(async () => {
      fireEvent.press(getByTestId('onboarding-prev-btn'));
    });
    expect(getByText(/Ab Buyer Khud Aap Tak/i)).toBeTruthy();
  });

  it('opens language dropdown modal and allows selecting a language', async () => {
    const { getByText, getByTestId } = await render(
      <ThemeProvider>
        <OnboardingScreen navigation={mockNavigation} route={{} as any} />
      </ThemeProvider>
    );

    // Dropdown trigger is rendered in top right
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
    expect(getByText(/आपका हुनर, अब डिजिटल/i)).toBeTruthy();
  });
});
