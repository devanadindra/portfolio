import { useState } from "react"; // Import useState
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ResultByCustomer } from "../../response/DashboardAdminResponse";
import { API_BASE } from "../../utils/constants";
// Assuming you have a Button component or you'll use a standard button
// import { Button } from "../ui/button"; 

interface Props {
  resultOrder: ResultByCustomer[];
}

// Define the number of items per page
const ITEMS_PER_PAGE = 3;

export default function TopCustomers({ resultOrder }: Props) {
  // State for the current page
  const [currentPage, setCurrentPage] = useState(1);

  function formatCustomerID(id: string): string {
    if (!id) return "";
    const firstPart = id.slice(0, 8);
    const lastPart = id.slice(-4);
    return (firstPart + lastPart).toUpperCase();
  }
  
  // Calculate total pages
  const totalPages = Math.ceil(resultOrder.length / ITEMS_PER_PAGE);

  // Calculate the slice of data to display
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = resultOrder.slice(startIndex, endIndex);

  // Handler for changing pages
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Top Customers
          </h3>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              {/* Added a Header for the Numbering */}
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400 w-12"
              >
                No
              </TableCell> 
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Customer ID
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Customer Name
              </TableCell>
              <TableCell
                isHeader
                className="hidden sm:block py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Phone Number
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Total Amount
              </TableCell>
              <TableCell
                isHeader
                className="hidden sm:block py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Total Orders Completed
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body - Uses currentData (max 3 items) */}
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {currentData.length > 0 ? (
              currentData.map((data, index) => (
                <TableRow key={index}>
                  {/* Row Numbering */}
                  <TableCell className="py-3 font-semibold text-gray-800 text-theme-sm dark:text-white/90">
                    {startIndex + index + 1}
                  </TableCell>
                  
                  <TableCell
                    className="py-3 text-gray-500 text-theme-sm dark:text-gray-400"
                    title={data.userID}
                  >
                    {formatCustomerID(data.userID)}
                  </TableCell>

                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="hidden sm:block h-[50px] w-[50px] overflow-hidden rounded-md">
                        <img
                          src={`${API_BASE}${data.CustomerProfile}`}
                          className="h-[50px] w-[50px]"
                          alt={data.CustomerName}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {data.CustomerName}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:block py-7 text-gray-500 text-theme-sm dark:text-gray-400">
                    {data.PhoneNumber}
                  </TableCell>
                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {data.TotalAmount}
                  </TableCell>
                  <TableCell className="hidden sm:block py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {data.TotalOrderComleted}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                {/* Changed colSpan to 6 because of the new '#' column */}
                <TableCell
                  colSpan={6} 
                  className="py-6 text-center text-gray-500 text-theme-sm dark:text-gray-400"
                >
                  No top customer yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 pt-4">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-md disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-md disabled:opacity-50 dark:bg-gray-700 dark:text-gray-300"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}