import React, { useEffect, useState } from "react"
import { useAuth } from "../../../providers/auth.provider";
import { Modal } from "..";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<IProps> = (props) => {
  const {
    client,
    handleLogin
  } = useAuth();
  const { isOpen, onClose } = props;
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [inputErr, setInputErr] = useState<{
    username?: 'NO VALUE' | 'FAILED USERNAME',
    password?: 'NO VALUE' | 'FAILED PASSWORD'
  }>({});

  useEffect(() => {
  }, [client])

  const handleAuth = () => {
    if (username.length === 0) {
      return setInputErr({ ...inputErr, username: 'NO VALUE' });
    } else if (password.length === 0) {
      return setInputErr({ ...inputErr, password: 'NO VALUE' });
    } else {
      setInputErr({});
    }

    handleLogin(username, password)
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
      <Modal open={isOpen} onClose={onClose}>
      
        <div id="modal-login">

          <div
            style={{ display: 'flex', flexDirection: 'row', gap: '1em' }}
          >

            <label htmlFor="input-login-username">Username</label>
            <input
              type="text"
              id="input-login-username"
              value={username}
              onChange={(evt) => setUsername(evt.target.value)}
            />
          
            <label htmlFor="input-login-password">Password</label>
            <input
              type="password"
              id="input-login-password"
              value={password}
              onChange={(evt) => setPassword(evt.target.value)}
            />

          </div>

          <button onClick={handleAuth}>Login</button>

        </div>

      </Modal>
    </>
  )
}