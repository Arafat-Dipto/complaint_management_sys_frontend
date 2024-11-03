import ReactPaginate from "react-paginate";

const Pagination = ({ pageCount, setPage, currentPage }) => {
  const handlePageClick = (selectedEvent) => {
    setPage(selectedEvent.selected + 1);
  };

  return (
    <div className="flex justify-end mt-4">
      <ReactPaginate
        breakLabel="..."
        nextLabel=" >"
        onPageChange={(event) => handlePageClick(event)}
        pageRangeDisplayed={4}
        pageCount={pageCount}
        previousLabel="< "
        forcePage={currentPage - 1}
        breakClassName="px-2 py-1 mx-1 text-gray-600"
        breakLinkClassName="hover:text-gray-800"
        containerClassName="flex items-center space-x-2"
        pageClassName="px-3 py-1 text-gray-700 rounded-md cursor-pointer hover:bg-gray-200"
        pageLinkClassName="text-gray-700"
        previousClassName="px-3 py-1 text-gray-700 rounded-md cursor-pointer hover:bg-gray-200"
        previousLinkClassName="text-gray-700"
        nextClassName="px-3 py-1 text-gray-700 rounded-md cursor-pointer hover:bg-gray-200"
        nextLinkClassName="text-gray-700"
        activeClassName="bg-blue-500 text-white"
      />
    </div>
  );
};

export default Pagination;
