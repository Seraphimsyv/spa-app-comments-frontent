import { useState, useEffect, useContext, createContext } from 'react';
import { SocketService } from '../services/socket.service';
import { WEBSOCKET_AUTH_URI } from '../common/constant';
import { UserType } from '../common/types';

interface IContext {
  isAuth: boolean;
  profile?: UserType;
  jwtToken?: string;
  client?: SocketService,
  handleLogin: (username: string, password: string) => Promise<any>;
  handleSignin: (username: string, password: string, email: string, homePage?: string) => Promise<any>;
  handleLogout: () => void;
}

interface IProvider {
  children: React.ReactNode;
}

const AuthContext = createContext<IContext | undefined>(undefined);

const AuthProvider: React.FC<IProvider> = ({ children }) => {
  const [client, setClient] = useState<SocketService | null>(null);
  const [jwtToken, setToken] = useState<string | undefined>(
    window.localStorage.getItem('jwt_token') || undefined
  );
  const [isAuth, setAuth] = useState<boolean>(Boolean(jwtToken));
  const [profile, setProfile] = useState<UserType | undefined>(undefined);
  /**
   * Effects
   */
  useEffect(() => {
    /**
     * Connection to ws
     */
    if (!client) {
      const newClient = new SocketService(WEBSOCKET_AUTH_URI);
      setClient(newClient);
    }
    /**
     * 
     */
    else {

      if (jwtToken) client.emit('getProfile', { token: jwtToken });

      client.listen('connect', () => {
        console.log('(Auth) Event - (connect) - Connected!');
      })

      client.listen('jwtToken', (data: { access_token: string }) => {
        console.log('(Auth) Event - (jwtToken) - Receive!');
        window.localStorage.setItem('jwt_token', data.access_token);
        setAuth(true);
        setToken(data.access_token);
      })  

      client.listen('profile', (data: UserType) => {
        console.log('(Auth) Event - (profile) - Receive!');
        setProfile({ ...data })
      })

      client.listen('profileError', (res: string) => {
        console.log(`(Auth) Event - (profileError) - Failed! ${res}`)

        setAuth(false);
        setToken(undefined);
      })
    }
  }, [client, jwtToken])

  const handleLogin = (username: string, password: string): Promise<any> => {
    client?.emit('logIn', { username, password });

    return new Promise((res, rej) => {
      client?.listen('logInError', (data: string) => {
        console.log(`(Auth) Event - (logInError) - Failed! ${data}`);
        return rej(data);
      })
    })
  }

  const handleSignin = (username: string, password: string, email: string, homePage?: string): Promise<any> => {
    client?.emit('signIn', { username, password, email, homePage });

    return new Promise((res, rej) => {
      client?.listen('logInError', (data: string) => {
        console.log(`(Auth) Event - (signInError) - Failed! ${data}`);
        return rej(data);
      })
    });
  }

  const handleLogout = (): void => {
    window.localStorage.removeItem('jwt_token');
    setAuth(false);
    setToken(undefined);
  }

  return (
    <AuthContext.Provider value={{ isAuth, profile, jwtToken, handleLogin, handleSignin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context)
    throw new Error('Auth context must be wrapped in provider!');

  return context;
}

export { useAuth, AuthContext, AuthProvider };