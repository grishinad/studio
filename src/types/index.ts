export type Organization = {
  id: string;
  name: string;
  chief?: string;
};

export enum AbsenceType {
  ANNUAL_LEAVE,      // отпуск ежегодный
  BUSINESS_TRIP,     // командировка
  SICK_LEAVE,        // больничный
  MATERNITY_LEAVE,   // отпуск декретный
  UNPAID_LEAVE,      // отгул за свой счет
  ABSENTEEISM,       // прогул
  OTHER              // другое
}

export const absenceTypeDetails: { [key in AbsenceType]: { name: string, colorClass: string } } = {
  [AbsenceType.ANNUAL_LEAVE]: { name: 'отпуск ежегодный', colorClass: 'bg-green-400/80 hover:bg-green-400 text-green-950' },
  [AbsenceType.BUSINESS_TRIP]: { name: 'командировка', colorClass: 'bg-pink-400/80 hover:bg-pink-400 text-pink-950' },
  [AbsenceType.SICK_LEAVE]: { name: 'больничный', colorClass: 'bg-orange-400/80 hover:bg-orange-400 text-orange-950' },
  [AbsenceType.MATERNITY_LEAVE]: { name: 'отпуск декретный', colorClass: 'bg-blue-400/80 hover:bg-blue-400 text-blue-950' },
  [AbsenceType.UNPAID_LEAVE]: { name: 'отгул за свой счет', colorClass: 'bg-slate-400/80 hover:bg-slate-400 text-slate-950' },
  [AbsenceType.ABSENTEEISM]: { name: 'прогул', colorClass: 'bg-red-500/80 hover:bg-red-500 text-white' },
  [AbsenceType.OTHER]: { name: 'другое', colorClass: 'bg-teal-400/80 hover:bg-teal-400 text-teal-950' },
};

export const absenceTypeToString = (type: AbsenceType): string => {
  return absenceTypeDetails[type]?.name || 'Неизвестный тип';
};

export const absenceTypeToColorClass = (type: AbsenceType): string => {
  return absenceTypeDetails[type]?.colorClass || 'bg-primary/80 hover:bg-primary text-primary-foreground';
};

export type Absence = {
  id: string;
  organizationId: string;
  startDate: Date;
  endDate: Date;
  absenceType: AbsenceType;
  replacement?: string;
};

export type Holiday = {
  date: string;
  name: string;
};
