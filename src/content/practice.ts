export type PracticeKey = "begin" | "build" | "sculpt" | "private";

export type Practice = {
  heroColumnId: number;
  key: PracticeKey;
  label: string;
  eyebrow: string;
  subtitle: string;
  image: string;
  desktopHeightClass: string;
  desktopOffsetClass: string;
};

/* One canonical source for the four practices used by desktop hero,
   mobile hero and the classes section. Keeping labels/images here prevents
   the three presentations from drifting apart as the design evolves. */
export const PRACTICES: readonly Practice[] = [
  {
    heroColumnId: 2,
    key: "begin",
    label: "BEGIN",
    eyebrow: "01",
    subtitle: "Foundation · Control · Confidence",
    image: "/premium/787cc875-3817-4fdc-a070-9fe5233dbade.png",
    desktopHeightClass: "h-[55svh]",
    desktopOffsetClass: "mt-10 md:mt-32",
  },
  {
    heroColumnId: 3,
    key: "build",
    label: "BUILD",
    eyebrow: "02",
    subtitle: "Strength · Stability · Progression",
    image: "/premium/pill-reformer.jpg",
    desktopHeightClass: "h-[70svh]",
    desktopOffsetClass: "-mt-10 md:-mt-16",
  },
  {
    heroColumnId: 4,
    key: "sculpt",
    label: "SCULPT",
    eyebrow: "03",
    subtitle: "Flow · Endurance · Precision",
    image: "/premium/pill-mat.jpg",
    desktopHeightClass: "h-[45svh]",
    desktopOffsetClass: "mt-5 md:mt-16",
  },
  {
    heroColumnId: 5,
    key: "private",
    label: "PRIVATE",
    eyebrow: "04",
    subtitle: "Personal · Focused · Yours",
    image: "/premium/pill-private.jpg",
    desktopHeightClass: "h-[65svh]",
    desktopOffsetClass: "-mt-10 md:-mt-24",
  },
];
