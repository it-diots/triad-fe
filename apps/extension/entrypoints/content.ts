export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    console.log("Triad Extension content script loaded");
  },
});
