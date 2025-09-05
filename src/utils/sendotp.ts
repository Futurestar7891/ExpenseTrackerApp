export const sendOtp = async (email: string) => {
  try {
    const res = await fetch('http://localhost:3000/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    return data; // { success: true/false, message: string }
  } catch (error) {
    console.error('Send OTP error:', error);
    return { success: false, message: 'Network error while sending OTP' };
  }
};
