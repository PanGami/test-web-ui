/**
 * splitLines.ts
 * Manual line-mask utility for Hero text reveal.
 *
 * Why manual instead of SplitText plugin:
 *   SplitText requires a GSAP Club license. Since we can only verify
 *   the free 3.x build is installed, we do line-wrapping ourselves:
 *   wrap each text node into an overflow:hidden parent so each line
 *   slides in from below (y:110% → 0) with no text clipping visible.
 *
 * Usage:
 *   const lines = splitIntoLines(headingEl);
 *   // animate lines with gsap.from(lines, { y: "110%", ... })
 *   // call cleanup() on unmount to restore original DOM
 */

export type SplitResult = {
  lines: HTMLElement[];
  cleanup: () => void;
};

/**
 * Splits the text content of `el` into visual lines by measuring word
 * positions, wraps each line in an `overflow:hidden` mask div, and
 * wraps the content span itself. Returns the inner spans (the things
 * you animate) and a cleanup function.
 */
export function splitIntoLines(el: HTMLElement): SplitResult {
  const originalHTML = el.innerHTML;
  const originalStyle = el.getAttribute("style") ?? "";

  // Temporarily make el relative so we can measure children
  const words = el.innerText.split(/\s+/).filter(Boolean);

  // Build word spans inside el
  el.innerHTML = words
    .map((w) => `<span class="word" style="display:inline-block;white-space:nowrap">${w}&nbsp;</span>`)
    .join("");

  // Force layout so offsetTop is accurate
  el.getBoundingClientRect();

  // Group words by their top offset (i.e., their visual line)
  const wordEls = Array.from(el.querySelectorAll<HTMLElement>(".word"));
  const lineMap = new Map<number, HTMLElement[]>();

  for (const word of wordEls) {
    const top = word.offsetTop;
    if (!lineMap.has(top)) lineMap.set(top, []);
    lineMap.get(top)!.push(word);
  }

  // Rebuild as line-mask structure
  // Each line: <span class="line-mask" style="display:block;overflow:hidden">
  //              <span class="line-inner">words…</span>
  //            </span>
  const lineInners: HTMLElement[] = [];

  el.innerHTML = Array.from(lineMap.values())
    .map((group) => {
      const text = group.map((w) => w.textContent).join("");
      return `<span class="line-mask" style="display:block;overflow:hidden;line-height:inherit"><span class="line-inner" style="display:block">${text}</span></span>`;
    })
    .join("");

  const inners = Array.from(el.querySelectorAll<HTMLElement>(".line-inner"));
  lineInners.push(...inners);

  function cleanup() {
    el.innerHTML = originalHTML;
    if (originalStyle) {
      el.setAttribute("style", originalStyle);
    } else {
      el.removeAttribute("style");
    }
  }

  return { lines: lineInners, cleanup };
}
