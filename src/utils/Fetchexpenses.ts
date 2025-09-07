import { ExpenseState, dateRangeState } from '../Context';
import { API_ENDPOINT } from '@env';

export const FetchExpenses = async (
  setExpenseData: React.Dispatch<React.SetStateAction<ExpenseState>>,
  setDateRange: React.Dispatch<React.SetStateAction<dateRangeState>>,
  filters?: any,
) => {
  try {
    
    const params = new URLSearchParams();

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    params.append('timezone', timezone);

    if (filters) {
      // Categories
      if (filters.categories && filters.categories.length > 0) {
        filters.categories.forEach(
          (cat: { name: string; selected: boolean }) => {
            if (cat.selected) params.append('categories', cat.name);
          },
        );
      }

      // Amount
      if (filters.minAmount)
        params.append('minAmount', filters.minAmount.toString());
      if (filters.maxAmount)
        params.append('maxAmount', filters.maxAmount.toString());

      // Dates (already in yyyy-mm-dd from FiltersAndCategories)
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
    }
    
    console.log(filters.startDate);
    console.log(filters.endDate);

    const response = await fetch(
      `${API_ENDPOINT}/api/get-expense?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      },
    );

    const data = await response.json();

    if (!data.success) {
      if (data.fielderror) {
         console.log(data.fielderror);
      }
    }

    if (data.success) {
      setExpenseData(data.expenses);

      // ✅ Update date range in context
      if (data.daterange) {
        setDateRange({
          startDate: data.daterange.startDate,
          endDate: data.daterange.endDate,
        });
      }
    }
  } catch (error) {
    console.error('Error fetching expenses:', error);
  } 
};
