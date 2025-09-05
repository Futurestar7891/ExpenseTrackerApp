import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Login from "../screen/Login";
import Signup from "../screen/Signup";
import Changepassword from "../screen/Changepassword";

export type RootStackParamsList = {
  Login: undefined,
  Signup: undefined,
  Changepassword:{email:string}
}

const Stack = createNativeStackNavigator<RootStackParamsList>();

export default function PublicRoute() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Changepassword" component={Changepassword}/>
      </Stack.Navigator>
    </NavigationContainer>

  );
}


