'use server';

/**
 * @fileOverview Suggests statutory and national holidays for accurate absence planning.
 *
 * - suggestHolidays - A function that returns a list of suggested holidays.
 * - SuggestHolidaysInput - The input type for the suggestHolidays function.
 * - SuggestHolidaysOutput - The return type for the suggestHolidays function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestHolidaysInputSchema = z.object({
  year: z.number().describe('The year for which to suggest holidays.'),
  country: z.string().describe('The country for which to suggest holidays.'),
});
export type SuggestHolidaysInput = z.infer<typeof SuggestHolidaysInputSchema>;

const SuggestHolidaysOutputSchema = z.object({
  holidays: z.array(
    z.object({
      date: z.string().describe('The date of the holiday (YYYY-MM-DD).'),
      name: z.string().describe('The name of the holiday.'),
    })
  ).describe('A list of suggested holidays.'),
});
export type SuggestHolidaysOutput = z.infer<typeof SuggestHolidaysOutputSchema>;

export async function suggestHolidays(input: SuggestHolidaysInput): Promise<SuggestHolidaysOutput> {
  return suggestHolidaysFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestHolidaysPrompt',
  input: {schema: SuggestHolidaysInputSchema},
  output: {schema: SuggestHolidaysOutputSchema},
  prompt: `You are a helpful assistant that suggests statutory and national holidays for a given year and country.

  Suggest holidays for the year {{{year}}} and the country {{{country}}}.  Return the holidays in JSON format.
  Ensure that the date is in the YYYY-MM-DD format.
  Make sure to include all major holidays.

  The holiday names should be in the language of the country provided.
  For example, if the country is 'Russia', the holiday names should be in Russian.

  Here's the format to use:
  {
    "holidays": [
      {
        "date": "YYYY-MM-DD",
        "name": "Holiday Name"
      },
      ...
    ]
  }`,
});

const suggestHolidaysFlow = ai.defineFlow(
  {
    name: 'suggestHolidaysFlow',
    inputSchema: SuggestHolidaysInputSchema,
    outputSchema: SuggestHolidaysOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
