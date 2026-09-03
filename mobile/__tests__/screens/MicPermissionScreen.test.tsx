import React, { act } from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MicPermissionScreen } from '@/screens/product/MicPermissionScreen';
import { ThemeProvider } from '@/theme/ThemeProvider';

const mockNavigation: any = {
  navigate: jest.fn(),
  replace: jest.fn(),
  goBack: jest.fn(),
};

describe('MicPermissionScreen', () => {
  it('renders microphone primer and navigates on allow button press', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <MicPermissionScreen navigation={mockNavigation} route={{} as any} />
      </ThemeProvider>
    );

    expect(getByText('माइक की अनुमति दें')).toBeTruthy();
    expect(getByText('Allow Microphone Access')).toBeTruthy();

    await act(async () => {
      fireEvent.press(getByText('माइक की अनुमति दें (Allow Mic) 🎙️'));
    });

    expect(mockNavigation.replace).toHaveBeenCalledWith('VoiceDescription');
  });
});
