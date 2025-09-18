import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { googleLogin, setAuthToken } from '../services/authService';
import Button from './common/Button';
import Card from './common/Card';

const LoginView: React.FC = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, you would use the Google Identity Services API
      // to get the ID token. For now, we'll simulate this.
      // This is where you would integrate with Google's OAuth flow.
      
      // Simulate getting a token from Google
      // In a real app, you would use something like:
      // const googleUser = await google.accounts.id.initialize(...)
      // const tokenId = googleUser.credential;
      
      // For demonstration, we'll use a mock token
      const tokenId = "mock_google_token";
      
      // Call our backend authentication service
      const response = await googleLogin(tokenId);
      
      // Set the token in local storage
      setAuthToken(response.token);
      
      // Update the auth context
      login(response.teacher);
    } catch (err) {
      setError('Gagal masuk dengan Google. Silakan coba lagi.');
      console.error('Google login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-text-main mb-2">Asisten Guru</h1>
        <p className="text-text-secondary mb-8">Asisten ruang kelas lengkap Anda.</p>
        
        <Button onClick={handleGoogleLogin} isLoading={loading} className="w-full">
            <svg className="w-5 h-5 mr-2" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-72.2 64.5C322.7 102.4 288.3 88 248 88c-88.3 0-160 71.7-160 160s71.7 160 160 160c94.4 0 135.3-63.5 140.8-96.9H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path>
            </svg>
            Masuk dengan Google
        </Button>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <p className="text-xs text-gray-400 mt-6">
            Masuk dengan akun Google Anda untuk mengakses aplikasi.
        </p>
      </Card>
    </div>
  );
};

export default LoginView;