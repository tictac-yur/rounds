// Logo files come from the Rounds design system (public/brand). Use them
// rather than rebuilding the mark or wordmark in live type.

export function Lockup({ height = 24, reverse = true }: { height?: number; reverse?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={reverse ? "/brand/rounds-lockup-reverse.svg" : "/brand/rounds-lockup.svg"}
      alt="Rounds"
      height={height}
      width={Math.round((height * 388.7) / 74)}
      style={{ display: "block" }}
    />
  );
}

export function Mark({ height = 22, reverse = false }: { height?: number; reverse?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={reverse ? "/brand/rounds-mark-reverse.svg" : "/brand/rounds-mark.svg"}
      alt=""
      height={height}
      width={Math.round((height * 170) / 74)}
      style={{ display: "block" }}
    />
  );
}
