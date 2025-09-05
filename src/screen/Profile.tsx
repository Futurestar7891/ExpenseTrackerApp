import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Alert,
  Platform
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import { useFilter } from '../Context';

export default function Profile() {
  const { user, setUser, setIsLoggedIn } = useFilter();

  const [passwordVisible, setPasswordVisible] = useState<{ current: boolean; new: boolean }>({
    current: false,
    new: false,
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');

  // --- Pick Image and upload ---
  const pickImage = () => {
    launchImageLibrary(
      { mediaType: 'photo', maxHeight: 800, maxWidth: 800, quality: 0.8 },
      async response => {
        if (response.assets && response.assets.length > 0) {
          let uri = response.assets[0].uri;
          if (!uri) return;

          // Handle iOS file:// prefix
          if (Platform.OS === 'ios') uri = uri.replace('file://', '');

          const formData = new FormData();
          formData.append('photo', {
            uri,
            name: 'profile.jpg',
            type: 'image/jpeg',
          } as any);

          try {
            const res = await fetch('http://localhost:3000/api/change-profile-image', {
              method: 'POST',
              body: formData,
              credentials: 'include',
            });

            const data = await res.json();
            if (data.success && user) {
              setUser({ ...user, photo: data.photo });
              Alert.alert('Success', 'Profile image updated!');
            } else {
              console.log('Backend response:', data);
              Alert.alert('Error', 'Failed to update profile image');
            }
          } catch (err) {
            console.log('Fetch error:', err);
            Alert.alert('Error', 'Something went wrong!');
          }
        }
      }
    );
  };


  // --- Change Password ---
  const changePassword = async () => {
    setCurrentPasswordError('');
    setNewPasswordError('');

    if (!currentPassword) return setCurrentPasswordError('Please enter current password');
    if (!newPassword) return setNewPasswordError('Please enter new password');
    if (newPassword === currentPassword) return setNewPasswordError('New password cannot be same as current');

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
    if (!passwordRegex.test(newPassword))
      return setNewPasswordError(
        'Password must be at least 8 characters with uppercase, lowercase, number, special char'
      );

    try {
      const res = await fetch('http://localhost:3000/api/change-password', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        Alert.alert('Success', 'Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
      } else {
         if(data.fielderror==="currentPassword")setCurrentPasswordError(data.message);
         if(data.fielderror==="newPassword")setNewPasswordError(data.message);
      }
    } catch {
      Alert.alert('Error', 'Something went wrong!');
    }
  };

  // --- Logout ---
  const logout = async () => {
    try {
      await fetch('http://localhost:3000/api/logout', { method: 'POST', credentials: 'include' });
      setUser(null);
      setIsLoggedIn(false);
    } catch {
      Alert.alert('Error', 'Failed to logout');
    }
  };


  const deleteAccount = () => {
    Alert.alert('Confirm', 'Are you sure you want to delete your account?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'OK',
        onPress: async () => {
          try {
            const res = await fetch('http://localhost:3000/api/delete-account', {
              method: 'DELETE',
              credentials: 'include',
            });
            const data = await res.json();
            if (data.success) {
              Alert.alert('Deleted', 'Account deleted successfully');
              logout();
            } else Alert.alert('Error', 'Failed to delete account');
          } catch {
            Alert.alert('Error', 'Something went wrong!');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Profile Image */}
      <View style={styles.profileContainer}>
        <Image
          source={user?.photo ? { uri: user.photo } : require('../assets/ExpenseLogo.png')}
          style={styles.profileImage}
        />
        <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
          <Ionicons name="camera" size={22} color="white" />
        </TouchableOpacity>
      </View>

      {/* User Details */}
      <View style={styles.userDetails}>
        <View style={styles.field}>
          <Text style={styles.label}>Username</Text>
          <Text style={styles.value}>{user?.name}</Text>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user?.email}</Text>
        </View>

        {/* Change Password */}
        <View style={styles.field}>
          <Text style={styles.label}>Change Password</Text>

          <View style={styles.passwordRow}>
            <TextInput
              value={currentPassword}
              onChangeText={text => { setCurrentPassword(text); setCurrentPasswordError(''); }}
              secureTextEntry={!passwordVisible.current}
              style={styles.passwordInput}
              placeholder="Enter Current Password"
              placeholderTextColor="#333"
            />
            <TouchableOpacity onPress={() => setPasswordVisible(prev => ({ ...prev, current: !prev.current }))}>
              <Ionicons name={passwordVisible.current ? 'eye-off' : 'eye'} size={22} color="black" />
            </TouchableOpacity>
          </View>
          {currentPasswordError ? <Text style={styles.errorText}>{currentPasswordError}</Text> : null}

          <View style={styles.passwordRow}>
            <TextInput
              value={newPassword}
              onChangeText={text => { setNewPassword(text); setNewPasswordError(''); }}
              secureTextEntry={!passwordVisible.new}
              style={styles.passwordInput}
              placeholder="Enter New Password"
              placeholderTextColor="#333"
            />
            <TouchableOpacity onPress={() => setPasswordVisible(prev => ({ ...prev, new: !prev.new }))}>
              <Ionicons name={passwordVisible.new ? 'eye-off' : 'eye'} size={22} color="black" />
            </TouchableOpacity>
          </View>
          {newPasswordError ? <Text style={styles.errorText}>{newPasswordError}</Text> : null}

          <TouchableOpacity style={styles.changeBtn} onPress={changePassword}>
            <Text style={styles.changeText}>Change Password</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* User Operations */}
      <View style={styles.userOperation}>
        <TouchableOpacity style={styles.deleteBtn} onPress={deleteAccount}>
          <Text style={styles.deleteText}>Delete Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#F2F4F8', alignItems: 'center' },
  profileContainer: { alignItems: 'center', marginBottom: 30, position: 'relative' },
  profileImage: { width: 120, height: 120, borderRadius: 60 },
  uploadButton: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#337AB7', padding: 8, borderRadius: 20 },
  userDetails: { width: '100%', backgroundColor: 'white', borderRadius: 15, padding: 15, marginBottom: 30, elevation: 3 },
  field: { marginBottom: 15 },
  label: { fontSize: 14, color: '#555', marginBottom: 5 },
  value: { fontSize: 16, fontWeight: '500', color: '#000' },
  passwordRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  passwordInput: { flex: 1, fontSize: 16, backgroundColor: '#F0F0F0', padding: 8, borderRadius: 8, marginRight: 10 },
  changeBtn: { backgroundColor: '#337AB7', padding: 12, borderRadius: 8, marginTop: 10, alignItems: 'center' },
  changeText: { color: 'white', fontWeight: 'bold' },
  userOperation: { width: '100%', alignItems: 'center' },
  deleteBtn: { backgroundColor: '#E74C3C', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center', marginBottom: 15 },
  deleteText: { color: 'white', fontWeight: 'bold' },
  logoutBtn: { backgroundColor: '#337AB7', padding: 15, borderRadius: 10, width: '100%', alignItems: 'center' },
  logoutText: { color: 'white', fontWeight: 'bold' },
  errorText: { color: 'red', fontSize: 12, marginBottom: 5 },
});
