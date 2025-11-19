// import { useState } from "react";
// import { Menu, X } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useNavigate } from "react-router-dom";

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const navigate = useNavigate();

//   const scrollToSection = (sectionId: string) => {
//     const element = document.getElementById(sectionId);
//     if (element) {
//       element.scrollIntoView({ behavior: "smooth" });
//       setIsMenuOpen(false);
//     }
//   };

//   const handleLogin = () => {
//     navigate("/login");
//   };

//   return (
//     <nav className="fixed top-0 right-0 z-50 p-4">
//       <div className="flex items-center justify-end">
//         {/* Desktop Navigation */}
//         <div className="hidden md:flex items-center space-x-6">
//           <button
//             onClick={() => scrollToSection("about")}
//             className="text-foreground/80 hover:text-foreground transition-colors"
//           >
//             About Us
//           </button>
//           <button
//             onClick={() => scrollToSection("contact")}
//             className="text-foreground/80 hover:text-foreground transition-colors"
//           >
//             Contact Us
//           </button>
//           <button
//             onClick={() => scrollToSection("team")}
//             className="text-foreground/80 hover:text-foreground transition-colors"
//           >
//             Meet the Team
//           </button>
//           <Button
//             onClick={handleLogin}
//             variant="outline"
//             className="border-primary/30 hover:border-primary hover:bg-primary/10"
//           >
//             Log in
//           </Button>
//         </div>

//         {/* Mobile menu button */}
//         <Button
//           variant="ghost"
//           size="sm"
//           className="md:hidden ml-2"
//           onClick={() => setIsMenuOpen(!isMenuOpen)}
//         >
//           {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
//         </Button>
//       </div>

//       {/* Mobile Navigation */}
//       {isMenuOpen && (
//         <div className="md:hidden mt-2 space-y-2 text-right animate-fade-in">
//           <button
//             onClick={() => scrollToSection("about")}
//             className="block w-full py-2 text-foreground/80 hover:text-foreground transition-colors"
//           >
//             About Us
//           </button>
//           <button
//             onClick={() => scrollToSection("contact")}
//             className="block w-full py-2 text-foreground/80 hover:text-foreground transition-colors"
//           >
//             Contact Us
//           </button>
//           <button
//             onClick={() => scrollToSection("team")}
//             className="block w-full py-2 text-foreground/80 hover:text-foreground transition-colors"
//           >
//             Meet the Team
//           </button>
//           <div className="flex space-x-2 mt-2">
//             <Button
//               onClick={handleLogin}
//               variant="outline"
//               className="flex-1 border-primary/30 hover:border-primary hover:bg-primary/10"
//             >
//               Sign In
//             </Button>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;

"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [active, setActive] = useState("hero");
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);

    if (!element) return;

    // Scroll smoothly & cleanly
    element.scrollIntoView({ behavior: "smooth", block: "start" });

    // Delay active state until scroll stabilizes
    setTimeout(() => {
      setActive(sectionId);
    }, 300);

    setIsMenuOpen(false);
  };

  // Detect active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "about", "contact", "team"];

      for (const id of sections) {
        const el = document.getElementById(id);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        if (rect.top <= 150 && rect.bottom >= 150) {
          setActive(id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const linkClass = (id: string) =>
    `relative text-white/70 hover:text-white transition-all text-sm pb-1
     after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px]
     after:bg-white after:rounded-full after:transition-all after:duration-300
     after:ease-out ${
       active === id
         ? "after:w-full"
         : "after:w-0 hover:after:w-full"
     }`;

  const handleLogin = () => navigate("/login");

  return (
    <nav className="fixed top-0 right-0 z-50 p-4">
      <div className="flex items-center justify-end">

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">

          <button onClick={() => scrollToSection("hero")} className={linkClass("hero")}>
            Home
          </button>

          <button onClick={() => scrollToSection("about")} className={linkClass("about")}>
            About Us
          </button>

          <button onClick={() => scrollToSection("contact")} className={linkClass("contact")}>
            Contact Us
          </button>

          <button onClick={() => scrollToSection("team")} className={linkClass("team")}>
            Meet the Team
          </button>

          <Button
            onClick={handleLogin}
            variant="outline"
            className="border-white/20 hover:border-white hover:bg-white/10 text-white/80 text-sm"
          >
            Log In
          </Button>
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden ml-2 text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 space-y-2 text-right animate-fade-in">

          <button
            onClick={() => scrollToSection("hero")}
            className="block w-full py-2 text-white/70 hover:text-white text-sm"
          >
            Home
          </button>

          <button
            onClick={() => scrollToSection("about")}
            className="block w-full py-2 text-white/70 hover:text-white text-sm"
          >
            About Us
          </button>

          <button
            onClick={() => scrollToSection("contact")}
            className="block w-full py-2 text-white/70 hover:text-white text-sm"
          >
            Contact Us
          </button>

          <button
            onClick={() => scrollToSection("team")}
            className="block w-full py-2 text-white/70 hover:text-white text-sm"
          >
            Meet the Team
          </button>

          <div className="flex space-x-2 mt-2">
            <Button
              onClick={handleLogin}
              variant="outline"
              className="flex-1 border-white/20 hover:border-white hover:bg-white/10 text-white/70"
            >
              Sign In
            </Button>
          </div>

        </div>
      )}
    </nav>
  );
};

export default Navbar;
