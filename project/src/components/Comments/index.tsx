import { Comment } from '../Comment';
import { CommentType } from '../../common/types';
import { Pagination } from '../Pagination';
import { useCommentSocket } from '../../providers/comment.provider';

export const Comments = () => {
  const {
    currentPage,
    totalPages,
    comments,
    handlePrev,
    handleTarget,
    handleNext
  } = useCommentSocket();

  return (
    <>

      <div className='comments'>

        <div className="comments-list">
          {comments ? (
            <>
              {comments.map((val: CommentType, key) => (
                <Comment key={key} comment={val} />
              ))}
            </>
          ) : null}

        </div>

      </div>

      <Pagination
        currentPage={currentPage} pages={totalPages}
        handlePrev={handlePrev}
        handlePage={handleTarget}
        handleNext={handleNext}
      />
    </>
  )
}