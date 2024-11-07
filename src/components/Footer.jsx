import { Link } from "react-router-dom";

export const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white p-4 fixed bottom-0 left-0 right-0 py-4">
          <div className="container mx-auto flex justify-between items-center">
            <p className="text-sm">&copy; {new Date().getFullYear()} ShoeStore. All rights reserved.</p>
            <ul className="flex space-x-4">
              <li>
                <a href="/privacy" className="hover:text-gray-400">
                  Privacy Policys
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-gray-400">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </footer>
      );
    };