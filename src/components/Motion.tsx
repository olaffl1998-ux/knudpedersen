"use client";

import { Fragment } from "react";

/** Tekst, hvor ordene glider ind ét for ét, når afsnittet kommer til syne (styres af .rv/.is-in på forælderen) */
export function Words({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="w" style={{ ["--i" as string]: i }}><span>{w}</span></span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}

/** Tal i velkomst-afsnittet. Lars ønsker, at alt vises med det samme, så tallet vises færdigt fra start (ingen optælling ved scroll). */
export function CountUp({ to }: { to: number; from?: number; ms?: number }) {
  return <span>{to}</span>;
}
