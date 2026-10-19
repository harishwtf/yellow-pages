/** Two layers laid over the whole document (they scroll with it, like a real sheet):
 *  - relief: an SVG normal map (noise height field, lit from the top-left) in soft-light, for paper tooth and fibres;
 *  - ink voids: tiny specks of the paper colour in lighten mode, which knock out of every printed line and letter. */
export function PaperTexture() {
  return (
    <>
      <div aria-hidden="true" className="paper-relief" />
      <div aria-hidden="true" className="ink-voids" />
    </>
  );
}
