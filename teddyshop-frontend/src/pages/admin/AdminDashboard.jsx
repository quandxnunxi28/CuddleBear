import React, { useState, useEffect } from 'react';
import Loading from '../../components/ui/Loading';
import Alert from '../../components/ui/Alert';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    // TODO: Fetch admin statistics from API
    const fetchStats = async () => {
      try {
        // const data = await getAdminStats();
        // setStats(data);
        setLoading(false);
      } catch (error) {
        setAlert({
          type: 'danger',
          message: 'Failed to load statistics',
        });
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container-fluid mt-5">
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <h1 className="mb-4">Admin Dashboard</h1>

      <div className="row">
        <div className="col-md-3 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Products</h5>
              <p className="card-text display-4">{stats.totalProducts}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Orders</h5>
              <p className="card-text display-4">{stats.totalOrders}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Users</h5>
              <p className="card-text display-4">{stats.totalUsers}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Revenue</h5>
              <p className="card-text display-4">${stats.totalRevenue}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h5>Management</h5>
            </div>
            <div className="card-body">
              <button className="btn btn-primary me-2">Manage Products</button>
              <button className="btn btn-info me-2">Manage Orders</button>
              <button className="btn btn-warning">Manage Users</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
