import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const password = watch('password');

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');

    try {
      // ✅ ONLY useAuth register
      await registerUser(
        data.firstName,
        data.lastName,
        data.email,
        data.password,
        data.phone,
        data.address
      );

      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          📚 Smart Library
        </h1>

        <p className="text-center text-gray-600 mb-8">
          Create your account
        </p>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* First Name */}
          <input
            placeholder="First Name"
            {...register('firstName', { required: true })}
            className="w-full p-2 border rounded"
          />

          {/* Last Name */}
          <input
            placeholder="Last Name"
            {...register('lastName', { required: true })}
            className="w-full p-2 border rounded"
          />

          {/* Email */}
          <input
            placeholder="Email"
            type="email"
            {...register('email', { required: true })}
            className="w-full p-2 border rounded"
          />

          {/* Password */}
          <input
            placeholder="Password"
            type="password"
            {...register('password', { required: true, minLength: 6 })}
            className="w-full p-2 border rounded"
          />

          {/* Confirm Password */}
          <input
            placeholder="Confirm Password"
            type="password"
            {...register('confirmPassword', {
              validate: (value) =>
                value === password || 'Passwords do not match'
            })}
            className="w-full p-2 border rounded"
          />

          {/* Phone */}
          <input
            placeholder="Phone"
            {...register('phone')}
            className="w-full p-2 border rounded"
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg"
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>

        </form>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-medium">
            Login here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default RegisterPage;