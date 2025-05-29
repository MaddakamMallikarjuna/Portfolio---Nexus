const githubUsername = "MaddakamMallikarjuna";

async function fetchGitHubProjects() {
  const container = document.getElementById("github-projects");
  container.innerHTML = "";

  try {
    const res = await fetch(`https://api.github.com/users/${githubUsername}/repos`);
    if (!res.ok) throw new Error("GitHub API error");

    const repos = await res.json();
    const nexusRepos = repos.filter(repo => repo.name.endsWith("---Nexus"));

    for (const repo of nexusRepos) {
      const projectName = repo.name.replace("---Nexus", "");
      const repoUrl = repo.html_url;

      let mediaFiles = [];
      try {
        const contentsRes = await fetch(`https://api.github.com/repos/${githubUsername}/${repo.name}/contents/assets`);
        if (!contentsRes.ok) throw new Error("Assets folder not found");
        const contents = await contentsRes.json();
        mediaFiles = contents
          .filter(file => /\.(png|jpe?g|gif|webp|svg|mp4|webm|ogg)$/i.test(file.name))
          .map(file => file.download_url);
      } catch (err) {
        console.warn(`No assets folder in ${repo.name}`);
      }

      const mediaHTML = mediaFiles.map((url, index) => {
        const isVideo = /\.(mp4|webm|ogg)$/i.test(url);
        return isVideo
          ? `<video class="media-item ${index === 0 ? "active" : ""}" muted autoplay loop><source src="${url}"></video>`
          : `<img class="media-item ${index === 0 ? "active" : ""}" src="${url}" alt="${projectName || 'Project image'}" />`;
      }).join("");

      const card = document.createElement("div");
      card.className = "project-card";
      card.innerHTML = `
        <div class="media-carousel">${mediaHTML}</div>
        <div class="description"><a href="${repoUrl}" target="_blank">
          <h3>${projectName}</h3>
          <p>${repo.description || "No description provided."}</p>
        </a></div>
      `;
      container.appendChild(card);

      // Rotate media
      if (mediaFiles.length > 1) {
        let current = 0;
        const media = card.querySelectorAll(".media-item");
        setInterval(() => {
          media[current].classList.remove("active");
          current = (current + 1) % media.length;
          media[current].classList.add("active");
        }, 3000);
      }
    }
  } catch (err) {
    container.innerHTML = "<p>Error loading projects.</p>";
    console.error(err);
  }
}

fetchGitHubProjects();

// Animate sections into view
const sections = document.querySelectorAll("section");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.2 });
sections.forEach(section => observer.observe(section));

// Skill hover interaction
const skills = document.querySelectorAll(".skill-item");
const descBox = document.getElementById("descriptionText");

function showDescription(skillEl) {
  const newText = skillEl.getAttribute("data-description");
  if (descBox.textContent === newText) return;

  // Remove active from others
  skills.forEach(s => s.classList.remove("active"));
  skillEl.classList.add("active");

  // Slide effect
  descBox.classList.remove("description-text");
  descBox.classList.add("slide-out");

  setTimeout(() => {
    descBox.textContent = newText;
    descBox.className = "description-text";
  }, 400);
}

// Random skill on load (safe check)
if (skills.length > 0) {
  const initialSkill = skills[Math.floor(Math.random() * skills.length)];
  showDescription(initialSkill);

  skills.forEach(skill => {
    skill.addEventListener("mouseenter", () => {
      showDescription(skill);
    });
  });
}

// Google Form submission
const form = document.getElementById("custom-form");
const responseEl = document.getElementById("response");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData();
  formData.append("entry.1100096532", form.name.value);   // Name
  formData.append("entry.758623599", form.message.value); // Message
  formData.append("entry.1723152443", form.email.value);  // Email

  fetch("https://docs.google.com/forms/d/e/1FAIpQLScMp-3dV8ogTGkZd3MyPvBIrdjiRcP9nkIhfZU5gudhX3MlZQ/formResponse", {
    method: "POST",
    mode: "no-cors",
    body: formData
  }).then(() => {
    responseEl.innerText = "✅ Message sent successfully!";
    form.reset();
    setTimeout(() => responseEl.innerText = "", 2000);
  }).catch(() => {
    responseEl.innerText = "❌ Failed to send message.";
    setTimeout(() => responseEl.innerText = "", 2000);
  });
});
