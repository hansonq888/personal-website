import PageShell from "../components/PageShell";

const INTER = { fontFamily: '"Inter", sans-serif', fontWeight: 300 };

export default function About() {
  return (
    <PageShell>
      <div className="min-h-[calc(100vh-2.75rem)] sm:min-h-[calc(100vh-3rem)] w-full min-w-0 bg-white text-black overflow-x-hidden flex flex-col">
        {/* Body */}
        <div className="flex-1 px-3 sm:px-5 pt-6 md:pt-8 pb-6 flex flex-col">
          <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col">
            <img
              src="/camera_shutter_dotted.gif"
              alt=""
              className="mb-1 w-[150px] sm:w-[190px] md:w-[240px] h-auto block select-none pointer-events-none"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-start">
              <div>
                <h1
                  className="leading-[0.9]"
                  style={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: "clamp(2.75rem, 12vw, 10rem)", letterSpacing: "-0.02em" }}
                >
                  About
                </h1>

                <div className="mt-4 md:mt-5 space-y-1" style={INTER}>
                  <p className="text-sm tracking-wide">--CS + MATH @ YALE</p>
                  <p className="text-sm tracking-wide">--VANCOUVER, BC x NEW HAVEN, CT</p>
                </div>
              </div>

              <div className="w-full flex md:justify-end">
                <img
                  src="/sideeye.JPG"
                  alt="Hanson Qin"
                  className="w-full max-w-[380px] h-auto block"
                />
              </div>
            </div>

          </div>
        </div>

      </div>
    </PageShell>
  );
}
