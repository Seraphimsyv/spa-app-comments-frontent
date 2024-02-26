import { useEffect, useState } from "react";
import { Pages } from "../../common/types"
import { useAuth } from "../../providers/auth.provider";
import { Modal } from "../Modal";
import { LoginModal } from "../Modal/Login";
import { SigninModal } from "../Modal/Signin";
import { NewComment } from "../Modal/NewComment";

interface IHeaderProps {
  handleChangePage: (page: Pages) => void;
}

export const Header: React.FC<IHeaderProps> = (props) => {
  const {
    handleChangePage
  } = props;
  const {
    isAuth,
    handleLogout
  } = useAuth();
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [showSignin, setShowSignin] = useState<boolean>(false);
  const [showCreateComment, setShowCreateComment] = useState<boolean>(false);

  useEffect(() => {
    if (isAuth) {
      setShowLogin(false);
      setShowSignin(false);
    }
  }, [isAuth])

  return (
    <>
      <header>

        <div className="navigation">

          <p onClick={() => handleChangePage('example')}>Example</p>
          <p onClick={() => handleChangePage('table')}>Table view</p>
          <p onClick={() => setShowCreateComment(true)}>Create Comment</p>

        </div>

        <div className="authorization">

          {isAuth ? (
            <>
              <div className="auth">
                <button onClick={handleLogout}>Log-out</button>
              </div>
            </>
          ) : (
            <>
              <div className="no-auth">
                <button onClick={() => setShowLogin(true)}>Log-in</button>
                <button onClick={() => setShowSignin(true)}>Sign-in</button>
              </div>

              <Modal open={!isAuth && showLogin} onClose={() => setShowLogin(false)}>
                <LoginModal />
              </Modal>

              <Modal open={!isAuth && showSignin} onClose={() => setShowSignin(false)}>
                <SigninModal />
              </Modal>
            </>
          )}

        </div>
        
      </header>

      <Modal open={showCreateComment} onClose={() => setShowCreateComment(false)}>
        <NewComment />
      </Modal>
    </>
  )
}