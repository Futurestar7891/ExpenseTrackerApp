import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Logo from '../assets/ExpenseLogo.png';
import { useFilter } from '../Context';
import { FetchExpenses } from '../utils/Fetchexpenses';
import Expensedata from '../components/Expensedata';
import { RootStackParamsList } from '../routes/ProtectedRoute';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamsList, "Addexpense">;

export default function AddExpense({ route, navigation }: Props) {
    const [expandheight, setExpandHeight] = useState(false);
    const {
        choosecat,
        toggleChooseCategory,
        setExpenseData,
        setDateRange,
        filters,
    } = useFilter();
    const [amount, setAmount] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [amounterror, setAmountError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    // Check if editing an existing expense
    const editingExpense = route.params?.expense;

    useEffect(() => {
        if (editingExpense) {
            setAmount(editingExpense.amount.toString());
            setDescription(editingExpense.text || '');
            
            toggleChooseCategory(editingExpense.category);
        }
    }, [editingExpense]);

    const MakeExpense = async () => {
        const numAmount = Number(amount);

        if (isNaN(numAmount) || numAmount < 0) {
            setAmountError('Please enter a valid amount');
            return;
        }

        const chosenCategory = choosecat.find(cat => cat.chosed === true);
        if (!chosenCategory) {
            Alert.alert('Validation Error', 'Please select a category');
            return;
        }

        try {
            setLoading(true);

            const url = editingExpense
                ? `http://localhost:3000/api/update-expense/${editingExpense._id}`
                : 'http://localhost:3000/api/add-expense';

            const method = editingExpense ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    category: chosenCategory.name,
                    amount: numAmount,
                    text: description,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setAmount('');
                setDescription('');
                FetchExpenses(setExpenseData, setDateRange, filters);
                navigation.goBack(); // return to previous screen
            } else {
                if (data.fielderror === 'amount') setAmountError(data.message);
                else Alert.alert('Error', data.message);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Server error, please try again later');
        } finally {
            setLoading(false);
        }
    };

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
                <TouchableOpacity onPress={() => navigation.navigate("Profile")} style={styles.navbarRight}>
                    <Ionicons name="menu" size={42} color="white" />
                </TouchableOpacity>
            </View>

            <View style={styles.scrollWrapper}>
                <View style={styles.choosecat}>
                    <Text style={styles.choosecattext}>Select Category</Text>
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.catContentContainer}
                >
                    {choosecat.map(cat => (
                        <TouchableOpacity
                            key={cat.name}
                            onPress={() => toggleChooseCategory(cat.name)}
                            style={[styles.catbutton, cat.chosed && styles.selectedButton]}
                        >
                            <Text style={[styles.catText, cat.chosed && styles.selectedText]}>
                                {cat.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {!expandheight && (
                <View style={styles.addexpensecontainer}>
                    <View style={styles.amountRow}>
                        <Text style={styles.symbol}>₹</Text>
                        <TextInput
                            placeholder="0.0"
                            placeholderTextColor="#aaa"
                            keyboardType="numeric"
                            value={amount}
                            onChangeText={text => {
                                setAmount(text);
                                setAmountError('');
                            }}
                            style={styles.amountInput}
                        />
                    </View>
                    {amounterror ? <Text style={styles.error}>{amounterror}</Text> : null}

                    <TextInput
                        placeholder="What did you spend on?"
                        placeholderTextColor="#aaa"
                        style={styles.input}
                        value={description}
                        onChangeText={setDescription}
                    />

                    <TouchableOpacity onPress={MakeExpense} style={styles.addButton}>
                        <Text style={styles.addButtonText}>
                            {editingExpense ? 'Update Expense' : 'Add Expense'}
                        </Text>
                    </TouchableOpacity>
                </View>
            )}

            <Expensedata
                expandheight={expandheight}
                onToggle={() => setExpandHeight(!expandheight)}
            />

            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: '#E9EDF2',
        borderBottomRightRadius: 30,
        borderBottomLeftRadius: 30,
    },
    navbar: {
        height: 120,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: 5,
        backgroundColor: '#337AB7',
    },
    navbarLeft: {
        width: '80%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 10,
    },
    logo: { width: '20%', aspectRatio: 1 / 1 },
    title: {
        width: '75%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    navbartitle1: { color: 'black', fontSize: 24 },
    navbartitle2: { color: 'white', fontSize: 24 },
    navbarRight: {
        marginRight: 10
    },
    scrollWrapper: {
        height: 100,
        justifyContent: 'center',
        marginVertical: 5,
        marginHorizontal: 3,
        paddingTop: 5,
    },
    choosecat: { padding: 5, justifyContent: 'flex-end' },
    choosecattext: { fontSize: 18, fontWeight: '500' },
    catContentContainer: {
        paddingHorizontal: 0,
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
    },
    catbutton: {
        backgroundColor: 'grey',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 15,
        marginHorizontal: 4,
        justifyContent: 'center',
    },
    selectedButton: { backgroundColor: 'blue' },
    catText: { color: 'black', fontSize: 14 },
    selectedText: { color: 'white', fontWeight: '700' },
    addexpensecontainer: {
        backgroundColor: '#fff',
        padding: 20,
        marginHorizontal: 3,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        marginBottom: 5,
    },
    symbol: { fontSize: 28, color: '#4CAFED', fontWeight: 'bold' },
    amountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        width: '100%',
    },
    amountInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 26,
        fontWeight: 'bold',
        color: '#222',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        paddingVertical: 4,
    },
    input: {
        width: '100%',
        padding: 12,
        backgroundColor: '#F2F4F7',
        borderRadius: 12,
        marginBottom: 16,
        fontSize: 16,
        color: '#333',
    },
    addButton: {
        width: '100%',
        paddingVertical: 14,
        borderRadius: 30,
        backgroundColor: 'green',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addButtonText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
    error: { color: 'red' },
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
});
