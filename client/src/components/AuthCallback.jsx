import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      if (error) {
        toast.error(`Authentication error: ${error}`);
        navigate('/login');
        return;
      }

      if (!code || !state) {
        toast.error('Missing authorization parameters');
        navigate('/login');
        return;
      }

      const result = await login(code, state);
      
      if (result.success) {
        navigate('/', { replace: true });
      } else {
        navigate('/login');
      }
    } catch (error) {
      console.error('Callback error:', error);
      toast.error('Authentication failed');
      navigate('/login');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {processing ? 'Processing Authentication...' : 'Authentication Complete'}
        </h2>
        <p className="text-gray-600">
          {processing ? 'Please wait while we sign you in' : 'Redirecting...'}
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;