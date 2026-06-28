import { useEffect, useState } from "react";
import borrowService from "../services/borrowService";
import Layout from "../components/Layout";

const MyBorrowingsPage = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReturning, setIsReturning] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchBorrowings();
  }, []);

  const fetchBorrowings = async () => {
    try {
      setIsLoading(true);
      setError("");
      setSuccessMessage("");
      const response = await borrowService.getMyBorrowingHistory();
      setBorrowings(response.data.borrowings || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        error.message ||
        "Failed to load borrowings."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturn = async (borrowingId) => {
    try {
      setIsReturning(true);
      setError("");
      await borrowService.returnBook(borrowingId);
      setSuccessMessage("Book returned successfully.");
      await fetchBorrowings();
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        error.message ||
        "Failed to return book."
      );
    } finally {
      setIsReturning(false);
    }
  };

  const activeBorrowings = borrowings.filter((b) => b.status === "active");

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen text-lg text-gray-600">
          Loading...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-4xl font-bold text-gray-800">My Borrowings</h1>
        {error && <div className="rounded border border-red-300 bg-red-100 px-4 py-3 text-red-700">{error}</div>}
        {successMessage && <div className="rounded border border-green-300 bg-green-100 px-4 py-3 text-green-700">{successMessage}</div>}
        
        <div>
          <h2 className="mb-4 text-2xl font-bold text-gray-800">Active Borrowings</h2>
          {activeBorrowings.length === 0 ? <p className="text-gray-600">No active borrowings.</p> : (
            <div className="grid gap-6">
              {activeBorrowings.map((borrowing) => (
                <div key={borrowing.id} className="rounded-lg border-l-4 border-blue-500 bg-white p-6 shadow-md">
                   <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{borrowing.book.title}</h3>
                      <p className="text-gray-600">ISBN: {borrowing.book.isbn}</p>
                    </div>
                    <button
                      onClick={() => handleReturn(borrowing.id)}
                      disabled={isReturning}
                      className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:bg-gray-400"
                    >
                      {isReturning ? "Processing..." : "Return Book"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyBorrowingsPage;