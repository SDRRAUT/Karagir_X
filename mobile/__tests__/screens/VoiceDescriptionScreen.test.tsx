import React, { act } from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { VoiceDescriptionScreen } from '@/screens/product/VoiceDescriptionScreen';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { useProductDraftStore } from '@/store/useProductDraftStore';

const mockNavigation: any = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

describe('VoiceDescriptionScreen', () => {
  beforeEach(() => {
    useProductDraftStore.getState().resetDraft();
    useProductDraftStore.getState().addPhoto({
      uri: 'file:///mock/photo.jpg',
      angle: 'FRONT',
      quality: 'GOOD',
    });
  });

  it('renders recording stage and processes recording on button press', async () => {
    const { getByText, getByTestId } = await render(
      <ThemeProvider>
        <VoiceDescriptionScreen navigation={mockNavigation} route={{} as any} />
      </ThemeProvider>
    );

    expect(getByText('Voice Story')).toBeTruthy();

    const recordBtn = getByTestId('record-voice-btn');

    // Start recording
    await act(async () => {
      fireEvent.press(recordBtn);
    });

    // Stop recording and process
    await act(async () => {
      fireEvent.press(recordBtn);
    });

    await waitFor(() => {
      expect(getByText(/Voice Summary:/)).toBeTruthy();
    });

    // Click continue
    const continueBtn = getByText(/Next: Voice Saathi Interview/);
    await act(async () => {
      fireEvent.press(continueBtn);
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('VoiceFollowUp');
  });
});
