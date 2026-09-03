import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TactileKeypad } from '@/components/inputs/TactileKeypad';
import { ThemeProvider } from '@/theme/ThemeProvider';

describe('TactileKeypad Component', () => {
  it('calls onPressDigit with corresponding number', async () => {
    const onDigit = jest.fn();
    const onBackspace = jest.fn();

    const { getByText } = await render(
      <ThemeProvider>
        <TactileKeypad onPressDigit={onDigit} onPressBackspace={onBackspace} />
      </ThemeProvider>
    );

    fireEvent.press(getByText('5'));
    expect(onDigit).toHaveBeenCalledWith('5');

    fireEvent.press(getByText('⌫'));
    expect(onBackspace).toHaveBeenCalledTimes(1);
  });
});
