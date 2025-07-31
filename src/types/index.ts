export type Organization = {
  id: string;
  name: string;
};

export type Absence = {
  id: string;
  organizationId: string;
  startDate: Date;
  endDate: Date;
  absenceType: string;
  replacement?: string;
};
