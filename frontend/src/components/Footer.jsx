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
          <div className="flex items-center gap-5">

            {/* GitHub */}
            <a
              href="https://github.com/Shikhar-Pandey04"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white text-xl"
            >
              🐙
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/shikhar-pandey-0234b42aa/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white text-xl"
            >
              🔗
            </a>

          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;