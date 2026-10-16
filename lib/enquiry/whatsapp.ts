export type EnquiryInput = {
  name: string;
  phone: string;
  city: string;
  interest: string;
  message?: string;
};

export function buildWhatsAppUrl(input: EnquiryInput) {
  if (!input.name.trim()) throw new Error('Your name is required.');
  if (!input.phone.trim()) throw new Error('Your phone number is required.');
  if (!input.city.trim()) throw new Error('Your city or locality is required.');
  const lines = [
    'Hello Cosmisol Energy, I would like to request a free site visit.',
    `Name: ${input.name.trim()}`,
    `Phone: ${input.phone.trim()}`,
    `City / locality: ${input.city.trim()}`,
    `Interested in: ${input.interest}`,
  ];
  if (input.message?.trim()) lines.push(`Message: ${input.message.trim()}`);
  return `https://wa.me/917339617710?text=${encodeURIComponent(lines.join('\n'))}`;
}
