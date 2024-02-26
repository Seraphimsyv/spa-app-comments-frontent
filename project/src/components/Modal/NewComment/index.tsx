import React, { useEffect, useState } from "react";
import { useAuth } from "../../../providers/auth.provider";
import { SERVER_URI, WEBSOCKET_COMMENT_URI } from "../../../common/constant";
import { SocketService } from "../../../services/socket.service";
import { Comment } from "../../Comment";
import { Modal } from "..";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  parentId?: number;
}

type Captcha = {
  text: string, data: any
}

export const NewComment: React.FC<IProps> = (props) => {
  const { isOpen, onClose, parentId } = props;
  const [client, setClient] = useState<SocketService | null>(null);
  const { isAuth, jwtToken } = useAuth();
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [homePage, setHomePage] = useState<string>('');
  const [captcha, setCaptcha] = useState<Captcha | null>(null);
  const [captchaValue, setCaptchaValue] = useState<string>('');
  const [captchaValid, setCaptchaValid] = useState<boolean | null>(null);
  const [textareaValue, setTextareaValue] = useState<string>('');
  const [isValidContent, setIsValidContent] = useState<boolean>(true);
  const [selectedFile, setSelectedFile] = useState<any>(null)
  const [showPrerender, setShowPrerender] = useState<boolean>(false);

  useEffect(() => {

    if (!client) {
      const client = new SocketService(WEBSOCKET_COMMENT_URI);
      setClient(client);
    } else {
    }

    if (captcha === null) {

      fetch(`${SERVER_URI}:8000/api/utils/get/captcha`)
      .then((res) => res.json())
      .then((res: Captcha) => setCaptcha(res));
    }
  }, [client, captcha, showPrerender])

  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setTextareaValue(value);

    const openingTags = value.match(/<[^/]+>/g) || [];
    const closingTags = value.match(/<\/[^>]+>/g) || [];
    const allowedTagsRegex = /^(?:(?!<(?!\/?(a|code|i|strong)\b)[^>]*>).)*$/;
    const containsAllowedTags = allowedTagsRegex.test(value);
    const isValid = containsAllowedTags
      && openingTags.length === closingTags.length
      && textareaValue.length > 0;

    setIsValidContent(isValid);
  };

  const handleSelectFile = (evt: React.ChangeEvent<HTMLInputElement>) => {
    
    if (evt.target.files && evt.target.files.length > 0) {
      const file = evt.target.files[0];
      setSelectedFile(file);
    }
  }

  const handleSendComment = () => {

    if (!client) return alert('Connection is unstable');

    if (textareaValue.length === 0) return alert('Text area empty');

    if (!isValidContent) return alert('Text area not valid!');

    if (captchaValue !== captcha?.text) {
      alert('Invalid captcha');
      return setCaptchaValid(false);
    } else {
      setCaptchaValid(true);
    }

    const comment = {
      parent: parentId,
      text: textareaValue,
      author: isAuth ? jwtToken : undefined,
      anonymAuthor: !isAuth ? {
        username, email, homePage
      } : undefined
    }

    if (selectedFile) {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onload = () => {
        const fileContent = reader.result;
        client.emit('createComment', {
          comment,
          file: {
            filename: selectedFile.name,
            content: fileContent
          }
        });
        onClose();
      }
    } else {
      client.emit('createComment', {
        comment,
      });
      onClose();
    }
  }

  return (
    <>
      <Modal open={isOpen} onClose={onClose}>
        <div id="modal-form">

          {showPrerender ? (
            <>
              <div
                style={{ width: 'calc(100% - 2em)'}}
              >
                <Comment
                  comment={{
                    id: 0,
                    text: textareaValue,
                    anonymAuthor: { username: 'Anonym', email: 'test@gmail.com', },
                    createdAt: new Date().toDateString()
                  }}
                  isTest
                />
              </div>

              <div className="send-comment">
                <button onClick={handleSendComment}>
                  {parentId ? 'Send reply' : 'Send comment'}
                </button>

                <button onClick={() => setShowPrerender(false)}>
                  Show editor
                </button>
              </div>
            </>
          ) : (
            <>
              {isAuth ? null : (
                <>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '50%, 50%',
                      gap: '1em'
                    }}
                  >
                    <label htmlFor="modal_create_comment_username">Username</label>
                    <input
                      type="text"
                      id="modal_create_comment_username"
                      value={username}
                      onChange={(evt) => setUsername(evt.target.value)}
                    />

                    <label htmlFor="modal_create_comment_email">E-mail</label>
                    <input
                      type="email"
                      id="modal_create_comment_email"
                      value={email}
                      onChange={(evt) => setEmail(evt.target.value)}
                    />

                    <label htmlFor="modal_create_comment_url">Home page*</label>
                    <input
                      type="url"
                      id="modal_create_comment_url"
                      value={homePage}
                      onChange={(evt) => setHomePage(evt.target.value)}
                    />
                  </div>
                </>
              )}

              <div
                className="captcha"
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: '1em'
                }}
              >
                {captcha && (
                  <>
                    <div
                      dangerouslySetInnerHTML={{ __html: captcha.data }}
                    />
                    <input
                      className={captchaValid === false ? 'invalid' : ''}
                      type="text"
                      value={captchaValue}
                      onChange={(evt) => setCaptchaValue(evt.target.value)}
                    />
                  </>
                )}
              </div>

              <div>
                <input type="file" onChange={handleSelectFile}/>
              </div>

              <label>
                <textarea value={textareaValue} onChange={handleTextareaChange} />
              </label>

              <div className="send-comment">
                <button onClick={handleSendComment}>
                  {parentId ? 'Send reply' : 'Send comment'}
                </button>

                <button onClick={() => setShowPrerender(true)}>
                  Show preview
                </button>
              </div>
            </>
          )}

        </div>
      </Modal>
    </>
  )
}