export const DISCOUNT_PERCENTAGE = 15; // 15%

export const VALID_DISCOUNT_CODES = [
  'BTXESTE',
  'BTXJOAN',
  'BTXJHOANC',
  'BTXPROFE',
  'BTXVANE',
  'BTXANZO',
  'MONTAÑERO',
  'MONTANERO', // Soporte por si no digitan la Ñ
  'BTXNICO',
];

export function isValidDiscountCode(code: string | null | undefined): boolean {
  if (!code) return false;
  const cleanCode = code.trim().toUpperCase();
  return VALID_DISCOUNT_CODES.includes(cleanCode);
}

export function calculatePrice(
  distancia: string | null | undefined,
  code: string | null | undefined,
): {
  basePrice: number;
  discount: number;
  finalPrice: number;
  hasDiscount: boolean;
  cleanCode: string;
} {
  const is10k = distancia === '10k';
  const basePrice = is10k ? 120_000 : 105_000;
  const hasDiscount = isValidDiscountCode(code);
  const discount = hasDiscount ? basePrice * (DISCOUNT_PERCENTAGE / 100) : 0;
  const finalPrice = basePrice - discount;
  const cleanCode = code ? code.trim().toUpperCase() : '';

  return {
    basePrice,
    discount,
    finalPrice,
    hasDiscount,
    cleanCode,
  };
}

