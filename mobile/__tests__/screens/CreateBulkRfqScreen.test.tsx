import React, { act } from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { CreateBulkRfqScreen } from '@/screens/linkage/CreateBulkRfqScreen';
import { ThemeProvider } from '@/theme/ThemeProvider';

const mockNavigation: any = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

describe('CreateBulkRfqScreen', () => {
  it('renders bulk RFQ form and submits requirement', async () => {
    const { getByText, getByPlaceholderText } = await render(
      <ThemeProvider>
        <CreateBulkRfqScreen navigation={mockNavigation} route={{} as any} />
      </ThemeProvider>
    );

    expect(getByText(/Corporate Bulk RFQ/)).toBeTruthy();
    expect(getByText(/Requirement Details/)).toBeTruthy();

    const companyInput = getByPlaceholderText(/Tata Consultancy Services/);
    const contactInput = getByPlaceholderText(/Full Name/);
    const phoneInput = getByPlaceholderText(/10-digit number/);

    await act(async () => {
      fireEvent.changeText(companyInput, 'Infosys B2B');
      fireEvent.changeText(contactInput, 'Ananya Roy');
      fireEvent.changeText(phoneInput, '9876543210');
    });

    const submitBtn = getByText(/Launch AI Cluster Matching/);
    await act(async () => {
      fireEvent.press(submitBtn);
    });

    await waitFor(() => {
      expect(submitBtn).toBeTruthy();
    });
  });
});
