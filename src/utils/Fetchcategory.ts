import { API_ENDPOINT } from "@env";
export const FetchCategories = async (
  setCategories: (cats: string[]) => void,
  setLoading: (loading: boolean) => void,
) => {
  try {
    setLoading(true);
    const response = await fetch(
      `${API_ENDPOINT}/api/get-categories`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      },
    );

    const data = await response.json();
    if (data.success) {
      setCategories(data.categories);
    } else {
      console.error('Failed to fetch categories:', data.message);
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
  } finally {
    setLoading(false);
  }
};
