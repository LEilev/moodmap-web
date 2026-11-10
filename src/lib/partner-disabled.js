/**
 * Partner Mode is not part of the released product. Every legacy Partner API
 * must stop here before reading request data or contacting Redis. Reintroducing
 * it requires a new authenticated service, not an environment-variable toggle.
 */
export function partnerDisabledResponse() {
  return Response.json(
    {
      ok: false,
      error: 'partner_mode_disabled',
      message: 'Partner Mode is currently unavailable.',
      disabled: true,
      isValidConnection: false,
      hasData: false,
    },
    {
      status: 410,
      headers: {
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
      },
    },
  );
}
