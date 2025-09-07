import { UserDetails } from '../Context';
import { API_ENDPOINT } from '@env';
export const fetchLoginStatus = async (
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>,
  setUser: React.Dispatch<React.SetStateAction<UserDetails | null>>,
) => {
  try {
    console.log('run the loginstatus');
    const res = await fetch(
      `${API_ENDPOINT}/api/fetch-login-status`,
      {
        method: 'GET',
        credentials: 'include',
      },
    );

    const data = await res.json();

    if (data.status === '401') {
      setIsLoggedIn(false);
    }

    if (data.success && data.user) {
      setIsLoggedIn(true);
      setUser({
        name: data.user.name,
        email: data.user.email,
        photo: data.user.photo,
      });
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  } catch {
    setIsLoggedIn(false);
    setUser(null);
  }
};
