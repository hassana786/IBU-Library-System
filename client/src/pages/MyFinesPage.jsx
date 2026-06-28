import { useEffect, useState } from 'react';
import fineService from '../services/fineService';
import Layout from '../components/Layout';

const MyFinesPage = () => {
  const [fines, setFines] = useState([]);
  const [totalUnpaid, setTotalUnpaid] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchFines();
  }, []);

  const fetchFines = async () => {
    try {
      setIsLoading(true);
      setError('');

      const [finesResponse, totalResponse] = await Promise.all([
        fineService.getMyFines(),
        fineService.getTotalUnpaidFine(),
      ]);

      const finesData = finesResponse?.data?.fines ?? [];
      const totalData = totalResponse?.data?.total ?? 0;

      setFines(finesData);
      setTotalUnpaid(totalData);
    } catch (err) {
      setError(
        err?.response?.data?.message || 'Failed to load fines'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayFine = async (fineId) => {
    const confirmPay = window.confirm(
      'Are you sure you want to pay this fine?'
    );

    if (!confirmPay) return;

    try {
      setError('');
      await fineService.payFine(fineId);

      setSuccessMessage('Fine paid successfully!');

      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

      fetchFines();
    } catch (err) {
      setError(
        err?.response?.data?.message || 'Failed to pay fine'
      );
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
        <h1 className="text-4xl font-bold text-gray-800">
          My Fines
        </h1>

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Success */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {successMessage}
          </div>
        )}

        {/* Summary */}
        <div className="bg-red-50 rounded-lg p-6 border border-red-200">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Outstanding Balance
          </h2>
          <p className="text-4xl font-bold text-red-600">
            ${Number(totalUnpaid || 0).toFixed(2)}
          </p>
        </div>

        {/* Fines List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            All Fines
          </h2>

          <div className="grid gap-6">
            {fines.map((fine) => (
              <div
                key={fine?.id}
                className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                  fine?.status === 'paid'
                    ? 'border-green-500'
                    : 'border-red-500'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-600 text-sm">Reason</p>
                    <h3 className="text-xl font-bold text-gray-800">
                      {fine?.reason || 'No reason provided'}
                    </h3>
                  </div>

                  <div className="text-right">
                    <p className="text-gray-600 text-sm">Amount</p>
                    <p className="text-3xl font-bold text-red-600">
                      ${Number(fine?.amount || 0).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-gray-600">Created Date</p>
                    <p className="font-semibold">
                      {fine?.createdAt
                        ? new Date(fine.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-600">Due Date</p>
                    <p className="font-semibold">
                      {fine?.dueDate
                        ? new Date(fine.dueDate).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-600">Status</p>
                    <p
                      className={`font-semibold capitalize ${
                        fine?.status === 'paid'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {fine?.status || 'unknown'}
                    </p>
                  </div>
                </div>

                {fine?.status === 'unpaid' && (
                  <button
                    onClick={() => handlePayFine(fine.id)}
                    className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                  >
                    Pay Fine
                  </button>
                )}
              </div>
            ))}
          </div>

          {fines.length === 0 && (
            <div className="text-center py-12">
              <p className="text-green-600 text-lg font-semibold">
                ✓ No fines! Keep it up!
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MyFinesPage;