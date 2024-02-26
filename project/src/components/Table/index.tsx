import { IconButton } from '@mui/material';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import CloseIcon from '@mui/icons-material/Close';
import { CommentType, OrderBy } from '../../common/types';
import { convertDate } from '../../common/utils';
import { Media } from '../Media';
import { Pagination } from '../Pagination';
import { useCommentSocket } from '../../providers/comment.provider';

interface ITableHeadCell {
  title: string;
  value?: string;
  sort?: OrderBy;
  sortEnable?: true;
  handleSetOrderBy?: (data?: OrderBy) => void;
}

const TableHeadCell: React.FC<ITableHeadCell> = (props) => {
  const {
    title, value, sort, sortEnable,
    handleSetOrderBy
  } = props;

  return (
    <>
      <th>
        <div className='thead-th'>
          <h5>{title}</h5>

          {sortEnable && value && handleSetOrderBy && (
            <div className='sort-btn'>
              {sort?.sort === 'ASC'
              ? (
                <>
                  <IconButton onClick={() => handleSetOrderBy({ column: value, sort: 'DESC' })}>
                    <SouthIcon />
                  </IconButton>
                </>
              ) : sort?.sort === 'DESC'
              ? (
                <>
                  <IconButton onClick={() => handleSetOrderBy()}>
                    <CloseIcon />
                  </IconButton>
                </>
              ) : (
                <>
                  <IconButton onClick={() => handleSetOrderBy({ column: value, sort: 'ASC' })}>
                    <NorthIcon />
                  </IconButton>
                </>
              )}
            </div>
          )}

        </div>
      </th>
    </>
  )
}

export const Table = () => {
  const {
    orderBy,
    currentPage,
    totalPages,
    comments,
    handleUpdate,
    handlePrev,
    handleTarget,
    handleNext
  } = useCommentSocket();
  
  const handleSetOrderBy = (data?: OrderBy) => {
    handleUpdate({ orderBy: data })
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <TableHeadCell
              title='#'
              value='id'
              sort={orderBy}
              sortEnable
              handleSetOrderBy={handleSetOrderBy}/>
            <TableHeadCell
              title='User name'
              value='username'
              sort={orderBy}
              sortEnable
              handleSetOrderBy={handleSetOrderBy}/>
            <TableHeadCell
              title='E-mail'
              value='email'
              sort={orderBy}
              sortEnable
              handleSetOrderBy={handleSetOrderBy}/>
            <TableHeadCell
              title='Text' />
            <TableHeadCell
              title='File' />
            <TableHeadCell 
              title='Created At'
              value='createdAt'
              sort={orderBy}
              sortEnable
              handleSetOrderBy={handleSetOrderBy}/>
          </tr>
        </thead>
        <tbody>
          {comments && comments.map((value: CommentType, key) => (
            <tr key={key}>
              <td>{(25 * (currentPage - 1)) + key + 1} | {value.id}</td>
              <td>
                {value.author
                  ? value.author.username
                  : value.anonymAuthor?.username}
              </td>
              <td>
                {value.author
                  ? value.author.email
                  : value.anonymAuthor?.email}
              </td>
              <td>{value.text}</td>
              <td><Media file={value.file} /></td>
              <td>{convertDate(value.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage} pages={totalPages}
        handlePrev={handlePrev}
        handlePage={handleTarget}
        handleNext={handleNext}
      />
    </>
  )
}