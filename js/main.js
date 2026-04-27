/* ═══════════════════════════════════════════════
   Victoria Gee — Site Scripts
   ═══════════════════════════════════════════════ */

/* ── Semantic synonym map ──────────────────────
   Keys are search terms, values are fragments
   that should match skill tag text content.
   ─────────────────────────────────────────────── */
const synonyms = {
  'coding':            ['python','c++','javascript','html','matlab','claude code','git'],
  'code':              ['python','c++','javascript','html','matlab','claude code','git'],
  'programming':       ['python','c++','javascript','html','matlab','claude code'],
  'language':          ['python','c++','javascript','html','matlab'],
  'languages':         ['python','c++','javascript','html','matlab'],
  'cad':               ['solidworks','fusion 360','autocad','altium'],
  '3d':                ['solidworks','fusion 360','autocad','fea'],
  'design':            ['solidworks','fusion 360','autocad','figma','process design','organizational design'],
  'hardware':          ['altium','solidworks','fusion 360','autocad','fea'],
  'circuit':           ['altium'],
  'electronics':       ['altium'],
  'pcb':               ['altium'],
  'simulation':        ['matlab','fea'],
  'engineering':       ['solidworks','fusion 360','autocad','altium','matlab','fea','c++'],
  'mechanical':        ['solidworks','fusion 360','autocad','fea'],
  'data':              ['matlab','python','power bi','excel'],
  'analytics':         ['power bi','excel','matlab','python'],
  'visualization':     ['power bi','figma','excel'],
  'dashboard':         ['power bi','excel','notion'],
  'spreadsheet':       ['excel'],
  'productivity':      ['notion','confluence','asana','sharepoint'],
  'tools':             ['notion','confluence','asana','sharepoint','servicenow'],
  'ux':                ['figma','html / css','javascript'],
  'ui':                ['figma','html / css','javascript'],
  'frontend':          ['html / css','javascript','figma'],
  'web':               ['html / css','javascript'],
  'version control':   ['git'],
  'ai':                ['claude code','python'],
  'project management':['agile','scrum','asana','confluence','project tracking','pmp'],
  'pm':                ['agile','scrum','project tracking','pmp','process design'],
  'methodology':       ['agile','scrum','lean','six sigma','pmp'],
  'methodologies':     ['agile','scrum','lean','six sigma','pmp'],
  'framework':         ['agile','scrum','lean','six sigma','pmp'],
  'frameworks':        ['agile','scrum','lean','six sigma','pmp'],
  'quality':           ['lean','six sigma'],
  'improvement':       ['lean','six sigma','process design'],
  'efficiency':        ['lean','six sigma','process design'],
  'operations':        ['lean','six sigma','process design','budget tracking','vendor management'],
  'ops':               ['lean','six sigma','process design','budget tracking','vendor management'],
  'planning':          ['agile','scrum','project tracking','pmp','process design'],
  'tracking':          ['project tracking','budget tracking','asana','confluence'],
  'budget':            ['budget tracking'],
  'finance':           ['budget tracking','excel'],
  'financial':         ['budget tracking','excel'],
  'procurement':       ['vendor management','budget tracking'],
  'vendor':            ['vendor management'],
  'ticketing':         ['servicenow','confluence','asana'],
  'itsm':              ['servicenow'],
  'documentation':     ['confluence','sharepoint','notion','knowledge management'],
  'docs':              ['confluence','sharepoint','notion','knowledge management'],
  'wiki':              ['confluence','notion','knowledge management'],
  'knowledge':         ['knowledge management','confluence','notion'],
  'process':           ['process design','lean','six sigma'],
  'communication':     ['executive communication','stakeholder management','cross-functional leadership'],
  'presentation':      ['executive communication'],
  'presenting':        ['executive communication'],
  'leadership':        ['cross-functional leadership','mentorship','organizational design','sponsor relations'],
  'leading':           ['cross-functional leadership','mentorship'],
  'management':        ['stakeholder management','vendor management','budget tracking','knowledge management','organizational design'],
  'managing':          ['stakeholder management','vendor management','budget tracking'],
  'stakeholder':       ['stakeholder management','executive communication'],
  'conflict':          ['conflict resolution'],
  'negotiation':       ['conflict resolution','stakeholder management','vendor management'],
  'mentoring':         ['mentorship'],
  'coaching':          ['mentorship'],
  'team':              ['cross-functional leadership','mentorship','organizational design'],
  'org':               ['organizational design','cross-functional leadership'],
  'organization':      ['organizational design'],
  'fundraising':       ['sponsor relations'],
  'sponsorship':       ['sponsor relations'],
  'sponsors':          ['sponsor relations'],
  'collaboration':     ['cross-functional leadership','stakeholder management','confluence'],
  'cross functional':  ['cross-functional leadership'],
};

/* ── Skills search & filter ─────────────────── */
function skillMatches(skillText, query) {
  const s = skillText.toLowerCase();
  const q = query.toLowerCase().trim();
  if (q === '') return true;
  if (s.includes(q)) return true;
  for (const [key, targets] of Object.entries(synonyms)) {
    if (q.includes(key) || key.includes(q)) {
      if (targets.some(t => s.includes(t))) return true;
    }
  }
  return false;
}

function initSkills() {
  const se = document.getElementById('skillSearch');
  const sg = document.getElementById('skillsGrid');
  if (!se || !sg) return;

  const tags    = sg.querySelectorAll('.st');
  const pills   = document.querySelectorAll('.fp');
  const noRes   = document.getElementById('noRes');
  const addRow  = document.getElementById('addRow');
  const qlabel  = document.getElementById('queryLabel');
  const addBtn  = document.getElementById('addBtn');
  const addConf = document.getElementById('addConfirm');
  let activeFilter = 'all';
  let requested = [];
  try { requested = JSON.parse(localStorage.getItem('vg_req') || '[]'); } catch(e) {}

  function run() {
    const q = se.value.trim();
    let visible = 0;
    tags.forEach(t => {
      const match = skillMatches(t.textContent, q) && (activeFilter === 'all' || t.dataset.cat === activeFilter);
      t.classList.toggle('hidden', !match);
      if (match) visible++;
    });
    const empty = visible === 0 && q !== '';
    noRes.style.display  = empty ? 'block' : 'none';
    addRow.classList.toggle('on', empty);
    if (empty) {
      qlabel.textContent    = se.value;
      addConf.style.display = 'none';
      addBtn.style.display  = 'inline-block';
    }
  }

  se.addEventListener('input', run);

  pills.forEach(p => {
    p.addEventListener('click', () => {
      pills.forEach(x => x.classList.remove('active'));
      p.classList.add('active');
      activeFilter = p.dataset.filter;
      run();
    });
  });

  addBtn.addEventListener('click', () => {
    const skill = se.value.trim();
    if (!skill) return;
    requested.push({ skill, time: new Date().toISOString() });
    try { localStorage.setItem('vg_req', JSON.stringify(requested)); } catch(e) {}
    // Replace YOUR_FORM_ID with your Formspree form ID to receive email alerts
    fetch('https://formspree.io/f/YOUR_FORM_ID', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ skill, source: 'vg-skill-request', time: new Date().toISOString() })
    }).catch(() => {});
    addBtn.style.display  = 'none';
    addConf.style.display = 'inline-flex';
  });
}

/* ── Experience tabs ────────────────────────── */
function initTabs() {
  document.querySelectorAll('.etab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.etab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.epanel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById('panel-' + tab.dataset.panel).classList.add('active');
    });
  });
}

/* ── Section reveal on scroll ────────────────── */
function initSectionReveal() {
  const sections = document.querySelectorAll('.hero-inner, .sec-inner');
  if (!sections.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    sections.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  sections.forEach((el) => el.classList.add('reveal-on-scroll'));

  if (!('IntersectionObserver' in window)) {
    sections.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('is-visible', entry.isIntersecting);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -8% 0px'
  });

  sections.forEach((el) => observer.observe(el));
}

/* ── Init ────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initSkills();
  initTabs();
  initSectionReveal();
});
