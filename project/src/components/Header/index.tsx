import { useEffect, useState } from "react";
import { Pages } from "../../common/types"
import { useAuth } from "../../providers/auth.provider";
import { LoginModal } from "../Modal/Login";
import { SigninModal } from "../Modal/Signin";
import { NewComment } from "../Modal/NewComment";
import { useCommentSocket } from "../../providers/comment.provider";

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
  const { client } = useCommentSocket();
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [showSignin, setShowSignin] = useState<boolean>(false);
  const [showCreateComment, setShowCreateComment] = useState<boolean>(false);

  useEffect(() => {
    if (isAuth) {
      setShowLogin(false);
      setShowSignin(false);
    }

    client.subscribe('commentCreated', () => {
      console.log('(Comment) Event - (commentCreated)')
      setShowCreateComment(false);
    })
  }, [isAuth, showCreateComment, client])

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

              <LoginModal
                isOpen={!isAuth && showLogin}
                onClose={() => setShowLogin(false)}
              />

              <SigninModal
                isOpen={!isAuth && showSignin}
                onClose={() => setShowSignin(false)}
              />
            </>
          )}

        </div>
        
      </header>

      <NewComment
        isOpen={showCreateComment}
        onClose={() => setShowCreateComment(false)}
      />
    </>
  )
}