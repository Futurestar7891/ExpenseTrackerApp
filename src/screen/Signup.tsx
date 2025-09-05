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
import OTPVerification from '../components/Otpverification';

type Props = NativeStackScreenProps<RootStackParamsList, 'Signup'>;
type BackendErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmpassword?: string;
};

export default function Signup({ navigation }: Props) {
  const [backendErrors, setBackendErrors] = useState<BackendErrors>({});
  const [loading, setLoading] = useState(false);
  const [slowMessage, setSlowMessage] = useState(false);

  // OTP modal state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');

  const handleSignup = async (
    values: {
      name: string;
      email: string;
      password: string;
      confirmpassword: string;
    },
    setSubmitting: (isSubmitting: boolean) => void,
  ) => {
    setBackendErrors({});
    setLoading(true);
    setSlowMessage(false);

    const slowTimer = setTimeout(() => setSlowMessage(true), 5000);

    try {
      const res = await fetch(`http://localhost:3000/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!data.success) {
        if (data.errorfield) {
          setBackendErrors({ [data.errorfield]: data.message });
        } else if (data.errors && Array.isArray(data.errors)) {
          const errorsObj: BackendErrors = {};
          data.errors.forEach((err: any) => {
            const field = err.errorfield as keyof BackendErrors;
            errorsObj[field] = err.message;
          });
          setBackendErrors(errorsObj);
        } else {
          setBackendErrors({ email: 'Signup failed. Please try again.' });
        }
      } else {
       
        setSignupEmail(values.email);
        setShowOtpModal(true);

      }
    } catch (err) {
      console.error('Signup request failed:', err);
      Alert.alert('Error', 'Network error. try later');
    } finally {
      setSubmitting(false);
      setLoading(false);
      setSlowMessage(false);
      clearTimeout(slowTimer);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={Loginbg} style={styles.background} resizeMode="cover">
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="orange" />
            <Text style={styles.loadingText}>
              {slowMessage
                ? 'Server is taking longer than usual, please wait...'
                : 'Signing up...'}
            </Text>
          </View>
        )}

        <View style={styles.content}>
          <View style={styles.heading}>
            <Text style={styles.title}>Signup</Text>
          </View>

          <Formik
            initialValues={{ name: '', email: '', password: '', confirmpassword: '' }}
            validate={values => {
              const errors: any = {};
              if (!values.name) errors.name = 'Name is required';
              if (!values.email) errors.email = 'Email is required';
              else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              )
                errors.email = 'Invalid email';
              if (!values.password) errors.password = 'Password is required';
              if (!values.confirmpassword)
                errors.confirmpassword = 'Confirm password is required';
              else if (values.password !== values.confirmpassword)
                errors.confirmpassword = 'Passwords do not match';
              return errors;
            }}
            onSubmit={(values, { setSubmitting, setErrors }) => {
              setErrors({});
              handleSignup(values, setSubmitting);
            }}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
              <View style={styles.form}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={text => {
                    handleChange('name')(text);
                    setBackendErrors(prev => ({ ...prev, name: undefined }));
                  }}
                  onBlur={handleBlur('name')}
                  value={values.name}
                  selectionColor="black"
                />
                {errors.name && touched.name && <Text style={styles.inlineError}>{errors.name}</Text>}
                {backendErrors.name && <Text style={styles.inlineError}>{backendErrors.name}</Text>}

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
                {errors.email && touched.email && <Text style={styles.inlineError}>{errors.email}</Text>}
                {backendErrors.email && <Text style={styles.inlineError}>{backendErrors.email}</Text>}

                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={text => {
                    handleChange('password')(text);
                    setBackendErrors(prev => ({ ...prev, password: undefined }));
                  }}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  secureTextEntry
                  selectionColor="black"
                />
                {errors.password && touched.password && <Text style={styles.inlineError}>{errors.password}</Text>}
                {backendErrors.password && <Text style={styles.inlineError}>{backendErrors.password}</Text>}

                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={text => {
                    handleChange('confirmpassword')(text);
                    setBackendErrors(prev => ({ ...prev, confirmpassword: undefined }));
                  }}
                  onBlur={handleBlur('confirmpassword')}
                  value={values.confirmpassword}
                  secureTextEntry
                  selectionColor="black"
                />
                {errors.confirmpassword && touched.confirmpassword && <Text style={styles.inlineError}>{errors.confirmpassword}</Text>}
                {backendErrors.confirmpassword && <Text style={styles.inlineError}>{backendErrors.confirmpassword}</Text>}

                <View style={styles.submitbtncontainer}>
                  <TouchableOpacity
                    style={styles.submitbutton}
                    onPress={() => handleSubmit()}
                    disabled={isSubmitting || loading}
                  >
                    <Text style={styles.submitbuttonText}>Signup</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>

          <View style={styles.registercontainer}>
            <Text style={styles.registertext}>Already have an account? </Text>
            <TouchableOpacity
              style={styles.registerbtn}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.registerlink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ✅ OTP Modal */}
        {showOtpModal && (
          <OTPVerification
            email={signupEmail}
            onSuccess={() => {
              setShowOtpModal(false);
              navigation.navigate('Login');
            }}
            onCancel={() => setShowOtpModal(false)}
            endpoint="verify-signup-otp"
          />
        )}
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  content: { width: '100%', paddingHorizontal: 20, alignItems: 'center' },
  heading: { width: '85%', marginBottom: 5 },
  title: { fontSize: 44, color: 'black' },
  form: { width: '85%' },
  label: { color: 'white', marginTop: 15, fontSize: 16, fontWeight: '700' },
  input: { width: '100%', borderBottomWidth: 1, borderBottomColor: '#000', paddingVertical: 5, backgroundColor: 'transparent', color: "black" },
  submitbtncontainer: { marginVertical: 10, alignItems: 'flex-end' },
  submitbutton: { width: '65%', backgroundColor: 'orange', padding: 12, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  submitbuttonText: { fontSize: 20, color: 'white', fontWeight: '700' },
  registercontainer: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 10, width: '85%' },
  registertext: { fontSize: 12, color: 'white' },
  registerbtn: { marginLeft: 5 },
  registerlink: { color: '#007BFF', fontWeight: 'bold' },
  inlineError: { color: 'red', marginTop: 5, fontSize: 14 },
  loadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: 'white', marginTop: 10, fontSize: 16, textAlign: 'center', paddingHorizontal: 20 },
});
