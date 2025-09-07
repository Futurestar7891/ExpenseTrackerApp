import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { API_ENDPOINT } from '@env';

type Props = {
    email: string;
    onSuccess: () => void;
    onCancel?: () => void;
    endpoint: string;
};

export default function OTPVerification({ email, onSuccess, onCancel, endpoint }: Props) {
    const [otp, setOtp] = useState('');
    const [otpError, setOtpError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleVerifyOtp = async () => {
        setOtpError('');
        setLoading(true);
        try {
            console.log("entered in the verify-otp");
            console.log(email, otp);
            const res = await fetch(
                `${API_ENDPOINT}/api/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            const data = await res.json();

            if (data.success) {
                Alert.alert('Success', 'OTP verified successfully!');
                onSuccess();
            } else {
                setOtpError(data.message || 'Invalid OTP');
            }
        } catch (err) {
            console.error(err);
            setOtpError('Network error, try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.otpOverlay}>
            <View style={styles.otpContainer}>
                <Text style={styles.otpTitle}>We sent an otp to your email</Text>
                <TextInput
                    style={styles.otpInput}
                    value={otp}
                    onChangeText={(text) => {
                        setOtp(text);
                        setOtpError("");
                    }}
                    keyboardType="numeric"
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    placeholderTextColor="gray"
                />
                {otpError ? <Text style={styles.inlineError}>{otpError}</Text> : null}

                <TouchableOpacity style={styles.otpButton} onPress={handleVerifyOtp} disabled={loading}>
                    <Text style={styles.otpButtonText}>
                        {loading ? 'Verifying...' : 'Validate'}
                    </Text>
                </TouchableOpacity>

                {onCancel && (
                    <TouchableOpacity style={styles.otpCancelButton} onPress={onCancel}>
                        <Text style={styles.otpCancelText}>Cancel</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    otpOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 200,
    },
    otpContainer: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    otpTitle: { fontSize: 20, fontWeight: '700', marginBottom: 10 },
    otpInput: {
        width: '100%',
        borderBottomWidth: 1,
        borderColor: 'gray',
        fontSize: 18,
        paddingVertical: 5,
        textAlign: 'center',
        marginBottom: 10,
    },
    inlineError: { color: 'red', fontSize: 14, marginBottom: 10 },
    otpButton: {
        width: '100%',
        backgroundColor: 'orange',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 5,
    },
    otpButtonText: { color: 'white', fontWeight: '700', fontSize: 16 },
    otpCancelButton: { marginTop: 10 },
    otpCancelText: { color: 'red', fontSize: 16 },
});
