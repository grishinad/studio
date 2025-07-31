'use client';

import { AddAbsenceDialog } from '@/components/add-absence-dialog';
import { AddOrganizationDialog } from '@/components/add-organization-dialog';
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
import type { Absence, Organization, AbsenceType } from '@/types';
import { useState, useMemo, useEffect, useCallback } from 'react';
import type { DateRange } from 'react-day-picker';
import { fetchDataForMonth, addOrganization, addAbsence } from '@/services/api';

export default function YearlyAbsenceTracker() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const daysInMonth = useMemo(() => getDaysInMonthForYear(year, month), [year, month]);

  const loadData = useCallback(async (y: number, m: number) => {
    setIsLoading(true);
    try {
      const { organizations: orgs, absences: abs } = await fetchDataForMonth(y, m);
      setOrganizations(orgs);
      setAbsences(abs);
    } catch (error) {
      console.error("Failed to fetch data", error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить данные. Попробуйте снова.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData(year, month);
  }, [year, month, loadData]);

  const handleAddOrganization = async (name: string, chief?: string) => {
    try {
      const newOrganization = await addOrganization(name, chief);
      setOrganizations(prev => [...prev, newOrganization]);
      toast({
        title: 'Организация добавлена',
        description: `${name} была добавлена в трекер.`,
      });
    } catch (error) {
       console.error("Failed to add organization", error);
       toast({
        title: 'Ошибка',
        description: 'Не удалось добавить организацию.',
        variant: 'destructive',
      });
    }
  };

  const handleAddAbsence = async (
    organizationId: string,
    dateRange: DateRange,
    absenceType: AbsenceType,
    replacement?: string
  ) => {
    if (dateRange.from && dateRange.to) {
      try {
        const newAbsence = await addAbsence(organizationId, {from: dateRange.from, to: dateRange.to}, absenceType, replacement);
        setAbsences(prev => [...prev, newAbsence]);
        const organization = organizations.find(e => e.id === organizationId);
        toast({
          title: 'Отсутствие добавлено',
          description: `Отсутствие для ${organization?.name} было записано.`,
        });
      } catch (error) {
        console.error("Failed to add absence", error);
        toast({
          title: 'Ошибка',
          description: 'Не удалось добавить отсутствие.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
        setYear(new Date().getFullYear());
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
  
  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(prev => prev - 1);
    } else {
      setMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(prev => prev + 1);
    } else {
      setMonth(prev => prev + 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="px-4 sm:px-6">
        <header className="space-y-2 pt-6">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Трекер отсутствий
          </h1>
        </header>
      </div>
      
      <div className="px-4 sm:px-6">
        <div className="p-4 sm:p-6 bg-card border rounded-lg shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="space-y-2">
                <Label htmlFor="year-input">Год</Label>
                <Input
                  id="year-input"
                  type="number"
                  value={year === 0 ? '' : year}
                  onChange={handleYearChange}
                  className="w-full sm:w-[120px]"
                  placeholder="ГГГГ"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="month-select">Месяц</Label>
                <Select value={String(month)} onValueChange={handleMonthChange}>
                  <SelectTrigger id="month-select" className="w-full sm:w-[180px]">
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

            <div className="flex flex-col sm:flex-row gap-2">
              <AddAbsenceDialog
                organizations={organizations}
                onAddAbsence={handleAddAbsence}
              />
              <AddOrganizationDialog onAddOrganization={handleAddOrganization} />
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center p-8">Загрузка данных...</div>
      ) : (
        <CalendarGrid
          daysInPeriod={daysInMonth}
          organizations={organizations}
          absences={absences}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
        />
      )}
    </div>
  );
}
