import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function AboutPreview() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the section is visible
        rootMargin: '0px 0px -50px 0px' // Trigger a bit before the section is fully visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
      <section ref={sectionRef} className="relative px-6 pt-12 pb-0 min-h-[80vh]" style={{ backgroundImage: "url('/space_space.jpg')", backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'top center' }}>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          
          <div className="py-16 sm:py-20 md:py-24 lg:py-28 max-w-xl text-left" style={{ paddingTop: 'clamp(60px, 8vw, 120px)', paddingBottom: 'clamp(80px, 12vw, 160px)' }}>
            <h2 
              className={`text-2xl font-bold mb-3 text-white instrument-serif-regular transition-all duration-800 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
              style={{ 
                transitionDelay: '0.2s'
              }}
            >
              Hi there!
            </h2>
            <p 
              className={`text-base mb-5 text-white instrument-serif-regular transition-all duration-800 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
              style={{ 
                transitionDelay: '0.4s'
              }}
            >
              I'm a second-year student at Yale, studying Computer Science and Economics. I'm passionate about software engineering and building projects that solve real problems. This website showcases some of my work, projects, and explorations in tech.
            </p>
            <Link
              to="/about"
              className={`hover:bg-white bg-white px-5 py-2 text-base text-black font-medium instrument-serif-regular transition-all duration-800 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
              style={{ 
                transitionDelay: '0.6s'
              }}
            >
              More about me
            </Link>
          </div>
        </div>
        {/* Decorative cat image anchored to bottom - responsive */}
        <img
          src="/Cat.png"
          alt="cat"
          className="absolute bottom-0 right-0 w-auto object-contain select-none pointer-events-none z-10"
          style={{ 
            bottom: '0px',
            right: '0px',
            height: 'clamp(300px, 35vw, 500px)',
            maxWidth: '100%'
          }}
        />
      </section>

  );
}