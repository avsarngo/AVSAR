const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
let animatedItems = [];
const counters = document.querySelectorAll("[data-counter]");
const faqButtons = document.querySelectorAll(".faq-question");
const sliders = document.querySelectorAll("[data-slider]");
const demoForms = document.querySelectorAll("[data-demo-form]");
const impactInput = document.querySelector("[data-impact-input]");
const impactOutput = document.querySelector("[data-impact-output]");
let donationSlider = null;
let donationAmountLabel = null;
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
let programExpandButtons = [];

const programToneClassMap = {
  education: "tone-education",
  healthcare: "tone-healthcare",
  women: "tone-women",
  skills: "tone-skills",
  environment: "tone-sdg",
  rural: "tone-community",
};

const programIconMap = {
  book: `
    <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true">
      <path d="M6 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2V6a2 2 0 0 1 2-2Z" />
      <path d="M12 4h6a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2h-6" />
      <path d="M8 8h4" />
      <path d="M8 11h4" />
    </svg>
  `,
  spark: `
    <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true">
      <path d="M12 3v2.25" />
      <path d="M12 18.75V21" />
      <path d="M4.5 8.25l1.6 1.6" />
      <path d="M17.9 15.65l1.6 1.6" />
      <path d="M3 12h2.25" />
      <path d="M18.75 12H21" />
      <path d="M6.1 17.25l1.6-1.6" />
      <path d="M15.9 7.45l1.6-1.6" />
      <path d="M12 7.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z" />
    </svg>
  `,
  heart: `
    <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true">
      <path d="M20.5 8.5c0 5.4-8.5 11-8.5 11S3.5 13.9 3.5 8.5A4.5 4.5 0 0 1 12 6.2a4.5 4.5 0 0 1 8.5 2.3Z" />
    </svg>
  `,
  users: `
    <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true">
      <path d="M8.5 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M15.5 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
      <path d="M4.5 19a4 4 0 0 1 8 0" />
      <path d="M13 19a4.5 4.5 0 0 1 6.5-4" />
    </svg>
  `,
  target: `
    <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1.4" />
    </svg>
  `,
  globe: `
    <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17" />
      <path d="M12 3.5c2.8 2.8 4.1 5.7 4.1 8.5S14.8 18.2 12 20.5c-2.8-2.3-4.1-5.2-4.1-8.5S9.2 6.3 12 3.5Z" />
    </svg>
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
            ${programIconMap[program.icon] || programIconMap.book}
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
            const hasEmbed = Boolean(videoId) && !/^(YOUR_|PLACEHOLDER_|ADD_)/i.test(videoId);
            const ratio = event.kind === "short" ? "9 / 16" : event.ratio || "16 / 9";
            const embedUrl = hasEmbed ? buildYouTubeEmbedUrl(videoId) : "";
            const notesMarkup = (event.notes || []).map((note) => `<li>${note}</li>`).join("");

            return `
          <article class="event-recap card" data-animate>
            <div
              class="event-recap__media theme-${event.theme || "story"}"
              style="--event-ratio: ${ratio}"
            >
              ${
                embedUrl
                  ? `<iframe
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
  const query = [`am=${amountValue}`, "cu=INR"];
  if (upi) {
    query.unshift(`pa=${encodeURIComponent(upi)}`);
  }
  return `upi://pay?${query.join("&")}`;
};

const renderDonate = () => {
  const donateData = window.AVSAR_DONATE_DATA;
  if (!donateData) return;

  donationSlider = document.querySelector("[data-donation-slider]");
  donationAmountLabel = document.querySelector("[data-donation-amount-label]");
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
  const bank = donateData.bank || {};

  donationSlider.min = String(sliderConfig.min ?? 100);
  donationSlider.max = String(sliderConfig.max ?? 5000);
  donationSlider.step = String(sliderConfig.step ?? 50);
  donationSlider.value = String(sliderConfig.defaultAmount ?? donationSlider.value);

  if (donationBankHolder) donationBankHolder.textContent = bank.accountHolder || "";
  if (donationBankName) donationBankName.textContent = bank.bankName || "";
  if (donationBankAccount) donationBankAccount.textContent = bank.accountNumber || "";
  if (donationBankIfsc) donationBankIfsc.textContent = bank.ifsc || "";
  if (donationBankBranch) donationBankBranch.textContent = bank.branch || "";
  if (donationBankNote) donationBankNote.textContent = bank.note || "";

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

    donationAmountLabel.textContent = `Rs ${amountValue.toLocaleString("en-IN")}`;
    if (donationUpiText) {
      donationUpiText.textContent = upi
        ? `UPI ID: ${upi} | Amount: Rs ${amountValue.toLocaleString("en-IN")}`
        : `Add your UPI ID in js/data/donate.js | Amount: Rs ${amountValue.toLocaleString("en-IN")}`;
    }
    if (donationUpiButton) {
      donationUpiButton.href = payload;
      donationUpiButton.textContent = upi ? "Open Payment App" : "Add UPI ID to enable";
    }
  };

  donationSlider.addEventListener("input", () => {
    renderQr(donationSlider.value);
  });

  renderQr(donationSlider.value);
};

renderPrograms();
renderEvents();
renderDonate();

animatedItems = document.querySelectorAll("[data-animate]");
animatedItems.forEach((item, index) => {
  item.style.setProperty("--reveal-delay", `${Math.min(index * 60, 420)}ms`);
});
galleryItems = document.querySelectorAll(".gallery-item");
programExpandButtons = document.querySelectorAll(".program-expand-toggle");

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 24);
};

setHeaderState();
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
      const theme = themeClassMap[item.dataset.theme] || "theme-story";
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

programExpandButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".program-card");
    if (!card) return;
    const details = card.querySelector(".program-details");
    if (!details) return;
    const isExpanded = card.classList.toggle("expanded");
    details.hidden = !isExpanded;
    button.textContent = isExpanded ? "Show Less" : "Read More";
    button.setAttribute("aria-expanded", String(isExpanded));
  });
});

demoForms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = form.querySelector(".form-status");
    if (!status) return;
    status.textContent =
      "Thank you. Your message has been captured in this demo layout and can be connected to your backend next.";
    form.reset();
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
