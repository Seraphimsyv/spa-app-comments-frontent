interface IPaginationProps {
  currentPage: number;
  pages: number | null;
  handlePrev: () => void;
  handlePage: (page: number) => void;
  handleNext: () => void;
}

export const Pagination: React.FC<IPaginationProps> = (props) => {
  const {
    currentPage, pages,
    handlePrev, handlePage, handleNext
  } = props;

  return (
    <>
      <div id="pagination">

        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        {pages && [...new Array(pages)].map((page, key) => (
          <button
            key={key}
            onClick={() => handlePage(key + 1)}
            disabled={key + 1 === currentPage}
          >
            {key + 1}
          </button>
        ))}

        <button
          onClick={handleNext}
          disabled={pages ? currentPage === pages : false}
        >
          Next
        </button>

      </div>
    </>
  )
}