import { copyEn } from './copy.en';
import { copyAr } from './copy.ar';
import type { Copy } from './copy.en';

export type Locale = 'en' | 'ar';

export function getCopy(locale: Locale): Copy {
  return (locale === 'ar' ? copyAr : copyEn) as Copy;
}
