'use client';

import {
  differenceInCalendarDays,
  format,
  isWithinInterval,
} from 'date-fns';

import { CalendarGridHeaders } from '@/components/calendar-grid-headers';
import { isWeekend } from '@/lib/dates';
import { cn } from '@/lib/utils';
import type { Absence, Organization } from '@/types';
import { absenceTypeToString, absenceTypeToColorClass } from '@/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { useMemo } from 'react';

type CalendarGridProps = {
  daysInPeriod: Date[];
  organizations: Organization[];
  absences: Absence[];
  onPrevMonth: () => void;
  onNextMonth: () => void;
};

export function CalendarGrid({
  daysInPeriod,
  organizations,
  absences,
  onPrevMonth,
  onNextMonth,
}: CalendarGridProps) {
  const isMobile = useIsMobile();

  const getAbsencesForOrganization = (organizationId: string) => {
    return absences.filter(absence => absence.organizationId === organizationId);
  };

  const periodInterval = useMemo(() => {
      if (!daysInPeriod || daysInPeriod.length === 0) {
        return { start: new Date(), end: new Date() };
      }
      return {
        start: daysInPeriod[0],
        end: daysInPeriod[daysInPeriod.length - 1],
      }
  }, [daysInPeriod]);


  const renderOrganizationRow = (organization: Organization) => {
    const organizationAbsences = getAbsencesForOrganization(organization.id);
    const cells = [];
    let i = 0;
    while (i < daysInPeriod.length) {
      const day = daysInPeriod[i];
      const absence = organizationAbsences.find(a =>
        isWithinInterval(day, { start: a.startDate, end: a.endDate })
      );

      if (absence) {
        const absenceInterval = { start: absence.startDate, end: absence.endDate };
        
        if (absenceInterval.start > periodInterval.end || absenceInterval.end < periodInterval.start) {
            i++;
            continue;
        }

        const intervalStart = absence.startDate > periodInterval.start ? absence.startDate : periodInterval.start;
        let duration = differenceInCalendarDays(absence.endDate, day) + 1;
        
        const colSpan = Math.min(duration, daysInPeriod.length - i);
        const absenceTypeName = absenceTypeToString(absence.absenceType);
        const absenceColorClass = absenceTypeToColorClass(absence.absenceType);
        
        const AbsenceInfo = ({isTooltip}: {isTooltip?: boolean}) => (
          <div className={cn("transition-colors duration-200 rounded-md h-full flex flex-col items-center justify-center text-xs px-2 shadow-sm text-center leading-tight", absenceColorClass, isTooltip ? "cursor-help" : "cursor-pointer")}>
            <span className="truncate w-full">{absenceTypeName}</span>
            <span className="truncate w-full text-xs">
              ({format(absence.startDate, 'dd.MM')} - {format(absence.endDate, 'dd.MM')})
            </span>
          </div>
        )
        
        const AbsenceDetails = () => (
          <div className="space-y-1 text-sm">
            <p className="font-bold text-base">{absenceTypeName}</p>
            <p>{format(absence.startDate, 'dd.MM.yyyy')} - {format(absence.endDate, 'dd.MM.yyyy')}</p>
            {organization.chief && <p>Главный врач: {organization.chief}</p>}
            {absence.replacement && <p>Исполняющий обязанности: {absence.replacement}</p>}
          </div>
        )

        cells.push(
          <td
            key={format(day, 'yyyy-MM-dd')}
            colSpan={colSpan}
            className="p-0.5 border-r"
          >
            {isMobile ? (
              <Dialog>
                <DialogTrigger asChild>
                  <div className="h-full">
                    <AbsenceInfo />
                  </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{organization.name}</DialogTitle>
                    </DialogHeader>
                    <AbsenceDetails />
                </DialogContent>
              </Dialog>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                     <AbsenceInfo isTooltip={true} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <AbsenceDetails />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </td>
        );
        i += colSpan;
      } else {
        cells.push(
          <td
            key={format(day, 'yyyy-MM-dd')}
            className={cn(
              'h-8 w-10 border-r',
              isWeekend(day) && 'bg-muted/50',
            )}
          />
        );
        i++;
      }
    }
    return cells;
  };

  return (
    <div className="overflow-x-auto border rounded-lg shadow-md bg-card">
      <table className="min-w-full border-collapse table-fixed">
        <colgroup>
          <col style={{ width: '12rem' }} />
          {daysInPeriod.map((_, i) => (
            <col key={i} style={{ width: '2.5rem' }} />
          ))}
        </colgroup>
        <CalendarGridHeaders
          daysInPeriod={daysInPeriod}
          onPrevMonth={onPrevMonth}
          onNextMonth={onNextMonth}
        />
        <tbody className="text-sm">
          {organizations.map(organization => (
            <tr key={organization.id} className="border-t hover:bg-muted/30 h-10">
              <th className="sticky left-0 bg-card hover:bg-muted/30 p-2 font-medium text-left border-r whitespace-nowrap z-10">
                <div className="font-semibold">{organization.name}</div>
                {organization.chief && <div className="text-xs font-normal text-muted-foreground">{organization.chief}</div>}
              </th>
              {renderOrganizationRow(organization)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
