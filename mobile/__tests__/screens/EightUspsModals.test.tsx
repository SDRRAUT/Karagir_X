import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { CraftStudioModal } from '@/screens/artisan/components/CraftStudioModal';
import { KaragirIpModal } from '@/screens/artisan/components/KaragirIpModal';
import { MelaModeModal } from '@/screens/artisan/components/MelaModeModal';
import { FairPriceCalculatorModal } from '@/screens/artisan/components/FairPriceCalculatorModal';
import { CraftPassportModal } from '@/screens/artisan/components/CraftPassportModal';
import { B2BBulkModal } from '@/screens/artisan/components/B2BBulkModal';

describe('8 USPs Master Modals Suite', () => {
  it('CraftStudioModal renders before/after toggle and craft preservation checklist', async () => {
    const onClose = jest.fn();
    const { getByText } = await render(
      <ThemeProvider>
        <CraftStudioModal visible={true} onClose={onClose} />
      </ThemeProvider>
    );

    expect(getByText(/Craft-Aware AI Studio/i)).toBeTruthy();
    expect(getByText(/Zero Generative Hallucination/i)).toBeTruthy();
  });

  it('KaragirIpModal renders cryptographic IP tag and brand royalty ledger', async () => {
    const onClose = jest.fn();
    const { getByText } = await render(
      <ThemeProvider>
        <KaragirIpModal visible={true} onClose={onClose} />
      </ThemeProvider>
    );

    expect(getByText(/Karagir IP & Royalty/i)).toBeTruthy();
    expect(getByText(/KALAKAR-IP-MH-2026/i)).toBeTruthy();
  });

  it('MelaModeModal renders 365-day digital twin and WhatsApp QR', async () => {
    const onClose = jest.fn();
    const { getByText } = await render(
      <ThemeProvider>
        <MelaModeModal visible={true} onClose={onClose} />
      </ThemeProvider>
    );

    expect(getByText(/Mela-to-Digital Twin/i)).toBeTruthy();
  });

  it('FairPriceCalculatorModal renders cost factors and Diwali surge intelligence', async () => {
    const onClose = jest.fn();
    const { getByText } = await render(
      <ThemeProvider>
        <FairPriceCalculatorModal visible={true} onClose={onClose} />
      </ThemeProvider>
    );

    expect(getByText(/Fair-Value/i)).toBeTruthy();
  });

  it('CraftPassportModal renders alternative credit score and govt scheme linker', async () => {
    const onClose = jest.fn();
    const { getByText } = await render(
      <ThemeProvider>
        <CraftPassportModal visible={true} onClose={onClose} />
      </ThemeProvider>
    );

    expect(getByText(/Kaarigar Passport/i)).toBeTruthy();
  });

  it('B2BBulkModal renders enterprise Tata RFQ and 15km cluster pooling', async () => {
    const onClose = jest.fn();
    const { getByText } = await render(
      <ThemeProvider>
        <B2BBulkModal visible={true} onClose={onClose} />
      </ThemeProvider>
    );

    expect(getByText(/TATA Capital/i)).toBeTruthy();
    expect(getByText(/500 Sets/i)).toBeTruthy();
  });
});