import { ExpenseState, dateRangeState } from '../Context';

export const FetchExpenses = async (
  setExpenseData: React.Dispatch<React.SetStateAction<ExpenseState>>,
  setDateRange: React.Dispatch<React.SetStateAction<dateRangeState>>,
  filters?: any,
) => {
  try {
    console.log("fetching expense");
    const params = new URLSearchParams();

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

      // Dates
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
    }

    const response = await fetch(
      `http://localhost:3000/api/get-expense?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      },
    );

    const data = await response.json();
    if (data.success) {
      setExpenseData(data.expenses);

      const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
      };

      // ✅ Update date range from backend
      if (data.daterange) {
        setDateRange({
          startDate: formatDate(data.daterange.startDate),
          endDate: formatDate(data.daterange.endDate),
        });
      }
    } else {
      console.error('Failed to fetch expenses:', data.message);
    }
  } catch (error) {
    console.error('Error fetching expenses:', error);
  }
};
