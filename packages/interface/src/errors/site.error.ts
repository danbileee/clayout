export const SitePageErrors = {
  "site-page.existing-homepage": "site-page.existing-homepage",
  "site-page.no-homepage": "site-page.no-homepage",
  "site-page.home-should-be-visible": "site-page.home-should-be-visible",
  "site-page.duplicate-slug": "site-page.duplicate-slug",
} as const;

export type SitePageError = keyof typeof SitePageErrors;

export const SitePageErrorMessages: Record<SitePageError, string> = {
  "site-page.existing-homepage":
    "This site already has a homepage. The home property can be linked to only one page.",
  "site-page.no-homepage":
    "Home property is required. Please set a new page as home.",
  "site-page.home-should-be-visible": "The homepage must always be visible.",
  "site-page.duplicate-slug":
    "A page with this slug already exists. Please choose a different slug.",
};
