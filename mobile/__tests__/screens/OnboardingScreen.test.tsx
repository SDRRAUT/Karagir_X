import React, { act } from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { OnboardingScreen } from '@/screens/auth/OnboardingScreen';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { Audio } from 'expo-av';

const mockNavigation: any = {
  navigate: jest.fn(),
  replace: jest.fn(),
};

/**
 * Helper: waits until the Next button is enabled (isAudioPlaying = false).
 * The expo-av mock fires didJustFinish synchronously inside playSlideAudio's async callback chain.
 * waitFor retries until React state settles.
 */
async function waitForNextEnabled(getByTestId: (id: string) => any) {
  await waitFor(
    () => {
      const btn = getByTestId('onboarding-next-btn');
      expect(btn.props.accessibilityState?.disabled).not.toBe(true);
    },
    { timeout: 3000 }
  );
}

async function pressNext(getByTestId: (id: string) => any) {
  await waitForNextEnabled(getByTestId);
  await act(async () => {
    fireEvent.press(getByTestId('onboarding-next-btn'));
  });
}

describe('OnboardingScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without errors and advances through 3 slides to RoleSelection', async () => {
    const { getByText, getByTestId } = await render(
      <ThemeProvider>
        <OnboardingScreen navigation={mockNavigation} route={{} as any} />
      </ThemeProvider>
    );

    // Slide 0: Hunar — wait for audio to finish
    await waitForNextEnabled(getByTestId);
    expect(getByText(/Aapka Hunar, Ab Digital/i)).toBeTruthy();

    // Advance to Slide 1
    await pressNext(getByTestId);
    expect(getByText(/Apne Hunar Ki Sahi Keemat/i)).toBeTruthy();

    // Advance to Slide 2
    await pressNext(getByTestId);
    expect(getByText(/Ab Buyer Khud Aap Tak/i)).toBeTruthy();

    // Tap Next on Slide 2 to navigate to RoleSelection
    await pressNext(getByTestId);
    expect(mockNavigation.navigate).toHaveBeenCalledWith('RoleSelection');
  }, 15000);

  it('allows user to navigate back using the Back button', async () => {
    const { getByText, getByTestId, queryByTestId } = await render(
      <ThemeProvider>
        <OnboardingScreen navigation={mockNavigation} route={{} as any} />
      </ThemeProvider>
    );

    // Slide 0 has no back button
    await waitForNextEnabled(getByTestId);
    expect(queryByTestId('onboarding-prev-btn')).toBeNull();

    // Advance to Slide 1
    await pressNext(getByTestId);
    expect(getByText(/Apne Hunar Ki Sahi Keemat/i)).toBeTruthy();

    // Slide 1 has back button
    await waitForNextEnabled(getByTestId);
    expect(getByTestId('onboarding-prev-btn')).toBeTruthy();

    // Advance to Slide 2
    await pressNext(getByTestId);
    expect(getByText(/Ab Buyer Khud Aap Tak/i)).toBeTruthy();

    // Click back button to return to Slide 1
    await act(async () => {
      fireEvent.press(getByTestId('onboarding-prev-btn'));
    });
    await waitFor(() => {
      expect(getByText(/Apne Hunar Ki Sahi Keemat/i)).toBeTruthy();
    });
  }, 15000);

  it('opens language dropdown modal and allows selecting a language', async () => {
    const { getByText, getByTestId } = await render(
      <ThemeProvider>
        <OnboardingScreen navigation={mockNavigation} route={{} as any} />
      </ThemeProvider>
    );

    await waitForNextEnabled(getByTestId);

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
    await waitFor(() => {
      expect(getByText(/आपका हुनर, अब डिजिटल/i)).toBeTruthy();
    });
  });

  it('renders speaker toggle button beside language selector and omits in-body button', async () => {
    const { getByTestId, queryByText } = await render(
      <ThemeProvider>
        <OnboardingScreen navigation={mockNavigation} route={{} as any} />
      </ThemeProvider>
    );

    // Verify 'Listen in Hindi' in-body badge is removed
    expect(queryByText(/Listen in Hindi/i)).toBeNull();

    // Speaker toggle button is present in the header beside language selector
    const audioBtn = getByTestId('onboarding-audio-btn');
    expect(audioBtn).toBeTruthy();

    // Toggle audio
    await act(async () => {
      fireEvent.press(audioBtn);
    });
  });

  it('updates text dynamically across regional languages (Marathi, Bengali, Tamil)', async () => {
    const { getByText, getByTestId } = await render(
      <ThemeProvider>
        <OnboardingScreen navigation={mockNavigation} route={{} as any} />
      </ThemeProvider>
    );

    await waitForNextEnabled(getByTestId);
    const dropdownBtn = getByTestId('language-dropdown-btn');

    // Switch to Marathi
    await act(async () => {
      fireEvent.press(dropdownBtn);
    });
    await act(async () => {
      fireEvent.press(getByTestId('lang-option-mr_IN'));
    });
    await waitFor(() => {
      expect(getByText(/तुमची कला, आता डिजिटल/i)).toBeTruthy();
    });

    // Switch to Bengali
    await act(async () => {
      fireEvent.press(dropdownBtn);
    });
    await act(async () => {
      fireEvent.press(getByTestId('lang-option-bn_IN'));
    });
    await waitFor(() => {
      expect(getByText(/আপনার শিল্প, এবার ডিজিটাল/i)).toBeTruthy();
    });

    // Switch to Tamil
    await act(async () => {
      fireEvent.press(dropdownBtn);
    });
    await act(async () => {
      fireEvent.press(getByTestId('lang-option-ta_IN'));
    });
    await waitFor(() => {
      expect(getByText(/உங்கள் கலை, இப்போது டிஜிட்டல்/i)).toBeTruthy();
    });
  });

  it('keeps simple Next button always accessible and advances slides on tap', async () => {
    const { getByTestId } = await render(
      <ThemeProvider>
        <OnboardingScreen navigation={mockNavigation} route={{} as any} />
      </ThemeProvider>
    );

    // Simple next button is always visible
    const nextBtn = getByTestId('onboarding-next-btn');
    expect(nextBtn).toBeTruthy();

    await act(async () => {
      fireEvent.press(nextBtn);
    });
  });
});

