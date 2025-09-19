const AboutSection = () => {
  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            About Us
          </h2>
          
          <div className="card-gradient rounded-2xl p-8 md:p-12 hover-lift">
            <div className="prose prose-lg prose-invert mx-auto">
              <p className="text-foreground/80 text-lg leading-relaxed mb-6">
                We are pioneering the future of artificial intelligence communication. 
                Our platform combines cutting-edge AI models with intuitive design 
                to create seamless conversational experiences.
              </p>
              
              <p className="text-foreground/70 leading-relaxed">
                Built by a team of AI researchers, engineers, and designers, 
                we believe that the best AI interactions feel natural, helpful, 
                and genuinely intelligent. Our mission is to democratize access 
                to advanced AI capabilities while maintaining the highest standards 
                of privacy and security.
              </p>
            </div>
            
            {/* Feature highlights */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 bg-primary rounded-sm" />
                </div>
                <h3 className="font-semibold mb-2">Advanced AI</h3>
                <p className="text-sm text-foreground/60">Multiple cutting-edge models at your disposal</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 bg-accent rounded-sm" />
                </div>
                <h3 className="font-semibold mb-2">Secure & Private</h3>
                <p className="text-sm text-foreground/60">Your conversations remain confidential</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 bg-success rounded-sm" />
                </div>
                <h3 className="font-semibold mb-2">Document Ready</h3>
                <p className="text-sm text-foreground/60">Upload and analyze documents effortlessly</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;