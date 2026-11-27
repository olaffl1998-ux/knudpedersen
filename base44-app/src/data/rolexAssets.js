/** Rolex-billeder, der bruges på alle sider (header, footer, forside). Ligger for sig selv, så Rolex-kataloget ikke hentes på hver side */
export const R = "/billeder/pics/Rolex/";
export const KE = R + "v7images/discover-rolex-page-assets/discover-rolex-page-assets-landscape/keep-exploring-landscape/";
export const rolexAssets = {
    plaque: R + "Rolex-retailer-plaque-120x60_da.jpg",
    crown: R + "v7images/rolex-global-cta-assets/png-buttons/crown-gold.png",
    guarantee: {
        l: R + "v72026/rolex-model-page/rolex-model-page-assets/rolex-model-page-editorial-assets-landscape/rolex-guarantee_elmt_2603fg_011-landscape.jpg",
        p: R + "v72026/rolex-model-page/rolex-model-page-assets/rolex-model-page-editorial-assets-portrait/rolex-guarantee_elmt_2603fg_011-portrait.jpg",
    },
    slides: [
        { title: "En hyldest til følelserne", eyebrow: "Oyster Perpetual", href: "/rolex/oyster-perpetual", alt: "Rolex Oyster Perpetual",
            desktop: R + "v72026/banner/12_december/rolex/m126000-0016_2610uf_003_14492x6166px_desktop_1492x500-2.avif",
            mobile: R + "v72026/banner/12_december/rolex/m126000-0016_2610uf_003_14492x6166px_mobile_390x525-2.avif" },
        { title: "Historien om Oyster", eyebrow: "Rolex' verden", href: "/rolex/world-of-rolex", alt: "Historien om Oyster",
            desktop: R + "v72026/banner/oyster_story/rolex/M126233-0015_First_Oyster_octagonal_1926_2604_0001_V3_eciRGB_1492x500.avif",
            mobile: R + "v72026/banner/oyster_story/rolex/M126233-0015_First_Oyster_octagonal_1926_2604_0001_V3_eciRGB_390x525.avif" },
        { title: "Skabelsen af den højeste standard", eyebrow: "Rolex og urmageri", href: "/rolex/watchmaking", alt: "Rolex og urmageri",
            desktop: R + "sliders/corners-rolex-watchmaking-cover_2023-watchmaking-features-manifesto-still_digital_master_rgb.avif",
            mobile: R + "sliders/corners-rolex-watchmaking-cover_2023-watchmaking-features-manifesto-still_digital_master_rgb-portrait.avif" },
    ],
};
