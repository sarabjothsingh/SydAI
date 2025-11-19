// import { Mail, MapPin } from "lucide-react";

// const ContactSection = () => {
//   // Contact section currently displays static contact information.
//   // Form logic has been removed because the form is commented out in JSX.

//   return (
//     <section id="contact" className="py-20 relative">
//       <div className="container mx-auto px-4">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-16 animate-slide-up">
//             <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
//               Contact Us
//             </h2>
//             <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
//               Have questions or feedback? We'd love to hear from you. 
//               Send us a message and we'll respond as soon as possible.
//             </p>
//           </div>

//           <div className="grid lg:grid-cols-2 gap-12 items-start">
//             {/* Contact Form */}
//             {/*<div className="card-gradient rounded-2xl p-8 hover-lift animate-scale-in">*/}
//             {/*  <form onSubmit={handleSubmit} className="space-y-6">*/}
//             {/*    <div>*/}
//             {/*      <label htmlFor="name" className="block text-sm font-medium mb-2">*/}
//             {/*        Name*/}
//             {/*      </label>*/}
//             {/*      <Input*/}
//             {/*        id="name"*/}
//             {/*        name="name"*/}
//             {/*        type="text"*/}
//             {/*        value={formData.name}*/}
//             {/*        onChange={handleInputChange}*/}
//             {/*        className="chat-input"*/}
//             {/*        placeholder="Your full name"*/}
//             {/*      />*/}
//             {/*    </div>*/}

//             {/*    <div>*/}
//             {/*      <label htmlFor="email" className="block text-sm font-medium mb-2">*/}
//             {/*        Email*/}
//             {/*      </label>*/}
//             {/*      <Input*/}
//             {/*        id="email"*/}
//             {/*        name="email"*/}
//             {/*        type="email"*/}
//             {/*        value={formData.email}*/}
//             {/*        onChange={handleInputChange}*/}
//             {/*        className="chat-input"*/}
//             {/*        placeholder="your.email@example.com"*/}
//             {/*      />*/}
//             {/*    </div>*/}

//             {/*    <div>*/}
//             {/*      <label htmlFor="message" className="block text-sm font-medium mb-2">*/}
//             {/*        Message*/}
//             {/*      </label>*/}
//             {/*      <Textarea*/}
//             {/*        id="message"*/}
//             {/*        name="message"*/}
//             {/*        value={formData.message}*/}
//             {/*        onChange={handleInputChange}*/}
//             {/*        className="chat-input min-h-[120px] resize-none"*/}
//             {/*        placeholder="Tell us what's on your mind..."*/}
//             {/*      />*/}
//             {/*    </div>*/}

//             {/*    <Button */}
//             {/*      type="submit" */}
//             {/*      className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"*/}
//             {/*    >*/}
//             {/*      Send Message*/}
//             {/*    </Button>*/}
//             {/*  </form>*/}
//             {/*</div>*/}

//             {/* Contact Information */}
//             {/* Center the contact info by spanning both columns on large screens */}
//             <div className="space-y-8 animate-fade-in lg:col-span-2 mx-auto max-w-2xl" style={{ animationDelay: "0.2s" }}>
//               <div className="card-gradient rounded-2xl p-8 hover-lift">
//                 <h3 className="text-xl font-semibold mb-6">Get in Touch</h3>
                
//                 <div className="space-y-6">
//                   <div className="flex items-center space-x-4">
//                     <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
//                       <Mail className="w-5 h-5 text-primary" />
//                     </div>
//                     <div>
//                       <p className="font-medium">Email</p>
//                       <p className="text-foreground/60">kycs22officialwork@gmail.com</p>
//                     </div>
//                   </div>

//                   {/*<div className="flex items-center space-x-4">*/}
//                   {/*  <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">*/}
//                   {/*    <Phone className="w-5 h-5 text-accent" />*/}
//                   {/*  </div>*/}
//                   {/*  <div>*/}
//                   {/*    <p className="font-medium">Phone</p>*/}
//                   {/*    <p className="text-foreground/60">+1 (555) 123-4567</p>*/}
//                   {/*  </div>*/}
//                   {/*</div>*/}

//                   <div className="flex items-center space-x-4">
//                     <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
//                       <MapPin className="w-5 h-5 text-success" />
//                     </div>
//                     <div>
//                       <p className="font-medium">Office</p>
//                       <p className="text-foreground/60">NIIT University, Neemrana, India</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="card-gradient rounded-2xl p-8 hover-lift">
//                 <h3 className="text-xl font-semibold mb-4">Response Time</h3>
//                 <p className="text-foreground/70">
//                   We typically respond to all inquiries within 24 hours during business days. 
//                   For urgent matters, please include "URGENT" in your subject line.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ContactSection;

// "use client";


// import { BentoDemo } from "./registry/bento-grid";
// import { BentoCard, BentoGrid } from "./ui/bento-grid";

// const ContactSection = () => {
//   return (
//     <section id="contact" className="min-h-screen bg-black py-20 relative">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-16 animate-slide-up">
//           <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
//             Contact Us
//           </h2>

//           <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
//             Reach out to us anytime. We’d love to connect with you.
//           </p>
//         </div>

//         <BentoDemo />
//       </div>
//     </section>
//   );
// };

// export default ContactSection;

// "use client";

// import React from "react";
// import Squares from "./Squares";
// import ShinyText from "./shinytext";

// const ContactSection = () => {
//   return (
//     <section
//       id="contact"
//       className="min-h-screen bg-black py-20 relative overflow-hidden"
//     >
//       {/* Background Squares */}
//       <div className="absolute inset-0 z-[1] pointer-events-none">
//         <Squares
//           direction="right"
//           speed={0.8}
//           borderColor="#777"
//           squareSize={55}
//           hoverFillColor="#1a1a1a"
//         />
//       </div>

//       {/* Foreground Content */}
//       <div className="container mx-auto px-4 relative z-[2]">
//         <div className="text-center mb-16">
//           <h2 className="text-4xl md:text-5xl font-bold mb-4">
//             <ShinyText text="Contact Us" speed={4} />
//           </h2>

//           <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
//             Reach out through any of the platforms below.
//           </p>
//         </div>

//         {/* Contact Grid */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
//           <ContactCard label="Email Us" value="support@syd.ai" />
//           <ContactCard label="LinkedIn" value="@sydai" />
//           <ContactCard label="Jira" value="jira.syd.ai" />
//           <ContactCard label="WhatsApp" value="+91 98765 43210" />
//           <ContactCard label="GitHub" value="github.com/syd-ai" />
//         </div>
//       </div>
//     </section>
//   );
// };

// const ContactCard = ({ label, value }: { label: string; value: string }) => {
//   return (
//     <div className="border border-white/20 p-6 rounded-2xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition">
//       <h3 className="text-xl font-semibold mb-2">{label}</h3>
//       <p className="text-foreground/80 break-all">{value}</p>
//     </div>
//   );
// };

// export default ContactSection;

// "use client";

// import React from "react";
// import Squares from "./Squares";
// import ShinyText from "./shinytext";
// import { Dock, DockIcon } from "@/components/ui/dock";

// const ContactSection = () => {
//   return (
//     <section
//       id="contact"
//       className="min-h-screen bg-black py-20 relative overflow-hidden"
//     >
//       {/* Background Squares */}
//       <div className="absolute inset-0 z-[1] pointer-events-none">
//         <Squares
//           direction="right"
//           speed={0.8}
//           borderColor="#777"
//           squareSize={55}
//           hoverFillColor="#1a1a1a"
//         />
//       </div>

//       {/* Content */}
//       <div className="container mx-auto px-4 relative z-[2] flex flex-col items-center">
//         <h2 className="text-4xl md:text-5xl font-bold mb-4">
//           <ShinyText text="Contact Us" speed={4} />
//         </h2>

//         <p className="text-foreground/70 text-lg max-w-2xl text-center mb-16">
//           Reach out through any of the platforms below.
//         </p>

//         {/* Centered Dock */}
//         <div className="flex justify-center w-full">
//           <Dock>
//             <DockIcon>E</DockIcon> {/* Email */}
//             <DockIcon>L</DockIcon> {/* LinkedIn */}
//             <DockIcon>J</DockIcon> {/* Jira */}
//             <DockIcon>W</DockIcon> {/* WhatsApp */}
//             <DockIcon>G</DockIcon> {/* GitHub */}
//           </Dock>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ContactSection;

// "use client";

// import React from "react";
// import Plasma from "./Plasma";
// import ShinyText from "./shinytext";
// import { Dock, DockIcon } from "@/components/ui/dock";

// const ContactSection = () => {
//   return (
//     <section
//       id="contact"
//       className="min-h-screen bg-black py-20 relative overflow-hidden"
//     >
//       {/* Plasma Background */}
//       <div className="absolute inset-0 -z-10 w-full h-full">
//         <Plasma
//           color="#ff6b35"
//           speed={0.6}
//           direction="forward"
//           scale={1.1}
//           opacity={0.8}
//           mouseInteractive={true}
//         />
//       </div>

//       {/* Content */}
//       <div className="container mx-auto px-4 relative z-20 flex flex-col items-center">
//         <h2 className="text-4xl md:text-5xl font-bold mb-4">
//           <ShinyText text="Contact Us" speed={4} />
//         </h2>

//         <p className="text-foreground/70 text-lg max-w-2xl text-center mb-16">
//           Reach out through any of the platforms below.
//         </p>

//         <div className="flex justify-center w-full">
//           <Dock>
//             <DockIcon>E</DockIcon>
//             <DockIcon>L</DockIcon>
//             <DockIcon>J</DockIcon>
//             <DockIcon>W</DockIcon>
//             <DockIcon>G</DockIcon>
//           </Dock>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ContactSection;

// "use client";

// import React from "react";
// import ShinyText from "./shinytext";
// import { Dock, DockIcon } from "@/components/ui/dock";
// import { BackgroundBeams } from "./registry/background-beams";

// const ContactSection = () => {
//   return (
//     <section
//       id="contact"
//       className="min-h-screen flex items-center relative bg-black overflow-hidden"
//     >
//       {/* Same background effect as About Section */}
//       <BackgroundBeams />

//       {/* Content */}
//       <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">
//         <h2 className="text-4xl md:text-5xl font-bold mb-4">
//           <ShinyText text="Contact Us" speed={4} />
//         </h2>

//         <p className="text-foreground/70 text-lg max-w-2xl text-center mb-16">
//           Reach out through any of the platforms below.
//         </p>

//         {/* Dock Menu - Centered */}
//         <div className="flex justify-center w-full">
//           <Dock>
//             <DockIcon>E</DockIcon> {/* Email */}
//             <DockIcon>L</DockIcon> {/* LinkedIn */}
//             <DockIcon>J</DockIcon> {/* Jira */}
//             <DockIcon>W</DockIcon> {/* WhatsApp */}
//             <DockIcon>G</DockIcon> {/* GitHub */}
//           </Dock>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ContactSection;

"use client";

import React from "react";
import ShinyText from "./shinytext";
import { Dock, DockIcon } from "@/components/ui/dock";
import { BackgroundBeams } from "./registry/background-beams";

// Import icons
import githubLogo from "../assets/github.svg";
import linkedinLogo from "../assets/linkedin.svg";
import whatsappLogo from "../assets/whatsapp.svg";
import jiraLogo from "../assets/jira.svg";
import mailLogo from "../assets/gmail.svg";

const ContactSection = () => {
  return (
    <section
      id="contact"
      className="min-h-screen flex items-center relative bg-black overflow-hidden"
    >
      {/* Background Beams */}
      <BackgroundBeams />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <ShinyText text="Contact Us" speed={4} />
        </h2>

        <p className="text-foreground/70 text-lg max-w-2xl text-center mb-16">
          Reach out through any of the platforms below.
        </p>

        {/* Dock Menu */}
        <div className="flex justify-center w-full">
          <Dock>
            {/* Email */}
            <DockIcon
              onClick={() =>
                window.open("mailto:sarabjothbhatia@gmail.com", "_blank")
              }
            >
              <img src={mailLogo} alt="Email" className="w-6 h-6" />
            </DockIcon>

            {/* LinkedIn */}
            <DockIcon
              onClick={() =>
                window.open(
                  "https://www.linkedin.com/in/sarabjothbhatia/",
                  "_blank"
                )
              }
            >
              <img src={linkedinLogo} alt="LinkedIn" className="w-6 h-6" />
            </DockIcon>

            {/* Jira */}
            <DockIcon
              onClick={() =>
                window.open(
                  "https://documentsummarizer.atlassian.net/jira/software/projects/SCRUM/boards/1/timeline?assignee=unassigned&selectedIssue=SCRUM-1",
                  "_blank"
                )
              }
            >
              <img src={jiraLogo} alt="Jira" className="w-6 h-6" />
            </DockIcon>

            {/* WhatsApp */}
            <DockIcon
              onClick={() => window.open("https://wa.me/919739899241", "_blank")}
            >
              <img src={whatsappLogo} alt="WhatsApp" className="w-6 h-6" />
            </DockIcon>

            {/* GitHub */}
            <DockIcon
              onClick={() =>
                window.open("https://github.com/sarabjothsingh/SydAI", "_blank")
              }
            >
              <img src={githubLogo} alt="GitHub" className="w-6 h-6" />
            </DockIcon>
          </Dock>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

