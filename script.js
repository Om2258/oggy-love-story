const CONFIG = {
  boyfriendName: "my favorite boy",
  yourName: "Your Name",
  lockCode: "2110",
  spotifyTrackUri: "spotify:track:1VFeSQ0eR8mL2MeR5tB0Ne",
  heroMessage:
    "Welcome to our tiny cartoon world: a little chaotic, very funny, and completely full of love.",
  note: [
    "You make my ordinary days feel like the best kind of episode: full of laughter, tiny adventures, and moments I want to replay forever.",
    "Thank you for being my safe place, my favorite person, and the one who makes even the silliest moments feel special.",
    "I hope you always remember this: I am cheering for you, choosing you, and loving you through every funny little bit of life."
  ],
  photos: [
    {
      src: "sandbox:/mnt/data/528BE952-E212-4767-87CD-7774F84E825B.jpeg",
      title: "Our little walk under the lights",
      message:
        "Jnn❤️\n\nThank you for always being there by my side whenever I needed someone. It means more to me than I can ever put into words. Thank you for being someone I can count on, for standing by me during difficult times, and for making things feel a little easier just by being there. I’m truly grateful to have you in my life. 🫶🏻❤️"
    },
    {
      src: "sandbox:/mnt/data/08846851-F65E-4957-BE7C-BE0065B70565.jpeg",
      title: "Happy little chaos",
      message:
        "Baatamize Bache, I want you to know that no matter what life brings your way, I’ll always be by your side. Through the good days and the difficult ones, you’ll always have me to count on. ❤️"
    },
    {
      src: "sandbox:/mnt/data/790835CC-B643-448F-B6B2-17A35FE944A8.jpeg",
      title: "Late-night talks",
      message:
        "Cutu, all I ever want is to see you happy, genuinely and wholeheartedly. No matter where life takes you or what comes your way, I hope you always find reasons to smile and feel at peace. You deserve all the happiness in the world. ❤️"
    },
    {
      src: "sandbox:/mnt/data/image(20261029-095327).png",
      title: "Our favorite days",
      message:
        "Do you remember the day we first met at Kaffeeine and the little notes on the walls? I remember telling you that one day we’d come back and write a gratitude note for everything that place has given us. That place holds such a special place in my heart because it will always be a part of our story. ❤️"
    },
    {
      src: "sandbox:/mnt/data/image(20261029-095605).png",
      title: "Tiny adventures",
      message:
        "I really love how you can understand me with just one look. And now, after knowing me for over a year, it feels even more beautiful how you understand the little things that matter to me. The small gestures, like making sure I never feel left out during festivals, taking me along, eating from the same plate, or simply waiting for me to finish eating, mean so much more to me than you realise. It’s these little things that make me feel seen, included, and cared for. ❤️"
    },
    {
      src: "sandbox:/mnt/data/image(20261029-095705).png",
      title: "Always us",
      message:
        "The crazy secrets, the madness, and the love for garba. 💃"
    },
    {
      src: "sandbox:/mnt/data/image(20261029-095705).png",
      title: "Our favorite smile",
      message:
        "Pure depth, understanding, and emotions. 💓"
    },
    {
      src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
      title: "Best memories",
      message:
        "Every memory with you feels like a page I never want to close — full of love, laughter, and peace."
    },
    {
      src: "sandbox:/mnt/data/image(20261029-100012).png",
      title: "Best vacation",
      message:
        "The trips and vacations that always turned into some very special stress-relief days. 😌"
    }
  ],
  videos: [
    {
      src: "sandbox:/mnt/data/VIDEO-2026-10-27-22-49-53.mp4",
      title: "Our happy moments",
      message:
        "Jnn, I really love how you remember every little thing I tell you, even the smallest details that I forget I’ve shared. It makes me feel special in a way I can’t explain. ❤️"
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
