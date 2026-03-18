(function () {
  function isModifiedClick(event) {
    return event.metaKey || event.altKey || event.ctrlKey || event.shiftKey || event.button !== 0;
  }

  document.addEventListener(
    "click",
    function (event) {
      if (event.defaultPrevented || isModifiedClick(event)) return;

      const target = event.target;
      const anchor = target && typeof target.closest === "function" ? target.closest("a[href]") : null;
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;

      const rawHref = anchor.getAttribute("href");
      if (!rawHref) return;
      if (
        rawHref.startsWith("#") ||
        rawHref.startsWith("mailto:") ||
        rawHref.startsWith("tel:") ||
        rawHref.startsWith("javascript:")
      ) {
        return;
      }

      const destination = new URL(rawHref, document.baseURI);
      if (destination.origin !== window.location.origin) return;
      if (destination.href === window.location.href) return;

      event.preventDefault();
      if (typeof event.stopImmediatePropagation === "function") {
        event.stopImmediatePropagation();
      }
      window.location.assign(destination.href);
    },
    true
  );
})();
