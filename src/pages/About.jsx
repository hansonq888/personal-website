import FloatingObject from "../components/FloatingObject";
export default function About() {
  return (
    <div className="relative p-6 ">
      <h1 className="text-3xl font-bold">About Me</h1>
      <FloatingObject src={"/Frisbee.png"} initialX={50} initialY={400} size={100} />
      <FloatingObject src={"/Piano.png"} initialX={150} initialY={400} size={100} />
      <FloatingObject src={"/Headphones.png"} initialX={250} initialY={400} size={100} />
      <FloatingObject src={"/Computer.png"} initialX={350} initialY={400} size={100} />
      <FloatingObject src={"/Dumbell.png"} initialX={450} initialY={400} size={100} />
      <p>Hi there! My name is Hanson and I am a sophomore at Yale University studying Computer Science and Economics.</p>
    </div>
  );
}
