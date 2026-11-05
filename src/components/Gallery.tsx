import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { gallery } from "../data";

export default function Gallery() {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.fromTo(".g-item", { opacity: 0, y: 120, filter: "blur(10px)" }, {
      opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power3.out", stagger: 0.05,
      scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
    });
  }, { scope: ref });

  return (
    <section id="menu" className="bg-white py-12 md:py-24 flex justify-center">
      <div ref={ref} className="w-[90%] md:w-[70%] lg:w-[65%]">
        <div className="grid grid-cols-1 min-[400px]:grid-cols-2 min-[1000px]:grid-cols-4 gap-x-0 gap-y-10">
          {gallery.map((g, i) => (
            <figure key={g.label} className={`g-item p-1 group flex flex-col ${i === 5 ? "min-[1000px]:col-span-2" : ""}`}>
              <div className={`overflow-hidden ${i === 5 ? "aspect-[3/4] min-[1000px]:aspect-auto min-[1000px]:flex-1" : "aspect-[3/4]"}`}>
                <div className="w-full h-full bg-cover bg-center transition-transform duration-[6s] group-hover:scale-[1.2]"
                  style={{ backgroundImage: `url(${g.img})`, transitionTimingFunction: "cubic-bezier(0.22,0.61,0.36,1)" }} role="img" aria-label={g.label} />
              </div>
              <figcaption className="text-left text-black text-sm mt-2 font-manrope font-medium">{g.label}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
