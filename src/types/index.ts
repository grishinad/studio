export type Employee = {
  id: string;
  name: string;
};

export type Absence = {
  id: string;
  employeeId: string;
  startDate: Date;
  endDate: Date;
  absenceType: string;
  replacement?: string;
};
