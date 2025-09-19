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
    navigate("/app");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b border-border/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="text-xl font-bold text-primary">
            AIChat
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
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
              Login
            </Button>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 animate-fade-in">
            <button
              onClick={() => scrollToSection("about")}
              className="block w-full text-left py-2 px-4 text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
            >
              About Us
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="block w-full text-left py-2 px-4 text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
            >
              Contact Us
            </button>
            <button
              onClick={() => scrollToSection("team")}
              className="block w-full text-left py-2 px-4 text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
            >
              Meet the Team
            </button>
            <Button 
              onClick={handleLogin}
              variant="outline"
              className="w-full mt-2 border-primary/30 hover:border-primary hover:bg-primary/10"
            >
              Login
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;