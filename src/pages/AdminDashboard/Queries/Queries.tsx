import { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import QueryCard from "../../../components/AdminDashboard/QueriesPage/QueryCard/QueryCard";
import Dropdown from "../../../components/Reusable/Dropdown/Dropdown";
import SearchInput from "../../../components/Reusable/SearchInput/SearchInput";
import { useGetAllQueriesQuery } from "../../../redux/Features/HelpDesk/helpDeskApi";
import type { THelpDesk } from "../../../types/helpdesk.types";
import Loader from "../../../components/Shared/Loader/Loader";

const Queries = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);

  useEffect(() => {
    setPage(1);
  }, [searchValue, status, limit]);

  const {
    data: queries,
    isLoading,
    isFetching,
  } = useGetAllQueriesQuery({
    keyword: searchValue,
    status,
    page,
    limit,
  });

  const allQueries = queries?.data?.queries;
  const pagination = queries?.data?.pagination;

  const handlePrevPage = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (pagination && page < pagination.totalPages) setPage((prev) => prev + 1);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-5 lg:gap-0 justify-between items-start flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-neutral-40">Queries</h1>
          <p className="text-neutral-65">Manage all user queries.</p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          {/* Filters */}
          <div className="flex items-center gap-0 md:gap-2 flex-wrap">
            <SearchInput
              value={searchValue}
              onChange={setSearchValue}
              placeholder="Search query..."
            />

            <Dropdown
              className="py-1 w-full md:w-60"
              value={status}
              onChange={setStatus}
              options={[
                { value: "pending", label: "Pending" },
                { value: "resolved", label: "Resolved" },
              ]}
            />

            <Dropdown
              className="py-1 w-full md:w-40"
              value={limit.toString()}
              onChange={(val) => setLimit(Number(val))}
              options={[
                { value: "5", label: "5 per page" },
                { value: "10", label: "10 per page" },
                { value: "25", label: "25 per page" },
                { value: "50", label: "50 per page" },
              ]}
            />
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center gap-2 text-sm text-neutral-40">
              <button
                onClick={handlePrevPage}
                disabled={page === 1}
                className={`p-[6px] rounded bg-primary-10 text-white hover:bg-primary-9 transition disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <FiChevronLeft size={18} />
              </button>
              <span className="text-lg">
                {page} of {pagination.totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={page === pagination.totalPages}
                className={`p-[6px] rounded bg-primary-10 text-white hover:bg-primary-9 transition disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Query List */}
      <div className="flex flex-col justify-center gap-6 mt-6">
        {isLoading || isFetching ? (
          <div className="py-6">
            <Loader />
          </div>
        ) : allQueries?.length < 1 ? (
          <p className="text-neutral-10 text-center py-6">No query raised!</p>
        ) : (
          allQueries?.map((query: THelpDesk) => (
            <QueryCard key={query._id} query={query} variant="admin" />
          ))
        )}
      </div>
    </div>
  );
};

export default Queries;
