import { useState } from "react";
import { CommentType } from "../../common/types"
import { convertDate } from "../../common/utils";
import { Media } from "../Media";
import { Modal } from "../Modal";
import { NewComment } from "../Modal/NewComment";

interface IHeaderProps {
  comment: CommentType;
  isTest?: true
}

const Header: React.FC<IHeaderProps> = (props) => {
  const { comment, isTest } = props;
  const [openForm, setOpenForm] = useState<boolean>(false);

  return (
    <>
      <div className="header">

        <div
          style={{ 
            display: 'flex', 
            flexDirection: 'row',
            justifyContent: 'flex-start',
            gap: '1em'
          }}
        >
          <div className="author-name">
            <p>
              {comment.author 
                ? comment.author.username
                : comment.anonymAuthor?.username}
            </p>
          </div>

          <div className="created-date">
            <p>
              {convertDate(comment.createdAt)}
            </p>
          </div>
        </div>

        {!isTest && (
          <div 
            className="reply"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <p onClick={() => setOpenForm(true)}>reply</p>
          </div>
        )}

      </div>


      <Modal
        open={openForm}
        onClose={() => setOpenForm(false)}
      >
        <NewComment parentId={comment.id} />
      </Modal>

    </>
  )
}

interface IContentProps {
  comment: CommentType;
}

export const Content: React.FC<IContentProps> = (props) => {
  const { comment } = props;

  return (
    <>
      <div className="content">
        <p>{comment.text}</p>

        <Media file={comment.file} />
      </div>
    </>
  )
}

interface ICommentProps {
  comment: CommentType;
  isTest?: true;
}

export const Comment: React.FC<ICommentProps> = (props) => {
  const { comment, isTest } = props;

  return (
    <>

      <div className="comment">
        
        <Header comment={comment} isTest={isTest} />

        <Content comment={comment} />

        <div className="subcomments">
          {comment.comments && comment.comments.map((val, key) => (
            <Comment key={key} comment={val} />
          ))}
        </div>

      </div>
    </>
  )
}