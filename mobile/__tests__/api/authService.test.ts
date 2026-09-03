import { authService } from '@/api/authService';

describe('AuthService', () => {
  it('sends OTP and returns session ID', async () => {
    const response = await authService.sendOtp('9876543210', 'hi_IN', 'ARTISAN');
    expect(response.status).toBe('OTP_DISPATCHED');
    expect(response.session_id).toBeDefined();
    expect(response.retry_after_seconds).toBe(60);
  });

  it('verifies OTP and returns user session', async () => {
    const response = await authService.verifyOtp(
      'mock_session_123',
      '849201',
      '9876543210',
      'ARTISAN',
      'hi_IN'
    );

    expect(response.access_token).toBeDefined();
    expect(response.refresh_token).toBeDefined();
    expect(response.user.phoneNumber).toBe('9876543210');
    expect(response.user.role).toBe('ARTISAN');
  });

  it('sets up artisan profile', async () => {
    const profile = await authService.setupProfile('artisan_1', {
      full_name: 'Sunita Devi',
      craft_category_code: 'PAINTING_FOLK',
      district: 'Madhubani',
      state: 'Bihar',
    });

    expect(profile.fullName).toBe('Sunita Devi');
    expect(profile.craftCategoryCode).toBe('PAINTING_FOLK');
    expect(profile.district).toBe('Madhubani');
    expect(profile.state).toBe('Bihar');
    expect(profile.isProfileComplete).toBe(true);
  });
});
