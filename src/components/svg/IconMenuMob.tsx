const IconMenuMob = ({ isCatalogPage = false }: { isCatalogPage: boolean }) => {
  const fillColor = isCatalogPage ? "#ff6633" : "#414141";

  return (
    <>
      <svg viewBox="0 0 24 24" width="24.000000" height="24.000000" fill="none">
        <rect
          id="Frame 211"
          width="24.000000"
          height="24.000000"
          x="0.000000"
          y="0.000000"
          fill="rgb(255,255,255)"
          fillOpacity="0"
        />
        <path
          id="Shape (Stroke)"
          d="M2.5 12C2.5 11.7239 2.72386 11.5 3 11.5L21 11.5C21.2761 11.5 21.5 11.7239 21.5 12C21.5 12.2761 21.2761 12.5 21 12.5L3 12.5C2.72386 12.5 2.5 12.2761 2.5 12Z"
          fill={fillColor}
          fillRule="evenodd"
        />
        <path
          id="Shape (Stroke)"
          d="M2.5 6C2.5 5.72386 2.72386 5.5 3 5.5L21 5.5C21.2761 5.5 21.5 5.72386 21.5 6C21.5 6.27614 21.2761 6.5 21 6.5L3 6.5C2.72386 6.5 2.5 6.27614 2.5 6Z"
          fill={fillColor}
          fillRule="evenodd"
        />
        <path
          id="Shape (Stroke)"
          d="M2.5 18C2.5 17.7239 2.72386 17.5 3 17.5L21 17.5C21.2761 17.5 21.5 17.7239 21.5 18C21.5 18.2761 21.2761 18.5 21 18.5L3 18.5C2.72386 18.5 2.5 18.2761 2.5 18Z"
          fill={fillColor}
          fillRule="evenodd"
        />
      </svg>
    </>
  );
};

export default IconMenuMob;
