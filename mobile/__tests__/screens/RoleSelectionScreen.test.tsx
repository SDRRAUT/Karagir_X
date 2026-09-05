import React, { act } from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { RoleSelectionScreen } from '@/screens/auth/RoleSelectionScreen';
import { ThemeProvider } from '@/theme/ThemeProvider';

const mockNavigation: any = {
  navigate: jest.fn(),
};

describe('RoleSelectionScreen', () => {
  it('renders Artisan, Buyer, and Facilitator roles and passes selection to AuthPhone', async () => {
    const { getByText, getByTestId } = await render(
      <ThemeProvider>
        <RoleSelectionScreen navigation={mockNavigation} route={{} as any} />
      </ThemeProvider>
    );

    expect(getByText('How would you like to join?')).toBeTruthy();

    await act(async () => {
      fireEvent.press(getByTestId('role-card-BUYER'));
    });

    await act(async () => {
      fireEvent.press(getByText('Continue →'));
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('AuthPhone', { role: 'BUYER' });
  });
});
