'use server';

import type { Absence, Organization } from "@/types";

type BackendAbsence = {
  from: number; // timestamp
  to: number; // timestamp
  type: string;
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
  // const response = await fetch(`${API_BASE_URL}/data?year=${year}&month=${month}`);
  // const data: ApiResponse = await response.json();
  
  console.log(`Fetching data for ${year}-${month + 1}`);

  const mockData: ApiResponse = {
    items: [
      {
        organization: 'ООО "Ромашка"',
        chief: 'Иванов Иван Иванович',
        absences: [
          { from: new Date(year, month, 10).getTime(), to: new Date(year, month, 14).getTime(), type: 'отпуск ежегодный', deputy: 'Сергей Смирнов' },
        ]
      },
      {
        organization: 'ИП Петров',
        chief: 'Петров Петр Петрович',
        absences: [
            { from: new Date(year, month, 20).getTime(), to: new Date(year, month, 28).getTime(), type: 'больничный' },
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
        absenceType: backendAbsence.type,
        replacement: backendAbsence.deputy,
      });
    });
  });

  return { organizations, absences };
};
