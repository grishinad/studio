'use server';

import { Absence, AbsenceType, Organization } from "@/types";

type BackendAbsence = {
  from: number; // timestamp
  to: number; // timestamp
  type: number; // Now a number
  deputy?: string;
};

type BackendOrganizationData = {
  organization: string;
  chief: string;
  absences: BackendAbsence[];
};

type ApiResponse = {
  items: BackendOrganizationData[];
};

export const fetchDataForMonth = async (year: number, month: number): Promise<{ organizations: Organization[], absences: Absence[] }> => {
  // Mocking the API response as the backend is not implemented.
  // In a real scenario, you would fetch from an actual API endpoint.
  // const response = await fetch(`https://your-api.com/data?year=${year}&month=${month}`);
  // const data: ApiResponse = await response.json();
  
  console.log(`Fetching data for ${year}-${month + 1}`);

  const mockData: ApiResponse = {
    items: [
      {
        organization: 'ООО "Ромашка"',
        chief: 'Иванов Иван Иванович',
        absences: [
          { from: new Date(year, month, 10).getTime(), to: new Date(year, month, 14).getTime(), type: 0, deputy: 'Сергей Смирнов' }, // AbsenceType.ANNUAL_LEAVE
        ]
      },
      {
        organization: 'ИП Петров',
        chief: 'Петров Петр Петрович',
        absences: [
            { from: new Date(year, month, 20).getTime(), to: new Date(year, month, 28).getTime(), type: 2 }, // AbsenceType.SICK_LEAVE
        ]
      },
      {
        organization: 'АО "Вымпел"',
        chief: 'Сидоров Сидор Сидорович',
        absences: []
      }
    ]
  };

  const organizations: Organization[] = [];
  const absences: Absence[] = [];

  mockData.items.forEach((item, index) => {
    const orgId = String(index + 1);
    organizations.push({
      id: orgId,
      name: item.organization,
      chief: item.chief,
    });

    item.absences.forEach(backendAbsence => {
      absences.push({
        id: crypto.randomUUID(),
        organizationId: orgId,
        startDate: new Date(backendAbsence.from),
        endDate: new Date(backendAbsence.to),
        absenceType: backendAbsence.type as AbsenceType,
        replacement: backendAbsence.deputy,
      });
    });
  });

  return { organizations, absences };
};

export const addOrganization = async (name: string, chief?: string): Promise<Organization> => {
  console.log(`Submitting new organization: ${name}`, { chief });
  // In a real app, you would make a POST request to your backend
  // const response = await fetch('https://your-api.com/organizations', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ organization: name, chief }),
  // });
  // const newOrganization = await response.json();
  // return newOrganization;

  // Mocking the API response
  const newOrganization: Organization = {
    id: crypto.randomUUID(),
    name,
    chief: chief || 'Не назначен',
  };
  return Promise.resolve(newOrganization);
};

export const addAbsence = async (
  organizationId: string,
  dateRange: { from: Date; to: Date },
  absenceType: AbsenceType,
  replacement?: string
): Promise<Absence> => {
  console.log('Submitting new absence:', {
    organizationId,
    ...dateRange,
    absenceType,
    replacement,
  });
  // In a real app, you would make a POST request to your backend
  // const response = await fetch('https://your-api.com/absences', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ 
  //      organizationId,
  //      from: dateRange.from.getTime(),
  //      to: dateRange.to.getTime(),
  //      type: absenceType,
  //      deputy: replacement
  //   }),
  // });
  // const newAbsence = await response.json();
  // return newAbsence;

  // Mocking the API response
  const newAbsence: Absence = {
    id: crypto.randomUUID(),
    organizationId,
    startDate: dateRange.from,
    endDate: dateRange.to,
    absenceType,
    replacement,
  };
  return Promise.resolve(newAbsence);
};
