/* ============================================================
   JAIN University – Spot Counselling 2026
   registration.js  |  Multi-step form logic, validation, security
   ============================================================ */

(function () {
  'use strict';

  /* ── City / venue data (single source of truth) ── */
  var CITY_DATA = {
    'Lucknow':    { state:'Uttar Pradesh', date:'12th April 2026', venue:'Hotel Diamond / The Royal Vista' },
    'Prayagraj':  { state:'Uttar Pradesh', date:'16th April 2026', venue:'Hotel Ravisha Continental' },
    'Varanasi':   { state:'Uttar Pradesh', date:'19th April 2026', venue:'Hotel Diamond / The Royal Vista' },
    'Gorakhpur':  { state:'Uttar Pradesh', date:'23rd April 2026', venue:'Ramada by Wyndham / Nirvana Sarovar' },
    'Guwahati':   { state:'Assam',          date:'19th April 2026', venue:'Hotel Greenwood' },
    'Jorhat':     { state:'Assam',          date:'23rd April 2026', venue:'D Royal Palm' },
    'Dibrugarh':  { state:'Assam',          date:'25th April 2026', venue:'Hotel Tea County' },
    'Tinsukia':   { state:'Assam',          date:'26th April 2026', venue:'Royal Highness' },
    'Patna':      { state:'Bihar',          date:'3rd May 2026',    venue:'Red Velvet – Income Tax' },
    'Ahmedabad':  { state:'Gujarat',        date:'26th April 2026', venue:'Courtyard by Marriott Ahmedabad' },
    'Ranchi':     { state:'Jharkhand',      date:'19th April 2026', venue:'Hotel Landmark' },
    'Kannur':     { state:'Kerala',         date:'26th April 2026', venue:'Hotel Royal Omars Kannur' },
    'Dimapur':    { state:'Nagaland',       date:'21st April 2026', venue:'Hotel Akasha' },
    'Puducherry': { state:'Tamil Nadu',     date:'19th April 2026', venue:'Prince Hall' },
    'Hosur':      { state:'Tamil Nadu',     date:'3rd May 2026',    venue:'Kannika Convention Hall' },
    'Agartala':   { state:'Tripura',        date:'3rd May 2026',    venue:'Hotel Parkline' },
    'Vijayawada': { state:'Andhra Pradesh', date:'25th April 2026', venue:'Fortune Murali Park' }
  };

  var currentStep = 1;
  var TOTAL_STEPS = 3;

  /* ── DOM helpers ── */
  function $(id) { return document.getElementById(id); }
  function setText(id, val) { var el = $(id); if (el) el.textContent = val; }
  function show(id) { var el = $(id); if (el) el.style.display = 'block'; }
  function hide(id) { var el = $(id); if (el) el.style.display = 'none'; }

  /* ── Sanitise (for any dynamic insertion) ── */
  function sanitise(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#x27;');
  }

  /* ── Validators ── */
  function isEmail(v) { return /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(v); }
  function isPhone(v) { return /^\d{10}$/.test(v); }
  function isName(v)  { return v.length >= 2 && /^[a-zA-Z\s'-]+$/.test(v); }

  function setFieldState(fieldId, errId, valid, msg) {
    var el = $(fieldId);
    var err = $(errId);
    if (!el) return valid;
    el.classList.toggle('is-error', !valid);
    el.setAttribute('aria-invalid', !valid);
    if (err) {
      err.textContent = msg || '';
      err.classList.toggle('show', !valid);
    }
    return valid;
  }

  /* ── Per-step validation ── */
  function validateStep(step) {
    var ok = true;

    function check(fieldId, errId, test, msg) {
      var el = $(fieldId);
      if (!el) return;
      var valid = test(el.value.trim());
      if (!setFieldState(fieldId, errId, valid, msg)) ok = false;
    }

    if (step === 1) {
      check('firstName', 'errFirstName', isName,  'Enter a valid first name (letters only)');
      check('lastName',  'errLastName',  isName,  'Enter a valid last name (letters only)');
      check('phone',     'errPhone',     isPhone, 'Enter a valid 10-digit mobile number');
      check('email',     'errEmail',     isEmail, 'Enter a valid email address');
      check('gender',    'errGender',    function(v){ return v !== ''; }, 'Please select your gender');
    }
    if (step === 2) {
      check('eduLevel',  'errEduLevel',  function(v){ return v !== ''; }, 'Please select your education level');
    }
    if (step === 3) {
      check('program',    'errProgram',    function(v){ return v !== ''; }, 'Please select a preferred program');
      check('citySelect', 'errCity',       function(v){ return v !== ''; }, 'Please select your counselling city');
      var consent = $('consent');
      var consentErr = $('errConsent');
      if (consent && !consent.checked) {
        if (consentErr) { consentErr.textContent = 'Please provide your consent to proceed'; consentErr.classList.add('show'); }
        ok = false;
      } else if (consentErr) {
        consentErr.classList.remove('show');
      }
    }
    return ok;
  }

  /* ── Update step UI ── */
  function updateStepUI() {
    for (var i = 1; i <= TOTAL_STEPS; i++) {
      var stepEl = $('step' + i);
      if (stepEl) stepEl.classList.toggle('active', i === currentStep);
    }
    // Progress fill
    var fill = $('progressFill');
    if (fill) fill.style.width = Math.round((currentStep / TOTAL_STEPS) * 100) + '%';
    // Labels
    var lbls = ['lbl1','lbl2','lbl3'];
    lbls.forEach(function(id, idx) {
      var el = $(id);
      if (!el) return;
      el.className = 'progress-label';
      if (idx + 1 < currentStep)      el.classList.add('done');
      else if (idx + 1 === currentStep) el.classList.add('active-lbl');
    });
    // Dots
    ['dot1','dot2','dot3'].forEach(function(id, idx) {
      var el = $(id);
      if (!el) return;
      el.className = 'step-dot';
      if (idx + 1 < currentStep)      el.classList.add('done');
      else if (idx + 1 === currentStep) el.classList.add('active');
    });
    // Back button
    var backBtn = $('btnBack');
    if (backBtn) backBtn.style.display = currentStep > 1 ? '' : 'none';
    // Next button text
    var nextBtn = $('btnNext');
    if (nextBtn) nextBtn.textContent = currentStep === TOTAL_STEPS ? 'Submit Registration ✓' : 'Continue →';
  }

  /* ── Next step ── */
  function nextStep() {
    if (!validateStep(currentStep)) return;
    if (currentStep < TOTAL_STEPS) {
      currentStep++;
      updateStepUI();
      var fc = $('formCard');
      if (fc) fc.scrollIntoView({ behavior:'smooth', block:'start' });
    } else {
      submitForm();
    }
  }

  /* ── Prev step ── */
  function prevStep() {
    if (currentStep > 1) {
      currentStep--;
      updateStepUI();
    }
  }

  /* ── City selection: show venue info ── */
  function showVenueInfo() {
    var sel = $('citySelect');
    if (!sel) return;
    var city = sel.value;
    var box = $('venueInfoBox');
    var txt = $('venueInfoText');
    if (city && CITY_DATA[city]) {
      var d = CITY_DATA[city];
      if (txt) txt.textContent = '📅 ' + d.date + '  ·  📍 ' + d.venue + ', ' + d.state;
      if (box) box.classList.add('show');
    } else {
      if (box) box.classList.remove('show');
    }
  }

  /* ── Quick-select city pills ── */
  function quickSelectCity(city) {
    var sel = $('citySelect');
    if (!sel) return;
    for (var i = 0; i < sel.options.length; i++) {
      if (sel.options[i].value === city) { sel.selectedIndex = i; break; }
    }
    showVenueInfo();
    document.querySelectorAll('.city-pill').forEach(function(p) {
      p.classList.toggle('selected', p.dataset.city === city);
    });
    var fc = $('formCard');
    if (fc) fc.scrollIntoView({ behavior:'smooth', block:'start' });
  }

  /* ── Submit form ── */
  function submitForm() {
    var firstName  = $('firstName') ? $('firstName').value.trim() : '';
    var lastName   = $('lastName')  ? $('lastName').value.trim()  : '';
    var phone      = $('phone')     ? $('phone').value.trim()     : '';
    var email      = $('email')     ? $('email').value.trim()     : '';
    var city       = $('citySelect')? $('citySelect').value       : '';
    var program    = $('program')   ? $('program').value          : '';
    var d          = CITY_DATA[city] || {};

    // Build confirmation using textContent (XSS-safe)
    var confirmBox = $('confirmBox');
    if (confirmBox) {
      confirmBox.innerHTML = '';
      var rows = [
        ['Name',           firstName + ' ' + lastName],
        ['Mobile',         '+91 ' + phone],
        ['Email',          email],
        ['City',           city],
        ['Event Date',     d.date  || '—'],
        ['Venue',          d.venue || '—'],
        ['Program Interest', program]
      ];
      rows.forEach(function(row) {
        var div = document.createElement('div');
        div.className = 'conf-row';
        var s1 = document.createElement('span');
        var s2 = document.createElement('span');
        s1.textContent = row[0];
        s2.textContent = row[1];
        div.appendChild(s1);
        div.appendChild(s2);
        confirmBox.appendChild(div);
      });
    }

    // Hide form, show success
    var formCard = $('formCard');
    if (formCard) {
      ['step1','step2','step3'].forEach(function(id) { var el = $(id); if(el) el.style.display='none'; });
      hide('formNav'); hide('stepDots'); hide('progressWrap');
      var h2 = formCard.querySelector('h2');
      var sub = formCard.querySelector('.form-subtitle');
      if (h2) h2.style.display = 'none';
      if (sub) sub.style.display = 'none';
    }
    var success = $('successScreen');
    if (success) success.classList.add('show');

    // Update WhatsApp notification badge
    var badge = $('waBadge');
    if (badge) badge.style.display = 'none';
  }

  /* ── Expose global helpers for inline HTML ── */
  window.JU = {
    nextStep:        nextStep,
    prevStep:        prevStep,
    showVenueInfo:   showVenueInfo,
    quickSelectCity: quickSelectCity
  };

  /* ── Initialise on DOM ready ── */
  document.addEventListener('DOMContentLoaded', function () {
    updateStepUI();

    var nextBtn = $('btnNext');
    var backBtn = $('btnBack');
    if (nextBtn) nextBtn.addEventListener('click', nextStep);
    if (backBtn) backBtn.addEventListener('click', prevStep);

    var citySelect = $('citySelect');
    if (citySelect) citySelect.addEventListener('change', showVenueInfo);

    // City pills
    document.querySelectorAll('.city-pill[data-city]').forEach(function(pill) {
      pill.addEventListener('click', function() {
        quickSelectCity(pill.dataset.city);
      });
    });

    // Phone: digits only
    var phoneEl = $('phone');
    if (phoneEl) {
      phoneEl.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g,'').slice(0,10);
      });
    }

    // Live validation on blur
    var liveFields = ['firstName','lastName','phone','email'];
    liveFields.forEach(function(id) {
      var el = $(id);
      if (!el) return;
      el.addEventListener('blur', function() { validateStep(currentStep); });
    });
  });

})();
