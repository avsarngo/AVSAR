const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const siteFooter = document.querySelector(".site-footer");
const mobileDonate = document.querySelector(".mobile-donate");
let animatedItems = [];
const counters = document.querySelectorAll("[data-counter]");
const faqButtons = document.querySelectorAll(".faq-question");
const sliders = document.querySelectorAll("[data-slider]");
const demoForms = document.querySelectorAll("[data-demo-form]");
const impactInput = document.querySelector("[data-impact-input]");
const impactOutput = document.querySelector("[data-impact-output]");
let donationSlider = null;
let donationAmountLabel = null;
let donationAmountInput = null;
let donationUpiText = null;
let donationQrGrid = null;
let donationUpiButton = null;
let donationBankHolder = null;
let donationBankName = null;
let donationBankAccount = null;
let donationBankIfsc = null;
let donationBankBranch = null;
let donationBankNote = null;
let galleryItems = [];

const programToneClassMap = {
  education: "tone-education",
  healthcare: "tone-healthcare",
  women: "tone-women",
  skills: "tone-skills",
  environment: "tone-sdg",
  rural: "tone-community",
};

const galleryThemeClassMap = {
  education: "theme-education",
  healthcare: "theme-healthcare",
  women: "theme-women",
  skills: "theme-skills",
  environment: "theme-environment",
  rural: "theme-rural",
};

const eventThemeClassMap = {
  rural: "theme-rural",
  community: "theme-rural",
  environment: "theme-environment",
  nature: "theme-environment",
  story: "theme-story",
};

const programIconMap = {
  book: `
   <i class="fa-brands fa-leanpub icon-fav"></i>
  `,
  spark: `
    <i class="fa-solid fa-user-graduate icon-fav"></i>
  `,
  heart: `
 <i class="fa-solid fa-heart-pulse icon-fav"></i>
  `,
  users: `
   <i class="fa-solid fa-users icon-fav"></i>
  `,
  target: `
   <i class="fa-solid fa-child-reaching icon-fav"></i>
  `,
  globe: `
    <i class="fa-solid fa-earth-asia icon-fav"></i>
  `,
};

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (character) => {
    const escapeMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return escapeMap[character] || character;
  });

const renderPrograms = () => {
  const grid = document.querySelector("[data-program-grid]");
  const programs = window.AVSAR_PROGRAMS_DATA || [];
  if (!grid || !programs.length) return;

  grid.innerHTML = programs
    .map(
      (program) => `
        <article
          class="card program-card ${programToneClassMap[program.theme] || "tone-story"}"
          id="${escapeHtml(program.id)}"
          data-animate
        >
          <span class="program-icon" aria-hidden="true">
            ${programIconMap[program.icon]}
          </span>
          <h3>${escapeHtml(program.title)}</h3>
          <p>${escapeHtml(program.description)}</p>
          <ul class="program-points">
            ${(program.bullets || [])
              .map((bullet) => `<li>${escapeHtml(bullet)}</li>`)
              .join("")}
          </ul>
        </article>
      `,
    )
    .join("");
};

const buildYouTubeEmbedUrl = (videoId) => {
  if (!videoId) return "";
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?rel=0&modestbranding=1&playsinline=1`;
};

const renderEvents = () => {
  const eventsData = window.AVSAR_EVENTS_DATA;
  if (!eventsData) return;

  const pastGrid = document.querySelector("[data-events-past]");
  const pastVideos = eventsData.pastVideos || eventsData.past || [];

  if (pastGrid && pastVideos.length) {
    pastGrid.innerHTML = pastVideos
      .map(
        (event) => `
          ${(() => {
            const videoId = event.videoId || event.youtubeId || "";
            const hasEmbed =
              Boolean(videoId) && !/^(YOUR_|PLACEHOLDER_|ADD_)/i.test(videoId);
            const ratio =
              event.kind === "short" ? "9 / 16" : event.ratio || "16 / 9";
            const embedUrl = hasEmbed ? buildYouTubeEmbedUrl(videoId) : "";
            const notesMarkup = (event.notes || [])
              .map((note) => `<li>${note}</li>`)
              .join("");

            return `
          <article class="event-recap card" data-animate>
            <div
              class="event-recap__media ${
                eventThemeClassMap[event.theme] ||
                `theme-${event.theme || "story"}`
              }"
              style="--event-ratio: ${ratio}"
            >
              ${
                embedUrl ?
                  `<iframe
                      src="${embedUrl}"
                      title="${event.title}"
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowfullscreen
                    ></iframe>`
                : `<div class="event-recap__placeholder">
                      <strong>Add a YouTube video ID</strong>
                      <span>Replace the placeholder value in <code>js/data/events.js</code>.</span>
                    </div>`
              }
            </div>
            <div class="event-recap__content">
              <div class="event-recap__meta">
                <span class="tag accent">${event.kind === "short" ? "YouTube Short" : "YouTube Video"}</span>
                <span class="event-recap__caption">${event.caption || "Past event recap"}</span>
              </div>
              <h3>${event.title}</h3>
              <p>${event.summary}</p>
              <ul class="event-recap__notes">
                ${notesMarkup}
              </ul>
            </div>
          </article>
            `;
          })()}
        `,
      )
      .join("");
  }
};

const buildUpiUri = (upi, amount) => {
  const amountValue = Number(amount || 0).toFixed(2);
  const query = [`am=${amountValue}`, "cu=INR", "mode=02", "purpose=00"];
  if (upi) {
    query.unshift(`pa=${encodeURIComponent(upi)}`);
    query.push(`pn=${encodeURIComponent("AVSAR Social Foundation")}`);
    query.push(
      `tn=${encodeURIComponent(
        `Donation to AVSAR Social Foundation Rs ${Number(amountValue).toLocaleString("en-IN")}`,
      )}`,
    );
    query.push(`tr=${encodeURIComponent(`AVSAR-${Date.now()}`)}`);
  }
  return `upi://pay?${query.join("&")}`;
};

const renderDonate = () => {
  const donateData = window.AVSAR_DONATE_DATA;
  if (!donateData) return;

  donationSlider = document.querySelector("[data-donation-slider]");
  donationAmountLabel = document.querySelector("[data-donation-amount-label]");
  donationAmountInput = document.querySelector("[data-donation-amount-input]");
  donationUpiText = document.querySelector("[data-donation-upi-text]");
  donationQrGrid = document.querySelector("[data-donation-qr-grid]");
  donationUpiButton = document.querySelector("[data-donation-upi-button]");
  donationBankHolder = document.querySelector("[data-bank-holder]");
  donationBankName = document.querySelector("[data-bank-name]");
  donationBankAccount = document.querySelector("[data-bank-account]");
  donationBankIfsc = document.querySelector("[data-bank-ifsc]");
  donationBankBranch = document.querySelector("[data-bank-branch]");
  donationBankNote = document.querySelector("[data-bank-note]");

  if (!donationSlider || !donationAmountLabel || !donationQrGrid) return;

  const sliderConfig = donateData.slider || {};
  const upi = donateData.upi || "";
  const paymentPage =
    donateData.paymentPage ||
    "https://pages.razorpay.com/donate-avsarsocialfoundation";
  const bank = donateData.bank || {};

  donationSlider.min = String(sliderConfig.min ?? 100);
  donationSlider.max = String(sliderConfig.max ?? 5000);
  donationSlider.step = String(sliderConfig.step ?? 50);
  donationSlider.value = String(
    sliderConfig.defaultAmount ?? donationSlider.value,
  );
  if (donationAmountInput) {
    donationAmountInput.min = donationSlider.min;
    donationAmountInput.max = donationSlider.max;
    donationAmountInput.step = "1";
    donationAmountInput.value = donationSlider.value;
  }

  if (donationBankHolder)
    donationBankHolder.textContent = bank.accountHolder || "";
  if (donationBankName) donationBankName.textContent = bank.bankName || "";
  if (donationBankAccount)
    donationBankAccount.textContent = bank.accountNumber || "";
  if (donationBankIfsc) donationBankIfsc.textContent = bank.ifsc || "";
  if (donationBankBranch) donationBankBranch.textContent = bank.branch || "";
  if (donationBankNote) donationBankNote.textContent = bank.note || "";

  const minAmount = Number(donationSlider.min || sliderConfig.min || 100);
  const maxAmount = Number(donationSlider.max || sliderConfig.max || 5000);
  let qrRenderTimer = null;
  const normalizeAmount = (value) => {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) return minAmount;
    const roundedValue = Math.round(numericValue);
    return Math.min(maxAmount, Math.max(minAmount, roundedValue));
  };

  const updateDonationCopy = (amountValue) => {
    donationAmountLabel.textContent = `Rs ${amountValue.toLocaleString("en-IN")}`;
    if (donationUpiText) {
      donationUpiText.textContent =
        upi ?
          `Amount: Rs ${amountValue.toLocaleString("en-IN")} | Scan the QR to pay instantly`
        : `Add your UPI ID in js/data/donate.js | Amount: Rs ${amountValue.toLocaleString("en-IN")}`;
    }
    if (donationUpiButton) {
      donationUpiButton.href = paymentPage;
      donationUpiButton.textContent =
        upi ? "Continue to Secure Payment" : "Add UPI ID to enable";
    }
  };

  const renderQr = (amount) => {
    const amountValue = Number(amount || 0);
    const payload = buildUpiUri(upi, amountValue);
    if (donationQrGrid) {
      donationQrGrid.innerHTML = "";
      if (window.QRCode) {
        new window.QRCode(donationQrGrid, {
          text: payload,
          width: 228,
          height: 228,
          colorDark: "#0f172a",
          colorLight: "#ffffff",
          correctLevel: window.QRCode.CorrectLevel.H,
        });
      } else {
        donationQrGrid.textContent = "QR code library unavailable";
      }
    }
  };

  const syncDonationAmount = (value, { immediateQr = false } = {}) => {
    const normalizedAmount = normalizeAmount(value);
    if (donationSlider) donationSlider.value = String(normalizedAmount);
    if (donationAmountInput)
      donationAmountInput.value = String(normalizedAmount);
    updateDonationCopy(normalizedAmount);

    if (qrRenderTimer) {
      window.clearTimeout(qrRenderTimer);
      qrRenderTimer = null;
    }

    if (immediateQr) {
      renderQr(normalizedAmount);
      return;
    }

    qrRenderTimer = window.setTimeout(() => {
      renderQr(normalizedAmount);
      qrRenderTimer = null;
    }, 120);
  };

  donationSlider.addEventListener("input", () => {
    syncDonationAmount(donationSlider.value);
  });

  if (donationAmountInput) {
    donationAmountInput.addEventListener("input", () => {
      if (donationAmountInput.value.trim() === "") return;
      syncDonationAmount(donationAmountInput.value);
    });

    donationAmountInput.addEventListener("blur", () => {
      if (donationAmountInput.value.trim() === "") {
        syncDonationAmount(donationSlider.value, { immediateQr: true });
        return;
      }
      syncDonationAmount(donationAmountInput.value, { immediateQr: true });
    });
  }

  syncDonationAmount(donationSlider.value, { immediateQr: true });
};

renderPrograms();
renderEvents();
renderDonate();

animatedItems = document.querySelectorAll("[data-animate]");
animatedItems.forEach((item, index) => {
  item.style.setProperty("--reveal-delay", `${Math.min(index * 60, 420)}ms`);
});
galleryItems = document.querySelectorAll(".gallery-item");

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 24);
};

const setupMobileDonateFooterState = () => {
  if (!siteFooter || !mobileDonate) return;

  const donateLink = mobileDonate.querySelector("a");
  const mobileDonateQuery = window.matchMedia("(max-width: 55rem)");
  let footerVisible = false;

  if (donateLink && !donateLink.getAttribute("aria-label")) {
    donateLink.setAttribute("aria-label", "Donate now");
  }

  const syncDonateState = () => {
    mobileDonate.classList.toggle(
      "is-footer-visible",
      mobileDonateQuery.matches && footerVisible,
    );
  };

  if ("IntersectionObserver" in window) {
    const footerObserver = new IntersectionObserver(
      (entries) => {
        footerVisible = entries.some((entry) => entry.isIntersecting);
        syncDonateState();
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.01 },
    );

    footerObserver.observe(siteFooter);
  } else {
    const checkFooterPosition = () => {
      const footerBounds = siteFooter.getBoundingClientRect();
      footerVisible = footerBounds.top < window.innerHeight;
      syncDonateState();
    };

    window.addEventListener("scroll", checkFooterPosition, { passive: true });
    window.addEventListener("resize", checkFooterPosition);
    checkFooterPosition();
  }

  if (mobileDonateQuery.addEventListener) {
    mobileDonateQuery.addEventListener("change", syncDonateState);
  } else {
    mobileDonateQuery.addListener(syncDonateState);
  }

  syncDonateState();
};

setHeaderState();
setupMobileDonateFooterState();
window.addEventListener("scroll", setHeaderState, { passive: true });

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    navLinks.classList.toggle("open");
    document.body.classList.toggle("menu-open", !expanded);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      navLinks.classList.remove("open");
      document.body.classList.remove("menu-open");
    });
  });
}

if (animatedItems.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.14 },
  );

  animatedItems.forEach((item) => observer.observe(item));
}

const animateCounter = (element) => {
  const target = Number(element.dataset.counter || 0);
  const suffix = element.dataset.suffix || "";
  const duration = 1800;
  const startTime = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(target * eased);
    element.textContent = `${value.toLocaleString()}${suffix}`;
    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

if (counters.length) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach((counter) => counterObserver.observe(counter));
}

faqButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const parent = button.closest(".faq-item");
    if (!parent) return;
    parent.classList.toggle("open");
    button.setAttribute(
      "aria-expanded",
      String(parent.classList.contains("open")),
    );
  });
});

sliders.forEach((slider) => {
  const track = slider.querySelector(".slider-track");
  const prev = slider.querySelector("[data-slider-prev]");
  const next = slider.querySelector("[data-slider-next]");
  if (!track || !prev || !next) return;

  const scrollAmount = () => track.clientWidth * 0.88;
  prev.addEventListener("click", () =>
    track.scrollBy({ left: -scrollAmount(), behavior: "smooth" }),
  );
  next.addEventListener("click", () =>
    track.scrollBy({ left: scrollAmount(), behavior: "smooth" }),
  );
});

if (galleryItems.length) {
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.innerHTML = `
    <button class="lightbox-close" type="button" aria-label="Close gallery preview">&times;</button>
    <div class="lightbox-panel" role="dialog" aria-modal="true" aria-label="Gallery preview">
      <div class="lightbox-media"></div>
      <div class="lightbox-copy">
        <h3 class="lightbox-title"></h3>
        <p class="lightbox-text"></p>
      </div>
    </div>
  `;
  document.body.appendChild(lightbox);

  const lightboxMedia = lightbox.querySelector(".lightbox-media");
  const lightboxTitle = lightbox.querySelector(".lightbox-title");
  const lightboxText = lightbox.querySelector(".lightbox-text");

  const closeLightbox = () => lightbox.classList.remove("open");

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const theme =
        galleryThemeClassMap[item.dataset.theme] || "theme-story";
      lightboxMedia.className = `lightbox-media ${theme}`;
      lightboxTitle.textContent = item.dataset.title || "Impact Story";
      lightboxText.textContent =
        item.dataset.description ||
        "A closer look at AVSAR's community-first work.";
      lightbox.classList.add("open");
    });
  });

  lightbox.addEventListener("click", (event) => {
    if (
      event.target === lightbox ||
      event.target.classList.contains("lightbox-close")
    ) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
  });
}

demoForms.forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const status = form.querySelector(".form-status");
    const submitButton = form.querySelector('button[type="submit"]');
    const action = form.getAttribute("action");
    const method = (form.getAttribute("method") || "POST").toUpperCase();

    if (!status) return;
    if (!action) {
      status.dataset.state = "error";
      status.textContent =
        "Thanks for your message. Please reach out through another option so we can help you quickly.";
      form.reset();
      return;
    }

    const originalButtonText = submitButton?.textContent || "";
    const setButtonState = (disabled, label) => {
      if (!submitButton) return;
      submitButton.disabled = disabled;
      if (label) {
        submitButton.textContent = label;
      }
    };

    try {
      status.dataset.state = "sending";
      status.textContent = "Sending your message...";
      setButtonState(true, "Sending...");

      const response = await fetch(action, {
        method,
        headers: {
          Accept: "application/json",
        },
        body: new FormData(form),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Unable to send the form right now.");
      }

      form.reset();
      status.dataset.state = "success";
      status.textContent =
        "Thank you for reaching out. Your response has been sent successfully.";
    } catch (error) {
      status.dataset.state = "error";
      status.textContent =
        "Thanks for your message. We could not send it right now, please try again or contact us through another option.";
    } finally {
      setButtonState(false, originalButtonText);
    }
  });
});

const impactMessages = [
  {
    max: 2000,
    text: "This can support a school kit for a child and basic learning supplies.",
  },
  {
    max: 5000,
    text: "This can help a family access a community health screening or essentials.",
  },
  {
    max: 10000,
    text: "This can contribute to a focused skills workshop for a youth cohort.",
  },
  {
    max: Infinity,
    text: "This can help fund a larger outreach drive with education, care, and follow-up support.",
  },
];

const updateImpactCalculator = () => {
  if (!impactInput || !impactOutput) return;
  const value = Number(impactInput.value);
  const match = impactMessages.find((entry) => value <= entry.max);
  impactOutput.textContent = `Estimated impact for Rs ${value.toLocaleString()}: ${match.text}`;
};

if (impactInput && impactOutput) {
  impactInput.addEventListener("input", updateImpactCalculator);
  updateImpactCalculator();
}
