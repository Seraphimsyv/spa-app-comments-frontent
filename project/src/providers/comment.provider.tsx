import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { SocketService } from "../services/socket.service";
import { WEBSOCKET_COMMENT_URI } from "../common/constant";
import { CommentType, OrderBy } from "../common/types";
import { IWsGetCommentsResponse } from "../common/interfaces";

interface IContext {
  client: SocketService;
  orderBy?: OrderBy;
  currentPage: number;
  totalPages: number;
  limit: number;
  comments: CommentType[];
  handleUpdate: (data: IHandleUpdate) => void;
  handlePrev: () => void;
  handleTarget: (page: number) => void;
  handleNext: () => void;
}

interface IProvider {
  children: React.ReactNode;
}

interface IHandleUpdate {
  page?: number,
  limit?: number,
  orderBy?: OrderBy
}

const CommentContext = createContext<IContext | undefined>(undefined);

const CommentProvider: React.FC<IProvider> = ({ children }) => {
  const [client] = useState<SocketService>(
    new SocketService(WEBSOCKET_COMMENT_URI)
  );
  const [orderBy, setOrderBy] = useState<OrderBy | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [limit, setLimit] = useState<number>(25);
  const [comments, setComments] = useState<CommentType[]>([]);

  const handleGetComments = useCallback((
    data?: {
      page?: number,
      limit?: number,
      orderBy?: OrderBy
    }
  ) => {
    const defaultPage = data?.page ? data.page : currentPage;
    const defaultLimit = data?.limit ? data.limit : limit;
    const defaultOrderBy = data?.orderBy ? data.orderBy : orderBy;

    if (data?.page) setCurrentPage(data.page);

    if (data?.limit) setLimit(data.limit);

    if (data?.orderBy) setOrderBy(data?.orderBy);
    else setOrderBy(undefined);

    client.emit('getComments', { page: defaultPage, limit: defaultLimit, orderBy: defaultOrderBy })
  }, [client, currentPage, limit, orderBy])

  const handlePrevPage = () => {
    if (currentPage === 1) return;
    
    client.emit('getComments', { page: currentPage - 1, limit: limit, orderBy: orderBy });
  }

  const handleTargetPage = (page: number) => {
    if (currentPage === page) return;

    client.emit('getComments', { page: page, limit: limit, orderBy: orderBy });
  }

  const handleNextPage = () => {
    if (totalPages && currentPage === totalPages) return;

    client.emit('getComments', { page: currentPage + 1, limit: limit, orderBy: orderBy });
  }

  useEffect(() => {
    client.listen('connect', () => {
      console.log('(Comments) Event - (connect) - Connected');
      handleGetComments()
    });

    client.listen('reciveComments', (data: IWsGetCommentsResponse) => {
      console.log('(Comments) Event - (sendComments) - Receive comments');

      setCurrentPage(data.currentPage);
      setTotalPages(data.pages);
      setComments(data.comments);
    })

    setInterval(() => {
      handleGetComments();
    }, 1000 * 10)
  }, [client, handleGetComments])

  return (
    <CommentContext.Provider value={{
      client,
      orderBy,
      currentPage,
      totalPages,
      limit,
      comments,
      handleUpdate: handleGetComments,
      handlePrev: handlePrevPage,
      handleTarget: handleTargetPage,
      handleNext: handleNextPage
    }}>
      {children}
    </CommentContext.Provider>
  )
}

const useCommentSocket = () => {
  const context = useContext(CommentContext);

  if (!context)
    throw new Error('Comment context must be wrapped in provider!');

  return context;
}

export { useCommentSocket, CommentContext, CommentProvider }