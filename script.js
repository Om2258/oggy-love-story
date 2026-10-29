const CONFIG = {
  boyfriendName: "my favorite person",
  yourName: "Your Love",
  lockCode: "2110",
  spotifyTrackUri: "spotify:track:1VFeSQ0eR8mL2MeR5tB0Ne",
  heroMessage:
    "Welcome to our little world: full of laughter, sweet memories, and a love that keeps growing.",
  note: [
    "Every ordinary day feels beautiful when I get to share it with you. You make even the quiet moments feel warm and full of life.",
    "Thank you for being my comfort, my favorite person, and the reason I smile more often than I ever used to.",
    "I hope this little corner of the internet reminds you how deeply loved and truly special you are to me."
  ],
  photos: [
    {
      src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
      title: "Our first smile",
      message: "The moment that started this beautiful chapter in my life."
    },
    {
      src: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
      title: "You and me",
      message: "Every day feels lighter and happier when I am with you."
    },
    {
      src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
      title: "Tiny adventures",
      message: "The little trips, laughs, and memories that turned into my favorite stories."
    },
    {
      src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
      title: "Growing together",
      message: "I love seeing us grow, learn, and become even more comfortable in our own little world."
    },
    {
      src: "https://images.unsplash.com/photo-1526413232644-8a40f03cc03b?auto=format&fit=crop&w=1200&q=80",
      title: "Sweet little chaos",
      message: "The silly, messy, beautiful moments are the ones I treasure the most."
    },
    {
      src: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1200&q=80",
      title: "Always us",
      message: "No matter where life goes, I want more memories like this with you."
    }
  ],
  videos: [
    {
      src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      title: "Our happy moments",
      message: "A tiny reminder of how beautiful and peaceful life feels with you beside me."
    },
    {
      src: "https://www.w3schools.com/html/mov_bbb.mp4",
      title: "Our little adventure",
      message: "The carefree, fun, and unforgettable memories I replay in my head."
    }
  ]
};

const $ = (selector) => document.querySelector(selector);

let spotifyEmbedController;
let shouldPlaySpotify = false;
let isSpotifyPlaying = false;

function imageExists(src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = src;
  });
}

function videoExists(src) {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    const timeout = window.setTimeout(() => resolve(false), 2500);
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      window.clearTimeout(timeout);
      resolve(true);
    };
    video.onerror = () => {
      window.clearTimeout(timeout);
      resolve(false);
    };
    video.src = src;
  });
}

function setText(selector, text) {
  const element = $(selector);
  if (element) element.textContent = text;
}

function setCopy() {
  setText("#boyfriendName", CONFIG.boyfriendName);
  setText("#noteName", CONFIG.boyfriendName);
  setText("#yourName", CONFIG.yourName);
  setText("#heroMessage", CONFIG.heroMessage);
  document.title = `For ${CONFIG.boyfriendName}`;

  const note = $("#loveNote");
  note.innerHTML = "";
  CONFIG.note.forEach((paragraph) => {
    const p = document.createElement("p");
    p.textContent = paragraph;
    note.appendChild(p);
  });
}

function playSpotifySong() {
  shouldPlaySpotify = true;
  isSpotifyPlaying = true;
  updateMusicToggle();

  if (spotifyEmbedController) {
    spotifyEmbedController.play();
  }
}

function pauseSpotifySong() {
  shouldPlaySpotify = false;
  isSpotifyPlaying = false;
  updateMusicToggle();

  if (spotifyEmbedController) {
    spotifyEmbedController.pause();
  }
}

function updateMusicToggle() {
  const button = $("#musicToggle");
  if (!button) return;

  button.classList.toggle("is-playing", isSpotifyPlaying);
  button.setAttribute("aria-label", isSpotifyPlaying ? "Pause music" : "Play music");
  button.title = isSpotifyPlaying ? "Pause music" : "Play music";
  button.innerHTML = isSpotifyPlaying ? "&#10074;&#10074;" : "&#9835;";
}

function setupSpotify() {
  const embedHost = $("#spotifyEmbed");
  const musicToggle = $("#musicToggle");
  if (!embedHost || !musicToggle) return;

  window.onSpotifyIframeApiReady = (SpotifyIframeApi) => {
    SpotifyIframeApi.createController(
      embedHost,
      {
        uri: CONFIG.spotifyTrackUri,
        width: "100%",
        height: "152"
      },
      (controller) => {
        spotifyEmbedController = controller;
        controller.addListener("playback_update", (event) => {
          isSpotifyPlaying = !event.data.isPaused;
          updateMusicToggle();
        });
        if (shouldPlaySpotify) controller.play();
      }
    );
  };

  const spotifyScript = document.createElement("script");
  spotifyScript.src = "https://open.spotify.com/embed/iframe-api/v1";
  spotifyScript.async = true;
  document.body.appendChild(spotifyScript);

  musicToggle.addEventListener("click", () => {
    if (isSpotifyPlaying) {
      pauseSpotifySong();
    } else {
      playSpotifySong();
    }
  });
}

function setupNumberLock() {
  const lock = $("#numberLock");
  const panel = $("#numberLockPanel");
  const dots = Array.from(document.querySelectorAll("#numberLockDots span"));
  const status = $("#numberLockStatus");
  const keyPad = $("#numberLockKeys");
  const clearButton = $("#numberLockClear");
  const backspaceButton = $("#numberLockBackspace");
  let enteredCode = "";
  let isUnlocked = false;
  let resetTimer;

  function updateDots() {
    dots.forEach((dot, index) => {
      dot.classList.toggle("is-filled", index < enteredCode.length);
    });
  }

  function clearCode() {
    enteredCode = "";
    updateDots();
    status.textContent = "";
  }

  function showWrongCode() {
    status.textContent = "That was not our number. Try again.";
    panel.classList.add("is-wrong");
    window.clearTimeout(resetTimer);
    resetTimer = window.setTimeout(() => {
      panel.classList.remove("is-wrong");
      clearCode();
    }, 700);
  }

  function unlock() {
    isUnlocked = true;
    status.textContent = "You found it. Oggy is here to say hello.";
    panel.classList.add("is-correct");
    playSpotifySong();

    window.setTimeout(() => {
      lock.classList.add("is-unlocked");
      document.body.classList.remove("is-locked");
    }, 2400);
  }

  function enterNumber(number) {
    if (isUnlocked || enteredCode.length >= CONFIG.lockCode.length) return;

    enteredCode += number;
    updateDots();

    if (enteredCode.length !== CONFIG.lockCode.length) return;

    if (enteredCode === CONFIG.lockCode) {
      unlock();
    } else {
      showWrongCode();
    }
  }

  keyPad.addEventListener("click", (event) => {
    const key = event.target.closest("[data-lock-number]");
    if (key) enterNumber(key.dataset.lockNumber);
  });

  clearButton.addEventListener("click", clearCode);
  backspaceButton.addEventListener("click", () => {
    if (isUnlocked) return;
    enteredCode = enteredCode.slice(0, -1);
    updateDots();
    status.textContent = "";
  });

  document.addEventListener("keydown", (event) => {
    if (isUnlocked) return;
    if (/^[0-9]$/.test(event.key)) {
      enterNumber(event.key);
    } else if (event.key === "Backspace") {
      backspaceButton.click();
    } else if (event.key === "Escape") {
      clearCode();
    }
  });
}

function addMessageCurtain(container) {
  const curtain = document.createElement("div");
  curtain.className = "message-curtain";
  curtain.innerHTML = `
    <span class="message-curtain__cloth message-curtain__cloth--left"></span>
    <span class="message-curtain__cloth message-curtain__cloth--right"></span>
    <span class="message-curtain__character message-curtain__character--oggy"></span>
    <span class="message-curtain__character message-curtain__character--bugs"></span>
    <button class="message-curtain__button" type="button">Open note</button>
  `;

  curtain.querySelector("button").addEventListener("click", () => {
    container.classList.add("is-revealed");
  });
  container.appendChild(curtain);
}

async function renderPhotos() {
  const grid = $("#photoGrid");
  grid.innerHTML = "";

  for (const photo of CONFIG.photos) {
    const card = document.createElement("article");
    card.className = "memory-card";

    const button = document.createElement("button");
    button.className = "memory-card__button";
    button.type = "button";
    button.setAttribute("aria-label", `Open photo: ${photo.title}`);

    if (await imageExists(photo.src)) {
      const image = document.createElement("img");
      image.src = photo.src;
      image.alt = photo.title;
      button.appendChild(image);
      button.addEventListener("click", () => openLightbox(photo));
    } else {
      const placeholder = document.createElement("span");
      placeholder.className = "memory-card__placeholder";
      placeholder.textContent = "Add a photo here";
      button.disabled = true;
      button.appendChild(placeholder);
    }

    const text = document.createElement("div");
    text.className = "memory-card__text";
    text.innerHTML = `<h3>${photo.title}</h3><p>${photo.message}</p>`;
    addMessageCurtain(text);
    card.append(button, text);
    grid.appendChild(card);
  }
}

async function renderVideos() {
  const grid = $("#videoGrid");
  grid.innerHTML = "";

  for (const item of CONFIG.videos) {
    const card = document.createElement("article");
    card.className = "video-card";
    const media = document.createElement("div");
    media.className = "video-card__media";

    if (await videoExists(item.src)) {
      const video = document.createElement("video");
      video.controls = true;
      video.preload = "metadata";
      video.src = item.src;
      video.setAttribute("aria-label", item.title);
      media.appendChild(video);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = "video-card__placeholder";
      placeholder.innerHTML = "<span>Add a video here</span>";
      media.appendChild(placeholder);
    }

    const text = document.createElement("div");
    text.className = "video-card__text";
    text.innerHTML = `<h3>${item.title}</h3><p>${item.message}</p>`;
    addMessageCurtain(text);
    card.append(media, text);
    grid.appendChild(card);
  }
}

function openLightbox(photo) {
  const dialog = $("#photoLightbox");
  const image = $("#lightboxImage");
  image.src = photo.src;
  image.alt = photo.title;
  setText("#lightboxCaption", `${photo.title} - ${photo.message}`);
  dialog.showModal();
}

function setupLightbox() {
  const dialog = $("#photoLightbox");
  $("#closeLightbox").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}

setupSpotify();
setupNumberLock();
setCopy();
renderPhotos();
renderVideos();
setupLightbox();
