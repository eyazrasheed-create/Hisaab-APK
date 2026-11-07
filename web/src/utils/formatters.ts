import { CurrencySymbol } from '../types';

export const formatCurrency = (amount: number, symbol: CurrencySymbol = 'Rs'): string => {
  const formattedNumber = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Math.abs(amount));

  const sign = amount < 0 ? '-' : '';

  if (symbol === 'Rs' || symbol === 'PKR') {
    return `${sign}${symbol} ${formattedNumber}`;
  }
  if (symbol === '$' || symbol === '£' || symbol === '€') {
    return `${sign}${symbol}${formattedNumber}`;
  }
  return `${sign}${formattedNumber} ${symbol}`;
};

export const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getCurrentTimeString = (): string => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const formatDateDisplay = (dateStr: string, lang: 'roman_urdu' | 'english' | 'urdu' = 'roman_urdu'): string => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  const todayStr = getTodayDateString();
  
  // Calculate yesterday
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

  if (dateStr === todayStr) {
    if (lang === 'roman_urdu') return `Aaj (${day} ${getMonthName(month, lang)})`;
    if (lang === 'urdu') return `آج (${day} ${getMonthName(month, lang)})`;
    return `Today (${day} ${getMonthName(month, lang)})`;
  }

  if (dateStr === yesterdayStr) {
    if (lang === 'roman_urdu') return `Kal (${day} ${getMonthName(month, lang)})`;
    if (lang === 'urdu') return `گزشتہ کل (${day} ${getMonthName(month, lang)})`;
    return `Yesterday (${day} ${getMonthName(month, lang)})`;
  }

  const dayOfWeek = getDayName(date.getDay(), lang);
  return `${dayOfWeek}, ${day} ${getMonthName(month, lang)} ${year}`;
};

export const getMonthName = (monthNum: number, lang: 'roman_urdu' | 'english' | 'urdu' = 'roman_urdu'): string => {
  const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthsRoman = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthsUrdu = ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون', 'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'];

  const idx = Math.max(0, Math.min(11, monthNum - 1));
  if (lang === 'urdu') return monthsUrdu[idx];
  if (lang === 'roman_urdu') return monthsRoman[idx];
  return monthsEn[idx];
};

export const getDayName = (dayIndex: number, lang: 'roman_urdu' | 'english' | 'urdu' = 'roman_urdu'): string => {
  const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const daysRoman = ['Itwaar', 'Peer', 'Mangal', 'Budh', 'Jumeraat', 'Jummah', 'Hafta'];
  const daysUrdu = ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'];

  if (lang === 'urdu') return daysUrdu[dayIndex];
  if (lang === 'roman_urdu') return daysRoman[dayIndex];
  return daysEn[dayIndex];
};
