import React from 'react';

function Footer() {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-4">
            <h5>About CuddleBear</h5>
            <p>Your favorite teddy bear shop for quality and comfort.</p>
          </div>
          <div className="col-md-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-white-50">Home</a></li>
              <li><a href="/products" className="text-white-50">Products</a></li>
              <li><a href="/contact" className="text-white-50">Contact</a></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Contact Us</h5>
            <p className="text-white-50">Email: info@cuddlebear.com</p>
            <p className="text-white-50">Phone: +84 123 456 789</p>
          </div>
        </div>
        <hr className="bg-white-50" />
        <div className="text-center">
          <p className="text-white-50">&copy; 2025 CuddleBear Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
