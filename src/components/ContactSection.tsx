import { Mail, MapPin } from "lucide-react";

const ContactSection = () => {
  // Contact section currently displays static contact information.
  // Form logic has been removed because the form is commented out in JSX.

  return (
    <section id="contact" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Contact Us
            </h2>
            <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
              Have questions or feedback? We'd love to hear from you. 
              Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            {/*<div className="card-gradient rounded-2xl p-8 hover-lift animate-scale-in">*/}
            {/*  <form onSubmit={handleSubmit} className="space-y-6">*/}
            {/*    <div>*/}
            {/*      <label htmlFor="name" className="block text-sm font-medium mb-2">*/}
            {/*        Name*/}
            {/*      </label>*/}
            {/*      <Input*/}
            {/*        id="name"*/}
            {/*        name="name"*/}
            {/*        type="text"*/}
            {/*        value={formData.name}*/}
            {/*        onChange={handleInputChange}*/}
            {/*        className="chat-input"*/}
            {/*        placeholder="Your full name"*/}
            {/*      />*/}
            {/*    </div>*/}

            {/*    <div>*/}
            {/*      <label htmlFor="email" className="block text-sm font-medium mb-2">*/}
            {/*        Email*/}
            {/*      </label>*/}
            {/*      <Input*/}
            {/*        id="email"*/}
            {/*        name="email"*/}
            {/*        type="email"*/}
            {/*        value={formData.email}*/}
            {/*        onChange={handleInputChange}*/}
            {/*        className="chat-input"*/}
            {/*        placeholder="your.email@example.com"*/}
            {/*      />*/}
            {/*    </div>*/}

            {/*    <div>*/}
            {/*      <label htmlFor="message" className="block text-sm font-medium mb-2">*/}
            {/*        Message*/}
            {/*      </label>*/}
            {/*      <Textarea*/}
            {/*        id="message"*/}
            {/*        name="message"*/}
            {/*        value={formData.message}*/}
            {/*        onChange={handleInputChange}*/}
            {/*        className="chat-input min-h-[120px] resize-none"*/}
            {/*        placeholder="Tell us what's on your mind..."*/}
            {/*      />*/}
            {/*    </div>*/}

            {/*    <Button */}
            {/*      type="submit" */}
            {/*      className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"*/}
            {/*    >*/}
            {/*      Send Message*/}
            {/*    </Button>*/}
            {/*  </form>*/}
            {/*</div>*/}

            {/* Contact Information */}
            {/* Center the contact info by spanning both columns on large screens */}
            <div className="space-y-8 animate-fade-in lg:col-span-2 mx-auto max-w-2xl" style={{ animationDelay: "0.2s" }}>
              <div className="card-gradient rounded-2xl p-8 hover-lift">
                <h3 className="text-xl font-semibold mb-6">Get in Touch</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-foreground/60">kycs22officialwork@gmail.com</p>
                    </div>
                  </div>

                  {/*<div className="flex items-center space-x-4">*/}
                  {/*  <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">*/}
                  {/*    <Phone className="w-5 h-5 text-accent" />*/}
                  {/*  </div>*/}
                  {/*  <div>*/}
                  {/*    <p className="font-medium">Phone</p>*/}
                  {/*    <p className="text-foreground/60">+1 (555) 123-4567</p>*/}
                  {/*  </div>*/}
                  {/*</div>*/}

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="font-medium">Office</p>
                      <p className="text-foreground/60">NIIT University, Neemrana, India</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-gradient rounded-2xl p-8 hover-lift">
                <h3 className="text-xl font-semibold mb-4">Response Time</h3>
                <p className="text-foreground/70">
                  We typically respond to all inquiries within 24 hours during business days. 
                  For urgent matters, please include "URGENT" in your subject line.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;