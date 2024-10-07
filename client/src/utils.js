export function smoothScroll(targetId) {
    const target = document.getElementById(targetId);
    if (target) {
      const headerOffset = 80; // Adjust this value based on your header height
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  }