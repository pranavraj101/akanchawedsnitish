/* eslint-disable @next/next/no-img-element */

/**
 * Watercolor florals that frame every scene: a trailing rose spray from the
 * top corner and lilies, roses and eucalyptus banked in both bottom corners.
 */
export default function Backdrop() {
  return (
    <div className="dressing" aria-hidden="true">
      <img className="flora flora-corner" src="/art/florals-corner.webp" alt="" draggable={false} />
      <img className="flora flora-bottom left" src="/art/florals-left.webp" alt="" draggable={false} />
      <img className="flora flora-bottom right" src="/art/florals-right.webp" alt="" draggable={false} />
    </div>
  );
}
