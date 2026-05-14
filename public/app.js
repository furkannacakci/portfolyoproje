const state = {
  portfolio: null
};

const selectors = {
  profileName: document.querySelector("#profile-name"),
  profileSummary: document.querySelector("#profile-summary"),
  profileTitle: document.querySelector("#profile-title"),
  profileLocation: document.querySelector("#profile-location"),
  profileAvailability: document.querySelector("#profile-availability"),
  profileEmail: document.querySelector("#profile-email"),
  projectCount: document.querySelector("#project-count"),
  skillCount: document.querySelector("#skill-count"),
  messageCount: document.querySelector("#message-count"),
  projectsGrid: document.querySelector("#projects-grid"),
  skillsList: document.querySelector("#skills-list"),
  contactForm: document.querySelector("#contact-form"),
  contactStatus: document.querySelector("#contact-status"),
  projectForm: document.querySelector("#project-form"),
  projectStatus: document.querySelector("#project-status")
};

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Request failed.");
  }
  return data;
}

function renderProfile(profile, counts) {
  selectors.profileName.textContent = profile.name;
  selectors.profileSummary.textContent = profile.summary;
  selectors.profileTitle.textContent = profile.title;
  selectors.profileLocation.textContent = profile.location;
  selectors.profileAvailability.textContent = profile.availability;
  selectors.profileEmail.textContent = profile.email;
  selectors.profileEmail.href = `mailto:${profile.email}`;
  selectors.projectCount.textContent = counts.projects;
  selectors.skillCount.textContent = counts.skills;
  selectors.messageCount.textContent = counts.messages;
}

function renderProjects(projects) {
  selectors.projectsGrid.innerHTML = projects
    .map(project => {
      const tech = project.tech.map(item => `<span>${item}</span>`).join("");
      return `
        <article class="project-card">
          <header>
            <div>
              <h3>${project.title}</h3>
              <p>${project.type}</p>
            </div>
            <span class="tag">${project.status}</span>
          </header>
          <p>${project.description}</p>
          <div class="tech-list">${tech}</div>
          <div class="project-actions">
            <button class="button danger" type="button" data-delete-project="${project.id}">Sil</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderSkills(skills) {
  selectors.skillsList.innerHTML = skills
    .map(skill => {
      return `
        <article class="skill-row">
          <header>
            <strong>${skill.name}</strong>
            <span>${skill.category} - ${skill.level}%</span>
          </header>
          <div class="meter" aria-label="${skill.name} level">
            <span style="width: ${skill.level}%"></span>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderApp() {
  const { profile, projects, skills, messages } = state.portfolio;
  renderProfile(profile, {
    projects: projects.length,
    skills: skills.length,
    messages: messages.length
  });
  renderProjects(projects);
  renderSkills(skills);
}

async function loadPortfolio() {
  state.portfolio = await api("/api/portfolio");
  renderApp();
}

selectors.contactForm.addEventListener("submit", async event => {
  event.preventDefault();
  selectors.contactStatus.textContent = "Gönderiliyor...";
  const formData = new FormData(selectors.contactForm);
  try {
    await api("/api/messages", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData))
    });
    selectors.contactForm.reset();
    selectors.contactStatus.textContent = "Mesaj başarıyla kaydedildi.";
    await loadPortfolio();
  } catch (error) {
    selectors.contactStatus.textContent = error.message;
  }
});

selectors.projectForm.addEventListener("submit", async event => {
  event.preventDefault();
  selectors.projectStatus.textContent = "Proje kaydediliyor...";
  const formData = new FormData(selectors.projectForm);
  const payload = Object.fromEntries(formData);
  payload.featured = formData.has("featured");
  try {
    await api("/api/projects", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    selectors.projectForm.reset();
    selectors.projectForm.featured.checked = true;
    selectors.projectStatus.textContent = "Proje eklendi.";
    await loadPortfolio();
  } catch (error) {
    selectors.projectStatus.textContent = error.message;
  }
});

selectors.projectsGrid.addEventListener("click", async event => {
  const button = event.target.closest("[data-delete-project]");
  if (!button) {
    return;
  }
  button.disabled = true;
  button.textContent = "Siliniyor...";
  try {
    await api(`/api/projects/${button.dataset.deleteProject}`, {
      method: "DELETE"
    });
    await loadPortfolio();
  } catch (error) {
    button.disabled = false;
    button.textContent = error.message;
  }
});

loadPortfolio().catch(error => {
  selectors.profileName.textContent = "Portfolio yüklenemedi";
  selectors.profileSummary.textContent = error.message;
});
