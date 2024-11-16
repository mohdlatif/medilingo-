import type { Alpine } from "alpinejs";

export default (Alpine: Alpine) => {
  // Access this data by using
  // `x-data="astro" x-bind="refreshOnPageLoad"`
  Alpine.data("astro", () => ({
    // re-evaluate expressions when the page loads by
    // including `pageLoaded` in the expression. For example,
    // `x-if="pageLoaded && typeof myComponent !== 'undefined'"`
    pageLoaded: 1,
    refreshOnPageLoad: {
      // This property is attached with the
      // `x-bind="refreshOnPageLoad"` directive
      ["@astro:page-load.document"]() {
        // Update pageLoaded to trigger a re-evaluation
        // of any Alpine.js expressions that depend on it.
        this.pageLoaded++;
      },
    },
  }));
  return Alpine;
};
