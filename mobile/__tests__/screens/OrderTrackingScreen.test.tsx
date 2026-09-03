import React from 'react';
import { render } from '@testing-library/react-native';
import { OrderTrackingScreen } from '@/screens/marketplace/OrderTrackingScreen';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { useOrderStore } from '@/store/useOrderStore';

const mockNavigation: any = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

describe('OrderTrackingScreen', () => {
  beforeEach(() => {
    useOrderStore.getState().addOrder({
      orderId: 'ord_track_test',
      orderNumber: 'KS-OD-908123',
      consignmentBarcode: 'SP90812301IN',
      status: 'ORDER_CONFIRMED',
      items: [],
      shippingAddress: {
        fullName: 'Rohan Sharma',
        addressLine: 'CP',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110001',
        phone: '9876543210',
      },
      totalAmount: 2320,
      escrowStatus: 'HELD_IN_VAULT',
      paymentMethod: 'UPI',
      estimatedDeliveryDate: '3-5 Days',
      trackingMilestones: [
        {
          step: 1,
          status: 'ORDER_CONFIRMED',
          titleHi: 'ऑर्डर कन्फर्म हुआ ✓',
          titleEn: 'Confirmed',
          descriptionHi: 'सुरक्षित जमा',
          descriptionEn: 'Locked in vault',
          timestamp: '10:00 AM',
          isCompleted: true,
        },
      ],
      createdAt: new Date().toISOString(),
    });
  });

  it('renders live tracking milestones and postal consignment barcode', async () => {
    const { getByText } = await render(
      <ThemeProvider>
        <OrderTrackingScreen
          navigation={mockNavigation}
          route={{ params: { orderId: 'ord_track_test' } } as any}
        />
      </ThemeProvider>
    );

    expect(getByText(/लाइव ऑर्डर ट्रैकिंग/)).toBeTruthy();
    expect(getByText('SP90812301IN')).toBeTruthy();
    expect(getByText(/एस्क्रो सुरक्षा सक्रिय/)).toBeTruthy();
    expect(getByText(/ऑर्डर कन्फर्म हुआ/)).toBeTruthy();
  });
});
