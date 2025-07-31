export type Organization = {
  id: string;
  name: string;
  chief?: string;
};

export type Absence = {
  id: string;
  organizationId: string;
  startDate: Date;
  endDate: Date;
  absenceType: string;
  replacement?: string;
};

export type Holiday = {
  date: string;
  name: string;
};
