'use server';

import {
  suggestHolidays,
  type SuggestHolidaysInput,
} from '@/ai/flows/suggest-holidays';
import type { Holiday } from '@/types';
import { parseISO } from 'date-fns';

export async function getHolidaySuggestions(
  country: string,
  year: number
): Promise<Holiday[]> {
  try {
    const input: SuggestHolidaysInput = { country, year };
    const result = await suggestHolidays(input);

    if (result && result.holidays) {
      return result.holidays.map(h => ({
        ...h,
        date: parseISO(h.date),
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching holiday suggestions:', error);
    // In a real app, you'd want more robust error handling
    return [];
  }
}
