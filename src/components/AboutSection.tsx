// const AboutSection = () => {
//   return (
//     <section id="about" className="py-20 relative">
//       <div className="container mx-auto px-4">
//         <div className="max-w-4xl mx-auto text-center animate-slide-up">
//           <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
//             About Us
//           </h2>
          
//           <div className="card-gradient rounded-2xl p-8 md:p-12 hover-lift">
//             <div className="prose prose-lg prose-invert mx-auto">
//               <p className="text-foreground/80 text-lg leading-relaxed mb-6">
//                 At SYD.AI, we believe working with documents shouldn’t feel overwhelming. Whether it’s a hundred-page research paper, a stack of contracts, or meeting notes that never end, our goal is simple: help you find the gist in seconds.
                
//                 SYD stands for “Summarise Your Documents” — an AI assistant designed to understand your files, answer your questions, and deliver context-aware summaries you can trust.

//                 We combine retrieval-augmented generation (RAG) with vector databases to make sure every answer is grounded in your documents, not guesswork. Think of SYD as your personal reading partner — fast, precise, and always available.

//                 Our mission is to make information accessible, accurate, and effortless, so you can focus on thinking, not skimming.
//               </p>
//             </div>
            
//             {/* Feature highlights */}
//             <div className="grid md:grid-cols-3 gap-6 mt-12">
//               <div className="text-center">
//                 <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <div className="w-6 h-6 bg-primary rounded-sm" />
//                 </div>
//                 <h3 className="font-semibold mb-2">Advanced AI</h3>
//                 <p className="text-sm text-foreground/60">Multiple cutting-edge models at your disposal</p>
//               </div>
              
//               <div className="text-center">
//                 <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <div className="w-6 h-6 bg-accent rounded-sm" />
//                 </div>
//                 <h3 className="font-semibold mb-2">Secure & Private</h3>
//                 <p className="text-sm text-foreground/60">Your conversations remain confidential</p>
//               </div>
              
//               <div className="text-center">
//                 <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <div className="w-6 h-6 bg-success rounded-sm" />
//                 </div>
//                 <h3 className="font-semibold mb-2">Document Ready</h3>
//                 <p className="text-sm text-foreground/60">Upload and analyze documents effortlessly</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default AboutSection;

"use client";
import { BackgroundBeams } from "./registry/background-beams";
import ShinyText from "./shinytext";

const AboutSection = () => {
  return (
    <section
      id="about"
      className="min-h-screen flex items-center relative bg-black overflow-hidden"
    >
      <BackgroundBeams />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-slide-up">

          <ShinyText
            text="About Us"
            disabled={false}
            speed={3}
            className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r 
            from-primary to-accent bg-clip-text text-transparent inline-block"
          />

          <div className="prose prose-lg prose-invert mx-auto">
            <p className="text-foreground/80 text-lg leading-relaxed mb-6">
              At SYD.AI, we believe working with documents shouldn’t feel
              overwhelming. Whether it’s a hundred-page research paper, a
              stack of contracts, or meeting notes that never end...
              <br /><br />
              SYD stands for “Summarise Your Documents”.
              <br /><br />
              We combine RAG with vector databases to ensure every answer is
              grounded in your documents.
              <br /><br />
              Our mission is to make information accessible and effortless.
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-primary rounded-sm" />
              </div>
              <h3 className="font-semibold mb-2">Advanced AI</h3>
              <p className="text-sm text-foreground/60">
                Multiple cutting-edge models at your disposal
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-accent rounded-sm" />
              </div>
              <h3 className="font-semibold mb-2">Secure & Private</h3>
              <p className="text-sm text-foreground/60">
                Your conversations remain confidential
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-success rounded-sm" />
              </div>
              <h3 className="font-semibold mb-2">Document Ready</h3>
              <p className="text-sm text-foreground/60">
                Upload and analyze documents effortlessly
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
