const revealItems = document.querySelectorAll(".reveal");
const companyName = document.querySelector(".company-name");
const companyNames = ["El Tio Lolo", "Miau Pizzas", "TexMex", "Brutal Kitchen", "La Chona", "Noreste Fusion"];
let companyIndex = 0;

document.querySelectorAll(".mobile-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    link.classList.remove("is-pressed");
    requestAnimationFrame(() => link.classList.add("is-pressed"));
  });
  link.addEventListener("animationend", () => {
    link.classList.remove("is-pressed");
  });
});

if (companyName && companyNames.length > 1 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  window.setInterval(() => {
    companyName.classList.add("is-changing");
    window.setTimeout(() => {
      companyIndex = (companyIndex + 1) % companyNames.length;
      companyName.textContent = companyNames[companyIndex];
      companyName.classList.remove("is-changing");
    }, 350);
  }, 3800);
}

if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, currentObserver) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              currentObserver.unobserve(entry.target);
            }
          });
        }, { threshold: 0.14 });
        revealItems.forEach((item) => observer.observe(item));
      } else {
        revealItems.forEach((item) => item.classList.add("visible"));
      }

      const quickLinks = [...document.querySelectorAll(".quick-link")];
      const quickDetail = document.querySelector(".quick-detail");
      const quickKicker = quickDetail?.querySelector(".quick-detail-kicker");
      const quickTitle = quickDetail?.querySelector("h3");
      const quickDescription = quickDetail?.querySelector(".quick-detail-copy > p:not(.quick-detail-kicker)");
      const quickPoints = quickDetail?.querySelector(".quick-points");
      const quickDetailIcon = quickDetail?.querySelector(".quick-detail-icon");
      let quickRotationTimer;
      let quickRotationIndex = 0;

      const updateQuickDetail = (link, index = quickLinks.indexOf(link)) => {
        quickLinks.forEach((item) => item.setAttribute("aria-pressed", String(item === link)));
        quickRotationIndex = index;
        if (!quickKicker || !quickTitle || !quickDescription || !quickPoints || !quickDetailIcon) return;

        quickKicker.textContent = link.dataset.quickKicker || "";
        quickTitle.textContent = link.dataset.quickTitle || "";
        quickDescription.textContent = link.dataset.quickDescription || "";
        quickDetailIcon.style.setProperty("--quick-icon-color", link.dataset.quickColor || "#1d1d1f");
        quickPoints.innerHTML = "";
        const icon = link.querySelector(".quick-icon svg");
        quickDetailIcon.replaceChildren(icon ? icon.cloneNode(true) : document.createTextNode(""));
        (link.dataset.quickPoints || "").split("|").filter(Boolean).forEach((point) => {
          const item = document.createElement("li");
          item.textContent = point;
          quickPoints.append(item);
        });
      };

      const startQuickRotation = () => {
        window.clearInterval(quickRotationTimer);
        if (quickLinks.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        quickRotationTimer = window.setInterval(() => {
          const nextIndex = (quickRotationIndex + 1) % quickLinks.length;
          updateQuickDetail(quickLinks[nextIndex], nextIndex);
        }, 6000);
      };

      quickLinks.forEach((link, index) => {
        link.addEventListener("click", () => {
          updateQuickDetail(link, index);
          startQuickRotation();
        });
        link.addEventListener("mouseenter", () => window.clearInterval(quickRotationTimer));
        link.addEventListener("mouseleave", startQuickRotation);
      });
      if (quickLinks[0]) updateQuickDetail(quickLinks[0], 0);
      startQuickRotation();

      const featureGrid = document.querySelector(".feature-grid");
      const featureCards = featureGrid ? [...featureGrid.querySelectorAll(".feature")] : [];
      const canHoverFeatures = window.matchMedia("(hover: hover) and (pointer: fine)");
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
      const desktopOrbitMode = window.matchMedia("(min-width: 1101px)");

      desktopOrbitMode.addEventListener("change", () => window.location.reload());

      if (featureGrid && featureCards.length) {
        featureCards.forEach((card) => {
          const iconName = card.dataset.featureIcon;
          if (!iconName) return;

          const icon = document.createElement("span");
          icon.className = "feature-icon";
          icon.setAttribute("aria-hidden", "true");

          const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          svg.setAttribute("viewBox", "0 0 24 24");
          const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
          use.setAttribute("href", `#feature-icon-${iconName}`);
          svg.append(use);
          icon.append(svg);
          card.prepend(icon);

          if (!desktopOrbitMode.matches && card.dataset.featureScreen) {
            const preview = document.createElement("div");
            preview.className = "feature-phone-preview";

            const phone = document.createElement("div");
            phone.className = "feature-phone phone";
            phone.setAttribute("aria-hidden", "true");

            const island = document.createElement("span");
            island.className = "phone-island";

            const inner = document.createElement("div");
            inner.className = "phone-inner";

            const screenImage = document.createElement("img");
            screenImage.className = `feature-phone-screen${card.dataset.featureScreenFit === "contain" ? " is-contain" : ""}`;
            screenImage.src = card.dataset.featureScreen;
            screenImage.alt = "";

            const revealPreview = () => preview.classList.add("is-ready");
            screenImage.addEventListener("load", revealPreview, { once: true });
            screenImage.addEventListener("error", revealPreview, { once: true });

            inner.append(screenImage);
            phone.append(island, inner);
            preview.append(phone);
            card.querySelector(".feature-art")?.replaceWith(preview);

            if (screenImage.complete) revealPreview();
          }
        });

        if (desktopOrbitMode.matches) {
        const orbitTrack = document.createElement("div");
        orbitTrack.className = "orbit-track";
        orbitTrack.setAttribute("aria-label", "Funciones de VidPos en órbita");

        featureCards.forEach((card, index) => {
          const angle = -90 + (index * 360) / featureCards.length;
          const orbitSlot = document.createElement("div");
          orbitSlot.className = "orbit-slot";
          orbitSlot.style.setProperty("--orbit-angle", `${angle}deg`);
          orbitSlot.style.setProperty("--counter-angle", `${-angle}deg`);
          orbitSlot.style.setProperty("--counter-angle-end", `${-angle - 360}deg`);
          orbitSlot.append(card);
          orbitTrack.append(orbitSlot);
        });

        let orbitRotation = 0;
        let previousOrbitTimestamp;
        let orbitCalloutLeft;
        let orbitCalloutRight;
        let focusedCard = null;
        let leftRotationIndex = 0;
        let rightRotationIndex = 1;
        const nextDistinctIndex = (index, blockedIndex) => {
          let nextIndex = (index + 1) % featureCards.length;
          while (nextIndex === blockedIndex) {
            nextIndex = (nextIndex + 1) % featureCards.length;
          }
          return nextIndex;
        };
        const renderCallout = (target, card, position) => {
          if (!target || !card) return;
          const description = card.querySelector("p:not(.feature-kicker)");
          const title = card.querySelector("h3");
          if (!description || !title) return;
          const screen = card.dataset.featureScreen
            ? `<img class="orbit-callout-screen${card.dataset.featureScreenFit === "contain" ? " is-contain" : ""}" src="${card.dataset.featureScreen}" alt="">`
            : "";
          target.className = `orbit-callout is-${position} is-visible is-changing`;
          target.innerHTML = `<div class="orbit-callout-card"><div class="orbit-callout-visual"><div class="orbit-callout-phone phone" aria-hidden="true"><span class="phone-island"></span><div class="phone-inner">${screen}</div></div></div><h3></h3><p></p></div>`;
          target.querySelector("h3").textContent = title.textContent;
          target.querySelector("p").textContent = description.textContent;
          const calloutCard = target.querySelector(".orbit-callout-card");
          const revealCallout = () => {
            if (target.querySelector(".orbit-callout-card") !== calloutCard) return;
            requestAnimationFrame(() => {
              if (target.querySelector(".orbit-callout-card") === calloutCard) {
                target.classList.remove("is-changing");
              }
            });
          };
          const screenImage = target.querySelector(".orbit-callout-screen");
          if (screenImage && !screenImage.complete) {
            screenImage.addEventListener("load", revealCallout, { once: true });
            screenImage.addEventListener("error", revealCallout, { once: true });
          } else {
            revealCallout();
          }
        };
        const hideCallout = (target) => {
          if (target) target.className = "orbit-callout is-hidden";
        };
        const renderAutomaticCallouts = () => {
          if (focusedCard) return;
          if (leftRotationIndex === rightRotationIndex) {
            rightRotationIndex = nextDistinctIndex(rightRotationIndex, leftRotationIndex);
          }
          renderCallout(orbitCalloutLeft, featureCards[leftRotationIndex], "left");
          renderCallout(orbitCalloutRight, featureCards[rightRotationIndex], "right");
        };
        const updateOrbitDepth = (timestamp) => {
          const elapsed = previousOrbitTimestamp === undefined
            ? 0
            : Math.min(100, timestamp - previousOrbitTimestamp);
          previousOrbitTimestamp = timestamp;
          if (!featureGrid.classList.contains("is-orbit-paused")) {
            orbitRotation = (orbitRotation + elapsed / 72000 * 360) % 360;
            orbitTrack.querySelectorAll(".orbit-slot").forEach((slot, index) => {
              const orbitAngle = -90 + index * 360 / featureCards.length + orbitRotation;
              const angle = orbitAngle * Math.PI / 180;
              slot.style.setProperty("--orbit-angle", `${orbitAngle}deg`);
              const horizontalPosition = Math.cos(angle);
              const verticalPosition = Math.sin(angle);
              const depth = (Math.sin(angle) + 1) / 2;
              const easedDepth = depth * depth * (3 - 2 * depth);
              const scale = .64 + easedDepth * .42;
              const translate = 16 - easedDepth * 20;
              const labelOpacity = Math.max(0, Math.min(1, (easedDepth - .58) / .28));
              slot.classList.toggle("is-side-left", horizontalPosition < -.35);
              slot.classList.toggle("is-side-right", horizontalPosition > .35);
              slot.classList.toggle("is-label-visible", labelOpacity > 0);
              slot.dataset.calloutPosition = horizontalPosition < -.35
                ? "left"
                : horizontalPosition > .35
                  ? "right"
                  : verticalPosition < 0
                    ? "top-right"
                    : "bottom-left";
              slot.firstElementChild.style.setProperty("--depth-scale", scale.toFixed(3));
              slot.firstElementChild.style.setProperty("--depth-translate", `${translate.toFixed(1)}px`);
              slot.firstElementChild.style.setProperty("--depth-label-opacity", labelOpacity.toFixed(3));
              slot.firstElementChild.style.transform = `rotate(${-angle}rad)`;
              slot.firstElementChild.style.zIndex = String(Math.round(10 + easedDepth * 20));
            });
          }
          if (!reduceMotion.matches) requestAnimationFrame(updateOrbitDepth);
        };
        if (!reduceMotion.matches) requestAnimationFrame(updateOrbitDepth);

        featureCards.forEach((card) => {
          if (!card.querySelector(".feature-icon")) return;
          const showFocusedCallout = () => {
            focusedCard = card;
            featureGrid.classList.add("is-orbit-focused");
            featureCards.forEach((item) => item.classList.toggle("is-orbit-selected", item === card));
            const cardCenter = card.getBoundingClientRect().left + card.getBoundingClientRect().width / 2;
            const gridCenter = featureGrid.getBoundingClientRect().left + featureGrid.getBoundingClientRect().width / 2;
            const position = cardCenter < gridCenter ? "left" : "right";
            renderCallout(position === "left" ? orbitCalloutLeft : orbitCalloutRight, card, position);
            hideCallout(position === "left" ? orbitCalloutRight : orbitCalloutLeft);
          };
          const restoreAutomaticCallouts = () => {
            focusedCard = null;
            featureGrid.classList.remove("is-orbit-focused");
            featureCards.forEach((item) => item.classList.remove("is-orbit-selected"));
            renderAutomaticCallouts();
          };
          card.addEventListener("pointerenter", showFocusedCallout);
          card.addEventListener("pointerleave", restoreAutomaticCallouts);
          card.addEventListener("focusin", showFocusedCallout);
          card.addEventListener("focusout", restoreAutomaticCallouts);
        });

        const setOrbitRadius = () => {
          const head = document.querySelector(".features .section-head");
          const headSpace = head ? head.offsetHeight + 34 : 0;
          const available = window.innerHeight - headSpace - 56;
          const scale = Math.min(1, Math.max(0.8, available / 760));
          featureGrid.style.setProperty("--os", scale.toFixed(3));
          const radius = `${Math.min(158, Math.max(138, window.innerWidth * 0.11 - 8)) * scale}px`;
          orbitTrack.querySelectorAll(".orbit-slot").forEach((slot) => {
            slot.style.setProperty("--orbit-radius", radius);
          });
        };
        setOrbitRadius();
        window.addEventListener("resize", setOrbitRadius, { passive: true });

        const orbitCenter = document.createElement("div");
        orbitCenter.className = "orbit-center";
        orbitCenter.setAttribute("aria-label", "VidPos");
        orbitCenter.innerHTML = '<img src="./images/VidPos_logo_v.svg" alt="VidPos">';
        const orbitCallout = document.createElement("aside");
        orbitCallout.className = "orbit-callout";
        orbitCallout.setAttribute("aria-live", "polite");
        orbitCalloutLeft = orbitCallout.cloneNode(true);
        orbitCalloutRight = orbitCallout.cloneNode(true);
        orbitCalloutLeft.setAttribute("aria-label", "Detalle de función izquierda");
        orbitCalloutRight.setAttribute("aria-label", "Detalle de función derecha");
        featureGrid.append(orbitTrack, orbitCenter, orbitCalloutLeft, orbitCalloutRight);
        featureGrid.classList.add("is-orbiting");
        renderAutomaticCallouts();
        if (!reduceMotion.matches) {
          window.setInterval(() => {
            if (focusedCard) return;
            leftRotationIndex = nextDistinctIndex(leftRotationIndex, rightRotationIndex);
            renderCallout(orbitCalloutLeft, featureCards[leftRotationIndex], "left");
          }, 4800);
          window.setInterval(() => {
            if (focusedCard) return;
            rightRotationIndex = nextDistinctIndex(rightRotationIndex, leftRotationIndex);
            renderCallout(orbitCalloutRight, featureCards[rightRotationIndex], "right");
          }, 6200);
        }
        }
      }

      featureCards.forEach((card, index) => {
        card.style.setProperty("--float-delay", `${index * -0.47}s`);
      });

      if (featureGrid?.classList.contains("is-orbiting") && canHoverFeatures.matches && !reduceMotion.matches) {
        const magnificationRadius = 340;
        let pointerFrame = 0;

        featureGrid.addEventListener("pointermove", (event) => {
          if (pointerFrame) cancelAnimationFrame(pointerFrame);
          pointerFrame = requestAnimationFrame(() => {
            featureCards.forEach((card) => {
              const bounds = card.getBoundingClientRect();
              const distance = Math.hypot(
                event.clientX - (bounds.left + bounds.width / 2),
                event.clientY - (bounds.top + bounds.height / 2),
              );
              const proximity = Math.max(0, 1 - distance / magnificationRadius);
              const easedProximity = proximity * proximity * (3 - 2 * proximity);
              const scale = 1 + easedProximity * 0.14;

              card.style.setProperty("--watch-scale", scale.toFixed(3));
              card.classList.toggle("is-pointer-near", proximity > 0.08);
              card.style.zIndex = String(Math.round(scale * 100));
            });
            pointerFrame = 0;
          });
        });

        featureGrid.addEventListener("pointerleave", () => {
          if (pointerFrame) cancelAnimationFrame(pointerFrame);
          pointerFrame = 0;
          featureCards.forEach((card) => {
            card.style.removeProperty("--watch-scale");
            card.style.removeProperty("z-index");
            card.classList.remove("is-pointer-near");
          });
        });
      }
