import { describe, expect, it } from 'vitest';
import { buildWhatsAppUrl } from '@/lib/enquiry/whatsapp';

const validEnquiry = {
  name: 'Anita Kumar',
  phone: '9876543210',
  city: 'Coimbatore',
  interest: 'Residential',
  message: 'My bill is around ₹4,600.',
};

describe('buildWhatsAppUrl', () => {
  it('uses the Cosmisol Energy brand and safely encodes the enquiry', () => {
    const url = buildWhatsAppUrl(validEnquiry);
    expect(url).toContain('7339617710');
    expect(decodeURIComponent(url)).toContain('Anita Kumar');
    expect(decodeURIComponent(url)).toContain('Hello Cosmisol Energy,');
    expect(decodeURIComponent(url)).toContain('Coimbatore');
  });

  it('rejects missing required enquiry details', () => {
    expect(() => buildWhatsAppUrl({ ...validEnquiry, phone: '' })).toThrow(/phone/i);
  });
});
