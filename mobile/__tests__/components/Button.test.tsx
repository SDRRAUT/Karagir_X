import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '@/components/buttons/Button';
import { ThemeProvider } from '@/theme/ThemeProvider';

describe('Button Component', () => {
  it('renders label correctly and responds to press', async () => {
    const onPressMock = jest.fn();
    const { getByText, getByRole } = await render(
      <ThemeProvider>
        <Button label="पुष्टि करें (Confirm)" onPress={onPressMock} />
      </ThemeProvider>
    );

    expect(getByText('पुष्टि करें (Confirm)')).toBeTruthy();
    const button = getByRole('button');
    fireEvent.press(button);
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('does not trigger press when disabled', async () => {
    const onPressMock = jest.fn();
    const { getByRole } = await render(
      <ThemeProvider>
        <Button label="अक्षम (Disabled)" disabled onPress={onPressMock} />
      </ThemeProvider>
    );

    const button = getByRole('button');
    fireEvent.press(button);
    expect(onPressMock).not.toHaveBeenCalled();
  });
});
