/**
 * PRIME AUDIOLOGY — INTERACTIVE LOGIC & ACCESSIBILITY SCRIPTS
 * Senior-Friendly UX, Interactive Matrix, 360 Viewer, HSP Checker & Form Routing
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNavigation();
  initStickyHeader();
  initStylesModal();
  init360Viewer();
  initHspChecker();
  initBookingForm();
  if (typeof ExcelManager !== 'undefined') {
    ExcelManager.init();
  }
  initFaqAccordion();
});

/* ==========================================================================
   1. MOBILE NAVIGATION & DRAWER
   ========================================================================== */
function initMobileNavigation() {
  const toggleBtn = document.getElementById('mobileToggleBtn');
  const drawer = document.getElementById('mobileNavDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const closeBtn = document.getElementById('drawerCloseBtn');

  if (!toggleBtn || !drawer || !backdrop) return;

  function openDrawer() {
    drawer.classList.add('open');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  // Close when clicking any nav link inside drawer
  const links = drawer.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   2. STICKY HEADER SCROLL SHADOW
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.style.boxShadow = '0 8px 24px rgba(10, 25, 47, 0.12)';
      header.style.borderColor = '#BFDBFE';
    } else {
      header.style.boxShadow = 'var(--shadow-sm)';
      header.style.borderColor = 'var(--border-light)';
    }
  }, { passive: true });
}

/* ==========================================================================
   3. HEARING AID STYLES DETAIL MODAL
   ========================================================================== */
const styleDetailsData = {
  bte: {
    title: 'Behind-The-Ear (BTE)',
    image: 'assets/images/bte.jpg',
    description: 'The traditional and most versatile hearing aid style. The electronic housing rests comfortably behind the ear and directs clear sound through a thin tube or custom ear mould into the ear canal.',
    pros: [
      'Maximum amplification power for mild through profound hearing loss',
      'Accommodates large, long-lasting rechargeable batteries',
      'Generous tactile buttons—easiest to handle for seniors with dexterity challenges',
      'Durable and highly resistant to natural ear moisture & wax'
    ],
    ideal: 'Seniors seeking maximum durability, straightforward handling, and high-power speech clarity.'
  },
  ric: {
    title: 'Receiver-In-Canal (RIC)',
    image: 'assets/images/ric.jpg',
    description: 'Australia’s most popular modern hearing aid. The speaker (receiver) sits right inside the ear canal, connected by an ultra-thin, virtually invisible wire to the compact body tucked discreetly behind the ear.',
    pros: [
      'Open-fit comfort prevents that "talking inside a barrel" sensation',
      'Discreet and modern aesthetic available in hairline-matching shades',
      'Crisp, natural acoustic quality with direct Bluetooth streaming to iPhone & Android',
      'Overnight lithium-ion charging dock'
    ],
    ideal: 'Patients wanting modern discretion, natural voice clarity, and seamless phone integration.'
  },
  ite: {
    title: 'In-The-Ear (ITE)',
    image: 'assets/images/ite.jpg',
    description: 'Custom-moulded to the precise contours of your outer ear bowl. With no components behind the ear, it avoids interfering with spectacle frames or oxygen tubing.',
    pros: [
      'Custom fabricated to the exact anatomical impression of your ear',
      'Easy one-piece insertion and removal',
      'Sufficient space for volume controls and dual directional microphones',
      'Compatible with glasses without snagging'
    ],
    ideal: 'Seniors who wear glasses full-time and desire an easy-to-insert custom device.'
  },
  itc: {
    title: 'In-The-Canal (ITC)',
    image: 'assets/images/ite.jpg',
    description: 'Sits gently in the lower portion of the ear canal opening. Smaller than a full ITE yet retains convenient Bluetooth streaming and rechargeable options.',
    pros: [
      'Custom cosmetic finish resting in the canal opening',
      'Natural sound pickup utilizing the ear pinna',
      'Good balance of discretion and easy handling'
    ],
    ideal: 'Patients wanting a balance between cosmetic discretion and easy handling.'
  },
  cic: {
    title: 'Completely-In-Canal (CIC)',
    image: 'assets/images/cic-iic.jpg',
    description: 'Moulded to fit deeply into the ear canal, making it almost undetectable from face-to-face angles with only a tiny transparent pull filament visible for removal.',
    pros: [
      'Substantially hidden from side and front view',
      'Reduces wind noise when walking outdoors',
      'Preserves the ear’s natural sound direction cues'
    ],
    ideal: 'Mild to moderate hearing loss patients seeking high cosmetic discretion.'
  },
  iic: {
    title: 'Invisible-In-Canal (IIC)',
    image: 'assets/images/cic-iic.jpg',
    description: 'The pinnacle of miniature hearing technology. Custom engineered to sit deep past the second bend of the ear canal, resting mere millimetres from the eardrum for 100% cosmetic invisibility.',
    pros: [
      'Completely invisible in standard daily interactions',
      'Optimal localization of sounds and natural earphone use',
      'Deep placement requires less power for natural acoustic fidelity'
    ],
    ideal: 'Active individuals seeking absolute cosmetic invisibility.'
  }
};

function initStylesModal() {
  const modal = document.getElementById('styleDetailModal');
  if (!modal) return;

  const modalTitle = document.getElementById('modalStyleTitle');
  const modalImg = document.getElementById('modalStyleImg');
  const modalDesc = document.getElementById('modalStyleDesc');
  const modalPros = document.getElementById('modalStylePros');
  const modalIdeal = document.getElementById('modalStyleIdeal');
  const closeBtn = document.getElementById('closeStyleModalBtn');
  const triggerBtns = document.querySelectorAll('[data-style-target]');

  function openStyleModal(key) {
    const data = styleDetailsData[key];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalImg.src = data.image;
    modalImg.alt = data.title;
    modalDesc.textContent = data.description;
    modalIdeal.textContent = data.ideal;

    modalPros.innerHTML = '';
    data.pros.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> <span>${item}</span>`;
      modalPros.appendChild(li);
    });

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeStyleModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.getAttribute('data-style-target');
      openStyleModal(target);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeStyleModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeStyleModal();
  });
}

/* ==========================================================================
   4. 360-DEGREE SIMULATED PRODUCT VIEWER (PERFORMANCE COMPLIANT)
   ========================================================================== */
function init360Viewer() {
  const slider = document.getElementById('spinSlider');
  const viewerImg = document.getElementById('viewerProductImg');
  const angleLabel = document.getElementById('spinAngleLabel');

  if (!slider || !viewerImg) return;

  // We rotate / scale / perspective tilt the high-res asset cleanly without heavy WebGL 3D engines
  slider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    const rotationY = (val / 100) * 45 - 22.5; // subtle tilt angle
    const brightness = 100 + Math.sin((val / 100) * Math.PI) * 12;
    
    viewerImg.style.transform = `scale(1.05) perspective(600px) rotateY(${rotationY}deg)`;
    viewerImg.style.filter = `brightness(${brightness}%)`;

    if (angleLabel) {
      const degrees = Math.round((val / 100) * 360);
      angleLabel.textContent = `${degrees}° Interactive Rotation`;
    }
  });
}

/* ==========================================================================
   5. HSP & PENSIONER ELIGIBILITY CHECKER (FREEDOM HEARING BENCHMARK)
   ========================================================================== */
function initHspChecker() {
  const options = document.querySelectorAll('.checker-option');
  const resultBox = document.getElementById('checkerResult');
  const resultTitle = document.getElementById('checkerResultTitle');
  const resultText = document.getElementById('checkerResultText');

  if (!options.length || !resultBox) return;

  options.forEach(option => {
    option.addEventListener('click', () => {
      option.classList.toggle('selected');
      evaluateEligibility();
    });
  });

  function evaluateEligibility() {
    const selected = Array.from(options).filter(opt => opt.classList.contains('selected'));
    
    if (selected.length === 0) {
      resultBox.classList.remove('active');
      return;
    }

    resultBox.classList.add('active');
    
    let hasHsp = false;
    let hasDva = false;
    let hasNdis = false;

    selected.forEach(opt => {
      const type = opt.getAttribute('data-eligibility-type');
      if (type === 'pensioner' || type === 'centrelink') hasHsp = true;
      if (type === 'dva' || type === 'adf') hasDva = true;
      if (type === 'ndis') hasNdis = true;
    });

    if (hasDva) {
      resultTitle.textContent = '🎉 You Likely Qualify for 100% Fully-Funded Veteran Care';
      resultText.innerHTML = 'Through the Department of Veterans’ Affairs (DVA Gold or White Card) and Australian Defence Force pathways, your comprehensive hearing assessments, hearing aids, and maintenance supplies are completely funded without out-of-pocket clinic fees.';
    } else if (hasHsp) {
      resultTitle.textContent = '🎉 You Qualify for the Australian Hearing Services Program (HSP)';
      resultText.innerHTML = 'Holding a Pensioner Concession Card or Centrelink Sickness Allowance entitles you to Government-funded hearing assessments and fully-subsidised digital hearing devices with George Sebastian.';
    } else if (hasNdis) {
      resultTitle.textContent = '✅ Eligible via NDIS or Private Health';
      resultText.innerHTML = 'You can access assistive hearing technology through your NDIS plan or on-the-spot HICAPS private health rebates.';
    } else {
      resultTitle.textContent = '✅ Medicare & Private Health Funding Available';
      resultText.innerHTML = 'You are eligible for Medicare rebates with a GP Chronic Disease Management plan and instant HICAPS private health fund claims.';
    }
  }
}

/* ==========================================================================
   6. EXCEL DATA INTEGRATION & BOOKING FORM MANAGEMENT
   ========================================================================== */
const ExcelManager = {
  STORAGE_KEY: 'prime_audiology_appointments_v1',
  API_PORTS: [3001, 3000],

  getLocalRecords() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (err) {
      console.warn('localStorage read error:', err);
      return [];
    }
  },

  saveLocalRecords(records) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(records));
    } catch (err) {
      console.warn('localStorage write error:', err);
    }
  },

  async addRecord(entry) {
    // 1. Always store locally in browser
    const local = this.getLocalRecords();
    local.push(entry);
    this.saveLocalRecords(local);

    // 2. Dispatch to backend API (server.js) to write directly into appointments.xlsx on disk
    let serverSaved = false;
    for (const port of this.API_PORTS) {
      try {
        const url = (window.location.port && Number(window.location.port) === port)
          ? '/api/appointments'
          : `http://localhost:${port}/api/appointments`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const json = await res.json();
          console.log('[Excel Server] Successfully saved to disk:', json);
          serverSaved = true;
          break;
        }
      } catch (e) {
        // Continue to fallback
      }
    }

    return { serverSaved, total: local.length };
  },

  downloadExcelFile() {
    // Check if XLSX library is loaded
    if (typeof XLSX !== 'undefined') {
      const records = this.getLocalRecords();
      const headers = [
        'Reference ID',
        'Date & Time',
        'Patient Full Name',
        'Phone Number',
        'Email Address',
        'Reason for Visit',
        'Preferred Date',
        'Preferred Time',
        'Notes',
        'Status'
      ];

      let sheetData = [];
      if (records.length === 0) {
        sheetData = [headers];
      } else {
        sheetData = [headers].concat(records.map(r => [
          r['Reference ID'] || r.refId || '',
          r['Date & Time'] || r.timestamp || '',
          r['Patient Full Name'] || r.name || '',
          r['Phone Number'] || r.phone || '',
          r['Email Address'] || r.email || '',
          r['Reason for Visit'] || r.service || '',
          r['Preferred Date'] || r.date || '',
          r['Preferred Time'] || r.time || '',
          r['Notes'] || r.notes || '',
          r['Status'] || 'New Inquiry'
        ]));
      }

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(sheetData);
      ws['!cols'] = [
        { wch: 18 }, { wch: 22 }, { wch: 24 }, { wch: 18 }, { wch: 28 },
        { wch: 35 }, { wch: 18 }, { wch: 22 }, { wch: 35 }, { wch: 15 }
      ];
      XLSX.utils.book_append_sheet(wb, ws, 'Appointments');
      XLSX.writeFile(wb, 'appointments.xlsx');
      return;
    }

    // Fallback: download directly from server
    const a = document.createElement('a');
    a.href = 'http://localhost:3001/api/appointments/download';
    a.download = 'appointments.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  },

  updateBadges() {
    const badges = document.querySelectorAll('#excelEntriesCountBadge');
    if (!badges.length) return;

    fetch('http://localhost:3001/api/appointments')
      .then(res => res.json())
      .then(data => {
        const count = data.count || 0;
        badges.forEach(b => {
          b.textContent = `${count} in appointments.xlsx`;
        });
      })
      .catch(() => {
        const count = this.getLocalRecords().length;
        badges.forEach(b => {
          b.textContent = `${count} in appointments.xlsx`;
        });
      });
  },

  init() {
    this.updateBadges();

    // Global listener for download buttons
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('#downloadExcelFromModalBtn, #exportAppointmentsExcelBtn');
      if (btn) {
        e.preventDefault();
        this.downloadExcelFile();
      }
    });
  }
};

function initBookingForm() {
  const form = document.getElementById('appointmentFallbackForm');
  const modal = document.getElementById('confirmationModal');
  const modalClose = document.getElementById('closeConfirmationBtn');
  const summaryName = document.getElementById('summaryPatientName');
  const summaryService = document.getElementById('summaryPatientService');
  const summaryDate = document.getElementById('summaryPatientDate');

  if (!form || !modal) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = form.querySelector('[name="patient_name"]');
    const phoneInput = form.querySelector('[name="patient_phone"]');
    const emailInput = form.querySelector('[name="patient_email"]');
    const serviceInput = form.querySelector('[name="service_reason"]');
    const dateInput = form.querySelector('[name="preferred_date"]');
    const timeInput = form.querySelector('[name="preferred_time"]');
    const notesInput = form.querySelector('[name="patient_notes"]');

    const name = nameInput ? nameInput.value.trim() : '';
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const service = serviceInput ? serviceInput.value : '';
    const date = dateInput ? dateInput.value : '';
    const time = timeInput ? timeInput.value : '';
    const notes = notesInput ? notesInput.value.trim() : '';

    if (!name || !phone || !email || !service) {
      alert('Please fill in your name, phone number, email address, and reason for visit.');
      return;
    }

    const submitBtn = form.querySelector('#submitBookingBtn');
    const originalBtnText = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Saving to Excel & Submitting...';
    }

    // Populate confirmation modal
    if (summaryName) summaryName.textContent = name;
    if (summaryService) summaryService.textContent = service;
    if (summaryDate) summaryDate.textContent = `${date || 'Earliest Available'} (${time || 'Anytime'})`;

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
      'Patient Full Name': name,
      'Phone Number': phone,
      'Email Address': email,
      'Reason for Visit': service,
      'Preferred Date': date || 'Earliest Available',
      'Preferred Time': time || 'Anytime',
      'Notes': notes,
      'Status': 'New Inquiry'
    };

    // Save to Excel
    ExcelManager.addRecord(newRecord).then(result => {
      ExcelManager.updateBadges();

      const detail = document.getElementById('excelModalFileDetail');
      if (detail) {
        detail.textContent = result.serverSaved
          ? `Saved to appointments.xlsx on local disk (${result.total} total)`
          : `Saved to appointments.xlsx (${result.total} total)`;
      }

      console.log('--- APPOINTMENT REQUEST LOGGED TO EXCEL ---');
      console.log('Recipient 1: GEORGESEBASTIAN@primeaudiology.com.au');
      console.log('Recipient 2: admin@primeaudiology.com.au');
      console.log('Payload:', newRecord);

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      form.reset();

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    }).catch(err => {
      console.error('Error saving to Excel:', err);
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      form.reset();

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/* ==========================================================================
   7. ACCORDION FAQ
   ========================================================================== */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const trigger = item.querySelector('.faq-question');
    if (!trigger) return;
    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(i => i.classList.remove('open'));
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
}
