// This file will be served from the /public directory.

// --- Data Model ---
// Students array is now loaded from the server via window.studentsData
const students = window.studentsData || [
  { roll: "25CS01", name: "MOHAMMAD SAHIL", email: "sahilansari74808@gmail.com" },
  { roll: "25CS02", name: "NANDNI", email: "nandinibaghel171@gmail.com" },
  // Fallback data in case server data is not available
];
// Attendance records: { date: { subject: { roll: true/false } } }
let attendance = {};

// Load attendance from localStorage
function loadAttendance() {
  try {
    const data = localStorage.getItem("attendance_data");
    attendance = data ? JSON.parse(data) : {};
  } catch (e) { attendance = {}; }
}
function saveAttendance() {
  try {
    localStorage.setItem("attendance_data", JSON.stringify(attendance));
  } catch (e) {}
}

let currentView = "dashboard";
let editingStudent = null;

function formatDate(date) {
  return date.toISOString().split('T')[0];
}
function todayStr() {
  return formatDate(new Date());
}
function showToast(msg, type = "success") {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.setAttribute('role', 'alert');
  toast.className = `toast-enter px-4 py-2 rounded-lg shadow text-sm font-medium ${type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"} transition`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.classList.add('toast-enter-active'), 10);
  setTimeout(() => {
    toast.classList.remove('toast-enter-active');
    toast.classList.add('toast-exit-active');
    setTimeout(() => container.removeChild(toast), 300);
  }, 2200);
}

// Updated function to get attendance for a specific date and subject
function getAttendanceForDate(date, subject) {
  return (attendance[date] && attendance[date][subject]) || {};
}

// Updated function to get daily attendance stats
function getAttendanceStats(date) {
  let present = 0, absent = 0;
  let presentRolls = new Set();
  if (attendance[date]) {
    for (const subject in attendance[date]) {
      for (const roll in attendance[date][subject]) {
        if (attendance[date][subject][roll]) {
          presentRolls.add(roll);
        }
      }
    }
  }
  present = presentRolls.size;
  absent = students.length - present;
  return { present, absent, total: students.length };
}

// Updated function to get student attendance percentage
function getStudentAttendancePercent(roll) {
  let total = 0, present = 0;
  for (const date in attendance) {
    for (const subject in attendance[date]) {
      total++;
      if (attendance[date][subject][roll]) present++;
    }
  }
  return total ? Math.round((present / total) * 100) : 0;
}

// Updated function to get average attendance
function getAverageAttendancePercent() {
  if (!students.length) return 0;
  let sum = 0;
  students.forEach(s => { sum += getStudentAttendancePercent(s.roll); });
  return Math.round(sum / students.length);
}
function getDateRange(start, end) {
  const dates = [];
  let d = new Date(start);
  const e = new Date(end);
  while (d <= e) {
    dates.push(formatDate(d));
    d.setDate(d.getDate() + 1);
  }
  return dates;
}

// --- SPA Navigation ---
function switchView(view) {
  document.querySelectorAll('.view-section').forEach(sec => sec.classList.add('hidden'));
  document.getElementById('view-' + view).classList.remove('hidden');
  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('bg-blue-200'));
  document.querySelector(`.nav-link[data-view="${view}"]`).classList.add('bg-blue-200');
  currentView = view;
  if (view === "dashboard") renderDashboard();
  if (view === "attendance") renderAttendance();
  if (view === "students") renderStudents();
}
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    switchView(link.dataset.view);
    if (window.innerWidth < 768) closeSidebar();
  });
});

function openSidebar() {
  document.getElementById('sidebar').classList.remove('-translate-x-full');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.add('-translate-x-full');
}
document.getElementById('sidebarToggle').onclick = openSidebar;
document.getElementById('sidebarClose').onclick = closeSidebar;
window.addEventListener('resize', () => {
  if (window.innerWidth >= 768) openSidebar();
  else closeSidebar();
});
if (window.innerWidth < 768) closeSidebar();

function updateHeaderDate() {
  const d = new Date();
  document.getElementById('currentDate').textContent = d.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
}
updateHeaderDate();

// --- Dashboard ---
function renderDashboard() {
  loadAttendance();
  const today = todayStr();
  const stats = getAttendanceStats(today);
  document.getElementById('cardTotal').textContent = students.length;
  document.getElementById('cardPresent').textContent = stats.present;
  document.getElementById('cardAbsent').textContent = stats.absent;
  document.getElementById('cardAvg').textContent = getAverageAttendancePercent() + "%";
  // Bar chart: last 7 days
  const chart = document.getElementById('dashboardChart');
  chart.innerHTML = '';
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(formatDate(d));
  }
  const max = students.length || 1;
  dates.forEach((date, idx) => {
    const s = getAttendanceStats(date);
    const barH = Math.round((s.present / max) * 60);
    chart.innerHTML += `<rect x="${idx*40+10}" y="${70-barH}" width="24" height="${barH}" rx="6" fill="#38bdf8" />
      <text x="${idx*40+22}" y="78" text-anchor="middle" font-size="10" fill="#64748b">${date.slice(5)}</text>`;
  });

  // Individual Student Performance Dropdown
  const select = document.getElementById('studentSelect');
  select.innerHTML = '<option value="">Select Student</option>';
  students.forEach(s => {
    select.innerHTML += `<option value="${s.roll}">${s.roll} - ${s.name}</option>`;
  });
  document.getElementById('studentPerformance').innerHTML = '';
}

document.getElementById('studentSelect').onchange = function() {
  const roll = this.value;
  if (!roll) {
    document.getElementById('studentPerformance').innerHTML = '';
    return;
  }
  let total = 0, present = 0, absentDates = [];
  for (const date in attendance) {
    for (const subject in attendance[date]) {
      total++;
      if (attendance[date][subject][roll]) present++;
      else absentDates.push(`${date} (${subject})`);
    }
  }
  let percent = total ? Math.round((present / total) * 100) : 0;
  let html = `<div><strong>Attendance %:</strong> ${percent}%</div>`;
  html += `<div><strong>Present:</strong> ${present} / ${total}</div>`;
  if (absentDates.length) {
    html += `<div class="mt-2 text-red-600"><strong>Absent on:</strong> ${absentDates.join(', ')}</div>`;
  }
  document.getElementById('studentPerformance').innerHTML = html;
};

// --- Mark Attendance ---
function renderAttendance() {
  loadAttendance();
  const dateInput = document.getElementById('attendanceDate');
  const subjectSelect = document.getElementById('subjectSelect');
  if (!dateInput.value) dateInput.value = todayStr();
  const tbody = document.getElementById('attendanceTable');
  
  const date = dateInput.value;
  const subject = subjectSelect.value;
  
  if (!subject) {
    tbody.innerHTML = '<tr><td colspan="3" class="px-4 py-2 text-center text-gray-500">Please select a subject.</td></tr>';
    return;
  }
  
  tbody.innerHTML = '';
  const att = getAttendanceForDate(date, subject);
  students.forEach(s => {
    const checked = att[s.roll] === true ? "checked" : "";
    tbody.innerHTML += `
      <tr>
        <td class="px-4 py-2">${s.roll}</td>
        <td class="px-4 py-2">${s.name}</td>
        <td class="px-4 py-2 text-center">
          <input type="checkbox" class="focus-ring present-checkbox w-8 h-8 cursor-pointer" style="accent-color:#38bdf8;" data-roll="${s.roll}" aria-label="Present for ${s.name}" ${checked}>
        </td>
      </tr>
    `;
  });
  document.querySelectorAll('.present-checkbox').forEach(cb => {
    cb.onchange = () => {
      const roll = cb.dataset.roll;
      if (!attendance[date]) attendance[date] = {};
      if (!attendance[date][subject]) attendance[date][subject] = {};
      attendance[date][subject][roll] = cb.checked;
      saveAttendance();
    };
  });
}

// Call this after saving attendance
function notifyAbsentees(date, subject) {
  const absentees = students.filter(s => {
    const isPresent = (attendance[date] && attendance[date][subject] && attendance[date][subject][s.roll] === true);
    const hasValidEmail = s.email && s.email.trim().length > 3;
    return !isPresent && hasValidEmail;
  });
  
  if (!absentees.length) {
    showToast('No absentees with valid emails found', 'error');
    return;
  }
  
  console.log('Sending emails to absentees:', absentees.map(s => ({roll: s.roll, name: s.name, email: s.email})));
  
  fetch('/send-absent-mails', { // Note: Removed '/api' prefix
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ date, subject, absentees })
  })
  .then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  })
  .then(data => {
    const sent = data.sent ? data.sent.filter(r => r.status === 'sent').length : 0;
    const failed = data.sent ? data.sent.filter(r => r.status === 'error').length : 0;
    showToast(`Absentee emails: ${sent} sent, ${failed} failed`, failed ? 'error' : 'success');
    console.log('Email results:', data.sent);
  })
  .catch(error => {
    console.error('Email sending failed:', error);
    showToast('Failed to send emails: ' + error.message, 'error');
  });
}

document.getElementById('attendanceForm').onsubmit = function(e) {
  e.preventDefault();
  const date = document.getElementById('attendanceDate').value;
  const subject = document.getElementById('subjectSelect').value;
  if (!subject) return showToast("Please select a subject.", "error");
  saveAttendance();
  showToast(`Attendance saved for ${date} (${subject})`, "success");
  renderDashboard();
};
document.getElementById('sendAbsenteeEmails').onclick = function() {
  const date = document.getElementById('attendanceDate').value;
  const subject = document.getElementById('subjectSelect').value;
  if (!subject) return showToast("Please select a subject.", "error");
  
  // Create confirmation dialog
  const dialog = document.createElement('div');
  dialog.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  dialog.innerHTML = `
    <div class="bg-white rounded-xl p-6 max-w-md w-full mx-4">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Confirm Sending Emails</h3>
      <p class="text-gray-600 mb-6">Are you sure you want to send absence notifications for <span class="font-medium">${subject}</span> on <span class="font-medium">${date}</span>?</p>
      <div class="flex justify-end space-x-3">
        <button id="cancelSend" class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
        <button id="confirmSend" class="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700">Send Emails</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(dialog);
  
  // Handle cancel
  dialog.querySelector('#cancelSend').onclick = function() {
    document.body.removeChild(dialog);
  };
  
  // Handle confirm
  dialog.querySelector('#confirmSend').onclick = function() {
    document.body.removeChild(dialog);
    notifyAbsentees(date, subject);
  };
};
document.getElementById('resetAttendance').onclick = function() {
  const date = document.getElementById('attendanceDate').value;
  const subject = document.getElementById('subjectSelect').value;
  if (!subject) return showToast("Please select a subject.", "error");
  if (attendance[date] && attendance[date][subject]) {
    delete attendance[date][subject];
    if (Object.keys(attendance[date]).length === 0) {
        delete attendance[date];
    }
    saveAttendance();
  }
  renderAttendance();
  showToast(`Attendance reset for ${date} (${subject})`, "success");
};
document.getElementById('attendanceDate').onchange = renderAttendance;
document.getElementById('subjectSelect').onchange = renderAttendance;

// --- Students (Admin) ---
function renderStudents() {
  const tbody = document.getElementById('studentsTable');
  tbody.innerHTML = '';
  students.forEach(s => {
    const percent = getStudentAttendancePercent(s.roll);
    tbody.innerHTML += `
      <tr class="${Number.isInteger(+s.roll) && +s.roll % 2 === 0 ? 'bg-blue-50' : ''}">
        <td class="px-4 py-2">${s.roll}</td>
        <td class="px-4 py-2">${s.name}</td>
        <td class="px-4 py-2 text-center">${percent}%</td>
        <td class="px-4 py-2 text-center">
          <button class="edit-btn px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 focus-ring" data-roll="${s.roll}" aria-label="Edit ${s.name}">Edit</button>
          <button class="delete-btn px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 focus-ring" data-roll="${s.roll}" aria-label="Delete ${s.name}">Delete</button>
        </td>
      </tr>
    `;
  });
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.onclick = () => openStudentModal('edit', btn.dataset.roll);
  });
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.onclick = () => {
      const roll = btn.dataset.roll;
      students = students.filter(s => s.roll !== roll);
      showToast("Student deleted.", "success");
      renderStudents();
      renderAttendance();
      renderDashboard();
    };
  });
}
document.getElementById('addStudentBtn').onclick = () => openStudentModal('add');

function openStudentModal(mode, roll = null) {
  editingStudent = null;
  document.getElementById('studentModal').classList.remove('hidden');
  document.getElementById('modalTitle').textContent = mode === 'add' ? "Add Student" : "Edit Student";
  document.getElementById('studentForm').reset();
  document.getElementById('modalRoll').disabled = (mode === 'edit');
  if (mode === 'edit') {
    const s = students.find(stu => stu.roll === roll);
    if (s) {
      editingStudent = s;
      document.getElementById('modalRoll').value = s.roll;
      document.getElementById('modalName').value = s.name;
      document.getElementById('modalEmail').value = s.email || '';
    }
  }
}
document.getElementById('modalCancel').onclick = () => {
  document.getElementById('studentModal').classList.add('hidden');
};
document.getElementById('studentForm').onsubmit = function(e) {
  e.preventDefault();
  const roll = document.getElementById('modalRoll').value.trim().toUpperCase();
  const name = document.getElementById('modalName').value.trim().toUpperCase();
  const email = document.getElementById('modalEmail').value.trim().toLowerCase();
  
  if (!roll || !name || !email) {
    showToast("Please fill in all required fields.", "error");
    return;
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast("Please enter a valid email address.", "error");
    return;
  }
  
  if (editingStudent) {
    // Update existing student
    const index = students.findIndex(s => s.roll === editingStudent.roll);
    if (index !== -1) {
      students[index] = { roll, name, email };
      showToast("Student updated.", "success");
    }
  } else {
    // Add new student
    if (students.some(s => s.roll === roll)) {
      showToast("A student with this roll number already exists.", "error");
      return;
    }
    students.push({ roll, name, email });
    showToast("Student added.", "success");
  }
  document.getElementById('studentModal').classList.add('hidden');
  renderStudents();
  renderAttendance();
  renderDashboard();
};

// --- Export Attendance ---
document.getElementById('downloadCSV').onclick = function() {
  const start = document.getElementById('exportStart').value;
  const end = document.getElementById('exportEnd').value;
  if (!start || !end) return showToast("Select date range.", "error");
  const dates = getDateRange(start, end);
  let csv = "Date,Subject,Roll No,Name,Status\n";
  dates.forEach(date => {
    if (attendance[date]) {
      for (const subject in attendance[date]) {
        students.forEach(s => {
          let status = "Absent";
          if (attendance[date][subject][s.roll]) status = "Present";
          csv += `${date},"${subject.replace(/"/g, '""')}",${s.roll},"${s.name.replace(/"/g, '""')}",${status}\n`;
        });
      }
    }
  });
  downloadFile(csv, "attendance.csv", "text/csv");
  showToast("CSV downloaded.", "success");
};
function downloadFile(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
}

// --- Initial Render ---
loadAttendance();
switchView("dashboard");