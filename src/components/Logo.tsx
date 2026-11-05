/** Full logo: green circle with eagle. */
export const Logo = ({ className = "" }: { className?: string }) => (
  <img src="/logo.svg" alt="Insurgentes 21" className={`aspect-square ${className}`} />
);

/** Mark only: white eagle + orange dot, no circle — for dark backgrounds. */
export const LogoMark = ({ className = "" }: { className?: string }) => (
  <img src="/logo-mark.svg" alt="Insurgentes 21" className={`w-auto ${className}`} />
);
