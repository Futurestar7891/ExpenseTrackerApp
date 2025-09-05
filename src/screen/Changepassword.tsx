import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { RouteProp } from "@react-navigation/native";
import { RootStackParamsList } from "../routes/PublicRoute";

// Define the route props type
type ChangePasswordScreenRouteProp = RouteProp<RootStackParamsList, 'Changepassword'>;


type Props = {
    route: ChangePasswordScreenRouteProp;
};

export default function Changepassword({ route,navigation }: Props) {
    const { email } = route.params; 
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [newPasswordError, setNewPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [apiError, setApiError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState('');

    const checkPasswordStrength = (password: string) => {
        if (password.length === 0) return '';

        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;

        if (strength === 5) return 'Strong';
        if (strength >= 3) return 'Medium';
        return 'Weak';
    };

    const getStrengthColor = () => {
        switch (passwordStrength) {
            case 'Strong': return '#4CAF50';
            case 'Medium': return '#FF9800';
            case 'Weak': return '#F44336';
            default: return '#666';
        }
    };

    const validatePassword = () => {
        let isValid = true;

        // Reset errors
        setNewPasswordError('');
        setConfirmPasswordError('');

        // Validate new password
        if (!newPassword) {
            setNewPasswordError('Password is required');
            isValid = false;
        } else if (newPassword.length < 8) {
            setNewPasswordError('Password must be at least 8 characters');
            isValid = false;
        } else if (!/(?=.*[a-z])/.test(newPassword)) {
            setNewPasswordError('Must include lowercase letter');
            isValid = false;
        } else if (!/(?=.*[A-Z])/.test(newPassword)) {
            setNewPasswordError('Must include uppercase letter');
            isValid = false;
        } else if (!/(?=.*\d)/.test(newPassword)) {
            setNewPasswordError('Must include number');
            isValid = false;
        } else if (!/(?=.*[@$!%*?&])/.test(newPassword)) {
            setNewPasswordError('Must include special character (@$!%*?&)');
            isValid = false;
        }

        // Validate confirm password
        if (!confirmPassword) {
            setConfirmPasswordError('Please confirm your password');
            isValid = false;
        } else if (newPassword !== confirmPassword) {
            setConfirmPasswordError('Passwords do not match');
            isValid = false;
        }

        return isValid;
    };

    const handlePasswordChange = (text: string) => {
        setNewPassword(text);
        setPasswordStrength(checkPasswordStrength(text));
        if (newPasswordError) setNewPasswordError('');
    };

    const handleResetPassword = async () => {
        if (!validatePassword()) return;

        setIsLoading(true);
        setApiError('');
        
        try {
            const response = await fetch('http://localhost:3000/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    newPassword,
                    confirmPassword
                }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Password reset successfully');
                setNewPassword('');
                setConfirmPassword('');
                setPasswordStrength('');

                navigation.navigate("Login");
                
            } else {
                // Handle backend validation errors
                if (data.errors && Array.isArray(data.errors)) {
                    data.errors.forEach(error => {
                        if (error.errorfield === 'newPassword') {
                            setNewPasswordError(error.message);
                        } else if (error.errorfield === 'confirmPassword') {
                            setConfirmPasswordError(error.message);
                        } else {
                            setApiError(error.message);
                        }
                    });
                } else {
                    setApiError(data.message || 'Failed to reset password');
                }
            }
        } catch (error) {
            setApiError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Reset Password for {email}</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>New Password</Text>
                <View style={[styles.passwordInput, newPasswordError && styles.inputError]}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter new password"
                        secureTextEntry={!showNewPassword}
                        value={newPassword}
                        onChangeText={handlePasswordChange}
                        autoCapitalize="none"
                        editable={!isLoading}
                        selectionColor="black"
                    />
                    <TouchableOpacity
                        onPress={() => setShowNewPassword(!showNewPassword)}
                        style={styles.eyeIcon}
                        disabled={isLoading}
                    >
                        <Icon
                            name={showNewPassword ? 'eye-off' : 'eye'}
                            size={24}
                            color="#666"
                        />
                    </TouchableOpacity>
                </View>
                {newPasswordError ? <Text style={styles.errorText}>{newPasswordError}</Text> : null}
            </View>

            <View style={styles.strengthContainer}>
                <Text style={styles.strengthLabel}>Password Strength</Text>
                <Text style={[styles.strengthValue, { color: getStrengthColor() }]}>
                    {passwordStrength || 'None'}
                </Text>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm New Password</Text>
                <View style={[styles.passwordInput, confirmPasswordError && styles.inputError]}>
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm new password"
                        secureTextEntry={!showConfirmPassword}
                        value={confirmPassword}
                        onChangeText={(text) => {
                            setConfirmPassword(text);
                            if (confirmPasswordError) setConfirmPasswordError('');
                        }}
                        autoCapitalize="none"
                        editable={!isLoading}
                        selectionColor="black"
                    />
                    <TouchableOpacity
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={styles.eyeIcon}
                        disabled={isLoading}
                    >
                        <Icon
                            name={showConfirmPassword ? 'eye-off' : 'eye'}
                            size={24}
                            color="#666"
                        />
                    </TouchableOpacity>
                </View>
                {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
            </View>

            {apiError ? <Text style={styles.apiErrorText}>{apiError}</Text> : null}

            <TouchableOpacity
                style={[styles.resetButton, isLoading && styles.disabledButton]}
                onPress={handleResetPassword}
                disabled={isLoading}
            >
                {isLoading ? (
                    <Text style={styles.resetButtonText}>wait please ---</Text>

                ) : (
                    <Text style={styles.resetButtonText}>Reset Password</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        paddingTop: 60,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        color: '#333',
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    passwordInput: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    input: {
        flex: 1,
        padding: 15,
        fontSize: 16,
        color:"black"
    },
    inputError: {
        borderColor: '#F44336',
        borderWidth: 1.5,
    },
    eyeIcon: {
        padding: 10,
    },
    errorText: {
        color: '#F44336',
        fontSize: 14,
        marginTop: 5,
        marginLeft: 5,
    },
    strengthContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        padding: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
    },
    strengthLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    strengthValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    apiErrorText: {
        color: '#F44336',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#FFEBEE',
        borderRadius: 8,
    },
    resetButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 50,
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    resetButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});