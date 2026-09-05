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

    expect(getByText(/Voice Saathi • AI Interview/)).toBeTruthy();
    expect(getByText(/Voice Saathi • AI Craft Interviewer/)).toBeTruthy();

    // Tap first quick answer option
    const firstOption = getByText(/1 Day \(8 Hours\)/);
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

    const skipBtn = getByText(/Skip →/);
    await act(async () => {
      fireEvent.press(skipBtn);
    });

    expect(getByText(/Voice Saathi • AI Interview \(2\/3\)/)).toBeTruthy();
  });
});
