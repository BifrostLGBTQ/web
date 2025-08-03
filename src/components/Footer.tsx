import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { theme } = useTheme();

  const footerLinks = {
    company: [
      { name: 'About Us', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Press', href: '#' },
      { name: 'Blog', href: '#' },
    ],
    support: [
      { name: 'Help Center', href: '#' },
      { name: 'Safety Center', href: '#' },
      { name: 'Community Guidelines', href: '#' },
      { name: 'Contact Us', href: '#' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
      { name: 'Accessibility', href: '#' },
    ],
    resources: [
      { name: 'Events', href: '#' },
      { name: 'Communities', href: '#' },
      { name: 'Professional Network', href: '#' },
      { name: 'Resources', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Github, href: '#', label: 'GitHub' },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={`border-t mt-20 ${
        theme === 'dark' 
          ? 'bg-gray-900 border-gray-800' 
          : 'bg-white border-gray-200/60'
      }`}
    >
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div 
              className="flex items-center space-x-3 mb-6"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
                theme === 'dark' 
                  ? 'bg-gray-800' 
                  : 'bg-gray-200'
              }`}>
                <Heart className={`w-5 h-5 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-700'
                }`} fill="currentColor" />
              </div>
              <div>
                <h3 className={`text-xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  PrideConnect
                </h3>
                <p className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>Professional Network</p>
              </div>
            </motion.div>
            
            <p className={`mb-6 leading-relaxed max-w-md ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Connecting professionals, building communities, and fostering meaningful relationships 
              in the LGBTQ+ professional network. Together we grow stronger.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className={`flex items-center space-x-3 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <Mail className={`w-4 h-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <span className="text-sm">hello@prideconnect.com</span>
              </div>
              <div className={`flex items-center space-x-3 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <Phone className={`w-4 h-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className={`flex items-center space-x-3 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <MapPin className={`w-4 h-4 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <span className="text-sm">San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className={`text-sm transition-colors duration-200 ${
                      theme === 'dark' 
                        ? 'text-gray-400 hover:text-white' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className={`text-sm transition-colors duration-200 ${
                      theme === 'dark' 
                        ? 'text-gray-400 hover:text-white' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Resources
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className={`text-sm transition-colors duration-200 ${
                      theme === 'dark' 
                        ? 'text-gray-400 hover:text-white' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Media & Newsletter */}
        <div className={`mt-8 sm:mt-12 pt-6 sm:pt-8 border-t ${
          theme === 'dark' ? 'border-gray-800' : 'border-gray-200/60'
        }`}>
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            {/* Social Media */}
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>Follow us:</span>
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group ${
                      theme === 'dark' 
                        ? 'bg-gray-800 hover:bg-gray-700' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    aria-label={social.label}
                  >
                    <social.icon className={`w-4 h-4 transition-colors duration-200 ${
                      theme === 'dark' 
                        ? 'text-gray-400 group-hover:text-white' 
                        : 'text-gray-600 group-hover:text-gray-900'
                    }`} />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
              <span className={`text-sm font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>Stay updated:</span>
              <div className="flex w-full sm:w-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 border rounded-l-xl focus:outline-none focus:ring-2 focus:ring-gray-500/20 focus:border-gray-400 text-sm min-w-0 ${
                    theme === 'dark' 
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
                <button className={`px-4 py-2 rounded-r-xl transition-all duration-200 text-sm font-medium whitespace-nowrap ${
                  theme === 'dark' 
                    ? 'bg-gray-800 text-white hover:bg-gray-700' 
                    : 'bg-gray-900 text-white hover:bg-black'
                }`}>
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={`border-t ${
        theme === 'dark' 
          ? 'border-gray-800 bg-gray-900/50' 
          : 'border-gray-200/60 bg-gray-50/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className={`flex items-center space-x-2 text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              <span>© {currentYear} PrideConnect. All rights reserved.</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline">Made with ❤️ for the community</span>
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-6 text-sm">
              {footerLinks.legal.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`transition-colors duration-200 ${
                    theme === 'dark' 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer; 