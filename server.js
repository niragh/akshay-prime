const http = require('http');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const PORT = process.env.PORT || 3001;
const EXCEL_FILE = path.join(__dirname, 'appointments.xlsx');
const SHEET_NAME = 'Appointments';

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

const COLUMN_WIDTHS = [
  { wch: 18 }, // Ref ID
  { wch: 22 }, // Timestamp
  { wch: 24 }, // Patient Name
  { wch: 18 }, // Phone
  { wch: 28 }, // Email
  { wch: 35 }, // Reason for Visit
  { wch: 18 }, // Preferred Date
  { wch: 22 }, // Preferred Time
  { wch: 35 }, // Notes
  { wch: 15 }  // Status
];

function getExistingAppointments() {
  if (!fs.existsSync(EXCEL_FILE)) {
    return [];
  }
  try {
    const wb = XLSX.readFile(EXCEL_FILE);
    const ws = wb.Sheets[SHEET_NAME] || wb.Sheets[wb.SheetNames[0]];
    if (!ws) return [];
    return XLSX.utils.sheet_to_json(ws) || [];
  } catch (err) {
    console.error('Error reading Excel file:', err);
    return [];
  }
}

function saveAppointmentsToExcel(appointments) {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(appointments);
  ws['!cols'] = COLUMN_WIDTHS;
  XLSX.utils.book_append_sheet(wb, ws, SHEET_NAME);
  XLSX.writeFile(wb, EXCEL_FILE);
  console.log(`[Excel] Saved ${appointments.length} appointment(s) to ${EXCEL_FILE}`);
}

function handlePostAppointment(req, res) {
  let body = '';
  req.on('data', chunk => { body += chunk.toString(); });
  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      const timestamp = new Date().toLocaleString('en-AU', {
        timeZone: 'Australia/Melbourne',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      const refId = 'PA-' + Date.now().toString().slice(-6);

      const newRecord = {
        'Reference ID': refId,
        'Date & Time': timestamp,
        'Patient Full Name': data.name || data.patient_name || 'Anonymous',
        'Phone Number': data.phone || data.patient_phone || '',
        'Email Address': data.email || data.patient_email || '',
        'Reason for Visit': data.service || data.service_reason || 'General Consultation',
        'Preferred Date': data.date || data.preferred_date || 'Earliest Available',
        'Preferred Time': data.time || data.preferred_time || 'Anytime',
        'Notes': data.notes || data.patient_notes || '',
        'Status': 'New Inquiry'
      };

      const existing = getExistingAppointments();
      existing.push(newRecord);
      saveAppointmentsToExcel(existing);

      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      res.end(JSON.stringify({
        success: true,
        message: 'Appointment successfully added to Excel spreadsheet!',
        refId: refId,
        totalRecords: existing.length,
        file: 'appointments.xlsx',
        record: newRecord
      }));
    } catch (err) {
      console.error('Failed to parse appointment payload:', err);
      res.writeHead(400, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
  });
}

const server = http.createServer((req, res) => {
  // CORS support
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    });
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = parsedUrl.pathname;

  // API Endpoints
  if (req.method === 'POST' && (pathname === '/api/appointments' || pathname === '/api/submit-form')) {
    handlePostAppointment(req, res);
    return;
  }

  if (req.method === 'GET' && pathname === '/api/appointments') {
    const list = getExistingAppointments();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, count: list.length, appointments: list }));
    return;
  }

  if (req.method === 'GET' && (pathname === '/api/appointments/download' || pathname === '/appointments.xlsx')) {
    if (!fs.existsSync(EXCEL_FILE)) {
      // create empty template if not exists
      saveAppointmentsToExcel([]);
    }
    const stat = fs.statSync(EXCEL_FILE);
    res.writeHead(200, {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Length': stat.size,
      'Content-Disposition': 'attachment; filename="appointments.xlsx"'
    });
    fs.createReadStream(EXCEL_FILE).pipe(res);
    return;
  }

  // Static File Serving
  if (pathname === '/') {
    pathname = '/index.html';
  } else if (!path.extname(pathname)) {
    // If no extension, check if [pathname].html exists
    if (fs.existsSync(path.join(__dirname, pathname + '.html'))) {
      pathname = pathname + '.html';
    }
  }

  const filePath = path.join(__dirname, pathname);
  
  // Security check: ensure within __dirname
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

function startServer(portToTry) {
  server.listen(portToTry, () => {
    console.log(`[Prime Audiology Server] Running on http://localhost:${portToTry}`);
    console.log(`[Excel Storage] Data will be written to: ${EXCEL_FILE}`);
  });
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const nextPort = PORT === 3000 ? 3001 : 3002;
    console.warn(`[Port in use] Port ${PORT} busy, retrying on port ${nextPort}...`);
    startServer(nextPort);
  } else {
    console.error('Server error:', err);
  }
});

startServer(PORT);

