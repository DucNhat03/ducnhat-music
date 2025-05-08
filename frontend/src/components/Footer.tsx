import { FaGithub, FaHeart, FaMusic } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-6 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center justify-center md:justify-start mb-2">
              <FaMusic className="text-purple-400 mr-2" />
              <span className="font-bold text-white">DucNhat Music</span>
            </div>
            <p className="text-center md:text-left text-sm">
              &copy; {new Date().getFullYear()} All rights reserved.
            </p>
          </div>
          <div className="flex items-center text-sm">
            <span className="flex items-center mr-4">
              Made with <FaHeart className="text-purple-400 mx-1" /> by DucNhat
            </span>
            <a 
              href="https://github.com/ducnhat03" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center hover:text-purple-400 transition-colors"
            >
              <FaGithub className="mr-1" /> GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 