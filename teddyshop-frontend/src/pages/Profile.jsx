import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/ui/Loading';

function Profile() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">User Profile</h2>
              <hr />
              <div className="row mb-3">
                <div className="col-sm-3">
                  <h6 className="mb-0">Name</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  {user?.fullName || 'N/A'}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-3">
                  <h6 className="mb-0">Email</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  {user?.email || 'N/A'}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-3">
                  <h6 className="mb-0">Role</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  {user?.role || 'User'}
                </div>
              </div>
              <button className="btn btn-primary">Edit Profile</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
