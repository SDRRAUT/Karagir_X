import React, { act } from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { VoiceFollowUpScreen } from '@/screens/product/VoiceFollowUpScreen';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { useProductDraftStore } from '@/store/useProductDraftStore';

const mockNavigation: any = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

describe('VoiceFollowUpScreen', () => {
  beforeEach(() => {
    useProductDraftStore.getState().resetDraft();
  });

  it('renders interview questions and progresses through answers', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <VoiceFollowUpScreen navigation={mockNavigation} route={{} as any} />
      </ThemeProvider>
    );

    expect(getByText(/AI सवाल-जवाब/)).toBeTruthy();
    expect(getByText(/कलाकार सहायक/)).toBeTruthy();

    // Tap first quick answer option
    const firstOption = getByText(/1 दिन/);
    await act(async () => {
      fireEvent.press(firstOption);
    });

    // Check store recorded the answer
    expect(useProductDraftStore.getState().interviewAnswers['labor_time']).toBe(8);
  });

  it('allows skipping question', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <VoiceFollowUpScreen navigation={mockNavigation} route={{} as any} />
      </ThemeProvider>
    );

    const skipBtn = getByText(/छोड़ें/);
    await act(async () => {
      fireEvent.press(skipBtn);
    });

    expect(getByText(/AI सवाल-जवाब \(2\/3\)/)).toBeTruthy();
  });
});
