import React, { act } from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PhotoReviewScreen } from '@/screens/product/PhotoReviewScreen';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { useProductDraftStore } from '@/store/useProductDraftStore';

const mockNavigation: any = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

describe('PhotoReviewScreen', () => {
  beforeEach(() => {
    useProductDraftStore.getState().resetDraft();
    useProductDraftStore.getState().addPhoto({
      uri: 'file:///mock/photo1.jpg',
      angle: 'FRONT',
      quality: 'GOOD',
    });
    useProductDraftStore.getState().addPhoto({
      uri: 'file:///mock/photo2.jpg',
      angle: 'TEXTURE',
      quality: 'GOOD',
    });
  });

  it('renders photo review screen and navigates to AI enhancement', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <PhotoReviewScreen navigation={mockNavigation} route={{} as any} />
      </ThemeProvider>
    );

    expect(getByText('फोटो समीक्षा (2/4)')).toBeTruthy();
    expect(getByText('✅ क्वालिटी अच्छी है (Clear & Sharp)')).toBeTruthy();

    await act(async () => {
      fireEvent.press(getByText('AI से फोटो सुंदर बनाएं (Enhance with AI) ✨'));
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('AiEnhancement');
  });

  it('allows adding another angle', async () => {
    const { getByTestId } = await render(
      <ThemeProvider>
        <PhotoReviewScreen navigation={mockNavigation} route={{} as any} />
      </ThemeProvider>
    );

    await act(async () => {
      fireEvent.press(getByTestId('add-angle-btn'));
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('CameraCapture');
  });
});
