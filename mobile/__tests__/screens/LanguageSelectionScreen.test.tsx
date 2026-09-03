import React, { act } from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { LanguageSelectionScreen } from '@/screens/auth/LanguageSelectionScreen';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { useAppStore } from '@/store/useAppStore';

const mockNavigation: any = {
  navigate: jest.fn(),
  replace: jest.fn(),
};

describe('LanguageSelectionScreen', () => {
  it('renders all primary language cards and allows selection', async () => {
    const { getByText, getByTestId } = await render(
      <ThemeProvider>
        <LanguageSelectionScreen navigation={mockNavigation} route={{} as any} />
      </ThemeProvider>
    );

    expect(getByText('अपनी भाषा चुनें')).toBeTruthy();

    await act(async () => {
      fireEvent.press(getByTestId('lang-card-bn_IN'));
    });

    await act(async () => {
      fireEvent.press(getByText('आगे बढ़ें (Continue) →'));
    });

    expect(useAppStore.getState().locale).toBe('bn_IN');
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Onboarding');
  });
});
