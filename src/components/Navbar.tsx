import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 right-0 z-50 p-4">
      <div className="flex items-center justify-end">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <button
            onClick={() => scrollToSection("about")}
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            About Us
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            Contact Us
          </button>
          <button
            onClick={() => scrollToSection("team")}
            className="text-foreground/80 hover:text-foreground transition-colors"
          >
            Meet the Team
          </button>
          <Button
            onClick={handleLogin}
            variant="outline"
            className="border-primary/30 hover:border-primary hover:bg-primary/10"
          >
            Sign In
          </Button>
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden ml-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 space-y-2 text-right animate-fade-in">
          <button
            onClick={() => scrollToSection("about")}
            className="block w-full py-2 text-foreground/80 hover:text-foreground transition-colors"
          >
            About Us
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="block w-full py-2 text-foreground/80 hover:text-foreground transition-colors"
          >
            Contact Us
          </button>
          <button
            onClick={() => scrollToSection("team")}
            className="block w-full py-2 text-foreground/80 hover:text-foreground transition-colors"
          >
            Meet the Team
          </button>
          <div className="flex space-x-2 mt-2">
            <Button
              onClick={handleLogin}
              variant="outline"
              className="flex-1 border-primary/30 hover:border-primary hover:bg-primary/10"
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