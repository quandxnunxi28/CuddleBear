import React from 'react';

function SubmitButton({
  text = 'Submit',
  loading = false,
  disabled = false,
  onClick,
  type = 'submit',
  className = '',
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn btn-primary ${className}`}
    >
      {loading ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Loading...
        </>
      ) : (
        text
      )}
    </button>
  );
}

export default SubmitButton;
