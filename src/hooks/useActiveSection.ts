import { useEffect, useState } from "react";

export function useActiveSection<TSectionId extends string>(
  sectionIds: readonly TSectionId[],
  defaultSection: TSectionId,
) {
  const [activeSection, setActiveSection] = useState<TSectionId>(defaultSection);

  useEffect(() => {
    let animationFrame = 0;

    const updateActiveSection = () => {
      const viewportAnchor = 140;
      let visibleSection = defaultSection;

      for (const sectionId of sectionIds) {
        const isVisible = (() => {
          const element = document.getElementById(sectionId);
          if (!element) return false;

          const rect = element.getBoundingClientRect();
          return rect.top <= viewportAnchor && rect.bottom > viewportAnchor;
        })();

        if (isVisible) {
          visibleSection = sectionId;
        }
      }

      setActiveSection(visibleSection);
    };

    const handleScroll = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [defaultSection, sectionIds]);

  return activeSection;
}
