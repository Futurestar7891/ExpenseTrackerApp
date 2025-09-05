import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screen/HomeScreen";  
import ProfileScreen from "../screen/Profile"; 
import { NavigationContainer } from "@react-navigation/native";
import AddExpense from "../screen/AddExpense";
import Profile from "../screen/Profile";

export type Expense = {
    _id: string;
    amount: number;
    category: string;
    date: string;   
    text: string;
    user: string;  
    __v?: number;  
};

export type RootStackParamsList = {
    Home: undefined;
    Profile: undefined;
    Addexpense: { expense: Expense } | undefined;
};


const Stack = createNativeStackNavigator<RootStackParamsList>();

export default function ProtectedRoute() {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown:false}}>
                <Stack.Screen name="Home" component={HomeScreen}/>
                <Stack.Screen name="Addexpense" component={AddExpense}/>
                <Stack.Screen name="Profile" component={Profile}/>
            </Stack.Navigator>
           
        </NavigationContainer>
        
    );
}


