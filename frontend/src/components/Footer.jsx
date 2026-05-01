import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-zinc-400 border-t border-white/10 mt-20">
      <div className="max-w-[1400px] mx-auto px-8 py-16">

        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          <div>
            <p className="text-sm max-w-[260px] leading-relaxed">
              A sleek and modern footer for businesses that want to make a bold statement.
            </p>
          </div>

          <div>
            <h3 className="text-white mb-4 font-semibold">PRODUCT</h3>
            <ul className="space-y-2 text-sm">
              <li>Features</li>
              <li>Pricing</li>
              <li>Case Studies</li>
              <li>Reviews</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white mb-4 font-semibold">RESOURCES</h3>
            <ul className="space-y-2 text-sm">
              <li>Blog</li>
              <li>Help Center</li>
              <li>Contact</li>
              <li>Status</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white mb-4 font-semibold">COMPANY</h3>
            <ul className="space-y-2 text-sm">
              <li>About</li>
              <li>Careers</li>
              <li>Press</li>
            </ul>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="mt-12 pt-6 border-t border-white/10 flex justify-between items-center">

          {/* LEFT */}
          <p className="text-sm">
            © 2025 Your Brand. All rights reserved.
          </p>

          {/* RIGHT ICONS */}
          <div className="flex items-center gap-6">

            {/* GitHub */}
            <a
              href="https://github.com/Shikhar-Pandey04"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-5 h-5"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12a12 12 0 008.2 11.4c.6.1.82-.26.82-.58v-2.17c-3.34.73-4.04-1.42-4.04-1.42-.55-1.38-1.34-1.75-1.34-1.75-1.1-.75.08-.73.08-.73 1.22.09 1.86 1.25 1.86 1.25 1.08 1.85 2.83 1.31 3.52 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.16 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.64.24 2.86.12 3.16.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.21.69.83.57A12 12 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/shikhar-pandey-0234b42aa/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-5 h-5"
              >
                <path d="M20.45 20.45h-3.55v-5.6c0-1.33-.03-3.05-1.86-3.05-1.86 0-2.14 1.45-2.14 2.95v5.7H9.35V9h3.41v1.56h.05c.48-.91 1.66-1.86 3.42-1.86 3.66 0 4.34 2.41 4.34 5.55v6.2zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45z"/>
              </svg>
            </a>

          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;