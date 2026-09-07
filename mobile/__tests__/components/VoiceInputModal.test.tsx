import React, { act } from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { VoiceInputModal } from '@/components/modals/VoiceInputModal';
import { ThemeProvider } from '@/theme/ThemeProvider';

describe('VoiceInputModal Component', () => {
  it('renders modal when visible is true with language options', async () => {
    const handleClose = jest.fn();
    const handleApply = jest.fn();

    const { getByText } = await render(
      <ThemeProvider>
        <VoiceInputModal
          visible={true}
          onClose={handleClose}
          onApplyText={handleApply}
          title="Voice Craft Search"
          initialText="Terracotta Diya"
        />
      </ThemeProvider>
    );

    expect(getByText(/Voice Craft Search/)).toBeTruthy();
    expect(getByText('🇮🇳 हिंदी')).toBeTruthy();
    expect(getByText('मराठी')).toBeTruthy();
    expect(getByText('English')).toBeTruthy();
    expect(getByText(/1. Spoken Voice Input/)).toBeTruthy();
  });

  it('allows user to modify spoken text with AI and apply result', async () => {
    const handleClose = jest.fn();
    const handleApply = jest.fn();

    const { getByText, findByText } = await render(
      <ThemeProvider>
        <VoiceInputModal
          visible={true}
          onClose={handleClose}
          onApplyText={handleApply}
          initialText="umm pure terracotta clay diya set 5 piece bana hai"
          context="product_story"
        />
      </ThemeProvider>
    );

    const modifyBtn = getByText(/2. Modify & Polish with AI/);

    await act(async () => {
      fireEvent.press(modifyBtn);
    });

    const aiResultHeading = await findByText(/AI Enhanced Result:/);
    expect(aiResultHeading).toBeTruthy();

    const applyBtn = getByText(/Apply AI Version/);
    await act(async () => {
      fireEvent.press(applyBtn);
    });

    expect(handleApply).toHaveBeenCalled();
    expect(handleClose).toHaveBeenCalled();
  });
});
