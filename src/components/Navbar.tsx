import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Logo from "../assets/ExpenseLogo.png"
import Graph from "../assets/Expensegraph.png"
import { useFilter } from '../Context';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamsList } from "../routes/ProtectedRoute";
import { useNavigation } from "@react-navigation/native";

type NavigationProp = NativeStackNavigationProp<RootStackParamsList, "Home">;

export default function Navbar() {
     const navigation = useNavigation<NavigationProp>();
    const { daterange, expenseData, setTotalAmount } = useFilter();
    
    
    const totalExpense = expenseData.reduce(
        (acc: number, expense: any) => acc + (expense.amount || 0),
        0
    );

    useEffect(() => {
        setTotalAmount(totalExpense);
    }, [expenseData]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.navbar}>
                <View style={styles.navbarLeft}>
                    <Image source={Logo} style={styles.logo} />
                    <View style={styles.title}>
                        <Text style={styles.navbartitle1}>Expense</Text>
                        <Text style={styles.navbartitle2}>Tracker</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={()=>navigation.navigate("Profile")} style={styles.navbarRight}>
                    <Ionicons name="menu" size={42} color="white" />
                </TouchableOpacity>
            </View>

            {/* Total Expenses Section */}
            <View style={styles.totalExpensesContainer}>
                <View style={styles.content}>
                    <Text style={styles.totalLabel}>Total Expense</Text>

                    {/* ✅ Show reduced total */}
                    <Text style={styles.totalAmount}>
                        ₹{totalExpense.toFixed(2)}
                    </Text>

                    {/* ✅ Show date range */}
                    <Text>
                        {daterange.startDate} - {daterange.endDate}
                    </Text>
                </View>

                <Image source={Graph} style={styles.graph} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 320,
        justifyContent: "flex-start",
        backgroundColor: "white",
        borderBottomRightRadius: 30,
        borderBottomLeftRadius: 30,
    },
    navbar: {
        height: 120,
        backgroundColor: "#337AB7",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 50,
        paddingHorizontal: 5,
    },
    navbarLeft: {
        width: "80%",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingLeft: 10,
    },
    logo: {
        width: "20%",
        aspectRatio: 1/ 1,
        // borderWidth:1,
        // borderColor:"red"
    },
    title: {
        width: "75%",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    navbartitle1: {
        color: "black",
        fontSize: 24,
    },
    navbartitle2: {
        color: "white",
        fontSize: 24,
    },
    navbarRight:{
      
        marginRight:10
    },
    totalExpensesContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingHorizontal: 5,
        height: 180,
    },
    content: {
        width: "50%",
        height: 100,
        paddingLeft: 10,
        justifyContent: "space-around",
    },
    totalLabel: {
        fontSize: 18,
        color: "black",
        fontWeight: "500",
    },
    totalAmount: {
        fontSize: 30,
        color: "black",
        fontWeight: "600",
    },
    graph: {
        width: "40%",
        aspectRatio: 5 / 4,
    },
});
