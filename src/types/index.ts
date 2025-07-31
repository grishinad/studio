export type Employee = {
  id: string;
  name: string;
};

export type Absence = {
  id: string;
  employeeId: string;
  startDate: Date;
  endDate: Date;
};

export type Holiday = {
  date: Date;
  name: string;
};
