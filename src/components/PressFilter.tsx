/** Letterpress: nudges the cover's ink edges a fraction of a pixel, so the type isn't machine-perfect.
 *  Rendered once; anything can use it with `filter: url(#press)`. */
export function PressFilter() {
  return (
    <svg className="sr-only" aria-hidden="true" focusable="false">
      <filter id="press" x="-2%" y="-2%" width="104%" height="104%">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="5" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}
