/**
 * IIT Kharagpur emblem, recoloured through a CSS mask so it can sit on any
 * surface in the palette. Source: official emblem from iitkgp.ac.in.
 */
export function Emblem({ className = "" }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="IIT Kharagpur emblem"
      className={`inline-block ${className}`}
      style={{
        WebkitMaskImage: "url(/images/brand/iitkgp-emblem-white.png)",
        maskImage: "url(/images/brand/iitkgp-emblem-white.png)",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}
