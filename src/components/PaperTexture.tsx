/** Fixed, pointer-transparent overlays: noise grain, paper fibre and an edge vignette. */
export function PaperTexture() {
  return (
    <>
      <div aria-hidden="true" className="paper-vignette" />
      <div aria-hidden="true" className="paper-fibre" />
      <div aria-hidden="true" className="paper-grain" />
    </>
  );
}

export function CoffeeRing({ className }: { className?: string }) {
  return <div aria-hidden="true" className={`coffee-ring ${className ?? ''}`} />;
}
