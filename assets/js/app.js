(function () {
  "use strict";

  const config = window.LONG_BENCH_CONFIG;
  const officialResults = window.LONG_BENCH_OFFICIAL_RESULTS || [];
  const taskGroups = window.LONG_BENCH_TASK_GROUPS || [];

  const pages = Array.from(document.querySelectorAll("[data-page]"));
  const navTabs = Array.from(document.querySelectorAll("[data-page-target]"));
  const leaderboardViewTabs = Array.from(document.querySelectorAll("[data-leaderboard-view-target]"));
  const leaderboardViews = Array.from(document.querySelectorAll("[data-leaderboard-view]"));
  const submitForm = document.getElementById("submit-form");
  const leaderboardBody = document.getElementById("leaderboard-body");
  const taskScoreTables = document.getElementById("task-score-tables");
  const capabilityScoreTables = document.getElementById("capability-score-tables");
  const openSourceOnly = document.getElementById("open-source-only");
  const lastUpdated = document.getElementById("last-updated");
  const toastEl = document.getElementById("toast");

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function makeId(prefix) {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return `${prefix}-${window.crypto.randomUUID()}`;
    }
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function getLocalRows() {
    return readJson(config.localRowsKey, []);
  }

  function saveLocalRows(rows) {
    writeJson(config.localRowsKey, rows);
  }

  function getSubmissions() {
    return readJson(config.submissionsKey, []);
  }

  function saveSubmissions(rows) {
    writeJson(config.submissionsKey, rows);
  }

  function getLeaderboardRows() {
    return officialResults.concat(getLocalRows());
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#039;"
    }[char]));
  }

  function formatAverage(value) {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
      return "-";
    }
    return Number(value).toFixed(3);
  }

  function formatScore(value) {
    if (value === null || value === undefined || Number.isNaN(Number(value))) {
      return "-";
    }
    return Number(value).toFixed(1);
  }

  function formatDate(value) {
    if (!value) {
      return "-";
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "-";
    }
    return new Intl.DateTimeFormat("en", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }).format(date);
  }

  function latestDate(rows) {
    const timestamps = rows
      .map((row) => new Date(row.updatedAt).getTime())
      .filter((value) => Number.isFinite(value));
    return timestamps.length ? new Date(Math.max(...timestamps)).toISOString() : "";
  }

  function toast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("is-visible");
    clearTimeout(toast.timerId);
    toast.timerId = setTimeout(() => {
      toastEl.classList.remove("is-visible");
    }, 2400);
  }

  function showPage(name) {
    pages.forEach((page) => {
      page.classList.toggle("is-hidden", page.dataset.page !== name);
    });
    navTabs.forEach((tab) => {
      tab.classList.toggle("is-active", tab.dataset.pageTarget === name);
    });
    window.location.hash = name;
    if (name === "leaderboard") {
      renderLeaderboard();
    }
  }

  function showLeaderboardView(name) {
    leaderboardViews.forEach((view) => {
      view.classList.toggle("is-hidden", view.dataset.leaderboardView !== name);
    });
    leaderboardViewTabs.forEach((tab) => {
      tab.classList.toggle("is-active", tab.dataset.leaderboardViewTarget === name);
    });
  }

  function numericValue(value) {
    return Number.isFinite(Number(value)) ? Number(value) : -Infinity;
  }

  function sortRowsBy(rows, scoreGetter) {
    return rows.sort((a, b) => {
      const scoreA = numericValue(scoreGetter(a));
      const scoreB = numericValue(scoreGetter(b));
      if (scoreA !== scoreB) {
        return scoreB - scoreA;
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }

  function renderOpenSource(value) {
    const normalized = value === "Yes" ? "yes" : "no";
    return `<span class="status-pill ${normalized}">${escapeHtml(value || "No")}</span>`;
  }

  function getFilteredRows() {
    return getLeaderboardRows().filter((row) => {
      return !openSourceOnly.checked || row.openSource === "Yes";
    });
  }

  function renderOverview(rows) {
    const sortedRows = sortRowsBy(rows.slice(), (row) => row.average);

    if (!rows.length) {
      leaderboardBody.innerHTML = `<tr><td class="empty-row" colspan="6">No leaderboard rows yet.</td></tr>`;
      return;
    }

    leaderboardBody.innerHTML = sortedRows.map((row, index) => `
      <tr>
        <td class="rank-cell">${index + 1}</td>
        <td class="policy-cell">${escapeHtml(row.policyName)}</td>
        <td class="avg-cell">${formatScore(row.contextIndependentAverage)}</td>
        <td class="avg-cell">${formatScore(row.contextDependentAverage)}</td>
        <td class="avg-cell">${formatAverage(row.average)}</td>
        <td>${renderOpenSource(row.openSource)}</td>
      </tr>
    `).join("");
  }

  function renderTaskTables(rows) {
    taskScoreTables.innerHTML = taskGroups.map((group) => {
      const sortedRows = sortRowsBy(rows.slice(), (row) => row[group.averageKey]);
      const taskHeadings = group.tasks.map((task) => `<th scope="col">${escapeHtml(task.label)}</th>`).join("");
      const bodyRows = sortedRows.map((row, index) => {
        const taskCells = group.tasks.map((task) => {
          return `<td>${formatScore(row.scores && row.scores[task.key])}</td>`;
        }).join("");
        return `
          <tr>
            <td class="rank-cell">${index + 1}</td>
            <td class="policy-cell">${escapeHtml(row.policyName)}</td>
            ${taskCells}
            <td class="avg-cell">${formatScore(row[group.averageKey])}</td>
          </tr>
        `;
      }).join("");

      return `
        <section class="score-table-block">
          <h3>${escapeHtml(group.label)} Task Scores (%)</h3>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">Rank</th>
                  <th class="policy-heading" scope="col">Policy</th>
                  ${taskHeadings}
                  <th scope="col">Average</th>
                </tr>
              </thead>
              <tbody>${bodyRows || `<tr><td class="empty-row" colspan="${group.tasks.length + 3}">No rows available.</td></tr>`}</tbody>
            </table>
          </div>
        </section>
      `;
    }).join("");
  }

  function capabilityAverage(row, group, capabilityKey) {
    const values = group.tasks
      .filter((task) => task.capabilities.includes(capabilityKey))
      .map((task) => row.scores && row.scores[task.key])
      .filter((value) => Number.isFinite(Number(value)))
      .map(Number);

    if (!values.length) {
      return null;
    }
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  function renderCapabilityTables(rows) {
    capabilityScoreTables.innerHTML = taskGroups.map((group) => {
      const capabilityHeadings = group.capabilities.map((capability) => {
        return `<th scope="col">${escapeHtml(capability.label)}</th>`;
      }).join("");
      const coverageRows = group.tasks.map((task) => {
        const coverageCells = group.capabilities.map((capability) => {
          return `<td>${task.capabilities.includes(capability.key) ? "Yes" : "-"}</td>`;
        }).join("");
        return `
          <tr>
            <td class="policy-cell">${escapeHtml(task.label)}</td>
            ${coverageCells}
          </tr>
        `;
      }).join("");
      const sortedRows = sortRowsBy(rows.slice(), (row) => row[group.averageKey]);
      const bodyRows = sortedRows.map((row, index) => {
        const capabilityCells = group.capabilities.map((capability) => {
          return `<td>${formatScore(capabilityAverage(row, group, capability.key))}</td>`;
        }).join("");
        return `
          <tr>
            <td class="rank-cell">${index + 1}</td>
            <td class="policy-cell">${escapeHtml(row.policyName)}</td>
            ${capabilityCells}
            <td class="avg-cell">${formatScore(row[group.averageKey])}</td>
          </tr>
        `;
      }).join("");

      return `
        <section class="score-table-block">
          <h3>${escapeHtml(group.label)} Capability Scores (%)</h3>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">Rank</th>
                  <th class="policy-heading" scope="col">Policy</th>
                  ${capabilityHeadings}
                  <th scope="col">Average</th>
                </tr>
              </thead>
              <tbody>${bodyRows || `<tr><td class="empty-row" colspan="${group.capabilities.length + 3}">No rows available.</td></tr>`}</tbody>
            </table>
          </div>
          <h4>Task Coverage</h4>
          <div class="table-wrap compact-table">
            <table>
              <thead>
                <tr>
                  <th class="policy-heading" scope="col">Task</th>
                  ${capabilityHeadings}
                </tr>
              </thead>
              <tbody>${coverageRows}</tbody>
            </table>
          </div>
        </section>
      `;
    }).join("");
  }

  function renderLeaderboard() {
    const rows = getFilteredRows();
    renderOverview(rows);
    renderTaskTables(rows);
    renderCapabilityTables(rows);
    lastUpdated.textContent = rows.length ? formatDate(latestDate(rows)) : "-";
  }

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function generateAverage() {
    return Number(randomBetween(15, 85).toFixed(3));
  }

  function updateLocalRow(id, patch) {
    const rows = getLocalRows();
    const index = rows.findIndex((row) => row.id === id);
    if (index >= 0) {
      rows[index] = Object.assign({}, rows[index], patch, { updatedAt: new Date().toISOString() });
      saveLocalRows(rows);
    }
  }

  function runLocalEvaluation(rowId) {
    toast("Submission queued. Evaluation is running.");

    setTimeout(() => {
      updateLocalRow(rowId, {
        average: generateAverage(),
        status: "Done"
      });
      renderLeaderboard();
      toast("Evaluation finished. Result added to leaderboard.");
      setTimeout(() => showPage("leaderboard"), 700);
    }, Math.floor(randomBetween(2200, 4800)));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(submitForm);
    const file = data.get("modelFile");

    if (!file || !file.name) {
      toast("Choose a model file.");
      return;
    }

    const serverPort = Number(data.get("serverPort"));
    if (!serverPort || serverPort < 1 || serverPort > 65535) {
      toast("Server port must be between 1 and 65535.");
      return;
    }

    const now = new Date().toISOString();
    const submissionId = makeId("submission");
    const rowId = makeId("local");

    const submission = {
      id: submissionId,
      leaderboardRowId: rowId,
      name: String(data.get("name") || "").trim(),
      affiliation: String(data.get("affiliation") || "").trim(),
      email: String(data.get("email") || "").trim(),
      apiSupport: data.get("apiSupport"),
      policyName: String(data.get("policyName") || "").trim(),
      serverIp: String(data.get("serverIp") || "").trim(),
      serverPort,
      openSource: data.get("openSource"),
      notes: String(data.get("notes") || "").trim(),
      modelFileName: file.name,
      createdAt: now,
      updatedAt: now
    };

    const row = {
      id: rowId,
      policyName: submission.policyName,
      average: null,
      openSource: submission.openSource,
      contextIndependentAverage: null,
      contextDependentAverage: null,
      sourceLabel: "Submission",
      locked: false,
      scores: {},
      status: "Queued",
      updatedAt: now
    };

    saveSubmissions(getSubmissions().concat(submission));
    saveLocalRows(getLocalRows().concat(row));
    runLocalEvaluation(rowId);
  }

  function clearSubmitForm() {
    submitForm.reset();
    toast("Form cleared.");
  }

  function bindEvents() {
    navTabs.forEach((tab) => {
      tab.addEventListener("click", () => showPage(tab.dataset.pageTarget));
    });
    leaderboardViewTabs.forEach((tab) => {
      tab.addEventListener("click", () => showLeaderboardView(tab.dataset.leaderboardViewTarget));
    });
    submitForm.addEventListener("submit", handleSubmit);
    document.getElementById("clear-form").addEventListener("click", clearSubmitForm);
    document.getElementById("refresh-leaderboard").addEventListener("click", renderLeaderboard);
    document.getElementById("export-leaderboard").addEventListener("click", () => {
      const payload = JSON.stringify(getLeaderboardRows(), null, 2);
      const blob = new Blob([payload], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "longbench-leaderboard.json";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast("Leaderboard JSON exported.");
    });
    openSourceOnly.addEventListener("change", renderLeaderboard);
  }

  function init() {
    bindEvents();
    renderLeaderboard();
    showLeaderboardView("overview");
    const hash = window.location.hash.replace("#", "");
    showPage(["submit", "leaderboard"].includes(hash) ? hash : "submit");
  }

  init();
}());
