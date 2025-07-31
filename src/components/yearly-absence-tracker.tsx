'use client';

import { getHolidaySuggestions } from '@/app/actions/ai';
import { AddAbsenceDialog } from '@/components/add-absence-dialog';
import { AddEmployeeDialog } from '@/components/add-employee-dialog';
import { CalendarGrid } from '@/components/calendar-grid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { getDaysInYear } from '@/lib/dates';
import type { Absence, Employee, Holiday } from '@/types';
import { Wand2 } from 'lucide-react';
import { useState, useTransition, useMemo } from 'react';
import type { DateRange } from 'react-day-picker';
import { Skeleton } from './ui/skeleton';

const COUNTRIES = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Japan',
];

const INITIAL_EMPLOYEES: Employee[] = [
  { id: '1', name: 'Alice Johnson' },
  { id: '2', name: 'Bob Williams' },
  { id: '3', name: 'Charlie Brown' },
];

const INITIAL_ABSENCES: Absence[] = [
    { id: '1', employeeId: '1', startDate: new Date(new Date().getFullYear(), 0, 10), endDate: new Date(new Date().getFullYear(), 0, 14) },
    { id: '2', employeeId: '2', startDate: new Date(new Date().getFullYear(), 1, 20), endDate: new Date(new Date().getFullYear(), 1, 28) },
];


export default function YearlyAbsenceTracker() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [absences, setAbsences] = useState<Absence[]>(INITIAL_ABSENCES);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const daysInYear = useMemo(() => getDaysInYear(year), [year]);

  const handleAddEmployee = (name: string) => {
    const newEmployee = { id: crypto.randomUUID(), name };
    setEmployees(prev => [...prev, newEmployee]);
    toast({
      title: 'Employee Added',
      description: `${name} has been added to the tracker.`,
    });
  };

  const handleAddAbsence = (employeeId: string, dateRange: DateRange) => {
    if (dateRange.from && dateRange.to) {
      const newAbsence = {
        id: crypto.randomUUID(),
        employeeId,
        startDate: dateRange.from,
        endDate: dateRange.to,
      };
      setAbsences(prev => [...prev, newAbsence]);
      const employee = employees.find(e => e.id === employeeId);
      toast({
        title: 'Absence Added',
        description: `Absence for ${employee?.name} has been recorded.`,
      });
    }
  };

  const handleSuggestHolidays = () => {
    startTransition(async () => {
      const suggestedHolidays = await getHolidaySuggestions(country, year);
      setHolidays(suggestedHolidays);
      toast({
        title: 'Holidays Suggested',
        description: `${suggestedHolidays.length} holidays for ${country} in ${year} have been loaded.`,
      });
    });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newYear = parseInt(e.target.value, 10);
    if (!isNaN(newYear) && String(newYear).length === 4) {
      setYear(newYear);
      setHolidays([]); // Clear holidays when year changes
    }
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Yearly Absence Tracker
        </h1>
        <p className="text-muted-foreground">
          Plan and visualize employee absences throughout the year.
        </p>
      </header>

      <div className="p-4 sm:p-6 bg-card border rounded-lg shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="year-input">Year</Label>
            <Input
              id="year-input"
              type="number"
              value={year}
              onChange={handleYearChange}
              className="max-w-[120px]"
              placeholder="YYYY"
            />
          </div>

          <div className="space-y-2 col-span-1 lg:col-span-2">
            <Label>AI Holiday Suggestions</Label>
            <div className="flex gap-2">
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger className="flex-grow">
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map(c => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleSuggestHolidays} disabled={isPending} variant="outline">
                <Wand2 className="mr-2 h-4 w-4" />
                {isPending ? 'Loading...' : 'Suggest'}
              </Button>
            </div>
          </div>

          <div className="flex gap-2 justify-self-start md:justify-self-end">
             <AddAbsenceDialog
              employees={employees}
              onAddAbsence={handleAddAbsence}
            />
            <AddEmployeeDialog onAddEmployee={handleAddEmployee} />
          </div>
        </div>
      </div>

      {isPending ? (
         <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-64 w-full" />
         </div>
      ) : (
        <CalendarGrid
          year={year}
          daysInYear={daysInYear}
          employees={employees}
          absences={absences}
          holidays={holidays}
        />
      )}
    </div>
  );
}
