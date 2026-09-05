import React, { act } from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CameraPermissionScreen } from '@/screens/product/CameraPermissionScreen';
import { ThemeProvider } from '@/theme/ThemeProvider';

const mockNavigation: any = {
  navigate: jest.fn(),
  replace: jest.fn(),
  goBack: jest.fn(),
};

describe('CameraPermissionScreen', () => {
  it('renders permission primer with vernacular cues and requests permission', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <CameraPermissionScreen navigation={mockNavigation} route={{} as any} />
      </ThemeProvider>
    );

    expect(getByText('Camera Permission')).toBeTruthy();
    expect(getByText('AI Smart Product Photography')).toBeTruthy();

    await act(async () => {
      fireEvent.press(getByText('Allow Camera 📷'));
    });

    expect(mockNavigation.replace).toHaveBeenCalledWith('CameraCapture');
  });
});
