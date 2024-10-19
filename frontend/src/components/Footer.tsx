import { FaWhatsapp, FaInstagram, FaGithub } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer 
      className="bg-primary-2 text-neutral-0" 
      style={{ 
        backgroundImage: `url('/wave.svg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'top'
      }}
    >
      <div 
        id="footer_items" 
        className="flex flex-col md:flex-row justify-center md:justify-between items-center px-[8%] py-6 gap-2 md:gap-0"
      >
        <div className="social-media-buttons flex space-x-4 order-1 md:order-2 justify-center  text-neutral-1">
          <a href="https://wa.me/your-number" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp className="text-xl md:text-2xl hover:text-neutral-400" />
          </a>
          <a href="https://instagram.com/gabrielcaf" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="text-xl md:text-2xl hover:text-neutral-400" />
          </a>
          <a href="https://github.com/Gabrielcafens" target="_blank" rel="noopener noreferrer">
            <FaGithub className="text-xl md:text-2xl hover:text-neutral-400" />
          </a>
        </div>

        <span 
          id="copyright" 
          className="font-medium text-sm md:text-base order-2 md:order-1 text-neutral-1 text-center"
        >
          &copy; 2024 Gabrielcafens
        </span>
      </div>
    </footer>
  );
}
