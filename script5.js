// ---------- Data: constructor function + objects (Objects slides) ----------
function Member(name, speaks, learns, level, area, bio) {
  this.name = name;
  this.speaks = speaks;
  this.learns = learns;
  this.level = level;
  this.area = area;
  this.bio = bio;
}

const members = [
  new Member("Simran Kaur", ["Punjabi", "Hindi"], ["English", "French"], "Fluent speaker", "Old City", "Teacher who loves poetry and strong chai. Free on weekends."),
  new Member("Marcus Bell", ["English"], ["Punjabi", "Hindi"], "Beginner", "Ranjit Avenue", "Here for a year and keen to order food without pointing at the menu."),
  new Member("Élodie Martin", ["French", "English"], ["Hindi"], "Intermediate", "Green Avenue", "Cook and traveller. Happy to trade recipes and verbs."),
  new Member("Arjun Mehta", ["Hindi", "English"], ["French", "Spanish"], "Intermediate", "Lawrence Road", "Engineer who studies French on the bus. Evenings work best."),
  new Member("Lucía Romero", ["Spanish", "English"], ["Hindi", "Punjabi"], "Beginner", "Model Town", "Volunteer at the library. Patient and chatty."),
  new Member("Harpreet Singh", ["Punjabi", "English"], ["Spanish"], "Advanced", "Hall Bazaar", "Photographer. Prefers walking conversations.")
];

const languages = ["English", "French", "Hindi", "Punjabi", "Spanish"];

let chats = [
  { person: "Simran Kaur", messages: [
    { me: false, text: "Sat sri akal! Shall we meet Saturday at the café?" },
    { me: true, text: "Sounds great. Could we practise greetings first?" } ] },
  { person: "Élodie Martin", messages: [
    { me: false, text: "Bonjour! Ready for our video call on Thursday?" } ] }
];

let requests = [
  { from: "Marcus Bell", text: "Hi! I'm learning Punjabi and can help you with English.", status: "pending" },
  { from: "Lucía Romero", text: "Hello! Would you like a weekly Spanish and Hindi swap?", status: "pending" }
];

let reports = [];

let currentChat = 0;

// ---------- Helpers ----------
function show(id, html) {
  document.getElementById(id).innerHTML = html;
}

function escapeHtml(text) {
  const element = document.createElement("span");
  element.textContent = text;
  return element.innerHTML;
}

function read(id) {
  return document.getElementById(id).value;
}

function makeOptions(list) {
  let html = "";
  for (let i = 0; i < list.length; i++) {
    html += `<option>${list[i]}</option>`;
  }
  return html;
}

function memberNames() {
  let names = [];
  for (let i = 0; i < members.length; i++) {
    names.push(members[i].name);
  }
  return names;
}

// ---------- Profiles ----------
function profileCard(m) {
  let speaks = "";
  for (let i = 0; i < m.speaks.length; i++) {
    speaks += `<span class="tag">${m.speaks[i]}</span>`;
  }
  let learns = "";
  for (let i = 0; i < m.learns.length; i++) {
    learns += `<span class="tag learn">${m.learns[i]}</span>`;
  }
  return `<article class="card profile">
    <div class="avatar">${m.name.charAt(0)}</div>
    <h3>${m.name}</h3>
    <p class="meta">${m.level} · ${m.area}</p>
    <p>${m.bio}</p>
    <div class="tags"><span>Speaks:</span>${speaks}</div>
    <div class="tags"><span>Learning:</span>${learns}</div>
    <a class="btn btn-small" href="requests.html?to=${encodeURIComponent(m.name)}">Say hello</a>
  </article>`;
}

function showProfiles() {
  const chosen = read("filter-lang");
  let html = "";
  for (let i = 0; i < members.length; i++) {
    if (chosen === "all" || members[i].speaks.indexOf(chosen) !== -1) {
      html += profileCard(members[i]);
    }
  }
  show("profile-grid", html);
}

// ---------- Partner matching (filter) ----------
function findMatches() {
  const iSpeak = read("my-speak");
  const iLearn = read("my-learn");
  const found = members.filter(function (m) {
    return m.speaks.indexOf(iLearn) !== -1 && m.learns.indexOf(iSpeak) !== -1;
  });
  if (found.length === 0) {
    show("match-results", '<p class="empty">No exact matches yet. Try another pair of languages, or <a href="../folder-1-members-and-partners/members.html">browse all members</a>.</p>');
    return;
  }
  let html = "";
  for (let i = 0; i < found.length; i++) {
    html += profileCard(found[i]);
  }
  show("match-results", html);
}

// ---------- Conversations ----------
function showChatList() {
  let html = "";
  for (let i = 0; i < chats.length; i++) {
    let style = "";
    if (i === currentChat) {
      style = "active";
    }
    html += `<li><button class="${style}" onclick="openChat(${i})">${chats[i].person}</button></li>`;
  }
  show("chat-list", html);
}

function openChat(i) {
  currentChat = i;
  showChatList();
  showMessages();
}

function showMessages() {
  const chat = chats[currentChat];
  show("chat-title", "Chat with " + chat.person);
  let html = "";
  for (let i = 0; i < chat.messages.length; i++) {
    let style = "bubble";
    if (chat.messages[i].me) {
      style = "bubble me";
    }
    html += `<div class="${style}">${escapeHtml(chat.messages[i].text)}</div>`;
  }
  show("chat-messages", html);
}

function sendMessage() {
  const text = read("chat-input").trim();
  if (text === "") {
    return;
  }
  chats[currentChat].messages.push({ me: true, text: text });
  document.getElementById("chat-input").value = "";
  saveDemo();
  showMessages();
}

// ---------- Requests (try / catch / finally) ----------
function sendRequest() {
  let note = "";
  try {
    if (read("req-msg").trim() === "") {
      throw new Error("Please write a short introduction first.");
    }
    note = `Request sent to ${read("req-to")}. They will reply once they accept.`;
    document.getElementById("req-msg").value = "";
  } catch (error) {
    note = error.message;
  } finally {
    show("req-note", note);
  }
}

function showInbox() {
  let html = "";
  for (let i = 0; i < requests.length; i++) {
    const r = requests[i];
    html += `<li><strong>${r.from}</strong><br>${r.text}`;
    if (r.status === "pending") {
      html += `<div class="actions">
        <button class="btn btn-small" onclick="answerRequest(${i}, 'accepted')">Accept</button>
        <button class="btn btn-small btn-quiet" onclick="answerRequest(${i}, 'declined')">Decline</button>
      </div>`;
    } else if (r.status === "accepted") {
      html += '<p class="status">Accepted. You can message this member below.</p>';
    } else {
      html += '<p class="status">Declined.</p>';
    }
    html += "</li>";
  }
  show("inbox", html);
}

function answerRequest(i, answer) {
  if (requests[i].status !== "pending") return;
  requests[i].status = answer;
  if (answer === "accepted") {
    chats.push({ person: requests[i].from, messages: [{ me: false, text: requests[i].text }] });
    openChat(chats.length - 1);
  }
  saveDemo();
  showInbox();
}

// ---------- Reporting and moderation ----------
function sendReport() {
  let note = "";
  try {
    const details = read("rep-details");
    if (details.trim() === "") {
      throw new Error("Please tell us what happened so a moderator can help.");
    }
    reports.push({ who: read("rep-who"), reason: read("rep-reason"), details: details, status: "open" });
    saveDemo();
    note = "Report saved for this demo session.";
    document.getElementById("rep-details").value = "";
  } catch (error) {
    note = error.message;
  } finally {
    show("rep-note", note);
  }
}

// Share demo changes between pages in the current browser tab.
const demoKey = "convo-together-demo";

function saveDemo() {
  try {
    sessionStorage.setItem(demoKey, JSON.stringify({ chats, requests, reports }));
  } catch {
    // The current page still works if browser storage is unavailable.
  }
}

function startPage() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(demoKey));
    if (saved) ({ chats, requests, reports = [] } = saved);
  } catch {
    // Use the sample data when storage is unavailable.
  }

  if (document.getElementById("stat-members")) {
    show("stat-members", members.length * 40);
  }
  if (document.getElementById("filter-lang")) {
    show("filter-lang", '<option value="all">Any language</option>' + makeOptions(languages));
    showProfiles();
  }
  if (document.getElementById("my-speak")) {
    show("my-speak", makeOptions(languages));
    show("my-learn", makeOptions(languages));
    document.getElementById("my-learn").value = "Punjabi";
  }
  if (document.getElementById("chat-list")) {
    openChat(0);
  }
  if (document.getElementById("req-to")) {
    show("req-to", makeOptions(memberNames()));
    const recipient = new URLSearchParams(location.search).get("to");
    if (memberNames().includes(recipient)) {
      document.getElementById("req-to").value = recipient;
    }
    showInbox();
  }
  if (document.getElementById("rep-who")) {
    show("rep-who", makeOptions(memberNames()));
  }
}

startPage();
window.addEventListener("pageshow", function (event) {
  if (event.persisted) startPage();
});
