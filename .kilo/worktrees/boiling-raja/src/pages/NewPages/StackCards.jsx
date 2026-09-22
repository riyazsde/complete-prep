"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function CardsAnimation() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const cards = cardsRef.current;

    const animation = gsap.timeline();

    const cardHeight = cards[0].offsetHeight;

    cards.forEach((card, index) => {
      if (index === 0) {
        gsap.set(card, { y: 0, opacity: 1 });

        animation.to(
          card,
          {
            y: -40 * cards.length,
            opacity: 0
          },
          0
        );
      } else if (index === 1) {
        gsap.set(card, { y: cardHeight, opacity: 1 });

        animation.to(
          card,
          {
            y: -40 * cards.length,
            opacity: 0
          },
          0
        );
      } else {
        gsap.set(card, {
          y: cardHeight * 2,
          opacity: 0
        });

        animation.to(
          card,
          {
            y: 0,
            opacity: 1
          },
          0
        );
      }
    });

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: `+=${cardHeight * cards.length}`,
      scrub: true,
      pin: true,
      animation,
      invalidateOnRefresh: true
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="bg-[#2e3537]">
      <div
        ref={sectionRef}
        className="w-[90%] mx-auto"
      >
<ul className="grid grid-cols-1 gap-[4vw] pb-[100vh]">            {[1, 2, 3, 4].map((item, i) => (
            <li
              key={i}
              ref={(el) => (cardsRef.current[i] = el)}
              className="sticky top-0"
              style={{ paddingTop: `${(i + 1) * 24}px` }}
            >
              <div
                className={`h-[87vh] rounded-[50px] flex items-center justify-center shadow-2xl ${
                  i === 0
                    ? "bg-sky-400"
                    : i === 1
                    ? "bg-orange-400"
                    : i === 2
                    ? "bg-indigo-300"
                    : "bg-pink-300"
                }`}
              >
                <h2 className="text-4xl font-bold">Card {item}</h2>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}