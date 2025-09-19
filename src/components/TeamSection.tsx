import teamMember1 from "@/assets/team-member-1.jpg";
import teamMember2 from "@/assets/team-member-2.jpg";
import teamMember3 from "@/assets/team-member-3.jpg";

const TeamSection = () => {
  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "AI Research Lead",
      image: teamMember1,
      description: "PhD in Machine Learning with 8+ years in AI development"
    },
    {
      name: "Sarah Chen",
      role: "Product Manager",
      image: teamMember2,
      description: "Former Google PM, expert in user experience and AI products"
    },
    {
      name: "Michael Rodriguez",
      role: "Chief Technology Officer",
      image: teamMember3,
      description: "20+ years in tech leadership, specializing in scalable systems"
    }
  ];

  return (
    <section id="team" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Meet the Team
          </h2>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Our diverse team of experts brings together decades of experience 
            in artificial intelligence, product development, and user experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <div 
              key={member.name}
              className="card-gradient rounded-2xl p-6 text-center hover-lift animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative mb-6">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-primary/20"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-0 hover:opacity-10 transition-opacity duration-300" />
              </div>
              
              <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
              <p className="text-primary font-medium mb-4">{member.role}</p>
              <p className="text-foreground/60 text-sm leading-relaxed">
                {member.description}
              </p>
            </div>
          ))}
        </div>

        {/* Team stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="text-3xl font-bold text-primary mb-2">50+</div>
            <div className="text-foreground/60 text-sm">AI Models</div>
          </div>
          <div className="text-center animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <div className="text-3xl font-bold text-accent mb-2">1M+</div>
            <div className="text-foreground/60 text-sm">Conversations</div>
          </div>
          <div className="text-center animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <div className="text-3xl font-bold text-success mb-2">99.9%</div>
            <div className="text-foreground/60 text-sm">Uptime</div>
          </div>
          <div className="text-center animate-fade-in" style={{ animationDelay: "0.7s" }}>
            <div className="text-3xl font-bold text-primary mb-2">24/7</div>
            <div className="text-foreground/60 text-sm">Support</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;