import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 dark:bg-gray-900 text-white py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Underground Voices</h3>
            <p className="text-gray-300 text-sm">
              A secure platform for underground journalists to connect the dots, 
              verify sources, and publish non-biased content.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-gray-300 hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="/articles" className="text-gray-300 hover:text-white">
                  Articles
                </a>
              </li>
              <li>
                <a href="/storyboard" className="text-gray-300 hover:text-white">
                  Connect the Dots
                </a>
              </li>
              <li>
                <a href="/profile" className="text-gray-300 hover:text-white">
                  Profile
                </a>
              </li>
            </ul>
          </div>

          {/* Security Notice */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Security Notice</h3>
            <p className="text-gray-300 text-sm">
              This platform uses end-to-end encryption to protect your data. 
              Always use a VPN when accessing from sensitive locations.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Underground Voices. Built with security and privacy in mind.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
