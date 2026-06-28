import { useEffect, useState } from 'react';
import reservationService from '../services/reservationService';
import Layout from '../components/Layout';

const MyReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setIsLoading(true);
      const response = await reservationService.getMyReservations();
      setReservations(response.data.reservations || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reservations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (reservationId) => {
    if (window.confirm('Are you sure you want to cancel this reservation?')) {
      try {
        await reservationService.cancelReservation(reservationId);
        setSuccessMessage('Reservation cancelled successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchReservations();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to cancel reservation');
      }
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="text-lg text-gray-600">Loading...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <h1 className="text-4xl font-bold text-gray-800">My Reservations</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {successMessage}
          </div>
        )}

        {/* Reservations List */}
        <div className="grid gap-6">
          {reservations.map((reservation) => (
            <div
              key={reservation.id}
              className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                reservation.status === 'ready' ? 'border-green-500' : 'border-yellow-500'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {reservation.book.title}
                  </h3>
                  <p className="text-gray-600">ISBN: {reservation.book.isbn}</p>
                  {reservation.status === 'ready' && (
                    <p className="text-green-600 font-semibold mt-2">
                      ✓ Ready for pickup!
                    </p>
                  )}
                </div>
                {reservation.status === 'pending' && (
                  <button
                    onClick={() => handleCancel(reservation.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Reservation Date</p>
                  <p className="font-semibold">
                    {new Date(reservation.reservationDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Status</p>
                  <p className="font-semibold capitalize">
                    <span className={`px-3 py-1 rounded-full text-white text-xs ${
                      reservation.status === 'ready' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}>
                      {reservation.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {reservations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No reservations</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyReservationsPage;