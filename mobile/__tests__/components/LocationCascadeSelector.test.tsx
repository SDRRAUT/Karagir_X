import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { LocationCascadeSelector } from '@/components/inputs/LocationCascadeSelector';
import { ThemeProvider } from '@/theme/ThemeProvider';

describe('LocationCascadeSelector Component', () => {
  it('renders country tag and state selector placeholder', async () => {
    const onChange = jest.fn();

    const result = await render(
      <ThemeProvider>
        <LocationCascadeSelector onChange={onChange} />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(result.getByText(/India/)).toBeTruthy();
      expect(result.getByTestId('location-state-btn')).toBeTruthy();
    });
  });

  it('renders pre-selected state and enables district picker', async () => {
    const onChange = jest.fn();

    const result = await render(
      <ThemeProvider>
        <LocationCascadeSelector
          value={{
            countryId: 1,
            countryName: 'India',
            stateId: 26,
            stateName: 'Maharashtra',
            districtId: 101,
            districtName: 'Kolhapur',
          }}
          onChange={onChange}
        />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(result.getByTestId('location-district-btn')).toBeTruthy();
      expect(result.getByText(/Kolhapur/)).toBeTruthy();
    });
  });
});
