import { StyleSheet, View, ActivityIndicator } from "react-native";
import { FilterProvider, useFilter } from "./Context";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import { useEffect, useState } from "react";
import { fetchLoginStatus } from "./utils/Fetchloginstatus";

function AppContent() {
  const { isloggedin, setIsLoggedIn,setUser } = useFilter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    fetchLoginStatus(setIsLoggedIn, setUser).finally(() => setLoading(false));

    // Set interval to fetch every 30 seconds
    const interval = setInterval(() => {
      fetchLoginStatus(setIsLoggedIn, setUser);
    }, 12 * 60 * 60 * 1000); 

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return isloggedin ? <ProtectedRoute /> : <PublicRoute />;
}

export default function App() {
  return (
    <FilterProvider>
      <AppContent />
    </FilterProvider>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
