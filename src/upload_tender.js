function saveTenderToLocalStorage(tenderId) {
  const title = document.getElementById("projectTitle").value.trim();
  const jurisdiction = document.querySelector("select").value;
  const scope = document.querySelector("textarea").value.trim();
  const phaseCount = parseInt(document.getElementById("phaseInput").value, 10);

  const phases = [];

  for (let i = 1; i <= phaseCount; i++) {
    const reqContainer = document.getElementById(`req-list-${i}`);
    const requirements = [];

    if (reqContainer) {
      reqContainer.querySelectorAll("span").forEach(span => {
        requirements.push(span.textContent.trim());
      });
    }

    phases.push({
      phase: i,
      requirements
    });
  }

  const tender = {
    id: tenderId,
    title,
    jurisdiction,
    scope,
    phases,
    createdAt: new Date().toISOString()
  };

  const existing = JSON.parse(localStorage.getItem("tenders")) || [];
  existing.push(tender);
  localStorage.setItem("tenders", JSON.stringify(existing));
}


/*
function saveTenderToLocalStorage(tenderId) {
    const title = document.getElementById("projectTitle").value.trim();
    const jurisdiction = document.querySelector("select").value;
    const scope = document.querySelector("textarea").value.trim();
    const phaseCount = parseInt(document.getElementById("phaseInput").value, 10);

    const phases = [];

    for (let i = 1; i <= phaseCount; i++) {
        const reqContainer = document.getElementById(`req-list-${i}`);
        const requirements = [];

        if (reqContainer) {
            reqContainer.querySelectorAll("span").forEach(span => {
                requirements.push(span.textContent.trim());
            });
        }

        phases.push({
            phase: i,
            requirements
        });
    }

    const tender = {
        id: tenderId,
        title,
        jurisdiction,
        scope,
        phases,
        createdAt: new Date().toISOString()
    };

    const existing = JSON.parse(localStorage.getItem("tenders")) || [];
    existing.push(tender);
    localStorage.setItem("tenders", JSON.stringify(existing));
}
    */