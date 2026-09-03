import React, { act } from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { AiEnhancementScreen } from '@/screens/product/AiEnhancementScreen';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { useProductDraftStore } from '@/store/useProductDraftStore';

const mockNavigation: any = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

describe('AiEnhancementScreen', () => {
  beforeEach(() => {
    useProductDraftStore.getState().resetDraft();
    useProductDraftStore.getState().addPhoto({
      uri: 'file:///mock/photo1.jpg',
      angle: 'FRONT',
      quality: 'GOOD',
    });
  });

  it('renders AI enhancement screen and allows toggling between original and enhanced', async () => {
    const { getByText, getByTestId } = await render(
      <ThemeProvider>
        <AiEnhancementScreen navigation={mockNavigation} route={{} as any} />
      </ThemeProvider>
    );

    expect(getByText(/AI स्टूडियो निखार/)).toBeTruthy();

    await waitFor(() => {
      expect(getByText('✨ स्वच्छ स्टूडियो फिनिश')).toBeTruthy();
    });

    // Switch to original
    await act(async () => {
      fireEvent.press(getByTestId('toggle-original-btn'));
    });

    expect(getByText('📷 मूल वर्कशॉप फोटो')).toBeTruthy();

    // Switch back to enhanced
    await act(async () => {
      fireEvent.press(getByTestId('toggle-enhanced-btn'));
    });

    expect(getByText('✨ स्वच्छ स्टूडियो फिनिश')).toBeTruthy();
  });
});
