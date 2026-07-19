export const DISCOUNT_SESSION_COUNT = 5;
export const DISCOUNT_PERCENTAGE = 10;

export function earnsSessionDiscount(sessionCount: number) {
  return sessionCount === DISCOUNT_SESSION_COUNT;
}
