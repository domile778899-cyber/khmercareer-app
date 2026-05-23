import { useState, useCallback } from 'react';

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  givenName: string;
  familyName: string;
  imageUrl: string | null;
  idToken: string;
  accessToken: string;
}

interface UseGoogleAuthReturn {
  user: GoogleUser | null;
  isLoading: boolean;
  error: string | null;
  signIn: () => Promise<GoogleUser | null>;
  signOut: () => Promise<void>;
}

// 模拟Google登录（实际环境使用 @codetrix-studio/capacitor-google-auth）
// 当配置了真实的GOOGLE_CLIENT_ID后，取消注释下方真实实现代码

export function useGoogleAuth(): UseGoogleAuthReturn {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = useCallback(async (): Promise<GoogleUser | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // ============================================================
      // 真实实现（需要配置GOOGLE_CLIENT_ID后启用）
      // ============================================================
      // const { GoogleAuth } = await import('@codetrix-studio/capacitor-google-auth');
      // const result = await GoogleAuth.signIn();
      // if (!result.authentication?.idToken) {
      //   throw new Error('Failed to get Google ID Token');
      // }
      // const googleUser: GoogleUser = {
      //   id: result.id,
      //   email: result.email,
      //   name: result.name,
      //   givenName: result.givenName || '',
      //   familyName: result.familyName || '',
      //   imageUrl: result.imageUrl || null,
      //   idToken: result.authentication.idToken,
      //   accessToken: result.authentication.accessToken,
      // };
      // setUser(googleUser);
      // return googleUser;
      // ============================================================

      // 模拟实现（开发/演示用）
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 模拟Google用户信息
      const mockGoogleUser: GoogleUser = {
        id: 'google_' + Math.random().toString(36).substring(2, 11),
        email: 'user@gmail.com',
        name: 'Google User',
        givenName: 'Google',
        familyName: 'User',
        imageUrl: 'https://ui-avatars.com/api/?name=Google+User&background=4285F4&color=fff',
        idToken: 'mock_id_token_' + Math.random().toString(36).substring(2),
        accessToken: 'mock_access_token_' + Math.random().toString(36).substring(2),
      };

      setUser(mockGoogleUser);
      return mockGoogleUser;
    } catch (err: any) {
      const errorMessage = err?.message || 'Google login failed';
      setError(errorMessage);
      console.error('Google Sign-In Error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    try {
      // 真实实现：
      // const { GoogleAuth } = await import('@codetrix-studio/capacitor-google-auth');
      // await GoogleAuth.signOut();

      setUser(null);
      setError(null);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('google_auth_user');
    } catch (err) {
      console.error('Google Sign-Out Error:', err);
    }
  }, []);

  return { user, isLoading, error, signIn, signOut };
}
