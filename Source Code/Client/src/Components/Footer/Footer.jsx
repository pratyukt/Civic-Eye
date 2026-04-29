import React from "react";
import { Link } from "react-router-dom"; 
import { routes } from "../../data/routes";
const Footer = () => {
  return (
    <footer className="bg-[#1565C0] text-white mt-6">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        
        {/* Logo + About */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <img
              src="/logo.png"
              alt="Civic Eye Logo"
              className="w-10 h-10 object-contain"
            />
            <span className="text-base font-semibold">Civic Eye</span>
          </div>
          <p className="text-xs text-gray-200 leading-snug">
            Civic Eye is an initiative under the Ministry of Personnel, Public
            Grievances & Pensions, Government of India.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-semibold mb-2">Quick Links</h4>
          <ul className="space-y-1 text-xs">
            <li><Link to={routes.aboutUs} className="hover:underline">About Us</Link></li>
            <li><Link to="#" className="hover:underline">Department Works</Link></li>
            <li><Link to="#" className="hover:underline">Department Info</Link></li>
            <li><Link to="#" className="hover:underline">Contact Support</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-sm font-semibold mb-2">Contact</h4>
          <p className="text-xs text-gray-200">📍 New Delhi, India</p>
          <p className="text-xs text-gray-200">📞 +91-XXXXXXXXXX</p>
          <p className="text-xs text-gray-200">✉️ support@civiceye.gov.in</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#0d47a1] text-center py-2 text-xs text-gray-200">
        © {new Date().getFullYear()} Civic Eye | Govt of India
      </div>
    </footer>
  );
};

export default Footer;
