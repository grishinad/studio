'use server';

import { Absence, AbsenceType, Organization } from "@/types";

type BackendAbsence = {
  start_date: number; // timestamp
  end_date: number; // timestamp
  type: number; // Now a number
  deputy?: string;
};

type BackendOrganizationData = {
  name: string;
  chief: string;
  absences: BackendAbsence[];
};

type ApiResponse = {
  items: BackendOrganizationData[];
};

const API_HOST = 'http://localhost:8000'

export const fetchDataForMonth = async (year: number, month: number): Promise<{ organizations: Organization[], absences: Absence[] }> => {
  // Mocking the API response as the backend is not implemented.
  // In a real scenario, you would fetch from an actual API endpoint.
  console.log(`Fetching data for ${year}-${month + 1}`);

  const response = await fetch(`${API_HOST}/data?year=${year}&month=${month+1}`);
  const data: BackendOrganizationData[] = await response.json();

  const organizations: Organization[] = [];
  const absences: Absence[] = [];

  data.forEach((item, index) => {
    const orgId = String(index + 1);
    organizations.push({
      id: orgId,
      name: item.name,
      chief: item.chief,
    });

    item.absences.forEach(backendAbsence => {
      absences.push({
        id: crypto.randomUUID(),
        organizationId: orgId,
        startDate: new Date(backendAbsence.start_date),
        endDate: new Date(backendAbsence.end_date),
        absenceType: backendAbsence.type as AbsenceType,
        replacement: backendAbsence.deputy,
      });
    });
  });

  return { organizations, absences };
};

export const addOrganization = async (name: string, chief?: string): Promise<Organization> => {
  
  console.log(`Submitting new organization: ${name}`, { chief });
  
  const response = await fetch(`${API_HOST}/organizations/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, chief }),
  });

  return await response.json();
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
  const response = await fetch(`${API_HOST}/absences`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
       organization_id: organizationId,
       start_date: dateRange.from.getTime(), // Use getTime() for timestamp
       end_date: dateRange.to.getTime(), // Use getTime() for timestamp
       type: absenceType,
       deputy: replacement
    }),
  });
  const newAbsence: Absence = await response.json();
  
  return Promise.resolve(newAbsence);
};
