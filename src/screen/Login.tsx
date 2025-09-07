import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { Formik } from 'formik';
import Loginbg from '../assets/LoginBg.png';
import { RootStackParamsList } from '../routes/PublicRoute';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFilter } from '../Context';
import OTPVerification from '../components/Otpverification';
import { API_ENDPOINT } from '@env';

type Props = NativeStackScreenProps<RootStackParamsList, 'Login'>;
type BackendErrors = { email?: string; password?: string };

const handleLogin = async (
  values: { email: string; password: string },
  setBackendErrors: React.Dispatch<React.SetStateAction<BackendErrors>>,
  setSubmitting: (isSubmitting: boolean) => void,
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>,
  setLoading: (val: boolean) => void,
  setSlowMessage: (val: boolean) => void,
) => {
  setBackendErrors({});
  setLoading(true);
  setSlowMessage(false);

  const slowTimer = setTimeout(() => setSlowMessage(true), 5000);

  try {
    console.log("login",API_ENDPOINT);
    const res = await fetch(
      `${API_ENDPOINT}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(values),
    });

    const data = await res.json();

    if (!data.success) {
      if (data.fielderror) {
        setBackendErrors({ [data.fielderror]: data.message });
      } else if (data.errors && Array.isArray(data.errors)) {
        const errorsObj: BackendErrors = {};
        data.errors.forEach((err: any) => {
          const field = err.errorfield as keyof BackendErrors;
          if (field === 'email' || field === 'password') {
            errorsObj[field] = err.message;
          }
        });
        setBackendErrors(errorsObj);
      }
    } else {
      setIsLoggedIn(true);
    }
  } catch (err) {
    console.error('Login request failed:', err);
    Alert.alert('Error', 'Network error. try later.');
  } finally {
    setSubmitting(false);
    setLoading(false);
    setSlowMessage(false);
    clearTimeout(slowTimer);
  }
};



export default function Login({ navigation }: Props) {
  const [backendErrors, setBackendErrors] = useState<BackendErrors>({});
  const [loading, setLoading] = useState(false);
  const [slowMessage, setSlowMessage] = useState(false);
  const { setIsLoggedIn } = useFilter();
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [loggingText, setLoggingText] = useState(false);

  const handleForgotPassword = async (email: string) => {

    setLoading(true);
    setSlowMessage(false);
    setLoggingText(true);
    const slowTimer = setTimeout(() => setSlowMessage(true), 5000);

    try {
      const res = await fetch(
        `${API_ENDPOINT}/api/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.success) {
        setOtpEmail(email);
        setShowOtpModal(true);
      } else {
        Alert.alert('Error', data.message || 'Failed to send OTP');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Network error. Try later.');
    } finally {
      setLoading(false);
      setSlowMessage(false);
      setLoggingText(false);
      clearTimeout(slowTimer);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={Loginbg}
        style={styles.background}
        resizeMode="cover"
      >
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="orange" />
            <Text style={styles.loadingText}>
              {slowMessage
                ? 'Server is taking longer than usual, please wait...'
                : loggingText === true ? "Forgetting---" : 'Logging---'}
            </Text>
          </View>
        )}

        <View style={styles.content}>
          <View style={styles.heading}>
            <Text style={styles.title}>Login</Text>
          </View>
          <Formik
            initialValues={{ email: '', password: '' }}
            validate={values => {
              const errors: any = {};
              if (!values.email) errors.email = 'Email is required';
              else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              )
                errors.email = 'Invalid email';
              if (!values.password) errors.password = 'Password is required';
              return errors;
            }}
            onSubmit={(values, { setSubmitting, setErrors }) => {
              setErrors({});
              handleLogin(
                values,
                setBackendErrors,
                setSubmitting,
                setIsLoggedIn,
                setLoading,
                setSlowMessage,
              );
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <View style={styles.form}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={text => {
                    handleChange('email')(text);
                    setBackendErrors(prev => ({ ...prev, email: undefined }));
                  }}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  selectionColor="black"
                />
                {errors.email && touched.email && (
                  <Text style={styles.inlineError}>{errors.email}</Text>
                )}
                {backendErrors.email && (
                  <Text style={styles.inlineError}>{backendErrors.email}</Text>
                )}

                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={text => {
                    handleChange('password')(text);
                    setBackendErrors(prev => ({
                      ...prev,
                      password: undefined,
                    }));
                  }}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  secureTextEntry
                  selectionColor="black"


                />
                {errors.password && touched.password && (
                  <Text style={styles.inlineError}>{errors.password}</Text>
                )}
                {backendErrors.password && (
                  <Text style={styles.inlineError}>
                    {backendErrors.password}
                  </Text>
                )}

                <View style={styles.forgotcontainer}>
                  <TouchableOpacity
                    onPress={() => handleForgotPassword(values.email)}
                  >
                    <Text style={styles.forgottext}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.submitbtncontainer}>
                  <TouchableOpacity
                    style={styles.submitbutton}
                    onPress={() => handleSubmit()}
                    disabled={isSubmitting || loading}
                  >
                    <Text style={styles.submitbuttonText}>Login</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>

          <View style={styles.registercontainer}>
            <Text style={styles.registertext}>Don't have an account? </Text>
            <TouchableOpacity
              style={styles.registerbtn}
              onPress={() => navigation.navigate('Signup')}
            >
              <Text style={styles.registerlink}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
        {showOtpModal && (
          <OTPVerification
            email={otpEmail}
            onSuccess={() => {
              setShowOtpModal(false);
              navigation.navigate('Changepassword', { email: otpEmail });
            }}
            onCancel={() => setShowOtpModal(false)}
            endpoint="verify-forgot-otp"
          />
        )}
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    height: 500,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heading: { width: '85%', marginBottom: 5 },
  title: { fontSize: 44 },
  form: { width: '85%' },
  label: { color: 'white', marginTop: 15, fontSize: 16, fontWeight: '700' },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingVertical: 5,
    backgroundColor: 'transparent',
    color: "black"
  },
  forgotcontainer: { marginVertical: 8, alignItems: 'flex-end' },
  forgottext: { color: 'blue' },
  submitbtncontainer: { marginVertical: 10, alignItems: 'flex-end' },
  submitbutton: {
    width: '65%',
    backgroundColor: 'orange',
    padding: 12,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitbuttonText: { fontSize: 20, color: 'white', fontWeight: '700' },
  registercontainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10,
    width: '85%',
  },
  registertext: { fontSize: 12 },
  registerbtn: { marginLeft: 5 },
  registerlink: { color: '#007BFF', fontWeight: 'bold' },
  inlineError: { color: 'red', marginTop: 5, fontSize: 16 },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
