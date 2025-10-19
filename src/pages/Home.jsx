import AboutPreview from "../components/AboutPreview";
import Hero from "../components/Hero";
import About from "./About";
import ProjectsPreview from "../components/ProjectsPreview";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="border-y border-white/15">
        <Hero />
        {/* Transition image between Hero and the paper section */}
        <img src="/transition.png" alt="transition" className="w-full block relative z-20" style={{ marginTop: 'clamp(-80px, -10vw, -140px)' }} loading="lazy" />
        <div className="relative z-10" style={{ marginTop: 'clamp(-150px, -19vw, -250px)' }}>
          <div className="relative">
            <AboutPreview />
            {/* Transition2 anchored to bottom of AboutPreview */}
            <img 
              src="/transition2.png" 
              alt="transition2" 
              className="w-full block absolute z-20" 
              style={{ 
                bottom: '5%', 
                left: '0', 
                transform: 'translateY(50%)' 
              }}
              loading="lazy"
            />
          </div>
          <div 
            className="relative z-10 pt-20 sm:pt-24 md:pt-28 lg:pt-32 xl:pt-36 pb-0" 
            style={{ 
              backgroundImage: "url('/auroras.png')", 
              backgroundRepeat: 'no-repeat', 
              backgroundSize: 'cover', 
              backgroundPosition: 'top center' 
            }}
          >
            <ProjectsPreview />
          </div>
          <Footer style={{ marginTop: '0px', marginBottom: '0px', paddingBottom: '0px' }} />
        </div>

    </div>
  );
}
