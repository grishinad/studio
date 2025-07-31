const API_BASE_URL = 'YOUR_BACKEND_API_URL'; // Replace with your actual backend URL

export const getEmployees = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees`);
    if (!response.ok) {
      throw new Error('Failed to fetch employees');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error; // Re-throw to be handled by the caller
  }
};

export const addEmployee = async (employeeData: { name: string }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData),
    });
    if (!response.ok) {
      throw new Error('Failed to add employee');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding employee:', error);
    throw error;
  }
};

export const getAbsences = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/absences`);
    if (!response.ok) {
      throw new Error('Failed to fetch absences');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching absences:', error);
    throw error;
  }
};

export const addAbsence = async (absenceData: { employeeId: string; startDate: string; endDate: string }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/absences`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(absenceData),
    });
    if (!response.ok) {
      throw new Error('Failed to add absence');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding absence:', error);
    throw error;
  }
};