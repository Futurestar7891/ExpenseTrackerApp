export const verifyOtp = async (email: string, otp: string) => {
  try {
    const res = await fetch('http://localhost:3000/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();
    return data; // { success: true/false, message: string }
  } catch (error) {
    console.error('Verify OTP error:', error);
    return { success: false, message: 'Network error while verifying OTP' };
  }
};
