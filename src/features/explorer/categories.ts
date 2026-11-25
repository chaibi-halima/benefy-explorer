import type { MerchantCategory } from '@/api/types';

export const categoryLabels: Record<MerchantCategory, string> = {
  restaurant: 'Restaurants',
  grocery: 'Épiceries',
  bakery: 'Boulangeries',
  transport: 'Mobilité',
  culture: 'Culture',
  shopping: 'Shopping',
};
export const categoryEmoji: Record<MerchantCategory, string> = {
  restaurant: '🍽️',
  grocery: '🛒',
  bakery: '🥖',
  transport: '🚲',
  culture: '🎭',
  shopping: '🛍️',
};
