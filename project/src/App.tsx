import { useState } from "react"
import { Comments } from "./components/Comments"
import { Header } from "./components/Header"
import { Pages } from "./common/types";
import { Table } from "./components/Table";
import { AuthProvider } from "./providers/auth.provider";
import { CommentProvider } from "./providers/comment.provider";

export const App = () => {
  const [page, setPage] = useState<Pages>('example');

  const handleChangePage = (page: Pages) => {
    setPage(page);
  }

  return (
    <>
      <AuthProvider>
        <CommentProvider>
        
          <Header handleChangePage={handleChangePage} />

          <div
            className="content"
          >

            {page === 'example'
            ? (
              <Comments />
            ) : (
              <Table />
            )}
          </div>
        
        </CommentProvider>
      </AuthProvider>
    </>
  )
}