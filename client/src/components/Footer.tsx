export default function Footer() {
  return (
    <footer className="bg-[#34495E] text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-4 md:mb-0">
            <h4 
              className="text-lg font-semibold mb-2"
              style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}
            >
              US Abortion Statistics Dashboard
            </h4>
            <p className="text-sm text-gray-300">
              Providing clear, objective data about abortion services across the United States.
            </p>
          </div>
          
          <div>
            <h5 
              className="font-semibold mb-2"
              style={{ fontFamily: '"IBM Plex Sans", sans-serif' }}
            >
              Data Resources
            </h5>
            <ul className="text-sm space-y-1">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Guttmacher Institute
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  CDC Reproductive Health Data
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  State Health Departments
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-600 mt-6 pt-4 text-sm text-gray-400 flex flex-col md:flex-row justify-between">
          <p>&copy; {new Date().getFullYear()} Abortion Statistics Dashboard. All data is public information.</p>
          <div className="mt-2 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white mr-4 transition-colors">
              Terms of Use
            </a>
            <a href="#" className="text-gray-400 hover:text-white mr-4 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
