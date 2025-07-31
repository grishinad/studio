'use client';

import { AddAbsenceDialog } from '@/components/add-absence-dialog';
import { AddEmployeeDialog } from '@/components/add-employee-dialog';
import { CalendarGrid } from '@/components/calendar-grid';
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
import { getDaysInMonthForYear, MONTHS } from '@/lib/dates';
import type { Absence, Employee } from '@/types';
import { useState, useMemo } from 'react';
import type { DateRange } from 'react-day-picker';

const INITIAL_EMPLOYEES: Employee[] = [
  { id: '1', name: 'Анна Иванова' },
  { id: '2', name: 'Борис Петров' },
  { id: '3', name: 'Карл Сидоров' },
];

const INITIAL_ABSENCES: Absence[] = [
    { id: '1', employeeId: '1', startDate: new Date(new Date().getFullYear(), 0, 10), endDate: new Date(new Date().getFullYear(), 0, 14), absenceType: 'отпуск ежегодный', replacement: 'Сергей Смирнов' },
    { id: '2', employeeId: '2', startDate: new Date(new Date().getFullYear(), 1, 20), endDate: new Date(new Date().getFullYear(), 1, 28), absenceType: 'больничный' },
];


export default function YearlyAbsenceTracker() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [absences, setAbsences] = useState<Absence[]>(INITIAL_ABSENCES);
  const { toast } = useToast();

  const daysInMonth = useMemo(() => getDaysInMonthForYear(year, month), [year, month]);

  const handleAddEmployee = (name: string) => {
    const newEmployee = { id: crypto.randomUUID(), name };
    setEmployees(prev => [...prev, newEmployee]);
    toast({
      title: 'Сотрудник добавлен',
      description: `${name} был добавлен в трекер.`,
    });
  };

  const handleAddAbsence = (
    employeeId: string,
    dateRange: DateRange,
    absenceType: string,
    replacement?: string
  ) => {
    if (dateRange.from && dateRange.to) {
      const newAbsence = {
        id: crypto.randomUUID(),
        employeeId,
        startDate: dateRange.from,
        endDate: dateRange.to,
        absenceType,
        replacement,
      };
      setAbsences(prev => [...prev, newAbsence]);
      const employee = employees.find(e => e.id === employeeId);
      toast({
        title: 'Отсутствие добавлено',
        description: `Отсутствие для ${employee?.name} было записано.`,
      });
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setYear(0);
      return;
    }
    const newYear = parseInt(value, 10);
    if (!isNaN(newYear) && newYear > 0) {
        setYear(newYear);
    }
  };

  const handleMonthChange = (value: string) => {
    setMonth(parseInt(value, 10));
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Трекер отсутствий
        </h1>
        <p className="text-muted-foreground">
          Планируйте и визуализируйте отсутствия сотрудников в течение года.
        </p>
      </header>

      <div className="p-4 sm:p-6 bg-card border rounded-lg shadow-sm space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-2">
              <Label htmlFor="year-input">Год</Label>
              <Input
                id="year-input"
                type="number"
                value={year === 0 ? '' : year}
                onChange={handleYearChange}
                className="w-[120px]"
                placeholder="ГГГГ"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="month-select">Месяц</Label>
               <Select value={String(month)} onValueChange={handleMonthChange}>
                <SelectTrigger id="month-select" className="w-[180px]">
                  <SelectValue placeholder="Выберите месяц" />
                </SelectTrigger>
                <SelectContent>
                  {MONTHS.map((name, index) => (
                    <SelectItem key={index} value={String(index)}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
             <AddAbsenceDialog
              employees={employees}
              onAddAbsence={handleAddAbsence}
            />
            <AddEmployeeDialog onAddEmployee={handleAddEmployee} />
          </div>
        </div>
      </div>

      <CalendarGrid
        daysInPeriod={daysInMonth}
        employees={employees}
        absences={absences}
      />
    </div>
  );
}
