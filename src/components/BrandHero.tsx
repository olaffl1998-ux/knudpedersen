"use client";

import { useEffect, useState } from "react";

type Props = {
  name: string; eyebrow: string; intro: string;
  hero?: string; heroMobile?: string;
  /** Produktbillede til en "scene", når mærket ikke har et kampagnebillede */
  packshot?: string;
  video?: { id: string; title: string };
  children?: React.ReactNode;
};

/** Stor hero øverst på mærkesiden: kampagnebillede (eller uret på en scene), centreret titel og evt. mærkets film */
export default function BrandHero({ name, eyebrow, intro, hero, heroMobile, packshot, video, children }: Props) {
  const [play, setPlay] = useState(false);
  useEffect(() => {
    if (!play) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setPlay(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [play]);
  return (
    <section className={`bh${hero ? " bh--photo" : " bh--stage"}`} aria-label={name}>
      <div className="bh__media" aria-hidden="true">
        {hero ? (
          <picture>
            {heroMobile && <source media="(max-width: 767px)" srcSet={heroMobile} />}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={hero} alt="" fetchPriority="high" />
          </picture>
        ) : packshot ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="bh__packshot" src={packshot} alt="" fetchPriority="high" />
        ) : null}
        <span className="bh__word">{name}</span>
      </div>
      <div className="bh__text">
        <small>{eyebrow}</small>
        <h1>{name}</h1>
        <p>{intro}</p>
        <div className="btn-row">
          {children}
          {video && <button type="button" className="bh__play" onClick={() => setPlay(true)}><span aria-hidden="true">▶</span> Se filmen</button>}
        </div>
      </div>
      {play && video && (
        <div className="bh__modal" role="dialog" aria-modal="true" aria-label={video.title} onClick={() => setPlay(false)}>
          <button type="button" className="bh__close" aria-label="Luk filmen" onClick={() => setPlay(false)} autoFocus>✕</button>
          <div className="bh__frame" onClick={(e) => e.stopPropagation()}>
            <iframe src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`} title={video.title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
          </div>
        </div>
      )}
    </section>
  );
}
