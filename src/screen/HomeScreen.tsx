import React, { useEffect, useState } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Text,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Navbar from "../components/Navbar";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamsList } from "../routes/ProtectedRoute";
import { useFilter } from "../Context";
import { FetchCategories } from "../utils/Fetchcategory";
import FiltersAndCategories from "../components/Filtersandcategories";
import { FetchExpenses } from "../utils/Fetchexpenses";
import Expensedata from "../components/Expensedata";
import { fetchLoginStatus } from "../utils/Fetchloginstatus";

type Props = NativeStackScreenProps<RootStackParamsList, "Home">;

export default function HomeScreen({ navigation }: Props) {
    const {
        setCategories,
        setExpenseData,
        filters,
        setDateRange,
        setIsLoggedIn,
        setUser,
        
       
    } = useFilter();

    const [expandheight, setExpandHeight] = useState(false);
    const [loading, setLoading] = useState(true);
    const [slowMessage, setSlowMessage] = useState(false);

    // Fetch categories
    useEffect(() => {
        const timer = setTimeout(() => setSlowMessage(true), 5000);
        FetchCategories(setCategories, setLoading).finally(() => {
            clearTimeout(timer);
            setSlowMessage(false);
        });
    }, []);

    useEffect(()=>{
        fetchLoginStatus(setIsLoggedIn,setUser);
    },[])

    // Fetch expenses whenever filters change
    useEffect(() => {
        const timer = setTimeout(() => setSlowMessage(true), 5000);
        FetchExpenses(setExpenseData, setDateRange, filters ).finally(() => {
            clearTimeout(timer);
            setSlowMessage(false);
        });;
    }, [filters]);

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loaderText}>
                    {slowMessage
                        ? "Database is taking longer . Please wait..."
                        : "Loading data..."}
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Navbar />
            {!expandheight && <FiltersAndCategories />}
            <Expensedata
                expandheight={expandheight}
                onToggle={() => setExpandHeight(!expandheight)}
            />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate("Addexpense")}
            >
                <Icon name="add" size={30} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E9EDF2",
    },
    fab: {
        position: "absolute",
        right: 20,
        bottom: 20,
        backgroundColor: "#007AFF",
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E9EDF2",
    },
    loaderText: {
        marginTop: 10,
        fontSize: 16,
        color: "#333",
        textAlign: "center",
        paddingHorizontal: 20,
    },
});
