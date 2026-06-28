import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import bookService from '../services/bookService';
import borrowService from '../services/borrowService';
import reservationService from '../services/reservationService';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';

const BooksPage = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { register, handleSubmit, reset } = useForm();

  const fetchBooks = async (query = '') => {
    try {
      setIsLoading(true);
      const response = query ? await bookService.searchBooks(query) : await bookService.getAllBooks();
      const rawData = response.data?.data || response.data || [];
      const finalBooks = rawData.books || rawData.items || (Array.isArray(rawData) ? rawData : []);
      setBooks(finalBooks);
    } catch (err) {
      setError('Failed to load books');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Ma hubtaa inaad tirtirto buuggan?")) {
      await bookService.deleteBook(id);
      fetchBooks(); // Dib u soo load-garee xogta
    }
  };

  useEffect(() => { fetchBooks(); }, []);

  if (isLoading) return <Layout><div className="p-10 text-center">Loading...</div></Layout>;

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Books Catalog</h1>
          {/* Admin: Add Button */}
          {user?.role === 'admin' && (
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
              + Add New Book
            </button>
          )}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSubmit((d) => fetchBooks(d.searchQuery))} className="flex gap-2">
          <input {...register('searchQuery')} className="border p-2 rounded w-full" placeholder="Search..." />
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded">Search</button>
        </form>

        {error && <div className="text-red-600">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book.id} className="border p-4 rounded shadow">
              <h3 className="text-xl font-bold">{book.title}</h3>
              <p>Author: {book.author?.name || 'N/A'}</p>
              <p>Available: {book.availableQuantity}</p>
              
              {/* Admin Actions */}
              {user?.role === 'admin' && (
                <div className="flex gap-2 mt-4">
                  <button className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                  <button onClick={() => handleDelete(book.id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                </div>
              )}

              {/* Student Actions */}
              {user?.role === 'student' && book.availableQuantity > 0 && (
                <button className="mt-4 bg-green-500 text-white w-full py-2 rounded">Borrow</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default BooksPage;