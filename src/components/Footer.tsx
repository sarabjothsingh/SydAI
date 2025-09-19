const Footer = () => {
  return (
    <footer className="border-t border-border/20 bg-card/30 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="text-2xl font-bold text-primary mb-4">AIChat Pro</div>
            <p className="text-foreground/60 mb-6 max-w-md">
              Revolutionizing AI conversations with cutting-edge technology 
              and intuitive design. Experience the future of artificial intelligence.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer">
                <div className="w-5 h-5 bg-primary rounded-sm" />
              </div>
              <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center hover:bg-accent/20 transition-colors cursor-pointer">
                <div className="w-5 h-5 bg-accent rounded-sm" />
              </div>
              <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center hover:bg-success/20 transition-colors cursor-pointer">
                <div className="w-5 h-5 bg-success rounded-sm" />
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-foreground/60">
              <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-foreground/60">
              <li><a href="#about" className="hover:text-foreground transition-colors">About</a></li>
              <li><a href="#team" className="hover:text-foreground transition-colors">Team</a></li>
              <li><a href="#contact" className="hover:text-foreground transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-foreground/60 text-sm">
            © 2024 AIChat Pro. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-foreground/60 hover:text-foreground text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-foreground/60 hover:text-foreground text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-foreground/60 hover:text-foreground text-sm transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;