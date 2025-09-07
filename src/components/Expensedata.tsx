import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useFilter } from "../Context";
import { DeleteExpense } from "../utils/Deleteexpense";
import { FetchExpenses } from "../utils/Fetchexpenses";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamsList } from "../routes/ProtectedRoute";

type NavigationProp = NativeStackNavigationProp<RootStackParamsList, "Home">;



interface Props {
    expandheight: boolean;
    onToggle: () => void;
}

export default function Expensedata({ expandheight, onToggle }: Props) {
    const { expenseData, filters, setDateRange, setExpenseData } = useFilter();
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<NavigationProp>();
    const formatDate = (isoDate: string) => {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, "0");
        const month = date.toLocaleString("en-US", { month: "short" }); 
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };


    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.itemContainer}>
            {/* Top Row: Category + Amount */}
            <View style={styles.row}>
                <Text style={styles.category}>{item.category}</Text>
                <Text style={styles.amount}>₹ {item.amount}</Text>
            </View>

            <Text style={styles.text}>{item.text}</Text>

            {/* Bottom Row: Date + Action Buttons */}
            <View style={styles.row}>
                <Text style={styles.date}>{formatDate(item.date)}</Text>
                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.iconBtn}
                        onPress={() =>
                            navigation.navigate("Addexpense", { expense: item }) 
                        }
                    >
                        <Ionicons name="create-outline" size={20} color="#007AFF" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() =>
                            DeleteExpense(
                                item._id,
                                () => FetchExpenses(setExpenseData, setDateRange, filters),
                                setLoading
                            )
                        }
                        style={styles.iconBtn}
                    >
                        <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Toggle Arrow */}
            <TouchableOpacity style={styles.toggleBtn} onPress={onToggle}>
                <Ionicons
                    name={expandheight ? "chevron-down" : "chevron-up"}
                    size={22}
                    color="#007AFF"
                />
            </TouchableOpacity>

            <FlatList
                data={expenseData}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                ListEmptyComponent={<Text style={styles.empty}>No expenses found</Text>}
            />

            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: "#F5F6FA" },
    toggleBtn: { alignSelf: "center", marginBottom: 5 },
    itemContainer: {
        backgroundColor: "white",
        padding: 14,
        marginBottom: 12,
        borderRadius: 12,
        elevation: 2,
    },
    row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    category: { fontSize: 16, fontWeight: "bold", color: "#007AFF" },
    amount: { fontSize: 16, fontWeight: "bold", color: "#28a745" },
    text: { fontSize: 14, color: "#444", marginVertical: 6 },
    date: { fontSize: 12, color: "#888" },
    actions: { flexDirection: "row", gap: 10 },
    iconBtn: { marginLeft: 10 },
    empty: { textAlign: "center", marginTop: 20, fontSize: 14, color: "#777" },
    loadingOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
});
