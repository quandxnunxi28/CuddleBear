import clsx from 'clsx';

export function Input({
  label,
  error,
  required,
  className,
  ...props
}) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        className={clsx(
          'input-field',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export function Button({
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  children,
  className,
  ...props
}) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
  };

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={clsx(
        variants[variant],
        sizes[size],
        disabled || loading ? 'opacity-50 cursor-not-allowed' : '',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <span className="inline-block animate-spin mr-2">⏳</span>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function Card({ children, className, ...props }) {
  return (
    <div className={clsx('card p-6', className)} {...props}>
      {children}
    </div>
  );
}

export function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                {title && (
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {title}
                  </h3>
                )}
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Alert({ type = 'info', message, onClose }) {
  const types = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  return (
    <div className={clsx('border rounded-lg p-4 mb-4', types[type])}>
      <div className="flex justify-between items-start">
        <p className="text-sm font-medium">{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="text-lg font-bold cursor-pointer"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

export function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin text-4xl mb-4">⏳</div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
