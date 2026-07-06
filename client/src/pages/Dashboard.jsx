import React from "react";
import { useAuth } from "../hooks/useAuth";

const Dashboard = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <h2>Loading...</h2>;

  if (!user) return <h2>No user found</h2>;

  return (
    <div>
      <h1>Dashboard</h1>

      <h3>
        Welcome: {user.firstName} {user.lastName}
      </h3>

      <p>Role: {user.role}</p>

      {user.role === "admin" ? (
        <div>
          <h2>Admin Panel</h2>
        </div>
      ) : (
        <div>
          <h2>Student Panel</h2>
        </div>
      )}
    </div>
  );
};

export default Dashboard;