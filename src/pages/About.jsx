import FloatingObject from "../components/FloatingObject";
import { Parallax, ParallaxLayer } from "@react-spring/parallax";

export default function About() {
  return (
    <div className="min-h-screen">
      <Parallax pages={3.5}>
        
        <ParallaxLayer
          factor={1.2}
          speed={1}
          style={{
            backgroundImage: `url(/AboutBackground.png)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            width: '100%'
          }}
        >
          <div className="flex flex-col items-center p-6 text-center md:text-left">
            <h1 className="mt-20 jersey-10-regular text-9xl">About Me</h1>
            <p>Hi there! My name is Hanson and I am a sophomore at Yale University studying Computer Science and Economics.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-35 m-10 md:m-20 items-center">
            <img
              src="./AboutPhoto.jpg"
              alt="baby photo"
              className="shadow-xl w-full max-w-[350px] border-t-10 border-l-10 border-r-10 border-b-30 border-white 
                        justify-self-center md:justify-self-end"
            />

            <p className="text-lg instrument-serif-regular break-words text-center md:text-left 
                          justify-self-center md:justify-self-start max-w-[500px]">
              Hi! I’m Hanson Qin, a sophomore at Yale University majoring in Computer Science and Economics. 
              I’m passionate about software development, machine learning, and UX/UI design, and I enjoy building projects that combine creativity and technology.
              <br /><br />
              Outside of academics, I love playing ultimate frisbee, exploring music production, and staying active through sports and fitness. 
              I’m always excited to learn new skills, tackle challenging problems, and share knowledge with others.
              <br /><br />
              This website is a space to showcase some of my work, projects, and explorations in technology, design, and personal growth.
            </p>
          </div>


        </ParallaxLayer>

        {/* Stars: Leave untouched */}
        <ParallaxLayer
          offset={0}
          speed={2}
          factor={2}
          style={{
            backgroundImage: `url(/AboutStars.png)`,
            backgroundSize: 'contain',     
            backgroundPosition: 'top left', 
            backgroundRepeat: 'no-repeat',
            height: '12vw',          
            width: '100%'
          }}
        />
        <ParallaxLayer
          offset={0}
          speed={2}
          factor={2}
          style={{
            backgroundImage: `url(/AboutStars.png)`,
            backgroundSize: 'contain',     
            backgroundPosition: 'top right', 
            backgroundRepeat: 'no-repeat',
            height: '12vw',          
            width: '100%'
          }}
        />

        <ParallaxLayer factor={1} offset={2} speed={0.1}>
          <div className="text-center">
            <h1 className="text-5xl">Nothing to see here... yet</h1>
          </div>
        </ParallaxLayer>

        <ParallaxLayer offset={2.5} factor={1} speed={0} style={{ backgroundColor: '#000' }} />
      </Parallax>
    </div>
  );
}
