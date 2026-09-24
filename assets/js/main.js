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
   6. DUAL BOOKING FORM WITH EMAIL ROUTING SIMULATION
   ========================================================================== */
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

    const name = form.querySelector('[name="patient_name"]').value.trim();
    const phone = form.querySelector('[name="patient_phone"]').value.trim();
    const email = form.querySelector('[name="patient_email"]').value.trim();
    const service = form.querySelector('[name="service_reason"]').value;
    const date = form.querySelector('[name="preferred_date"]').value;
    const time = form.querySelector('[name="preferred_time"]').value;

    if (!name || !phone || !email || !service) {
      alert('Please fill in your name, phone number, email address, and reason for visit.');
      return;
    }

    // Populate confirmation modal
    if (summaryName) summaryName.textContent = name;
    if (summaryService) summaryService.textContent = service;
    if (summaryDate) summaryDate.textContent = `${date || 'Earliest Available'} (${time || 'Anytime'})`;

    // Simulated email routing to the required endpoints
    console.log('--- APPOINTMENT REQUEST DISPATCHED ---');
    console.log('Recipient 1: GEORGESEBASTIAN@primeaudiology.com.au');
    console.log('Recipient 2: admin@primeaudiology.com.au');
    console.log('Payload:', { name, phone, email, service, date, time });

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    form.reset();
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
