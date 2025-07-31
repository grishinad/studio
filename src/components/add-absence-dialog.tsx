'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, PlusCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { Employee } from '@/types';
import { useState } from 'react';
import { ru } from 'date-fns/locale';
import { Input } from './ui/input';

const formSchema = z
  .object({
    employeeId: z.string({ required_error: 'Пожалуйста, выберите сотрудника.' }),
    dateRange: z.object({
      from: z.date({ required_error: 'Требуется дата начала.' }),
      to: z.date({ required_error: 'Требуется дата окончания.' }),
    }),
    absenceType: z.string({ required_error: 'Пожалуйста, выберите тип отсутствия.' }),
    replacement: z.string().optional(),
  })
  .refine(data => data.dateRange.from <= data.dateRange.to, {
    message: 'Дата окончания должна быть после даты начала.',
    path: ['dateRange'],
  });

type AddAbsenceDialogProps = {
  employees: Employee[];
  onAddAbsence: (
    employeeId: string,
    dateRange: DateRange,
    absenceType: string,
    replacement?: string
  ) => void;
};

export function AddAbsenceDialog({
  employees,
  onAddAbsence,
}: AddAbsenceDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.dateRange.from && values.dateRange.to) {
      onAddAbsence(values.employeeId, values.dateRange, values.absenceType, values.replacement);
      form.reset();
      setIsOpen(false);
    }
  }

  const absenceTypes = [
    'отпуск ежегодный',
    'командировка',
    'больничный',
    'отпуск декретный',
    'отгул за свой счет',
    'прогул',
    'другое',
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <PlusCircle />
          Добавить отсутствие
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Добавить отсутствие сотрудника</DialogTitle>
          <DialogDescription>
            Выберите сотрудника, диапазон дат и тип его отсутствия.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="employeeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Сотрудник</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите сотрудника" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {employees.map(employee => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="absenceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тип отсутствия</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип отсутствия" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {absenceTypes.map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

             <FormField
              control={form.control}
              name="replacement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Исполняющий обязанности</FormLabel>
                  <FormControl>
                    <Input placeholder="например, Сергей Смирнов" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateRange"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Даты отсутствия</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'pl-3 text-left font-normal',
                            !field.value?.from && 'text-muted-foreground'
                          )}
                        >
                          {field.value?.from ? (
                            field.value.to ? (
                              <>
                                {format(field.value.from, 'LLL dd, y', { locale: ru })} -{' '}
                                {format(field.value.to, 'LLL dd, y', { locale: ru })}
                              </>
                            ) : (
                              format(field.value.from, 'LLL dd, y', { locale: ru })
                            )
                          ) : (
                            <span>Выберите диапазон дат</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        locale={ru}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Добавить отсутствие</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
