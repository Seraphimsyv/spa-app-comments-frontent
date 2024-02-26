import { useState } from "react";
import { useAuth } from "../../../providers/auth.provider"

export const SigninModal = () => {
  const {
    handleSignin
  } = useAuth();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [homePage, setHomePage] = useState<string>('');
  const [inputErr, setInputErr] = useState<{
    username?: 'NO VALUE' | 'FAILED USERNAME',
    password?: 'NO VALUE' | 'FAILED PASSWORD',
    email?: 'No VALUE' | 'FAILED EMAIL',
  }>({});

  const handleAuth = () => {
    if (username.length === 0) {
      return setInputErr({ ...inputErr, username: 'NO VALUE' });
    } else if (password.length === 0) {
      return setInputErr({ ...inputErr, password: 'NO VALUE' });
    } else if (email.length === 0) {
      return setInputErr({ ...inputErr, email: 'No VALUE' })
    } else {
      setInputErr({});
    }

    handleSignin(username, password, email, homePage)
    .then((res) => console.log(res))
    .catch((err: any) => {
      if (err === 'User not found!') {
        setInputErr({ username: 'FAILED USERNAME' })
      } else if (err === 'Unauthorized') {
        setInputErr({ password: 'FAILED PASSWORD' });
      }
    });
  }
  
  return (
    <>
      <div id="modal-signin">

        <div
          style={{ display: 'flex', flexDirection: 'row', gap: '1em' }}
        >

          <label htmlFor="input-signin-username">Username</label>
          <input
            type="text"
            id="input-signin-username"
            value={username}
            onChange={(evt) => setUsername(evt.target.value)}
          />
        
          <label htmlFor="input-signin-password">Password</label>
          <input
            type="password"
            id="input-signin-password"
            value={password}
            onChange={(evt) => setPassword(evt.target.value)}
          />

        </div>

        <div
          style={{ display: 'flex', flexDirection: 'row', gap: '1em' }}
        >

          <label htmlFor="input-signin-email">Email</label>
          <input
            type="email"
            id="input-signin-email"
            value={email}
            onChange={(evt) => setEmail(evt.target.value)}
          />
        
          <label htmlFor="input-signin-homepage">Homepage*</label>
          <input
            type="text"
            id="input-signin-homepage"
            value={homePage}
            onChange={(evt) => setHomePage(evt.target.value)}
          />

        </div>

        <button onClick={handleAuth}>Signin</button>

      </div>
    </>
  )
}