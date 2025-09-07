import { Alert } from 'react-native';
import { API_ENDPOINT } from '@env';
export const DeleteExpense = async (
  id: string,
  refreshExpenses: () => void,
  setLoading: (loading: boolean) => void,
) => {
  try {
    setLoading(true);
    console.log(id, 'reached');

    const response = await fetch(`${API_ENDPOINT}/api/delete-expense/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const data = await response.json();

    if (data.success) {
      Alert.alert('Success', 'Expense deleted successfully');
      refreshExpenses();
    } else {
      Alert.alert('Error', data.message);
    }
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'Server error, please try again later');
  } finally {
    setLoading(false);
  }
};
