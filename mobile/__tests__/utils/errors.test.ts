import { AppError, NetworkError, ApiError, AuthError } from '@/utils/errors';

describe('Error Handling Architecture', () => {
  it('instantiates NetworkError with vernacular voice prompt', () => {
    const error = new NetworkError('Disconnected from Wi-Fi');
    expect(error.code).toBe('NETWORK_DISCONNECTED');
    expect(error.statusCode).toBe(0);
    expect(error.voicePromptLocale?.hi).toContain('Internet nahi chal raha');
  });

  it('instantiates ApiError from RFC 7807 problem details', () => {
    const error = ApiError.fromProblemDetails(
      {
        code: 'ORDER_EXPIRED',
        message: 'Order acceptance deadline has passed.',
        voice_prompt_locale: { hi: 'Order samay seema samaapt ho gayi hai.' },
      },
      400
    );

    expect(error.name).toBe('ApiError');
    expect(error.code).toBe('ORDER_EXPIRED');
    expect(error.statusCode).toBe(400);
    expect(error.voicePromptLocale?.hi).toBe('Order samay seema samaapt ho gayi hai.');
  });

  it('instantiates AuthError with 401 code', () => {
    const error = new AuthError();
    expect(error.statusCode).toBe(401);
    expect(error.code).toBe('UNAUTHORIZED');
  });
});
