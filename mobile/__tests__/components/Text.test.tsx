import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from '@/components/typography/Text';
import { ThemeProvider } from '@/theme/ThemeProvider';

describe('Text Component', () => {
  it('renders Indic text correctly with theme styling', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <Text variant="headlineLarge" weight="bold">
          कलाकार सेतु
        </Text>
      </ThemeProvider>
    );

    expect(getByText('कलाकार सेतु')).toBeTruthy();
  });
});
