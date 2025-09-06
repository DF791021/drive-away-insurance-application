import React from 'react';
import { Shield, Phone, Mail, Menu, X, HelpCircle, Save } from 'lucide-react';

interface HeaderProps {
  onSave?: () => void;
  onHelp?: () => void;
  showMobileMenu?: boolean;
  onToggleMobileMenu?: () => void;
}

export function Header({ onSave, onHelp, showMobileMenu, onToggleMobileMenu }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100 relative z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              aria-label="Go to homepage"
            >
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">GreenLite Insurance Agency</h1>
                <p className="text-sm text-gray-500">Drive-Away Coverage</p>
              </div>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* Quick Actions */}
            <div className="hidden md:flex items-center space-x-3">
              {onSave && (
                <button
                  onClick={onSave}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  aria-label="Save progress"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Progress</span>
                </button>
              )}
              {onHelp && (
                <button
                  onClick={onHelp}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  aria-label="Get help"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Help</span>
                </button>
              )}
            </div>
          
            {/* Contact Info */}
            <div className="hidden lg:flex items-center space-x-4 text-sm text-gray-600 border-l border-gray-200 pl-4">
              <a href="tel:9034079474" className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
                <Phone className="w-4 h-4" />
                <span>(903) 407-9474</span>
              </a>
              <a href="mailto:support@greenliteinsurance.com" className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
                <Mail className="w-4 h-4" />
                <span>support@greenliteinsurance.com</span>
              </a>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={onToggleMobileMenu}
              className="md:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
              aria-label={showMobileMenu ? "Close menu" : "Open menu"}
              aria-expanded={showMobileMenu}
            >
              {showMobileMenu ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {showMobileMenu && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">

              {/* Mobile Quick Actions */}
              <div className="pt-4 space-y-3">
                {onSave && (
                  <button
                    onClick={onSave}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Progress</span>
                  </button>
                )}
                {onHelp && (
                  <button
                    onClick={onHelp}
                    className="flex items-center space-x-2 w-full px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Get Help</span>
                  </button>
                )}
              </div>

              {/* Mobile Contact Info */}
              <div className="pt-3 mt-3 border-t border-gray-200 space-y-3">
                <a
                  href="tel:9034079474"
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>(903) 407-9474</span>
                </a>
                <a
                  href="mailto:support@greenliteinsurance.com"
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email Support</span>
                </a>
              </div>
          </div>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 lg:hidden z-40"
          onClick={onToggleMobileMenu}
          aria-hidden="true"
        />
      )}
    </header>
  );
}