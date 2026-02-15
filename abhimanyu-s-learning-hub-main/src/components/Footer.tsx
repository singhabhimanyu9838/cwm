import { Link } from "react-router-dom";
import {
  Code2,
  Youtube,
  Github,
  Linkedin,
  Twitter,
  Instagram,
} from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-card mt-20">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Code2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">
              codestorywithMIC<span className="text-primary">.dev</span>
            </span>
          </Link>
          <p className="text-muted-foreground text-sm max-w-sm">
            Learn DSA, Web Development, AI & more with structured playlists,
            daily problems, and hands-on projects.
          </p>
          <div className="flex gap-3 mt-4">
            {[
              {
                Icon: Youtube,
                href: "https://www.youtube.com/@codestorywithMIC",
                label: "YouTube",
                color: `
    hover:text-white
    hover:bg-[#FF0000]
  `,
              },
              {
                Icon: Instagram,
                href: "https://www.instagram.com/techboys.247/",
                label: "Instagram",
                color: `
    hover:text-white
    hover:bg-gradient-to-tr
    hover:from-[#FCAF45]
    hover:via-[#E1306C]
    hover:to-[#C13584]
  `,
              },
              {
                Icon: Github,
                href: "https://github.com/singhabhimanyu9838",
                label: "GitHub",
                color: `
    hover:text-background
    hover:bg-foreground
  `,
              },
              {
                Icon: Linkedin,
                href: "https://www.linkedin.com/in/abhimanyu-singh-95a55s/",
                label: "LinkedIn",
                color: `
    hover:text-white
    hover:bg-[#0A66C2]
  `,
              },
            ].map(({ Icon, href, label, color }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className={`
        w-10 h-10 rounded-xl
        bg-secondary/80 backdrop-blur
        flex items-center justify-center
        text-muted-foreground
        transition-all duration-300
        hover:scale-110 hover:-translate-y-1
        hover:bg-primary/10
        ${color}
        focus:outline-none focus:ring-2 focus:ring-primary/40
      `}
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold text-foreground mb-4">
            Quick Links
          </h4>
          <div className="flex flex-col gap-2">
            {["Playlists", "Videos", "POTD", "Contact"].map((link) => (
              <Link
                key={link}
                to={`/${link.toLowerCase()}`}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {link}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display text-sm font-semibold text-foreground mb-4">
            Categories
          </h4>
          <div className="flex flex-col gap-2">
            {["DSA", "Web Dev", "AI & GenAI", "Interview Prep"].map((cat) => (
              <span key={cat} className="text-sm text-muted-foreground">
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
        © 2025 Abhimanyu Singh. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
