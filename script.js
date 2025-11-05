window.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("start-overlay");
  const button = document.getElementById("start-button");
  const hero = document.getElementById("home");

  document.body.classList.add("lock-scroll");
  hero.style.backgroundImage = "url('assets/bg1-dark.gif')";

  // --- AUDIO FILES ---
  const startSound = new Audio("assets/The Finals Startup sound.mp3");
  const bgMusic   = new Audio("assets/Kainbeats - Mojito Summer (Bossa Nova LoFi).mp3");

  const sectionSFX = {
    home:    new Audio("assets/rain.mp3"),
    about:   new Audio("assets/snow.mp3"),
    skills:  new Audio("assets/trainn.mp3"),
    projects:new Audio("assets/morning.mp3"),
    contact: new Audio("assets/night.mp3")
  };

  // --- BASIC SETTINGS ---
  bgMusic.loop = true;
  bgMusic.volume = 0.17;
  startSound.volume = 0.7;

  for (const key in sectionSFX) {
    sectionSFX[key].loop = true;

  }

  let currentSFX = null;
  let musicMuted = false;
  let sfxMuted   = false;

  // --- START BUTTON ---
  button.addEventListener("click", () => {
    if (!sfxMuted) startSound.play();
    setTimeout(() => { if (!musicMuted) bgMusic.play(); }, 500);

    document.body.style.transition = "background 0.3s";
    document.body.style.background = "#fff";

    setTimeout(() => {
      hero.style.backgroundImage = "url('assets/bg1.gif')";
      document.body.style.background = "#0a0f0a";
    }, 200);

    overlay.remove();
    document.body.classList.remove("lock-scroll");

    playSFX("home"); // start with hero sfx
  });

  // --- MUTE BUTTONS ---
  const musicControl = document.getElementById("music-control");
  const sfxControl   = document.getElementById("sfx-control");

  musicControl.addEventListener("click", () => {
    musicMuted = !musicMuted;
    bgMusic.muted = musicMuted;
    musicControl.textContent = musicMuted ? "🚫🎵" : "🎵";
  });

  sfxControl.addEventListener("click", () => {
    sfxMuted = !sfxMuted;
    for (const key in sectionSFX) sectionSFX[key].muted = sfxMuted;
    startSound.muted = sfxMuted;
    sfxControl.textContent = sfxMuted ? "🔈" : "🔊";
  });

  // --- SECTION-BASED SFX ---
  const sections = document.querySelectorAll("section");

  function playSFX(id) {
    if (currentSFX && currentSFX !== sectionSFX[id]) {
      fadeOut(currentSFX);
    }
    const audio = sectionSFX[id];
    if (audio && !sfxMuted) {
      fadeIn(audio);
      currentSFX = audio;
    }
  }

  // smooth fade helpers
  function fadeIn(audio) {
    audio.currentTime = 0;
    audio.volume = 0;
    audio.play();
    let volTarget = audio === sectionSFX["skills"] ? 0.9 : 0.6;


    const fade = setInterval(() => {
      if (audio.volume < volTarget) audio.volume += 0.05;
      else clearInterval(fade);
    }, 100);

  }

  function fadeOut(audio) {
    const fade = setInterval(() => {
      if (audio.volume > 0.05) audio.volume -= 0.05;
      else { audio.pause(); clearInterval(fade); }
    }, 100);
  }

  // --- OBSERVE SCROLL POSITION ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        if (sectionSFX[id]) playSFX(id);
      }
    });
  }, { threshold: 0.6 });

  sections.forEach(sec => observer.observe(sec));
});
