// import LightRays from './LightRays';
// import Shuffle from './Shuffle';

// const HeroSection = () => {
//   return (
//     <section className="min-h-screen flex items-center justify-center hero-gradient relative overflow-hidden">
//       {/* Light Rays Background Effect */}
//       <div className="absolute inset-0 w-full h-full">
//         <LightRays
//           raysOrigin="top-center"
//           raysColor="#eff0f0ff"
//           raysSpeed={2.0}
//           lightSpread={1.8}
//           rayLength={1.2}
//           followMouse={true}
//           mouseInfluence={0.1}
//           noiseAmount={0.1}
//           distortion={0.05}
//           className="custom-rays"
//         />
//       </div>

//       {/* Background decoration */}
//       <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-50" />

//       <div className="container mx-auto px-4 text-center relative z-10">
//         <div className="max-w-4xl mx-auto animate-fade-in">
//         <div className='text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-foreground'>
//           <Shuffle
//           text="SydAI"
//           shuffleDirection="right"
//           duration={0.35}
//           animationMode="evenodd"
//           shuffleTimes={1}
//           ease="power3.out"
//           stagger={0.03}
//           threshold={0.1}
//           triggerOnce={true}
//           triggerOnHover={true}
//           respectReducedMotion={true}
//         />    
//         </div>
          
          
//           {/* <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
//             SydAI
//           </h1> */}
//           <p className="text-xl md:text-2xl text-foreground/70 mb-8 leading-relaxed">
//             The next generation of AI-powered document summarizer.
//             <br />
//             Experience intelligent dialogue like never before.
//           </p>

//           {/* Floating elements */}
//           <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
//           <div
//             className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-pulse"
//             style={{ animationDelay: "1s" }}
//           />
//         </div>
//       </div>

//       {/* Scroll indicator */}
//       <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
//         <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center">
//           <div className="w-1 h-3 bg-foreground/30 rounded-full mt-2 animate-pulse" />
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HeroSection;

import LightRays from './LightRays';
import Shuffle from './Shuffle';

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden"
    >
      
      <div className="absolute inset-0 w-full h-full">
        <LightRays
          raysOrigin="top-center"
          raysColor="#eff0f0ff"
          raysSpeed={2.0}
          lightSpread={1.8}
          rayLength={1.2}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0.1}
          distortion={0.05}
          className="custom-rays"
        />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto animate-fade-in">

          <div className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-foreground">
            <Shuffle
              text="SydAI"
              shuffleDirection="right"
              duration={0.35}
              animationMode="evenodd"
              shuffleTimes={1}
              ease="power3.out"
              stagger={0.03}
              threshold={0.1}
              triggerOnce={true}
              triggerOnHover={true}
              respectReducedMotion={true}
            />
          </div>

          <p className="text-xl md:text-2xl text-foreground/70 mb-8 leading-relaxed">
            The next generation of AI-powered document summarizer.
            <br />
            Experience intelligent dialogue like never before.
          </p>

          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-foreground/30 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
