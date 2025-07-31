# **App Name**: Yearly Absence Tracker

## Core Features:

- Employee Calendar Grid: Display a table with employees as rows and days of the year as columns, with nested headers for month, week, day of the week, and day number.
- Employee Input: Allow users to input employee names.
- Year Selection: Functionality to select a year to display the calendar for the specified year.
- Absence Entry and Display: Allow users to input and save weekend periods for each employee, displayed as a line covering the relevant days.
- Holiday Smart Suggestions: Smart suggestions, with an LLM tool, that remind users of statutory and national holidays for more accurate calendar planning.

## Style Guidelines:

- Primary color: HSL 210, 70%, 50% (RGB hex: #3399E6) to give a professional and calming impression.
- Background color: HSL 210, 20%, 98% (RGB hex: #F9FAFC), a light background for a clean look, offering optimal contrast.
- Accent color: HSL 180, 60%, 40% (RGB hex: #33BDBD) as a secondary highlight color to provide affordance to user controls.
- Body and headline font: 'Inter', a sans-serif font that provides a clean and modern feel, suitable for both headlines and body text. Note: currently only Google Fonts are supported.
- Use simple, clear icons to represent absence types and interactive elements.
- Employ a clean, table-based layout that maximizes screen real estate.
- Use subtle animations to reflect interactive use. For example, dim cell lighting for periods when someone is out of office, and animate on hover to full cell coloring to confirm or change settings.