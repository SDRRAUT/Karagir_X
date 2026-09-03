import React from 'react';
import { render } from '@testing-library/react-native';
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary';
import { Text } from '@/components/typography/Text';

const BuggyComponent: React.FC = () => {
  throw new Error('Test crash event');
};

describe('ErrorBoundary Component', () => {
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });

  it('renders children when no error occurs', async () => {
    const { getByText } = await render(
      <ErrorBoundary>
        <Text>सुरक्षित सामग्री (Safe Content)</Text>
      </ErrorBoundary>
    );

    expect(getByText('सुरक्षित सामग्री (Safe Content)')).toBeTruthy();
  });

  it('catches render error and displays reassuring crash recovery UI', async () => {
    const { getByText } = await render(
      <ErrorBoundary>
        <BuggyComponent />
      </ErrorBoundary>
    );

    expect(getByText("चिंता न करें! (Don't Worry)")).toBeTruthy();
    expect(getByText('दोबारा कोशिश करें (Retry)')).toBeTruthy();
  });
});
