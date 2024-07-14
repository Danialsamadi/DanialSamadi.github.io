let currentProject = 1;
const totalProjects = 4;

// Added GitHub links for each project
const githubLinks = [
  "https://github.com/user/project1",
  "https://github.com/user/project2",
  "https://github.com/user/project3",
  "https://github.com/user/project4"
];

document.getElementById('prev-btn').addEventListener('click', () => {
  showProject(currentProject - 1);
});

document.getElementById('next-btn').addEventListener('click', () => {
  showProject(currentProject + 1);
});

function showProject(projectNumber) {
  if (projectNumber < 1) {
    projectNumber = totalProjects;
  } else if (projectNumber > totalProjects) {
    projectNumber = 1;
  }

  for (let i = 1; i <= totalProjects; i++) {
    document.getElementById(`project-${i}`).style.display = 'none';
  }

  document.getElementById(`project-${projectNumber}`).style.display = 'flex';
  // Set the GitHub link for the current project
  document.getElementById(`github-link-${projectNumber}`).href = githubLinks[projectNumber - 1];
  currentProject = projectNumber;
}

// Initialize by showing the first project
showProject(currentProject);

if (document.getElementById('my-work-link')) {
  document.getElementById('my-work-link').addEventListener('click', () => {
    document.getElementById('my-work-section').scrollIntoView({behavior: "smooth"})
  })
}



