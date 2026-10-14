/**
 * GRURU MUSEUM - Executive Presentation Web App Logic
 * Theme: "New Knowledge. New Storytelling. Built for Everyday Living."
 * Concept: Future Archaeology (Modern Art Gallery x Sci-Fi Research Lab)
 */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------------------------
  const state = {
    currentSlide: 0,
    totalSlides: 12,
    soundEnabled: true,
    theme: 'dark',
    overviewOpen: false,
    notesOpen: false,
    boomingLevel: 0,
    boomingHistory: [],
    selectedKgCategory: 'all',
    selectedKgEra: 'all',
    searchQuery: '',
    highlightedNodeId: null
  };

  // ---------------------------------------------------------------------------
  // WEB AUDIO SYNTHESIZER (Minimal Sci-Fi UI Chimes)
  // ---------------------------------------------------------------------------
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
  }

  function playUiTone(type = 'click') {
    if (!state.soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1760, now + 0.05);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'boom') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'slide') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(660, now + 0.08);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'inspect') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(1200, now);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        osc.start(now);
        osc.stop(now + 0.03);
      }
    } catch (e) {
      // Audio not permitted or supported silently
    }
  }

  // ---------------------------------------------------------------------------
  // SLIDE DATA & SPEAKER NOTES
  // ---------------------------------------------------------------------------
  const slidesData = [
    {
      num: '01',
      code: 'GRM-2026-EXEC-001',
      title: 'วิสัยทัศน์ & แก่นโปรเจกต์',
      subtitle: 'Future Archaeology: ห้องแล็บของนักโบราณคดีจากอนาคต',
      category: 'Overview',
      notes: 'สไลด์เปิดนำเสนอ: เน้นย้ำธีม New Knowledge. New Storytelling. Built for Everyday Living. ชี้ให้เห็นว่า GRURU ไม่ใช่พิพิธภัณฑ์เก็บของเก่าแบบเดิม แต่เป็น Modern Art Gallery ผสม Sci-Fi Research Lab ที่ขุดความรู้ในอดีตมาเป็นเรื่องเล่าและเครื่องมือที่คนรุ่นใหม่ใช้ได้จริงทุกวัน'
    },
    {
      num: '02',
      code: 'GRM-2026-EXEC-002',
      title: 'ทำไมต้องตอนนี้? (Market Opportunity)',
      subtitle: 'ช่องว่างระหว่างสารานุกรมที่แห้งแล้ง กับคลิปสั้นที่ฉาบฉวย',
      category: 'Strategy',
      notes: 'ผู้บริหารจะเห็นตัวเลขชัดเจนใน 3 วินาที: กลุ่มอายุ 22-40 ปี มี Attention Span สั้นลง (3-5 นาที) ไม่ชอบสารานุกรมหนาเตอะ แต่ก็เบื่อคอนเทนต์ไวรัลที่ไม่บอกที่มา GRURU เติมเต็มช่องว่างนี้ด้วยความสนุกที่มีหลักฐานเชิงประจักษ์'
    },
    {
      num: '03',
      code: 'GRM-2026-EXEC-003',
      title: 'การวางตำแหน่งแบรนด์ (Brand Positioning)',
      subtitle: 'อดีตคือข้อมูล อนาคตคือเรื่องเล่า // ภัณฑารักษ์จากอนาคต',
      category: 'Positioning',
      notes: 'Perceptual Matrix 2x2: แกน X (วิชาการ ↔ สนุก) แกน Y (เส้นตรง ↔ เครือข่าย). GRURU ยึดครองจตุรัสทองคำ "สนุกแต่มีหลักฐาน + โต้ตอบแบบเครือข่าย" ซึ่งยังไม่มีคู่แข่งรายใดครองตำแหน่งนี้ได้'
    },
    {
      num: '04',
      code: 'GRM-2026-EXEC-004',
      title: 'เจาะลึก 3 บุคลิกเป้าหมาย (Target Personas)',
      subtitle: 'หนึ่งแพลตฟอร์ม ตอบโจทย์ 3 เลเยอร์ความลึก',
      category: 'Audience',
      notes: '1. Curious Starter (22-27): เน้นการ์ดแชร์ 1080x1350 px และเรื่องเล่า 3 นาที 2. Creative Professional (25-34): เข้าถึง Knowledge Graph เจาะลึกและโหลด Dataset ได้ 3. Lifelong Learner (30-40): เน้น Everyday Takeaways และความน่าเชื่อถือ'
    },
    {
      num: '05',
      code: 'GRM-2026-EXEC-005',
      title: 'เครื่องยนต์คุณค่า 5 ขั้น (Value Engine)',
      subtitle: 'Excavate → Decode → Retell → Connect → Apply',
      category: 'Process',
      notes: 'กระบวนการแปลงความรู้ที่จับต้องได้: เริ่มจากขุดค้นและระบุแหล่งที่มา สกัดเป็นโครงสร้างโหนด เล่าด้วยภาพและปฏิสัมพันธ์ ขยายความเชื่อมโยงด้วยกราฟ และจบด้วยวิธีนำไปปรับใช้ในชีวิตจริง'
    },
    {
      num: '06',
      code: 'GRM-2026-EXEC-006',
      title: 'สถาปัตยกรรมกราฟความรู้ (Knowledge Graph)',
      subtitle: 'บูรณาการ 4 แหล่งข้อมูล สู่ 6 ศาสตร์เรขาคณิต',
      category: 'Architecture',
      notes: 'แสดงภาพ Knowledge Graph ทั้ง 6 มิติในโฟลเดอร์โครงการ: แยก 6 หมวดด้วยสีและทรงเรขาคณิต (Cyan วงกลม, Ember หกเหลี่ยม, Violet สี่เหลี่ยม, Amber สามเหลี่ยม, Bio Green ข้าวหลามตัด, Coral วงแหวน) เพื่อรองรับ WCAG Accessibility และผู้บกพร่องทางสายตา'
    },
    {
      num: '07',
      code: 'GRM-2026-EXEC-007',
      title: 'นวัตกรรมไฮไลต์: Data Booming',
      subtitle: 'ระเบิดความรู้แบบนำทาง // เข้าใจโครงข่ายใน 3 วินาที',
      category: 'Signature Demo',
      notes: 'ทดสอบคลิกโหนดจริงได้บนสไลด์: โหนดศูนย์กลางจะระเบิดเป็นโหนดลูก 8 โหนดด้วยเวลาต่างกัน 40ms, มีวงแหวน Lime เรืองแสง, ตัวนับวิ่งขึ้น และสามารถคลิกระเบิดต่อได้ 3 ชั้น เป็นหมัดเด็ดทาง UX ที่ไม่มีใครเหมือน'
    },
    {
      num: '08',
      code: 'GRM-2026-EXEC-008',
      title: 'นวัตกรรมไฮไลต์: Interactive Knowledge Graph',
      subtitle: 'แผนที่ความรู้แบบ Force-Directed เต็มระบบ',
      category: 'Signature Demo',
      notes: 'Interactive Canvas แบบ D3-force ที่มีความลื่นไหลสูง: มีโหนดเชื่อมโยงกว่า 40 โหนด, กรองตามหมวดหมู่, สไลเดอร์ไทม์ไลน์ยุคสมัย, ป้าย Specimen Label เมื่อเลื่อนเมาส์ผ่าน และไฮไลต์เส้นทางเชื่อมโยงด้วยสี Specimen Lime'
    },
    {
      num: '09',
      code: 'GRM-2026-EXEC-009',
      title: 'ระบบการออกแบบ (Design Tokens & Rules)',
      subtitle: 'Past Warm × Future Electric // กฎ 70-20-10 & WCAG AA',
      category: 'Design System',
      notes: 'ความคมชัดผ่านเกณฑ์ WCAG AA ทั้งหมด (Void Black 70%, Graphite & Grid 20%, Brand Accents 10%). เอกลักษณ์การตัดมุม 45 องศา (Chamfer 12px), Specimen Grid 48px, และ Time Warp Gradient'
    },
    {
      num: '10',
      code: 'GRM-2026-EXEC-010',
      title: 'Built for Everyday Living & Everyday Lab',
      subtitle: 'จากภูมิปัญญาโบราณ สู่การปฏิบัติจริงในชีวิตประจำวัน',
      category: 'Application',
      notes: 'โชว์การ์ด Everyday Takeaway ขนาด 1080x1350 px ที่พร้อมแชร์บน Instagram/TikTok/LinkedIn ขับเคลื่อน Viral Loop ให้กับแบรนด์โดยไม่ต้องพึ่งงบโฆษณาหนัก'
    },
    {
      num: '11',
      code: 'GRM-2026-EXEC-011',
      title: 'แผนการดำเนินงาน & ความเร็วด้วย Antigravity',
      subtitle: '4-Sprint Agile Roadmap สู่การเปิดตัวที่สมบูรณ์แบบ',
      category: 'Roadmap',
      notes: 'แบ่งงานเป็น 4 รอบตาม Project Brief: รอบ 1 Design Tokens & Style Guide, รอบ 2 คอมโพเนนต์และ HUD, รอบ 3 หน้าห้องจัดแสดงทั้ง 4 HALL, รอบ 4 กราฟความรู้ D3 Canvas. พัฒนาเร็วขึ้น 4 เท่าด้วย Google Antigravity'
    },
    {
      num: '12',
      code: 'GRM-2026-EXEC-012',
      title: 'สรุปการนำเสนอ & ข้อเสนอแนะเชิงกลยุทธ์',
      subtitle: 'High Moat, Viral Retention, และ Next Milestones',
      category: 'Decision',
      notes: 'สไลด์ปิดการนำเสนอ: สรุปความคุ้มค่าการลงทุน 3 ประการ (คลังความรู้ที่มีสิทธิบัตรและตรวจสอบได้, การมีส่วนร่วมสูงผ่าน Data Booming, การต่อยอดสู่ภาคการศึกษาและสปอนเซอร์ชิป). ขออนุมัติเริ่ม Sprint 1 ทันที'
    }
  ];

  // ---------------------------------------------------------------------------
  // SLIDE NAVIGATION ENGINE
  // ---------------------------------------------------------------------------
  function updateSlideUI() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slide-dot');
    const data = slidesData[state.currentSlide];

    slides.forEach((slide, idx) => {
      slide.classList.remove('active', 'prev');
      if (idx === state.currentSlide) {
        slide.classList.add('active');
      } else if (idx < state.currentSlide) {
        slide.classList.add('prev');
      }
    });

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === state.currentSlide);
    });

    // Update Header
    const counterBadge = document.getElementById('slide-counter');
    if (counterBadge) {
      counterBadge.textContent = `${data.num} / ${state.totalSlides}`;
    }

    const currentTitleMini = document.getElementById('slide-title-mini');
    if (currentTitleMini) {
      currentTitleMini.textContent = data.title;
    }

    // Update Prev/Next Buttons
    const prevBtn = document.getElementById('prev-slide-btn');
    const nextBtn = document.getElementById('next-slide-btn');
    if (prevBtn) prevBtn.disabled = state.currentSlide === 0;
    if (nextBtn) nextBtn.disabled = state.currentSlide === state.totalSlides - 1;

    // Update Speaker Notes Drawer
    const notesContent = document.getElementById('notes-content');
    const notesTitle = document.getElementById('notes-title');
    if (notesContent) notesContent.textContent = data.notes;
    if (notesTitle) notesTitle.textContent = `SLIDE ${data.num} // ${data.code}`;

    // Update Overview Selection
    const overviewCards = document.querySelectorAll('.overview-card');
    overviewCards.forEach((card, idx) => {
      card.classList.toggle('current', idx === state.currentSlide);
    });

    // Trigger canvas animation resize if on slide 8
    if (state.currentSlide === 7 && window.initForceGraph) {
      setTimeout(() => {
        window.resizeForceCanvas();
      }, 100);
    }
  }

  function goToSlide(index) {
    if (index < 0 || index >= state.totalSlides || index === state.currentSlide) return;
    state.currentSlide = index;
    playUiTone('slide');
    updateSlideUI();
  }

  function nextSlide() {
    if (state.currentSlide < state.totalSlides - 1) {
      goToSlide(state.currentSlide + 1);
    }
  }

  function prevSlide() {
    if (state.currentSlide > 0) {
      goToSlide(state.currentSlide - 1);
    }
  }

  // ---------------------------------------------------------------------------
  // OVERVIEW & NOTES MODALS
  // ---------------------------------------------------------------------------
  function toggleOverview(force) {
    const modal = document.getElementById('overview-modal');
    if (!modal) return;
    const shouldOpen = force !== undefined ? force : !state.overviewOpen;
    state.overviewOpen = shouldOpen;
    modal.classList.toggle('open', shouldOpen);
    playUiTone('click');
  }

  function toggleNotes(force) {
    const drawer = document.getElementById('notes-drawer');
    const btn = document.getElementById('btn-notes');
    if (!drawer) return;
    const shouldOpen = force !== undefined ? force : !state.notesOpen;
    state.notesOpen = shouldOpen;
    drawer.classList.toggle('open', shouldOpen);
    if (btn) btn.classList.toggle('active', shouldOpen);
    playUiTone('click');
  }

  function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.body.classList.toggle('theme-light', state.theme === 'light');
    const themeBtn = document.getElementById('btn-theme');
    if (themeBtn) {
      themeBtn.innerHTML = state.theme === 'dark' 
        ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> THEME`
        : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> THEME`;
    }
    playUiTone('click');
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
    playUiTone('click');
  }

  function toggleSound() {
    state.soundEnabled = !state.soundEnabled;
    const btn = document.getElementById('btn-sound');
    if (btn) {
      btn.classList.toggle('active', state.soundEnabled);
      btn.innerHTML = state.soundEnabled 
        ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg> SFX ON`
        : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg> SFX OFF`;
    }
  }

  // ---------------------------------------------------------------------------
  // INTERACTIVE SIGNATURE: DATA BOOMING ENGINE
  // ---------------------------------------------------------------------------
  const boomingKnowledgeTree = {
    id: 'root',
    title: 'GRURU KNOWLEDGE',
    category: 'Root Core',
    takeaway: 'ศูนย์รวมการสกัดข้อมูลอดีตสู่เรื่องเล่าปัจจุบัน',
    children: [
      {
        id: 'c1',
        title: 'การหมักอาหารโบราณ',
        en: 'Ancient Fermentation',
        category: 'Bio & Food',
        color: '#34E89E',
        shape: '◇',
        takeaway: 'จุลินทรีย์โบราณสร้างสมดุลลำไส้ในยุค Ultra-processed Food',
        children: [
          { id: 'c1-1', title: 'ยีสต์หมักขนมปังซาวร์โด (3000 BC)', takeaway: 'ย่อยกลูเตนตามธรรมชาติ ลดน้ำตาลสะสม' },
          { id: 'c1-2', title: 'กิมจิ & นัตโตะ', takeaway: 'โปรไบโอติกสายพันธุ์เอเชีย เสริมภูมิคุ้มกัน' },
          { id: 'c1-3', title: 'ไวน์ดินเผาแอมฟอรา', takeaway: 'เทคนิคบ่มไร้สารเคมี ยืดอายุเซลล์' }
        ]
      },
      {
        id: 'c2',
        title: 'กลไกแอนติคิเธียรา',
        en: 'Antikythera Mechanism',
        category: 'Technology',
        color: '#8C6BFF',
        shape: '□',
        takeaway: 'คอมพิวเตอร์แอนะล็อกชิ้นแรกเมื่อ 2,000 ปีก่อน สะท้อนคณิตศาสตร์กลไก',
        children: [
          { id: 'c2-1', title: 'เฟืองทด 37 ชิ้น', takeaway: 'รากฐานการคำนวณตำแหน่งดวงดาวและสุริยุปราคา' },
          { id: 'c2-2', title: 'สูตรคำนวณโอลิมปิก', takeaway: 'การเขียนโค้ดเวลาเพื่อบริหารสังคมโบราณ' }
        ]
      },
      {
        id: 'c3',
        title: 'ภูมิปัญญาการนอนหลับ',
        en: 'Biphasic Sleep History',
        category: 'Health & Life',
        color: '#FF5FA2',
        shape: '◎',
        takeaway: 'การนอนสองช่วงในยุคกลาง ช่วยลดความเครียดของคนทำงานกะดึก',
        children: [
          { id: 'c3-1', title: 'Dorveille (ช่วงตื่นกลางดึก)', takeaway: 'ช่วงเวลาที่สมองหลั่งฮอร์โมนสร้างสรรค์มากที่สุด' },
          { id: 'c3-2', title: 'การปรับแสงธรรมชาติ', takeaway: 'วิธีรักษา Circadian Rhythm โดยไม่ใช้ยา' }
        ]
      },
      {
        id: 'c4',
        title: 'ระบบน้ำกานาตเปอร์เซีย',
        en: 'Persian Qanat System',
        category: 'Engineering',
        color: '#2EE6FF',
        shape: '○',
        takeaway: 'อุโมงค์ส่งน้ำแรงโน้มถ่วงกลางทะเลทราย ต้นแบบ Passive Cooling อาคารสมัยใหม่',
        children: [
          { id: 'c4-1', title: 'หอรับลม Badgir', takeaway: 'ระบบปรับอากาศธรรมชาติ ลดการใช้ไฟฟ้า 70%' },
          { id: 'c4-2', title: 'การเฉลี่ยน้ำเท่าเทียม', takeaway: 'Smart Contract ยุคโบราณเพื่อบริหารทรัพยากรส่วนรวม' }
        ]
      },
      {
        id: 'c5',
        title: 'เรขาคณิตสัดส่วนทองคำ',
        en: 'Sacred Golden Ratio',
        category: 'Art & Design',
        color: '#FFC233',
        shape: '△',
        takeaway: 'อัตราส่วน 1.618 ในธรรมชาติและสถาปัตยกรรม สู่ UI/UX Layout ที่สายตาสบายใจ',
        children: [
          { id: 'c5-1', title: 'พาร์เธนอน & พีระมิด', takeaway: 'สมดุลสายตาที่ไม่ตกยุคข้ามพันปี' },
          { id: 'c5-2', title: 'เกลียวหอยนอติลุส', takeaway: 'กฎ Fibonacci ในการขยายสเกลฟอนต์บนหน้าจอ' }
        ]
      },
      {
        id: 'c6',
        title: 'การแพทย์สมุนไพรจดหมายเหตุ',
        en: 'Ancient Pharmacology',
        category: 'Science',
        color: '#FF5A1F',
        shape: '⬡',
        takeaway: 'สารสกัดแอสไพรินจากเปลือกหลิว สู่ยาแผนปัจจุบันที่มีการบันทึกแหล่งที่มา',
        children: [
          { id: 'c6-1', title: 'ใบคิวนินรักษามาลาเรีย', takeaway: 'การวิจัยข้ามทวีปด้วยความรู้ชนพื้นเมือง' },
          { id: 'c6-2', title: 'ขมิ้นชันต้านอักเสบ', takeaway: 'การพิสูจน์ทางคลินิกเพื่อชีวิตประจำวัน' }
        ]
      }
    ]
  };

  let currentBoomNode = boomingKnowledgeTree;
  let boomingConnectionCount = 1;

  function initDataBooming() {
    const stage = document.getElementById('booming-stage');
    const centerBtn = document.getElementById('booming-center-btn');
    const svgNet = document.getElementById('booming-svg-lines');
    const counterEl = document.getElementById('booming-counter');
    const takeawayEl = document.getElementById('booming-takeaway');
    const resetBtn = document.getElementById('booming-reset-btn');

    if (!stage || !centerBtn) return;

    renderBoomingNodes();

    centerBtn.addEventListener('click', () => {
      triggerBoomExplosion();
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        currentBoomNode = boomingKnowledgeTree;
        boomingConnectionCount = 1;
        state.boomingLevel = 0;
        playUiTone('click');
        renderBoomingNodes();
      });
    }
  }

  function triggerBoomExplosion() {
    playUiTone('boom');
    const stage = document.getElementById('booming-stage');
    const children = currentBoomNode.children;
    if (!children || children.length === 0) return;

    const childEls = stage.querySelectorAll('.booming-child-node');
    const svgNet = document.getElementById('booming-svg-lines');

    childEls.forEach((el, idx) => {
      setTimeout(() => {
        el.classList.add('exploded');
        boomingConnectionCount++;
        const counterEl = document.getElementById('booming-counter');
        if (counterEl) counterEl.textContent = boomingConnectionCount;
        playUiTone('inspect');
      }, idx * 45);
    });

    // Draw SVG connecting lines
    if (svgNet) {
      svgNet.innerHTML = '';
      const rect = stage.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;

      childEls.forEach((el) => {
        const x = parseFloat(el.dataset.x);
        const y = parseFloat(el.dataset.y);
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', cx);
        line.setAttribute('y1', cy);
        line.setAttribute('x2', x);
        line.setAttribute('y2', y);
        line.setAttribute('stroke', '#D7FF3A');
        line.setAttribute('stroke-width', '1.5');
        line.setAttribute('stroke-opacity', '0.6');
        line.setAttribute('stroke-dasharray', '4,4');
        svgNet.appendChild(line);
      });
    }
  }

  function renderBoomingNodes() {
    const stage = document.getElementById('booming-stage');
    const centerBtn = document.getElementById('booming-center-btn');
    const svgNet = document.getElementById('booming-svg-lines');
    const counterEl = document.getElementById('booming-counter');
    const takeawayEl = document.getElementById('booming-takeaway');
    const breadcrumbEl = document.getElementById('booming-breadcrumb');

    if (!stage || !centerBtn) return;

    // Clear previous children
    stage.querySelectorAll('.booming-child-node').forEach(el => el.remove());
    if (svgNet) svgNet.innerHTML = '';

    // Center Node styling & text
    centerBtn.innerHTML = `
      <div style="font-size: 10px; color: #000; font-family: var(--font-mono); font-weight:700;">EXPLODE ME</div>
      <div style="font-size: 13px; font-weight: 700; line-height: 1.2;">${currentBoomNode.title}</div>
      <div style="font-size: 9px; opacity: 0.8; font-family: var(--font-mono);">LEVEL ${state.boomingLevel}</div>
    `;

    if (counterEl) counterEl.textContent = boomingConnectionCount;
    if (takeawayEl) takeawayEl.textContent = currentBoomNode.takeaway;
    if (breadcrumbEl) breadcrumbEl.textContent = `ROOT > LEVEL ${state.boomingLevel} // ${currentBoomNode.title}`;

    const children = currentBoomNode.children || [];
    const rect = stage.getBoundingClientRect();
    const cx = rect.width / 2 || 280;
    const cy = rect.height / 2 || 220;
    const radius = Math.min(cx, cy) * 0.72;

    children.forEach((child, i) => {
      const angle = (i / children.length) * (2 * Math.PI) - Math.PI / 2;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);

      const nodeEl = document.createElement('div');
      nodeEl.className = 'booming-child-node gr-chamfer';
      nodeEl.dataset.x = x;
      nodeEl.dataset.y = y;
      nodeEl.style.left = `${x}px`;
      nodeEl.style.top = `${y}px`;
      nodeEl.innerHTML = `
        <span style="color: ${child.color || 'var(--gr-lime)'}; font-size: 14px;">${child.shape || '●'}</span>
        <span>${child.title}</span>
      `;

      nodeEl.addEventListener('click', (e) => {
        e.stopPropagation();
        if (child.children && child.children.length > 0) {
          currentBoomNode = child;
          state.boomingLevel++;
          boomingConnectionCount += child.children.length;
          playUiTone('boom');
          renderBoomingNodes();
          setTimeout(() => triggerBoomExplosion(), 100);
        } else {
          if (takeawayEl) {
            takeawayEl.textContent = `[${child.title}] ${child.takeaway}`;
          }
          playUiTone('inspect');
        }
      });

      stage.appendChild(nodeEl);
    });
  }

  // ---------------------------------------------------------------------------
  // INTERACTIVE SIGNATURE: FORCE-DIRECTED KNOWLEDGE GRAPH CANVAS
  // ---------------------------------------------------------------------------
  const kgNodes = [
    { id: 'n1', title: 'กลไกแอนติคิเธียรา', en: 'Antikythera', cat: 'tech', era: 'Ancient', year: -150, conns: 5, takeaway: 'ต้นแบบคอมพิวเตอร์แอนะล็อกชิ้นแรกของมนุษยชาติ' },
    { id: 'n2', title: 'การหมักขนมปังซาวร์โด', en: 'Sourdough Fermentation', cat: 'nature', era: 'Ancient', year: -3000, conns: 6, takeaway: 'ใช้จุลินทรีย์ธรรมชาติย่อยแป้ง ลดอาการท้องอืด' },
    { id: 'n3', title: 'ระบบส่งน้ำกานาต', en: 'Persian Qanat', cat: 'tech', era: 'Ancient', year: -800, conns: 4, takeaway: 'วิศวกรรมการดึงน้ำเย็นใต้ดินมาหล่อเย็นอาคาร' },
    { id: 'n4', title: 'สมุดบันทึกดาวินชี', en: 'Codex Atlanticus', cat: 'art', era: 'Renaissance', year: 1490, conns: 8, takeaway: 'การสเกตช์ภาพเพื่อถอดรหัสฟิสิกส์และการเคลื่อนไหว' },
    { id: 'n5', title: 'วงจรคาร์บอน & การสังเคราะห์แสง', en: 'Photosynthesis Cycle', cat: 'sci', era: 'Classical', year: 1779, conns: 7, takeaway: 'ความเข้าใจเรื่องอากาศบริสุทธิ์และการจัดวางต้นไม้ในบ้าน' },
    { id: 'n6', title: 'สัดส่วนทองคำพาร์เธนอน', en: 'Parthenon Golden Ratio', cat: 'cult', era: 'Ancient', year: -447, conns: 5, takeaway: 'เรขาคณิตสร้างสมดุลสายตาในงานออกแบบ UI ยุคนี้' },
    { id: 'n7', title: 'การแพทย์แผนไอยคุปต์', en: 'Ebers Papyrus', cat: 'hist', era: 'Ancient', year: -1550, conns: 4, takeaway: 'การใช้สมุนไพรและการจดบันทึกประวัติการรักษาอย่างเป็นระบบ' },
    { id: 'n8', title: 'แท่นพิมพ์กูเทนแบร์ก', en: 'Gutenberg Press', cat: 'tech', era: 'Renaissance', year: 1440, conns: 9, takeaway: 'การเปิดเสรีองค์ความรู้สู่มวลชน ยุคแรกของ Open Source' },
    { id: 'n9', title: 'ทฤษฎีกราฟออยเลอร์', en: 'Eulerian Graph Theory', cat: 'sci', era: 'Classical', year: 1736, conns: 9, takeaway: 'สะพานเคอนิกส์แบร์ก ต้นกำเนิด Knowledge Graph และเน็ตเวิร์กสมัยใหม่' },
    { id: 'n10', title: 'เครื่องยนต์ไอน้ำวัตต์', en: 'Watt Steam Engine', cat: 'hist', era: 'Industrial', year: 1776, conns: 6, takeaway: 'การเปลี่ยนพลังงานความร้อนเป็นกลไกขับเคลื่อนโลก' },
    { id: 'n11', title: 'จานเพาะเชื้อเพนิซิลลิน', en: 'Penicillin Discovery', cat: 'sci', era: 'Industrial', year: 1928, conns: 7, takeaway: 'ยาปฏิชีวนะที่ช่วยชีวิตคนนับร้อยล้านจากการสังเกตสิ่งบังเอิญ' },
    { id: 'n12', title: 'โครงสร้างเกลียวคู่ DNA', en: 'DNA Double Helix', cat: 'sci', era: 'Digital', year: 1953, conns: 8, takeaway: 'ภาษาข้อมูลชีวภาพที่เป็นรากฐานของชีววิทยาสังเคราะห์' },
    { id: 'n13', title: 'โครงข่ายประสาทเทียม', en: 'Neural Networks (Perceptron)', cat: 'tech', era: 'Digital', year: 1957, conns: 9, takeaway: 'การจำลองสมองมนุษย์สู่ Deep Learning และ Antigravity AI' },
    { id: 'n14', title: 'ปรัชญาวะบิ-ซะบิ', en: 'Wabi-Sabi Aesthetics', cat: 'cult', era: 'Medieval', year: 1500, conns: 4, takeaway: 'การมองเห็นความงามในความไม่สมบูรณ์แบบ ลดความวิตกกังวล' },
    { id: 'n15', title: 'เครือข่ายไมคอร์ไรซาในป่า', en: 'Wood Wide Web (Mycorrhiza)', cat: 'nature', era: 'Classical', year: 1885, conns: 6, takeaway: 'การแบ่งปันสารอาหารใต้ดินของต้นไม้ บทเรียนเรื่อง Decentralized Ecosystem' },
    { id: 'n16', title: 'หลักการยศาสตร์เบาเฮาส์', en: 'Bauhaus Functionalism', cat: 'art', era: 'Industrial', year: 1919, conns: 6, takeaway: 'Form Follows Function ออกแบบสิ่งของเพื่อผู้ใช้จริง' }
  ];

  const kgLinks = [
    { source: 'n1', target: 'n8', type: 'influenced' },
    { source: 'n8', target: 'n9', type: 'derived_from' },
    { source: 'n9', target: 'n13', type: 'derived_from' },
    { source: 'n1', target: 'n4', type: 'influenced' },
    { source: 'n4', target: 'n16', type: 'influenced' },
    { source: 'n6', target: 'n4', type: 'influenced' },
    { source: 'n6', target: 'n16', type: 'derived_from' },
    { source: 'n2', target: 'n11', type: 'influenced' },
    { id: 'l9', source: 'n7', target: 'n11', type: 'derived_from' },
    { source: 'n11', target: 'n12', type: 'influenced' },
    { source: 'n5', target: 'n15', type: 'derived_from' },
    { source: 'n15', target: 'n9', type: 'influenced' },
    { source: 'n10', target: 'n13', type: 'influenced' },
    { source: 'n14', target: 'n16', type: 'influenced' },
    { source: 'n3', target: 'n10', type: 'influenced' },
    { source: 'n5', target: 'n2', type: 'used_in' }
  ];

  const categoryColors = {
    sci: '#2EE6FF',
    hist: '#FF5A1F',
    tech: '#8C6BFF',
    cult: '#FFC233',
    nature: '#34E89E',
    art: '#FF5FA2'
  };

  const categoryShapes = {
    sci: 'circle',
    hist: 'hexagon',
    tech: 'square',
    cult: 'triangle',
    nature: 'diamond',
    art: 'ring'
  };

  let canvas, ctx, canvasWidth, canvasHeight;
  let simNodes = [];
  let simLinks = [];
  let hoveredNode = null;
  let draggedNode = null;
  let isSimulating = true;

  function initForceGraph() {
    canvas = document.getElementById('kg-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    resizeForceCanvas();
    window.addEventListener('resize', resizeForceCanvas);

    // Initialize physical nodes
    simNodes = kgNodes.map((n, idx) => {
      return {
        ...n,
        x: canvasWidth / 2 + (Math.random() - 0.5) * 350,
        y: canvasHeight / 2 + (Math.random() - 0.5) * 280,
        vx: 0,
        vy: 0,
        radius: 10 + n.conns * 2.2
      };
    });

    simLinks = kgLinks.map(l => {
      return {
        ...l,
        sourceNode: simNodes.find(n => n.id === l.source),
        targetNode: simNodes.find(n => n.id === l.target)
      };
    }).filter(l => l.sourceNode && l.targetNode);

    // Canvas Events
    canvas.addEventListener('mousemove', handleCanvasMouseMove);
    canvas.addEventListener('mousedown', handleCanvasMouseDown);
    window.addEventListener('mouseup', handleCanvasMouseUp);

    // Category Filter Buttons
    document.querySelectorAll('.kg-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.kg-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.selectedKgCategory = btn.dataset.cat;
        playUiTone('click');
      });
    });

    // Timeline Filter
    const eraSlider = document.getElementById('kg-era-slider');
    if (eraSlider) {
      eraSlider.addEventListener('input', (e) => {
        const eras = ['all', 'Ancient', 'Classical', 'Renaissance', 'Industrial', 'Digital'];
        state.selectedKgEra = eras[e.target.value] || 'all';
        const label = document.getElementById('kg-era-label');
        if (label) label.textContent = `ERA: ${state.selectedKgEra.toUpperCase()}`;
        playUiTone('inspect');
      });
    }

    // Search Box
    const searchInput = document.getElementById('kg-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.toLowerCase().trim();
      });
    }

    requestAnimationFrame(renderForceLoop);
  }

  function resizeForceCanvas() {
    if (!canvas) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvasWidth = rect.width;
    canvasHeight = rect.height;
    canvas.width = canvasWidth * window.devicePixelRatio;
    canvas.height = canvasHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  function renderForceLoop() {
    // Physical Force Step
    const repulsion = 450;
    const springLen = 95;
    const springK = 0.04;
    const damping = 0.88;

    for (let i = 0; i < simNodes.length; i++) {
      for (let j = i + 1; j < simNodes.length; j++) {
        const dx = simNodes[j].x - simNodes[i].x;
        const dy = simNodes[j].y - simNodes[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        if (dist < 260) {
          const force = repulsion / (dist * dist);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          simNodes[i].vx -= fx;
          simNodes[i].vy -= fy;
          simNodes[j].vx += fx;
          simNodes[j].vy += fy;
        }
      }
    }

    // Link spring forces
    simLinks.forEach(l => {
      const dx = l.targetNode.x - l.sourceNode.x;
      const dy = l.targetNode.y - l.sourceNode.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const force = (dist - springLen) * springK;
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      l.sourceNode.vx += fx;
      l.sourceNode.vy += fy;
      l.targetNode.vx -= fx;
      l.targetNode.vy -= fy;
    });

    // Center Gravity & Integration
    const cx = canvasWidth / 2;
    const cy = canvasHeight / 2;
    simNodes.forEach(n => {
      if (n === draggedNode) return;
      n.vx += (cx - n.x) * 0.005;
      n.vy += (cy - n.y) * 0.005;
      n.vx *= damping;
      n.vy *= damping;
      n.x += n.vx;
      n.y += n.vy;

      // Keep within bounds
      n.x = Math.max(n.radius + 10, Math.min(canvasWidth - n.radius - 10, n.x));
      n.y = Math.max(n.radius + 10, Math.min(canvasHeight - n.radius - 10, n.y));
    });

    // Render Canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw Links
    simLinks.forEach(l => {
      const isSrcMatch = isNodeActive(l.sourceNode);
      const isTgtMatch = isNodeActive(l.targetNode);
      const isHighlighted = (state.highlightedNodeId && (l.sourceNode.id === state.highlightedNodeId || l.targetNode.id === state.highlightedNodeId));

      ctx.beginPath();
      ctx.moveTo(l.sourceNode.x, l.sourceNode.y);
      ctx.lineTo(l.targetNode.x, l.targetNode.y);

      if (isHighlighted) {
        ctx.strokeStyle = '#D7FF3A';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([]);
      } else {
        ctx.strokeStyle = '#2C2C3A';
        ctx.lineWidth = 1;
        if (l.type === 'derived_from') {
          ctx.setLineDash([4, 4]);
        } else if (l.type === 'used_in') {
          ctx.setLineDash([2, 4]);
        } else {
          ctx.setLineDash([]);
        }
      }
      ctx.globalAlpha = (isSrcMatch && isTgtMatch) ? (isHighlighted ? 0.9 : 0.4) : 0.08;
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Draw Nodes
    simNodes.forEach(n => {
      const active = isNodeActive(n);
      const isHover = (hoveredNode && hoveredNode.id === n.id);
      const isSelected = (state.highlightedNodeId === n.id);
      const color = categoryColors[n.cat] || '#D7FF3A';

      ctx.save();
      ctx.globalAlpha = active ? 1 : 0.15;
      ctx.translate(n.x, n.y);

      // Node background & shape
      ctx.fillStyle = isSelected ? '#D7FF3A' : (isHover ? '#FFFFFF' : color);
      ctx.shadowColor = isSelected ? 'rgba(215, 255, 58, 0.8)' : color;
      ctx.shadowBlur = (isSelected || isHover) ? 18 : 6;

      drawNodeShape(ctx, categoryShapes[n.cat], n.radius);

      // Node Label Text
      ctx.shadowBlur = 0;
      ctx.fillStyle = isSelected ? '#000000' : '#FFFFFF';
      ctx.font = '600 10px Chakra Petch';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if (isSelected || isHover || n.conns > 6) {
        ctx.fillText(n.title.slice(0, 10), 0, n.radius + 14);
      }

      ctx.restore();
    });

    requestAnimationFrame(renderForceLoop);
  }

  function isNodeActive(node) {
    if (state.selectedKgCategory !== 'all' && node.cat !== state.selectedKgCategory) return false;
    if (state.selectedKgEra !== 'all' && node.era !== state.selectedKgEra) return false;
    if (state.searchQuery && !node.title.toLowerCase().includes(state.searchQuery) && !node.en.toLowerCase().includes(state.searchQuery)) {
      return false;
    }
    return true;
  }

  function drawNodeShape(c, shape, r) {
    c.beginPath();
    if (shape === 'square') {
      c.rect(-r, -r, r * 2, r * 2);
    } else if (shape === 'triangle') {
      c.moveTo(0, -r * 1.2);
      c.lineTo(r, r * 0.8);
      c.lineTo(-r, r * 0.8);
      c.closePath();
    } else if (shape === 'diamond') {
      c.moveTo(0, -r * 1.2);
      c.lineTo(r * 1.1, 0);
      c.lineTo(0, r * 1.2);
      c.lineTo(-r * 1.1, 0);
      c.closePath();
    } else if (shape === 'hexagon') {
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const x = r * Math.cos(angle);
        const y = r * Math.sin(angle);
        if (i === 0) c.moveTo(x, y);
        else c.lineTo(x, y);
      }
      c.closePath();
    } else if (shape === 'ring') {
      c.arc(0, 0, r, 0, Math.PI * 2);
      c.stroke();
      c.beginPath();
      c.arc(0, 0, r * 0.4, 0, Math.PI * 2);
    } else {
      // Default circle
      c.arc(0, 0, r, 0, Math.PI * 2);
    }
    c.fill();
  }

  function handleCanvasMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (draggedNode) {
      draggedNode.x = mx;
      draggedNode.y = my;
      return;
    }

    hoveredNode = null;
    for (let i = simNodes.length - 1; i >= 0; i--) {
      const n = simNodes[i];
      const dist = Math.hypot(n.x - mx, n.y - my);
      if (dist <= n.radius + 6) {
        hoveredNode = n;
        canvas.style.cursor = 'pointer';
        updateInspectorHUD(n);
        break;
      }
    }
    if (!hoveredNode) {
      canvas.style.cursor = 'grab';
    }
  }

  function handleCanvasMouseDown(e) {
    if (hoveredNode) {
      draggedNode = hoveredNode;
      state.highlightedNodeId = hoveredNode.id;
      playUiTone('click');
      updateInspectorHUD(hoveredNode);
    } else {
      state.highlightedNodeId = null;
    }
  }

  function handleCanvasMouseUp() {
    draggedNode = null;
  }

  function updateInspectorHUD(node) {
    const idEl = document.getElementById('inspector-code');
    const titleEl = document.getElementById('inspector-title');
    const catEl = document.getElementById('inspector-category');
    const eraEl = document.getElementById('inspector-era');
    const takeawayEl = document.getElementById('inspector-takeaway');

    if (idEl) idEl.textContent = `GRM-${node.year < 0 ? Math.abs(node.year) + 'BC' : node.year}-${node.cat.toUpperCase()}-00${node.id.replace('n', '')}`;
    if (titleEl) titleEl.textContent = `${node.title} (${node.en})`;
    if (catEl) catEl.textContent = node.cat.toUpperCase();
    if (eraEl) eraEl.textContent = `${node.era} Era // Year ${node.year}`;
    if (takeawayEl) takeawayEl.textContent = node.takeaway;
  }

  // ---------------------------------------------------------------------------
  // INTERACTIVE GALLERY LIGHTBOX & THUMBNAILS
  // ---------------------------------------------------------------------------
  function initKgGallery() {
    const thumbs = document.querySelectorAll('.kg-thumb');
    const activeImg = document.getElementById('kg-active-img');
    const captionTitle = document.getElementById('kg-caption-title');
    const captionDesc = document.getElementById('kg-caption-desc');
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    const captions = [
      { title: 'มุมมองที่ 1: ภาพรวมแนวคิดสถาปัตยกรรม (Conceptual Overview)', desc: 'แสดงการรับเข้าจาก Books, Textbooks, Databases, Community สู่แก่นกลาง Knowledge Graph' },
      { title: 'มุมมองที่ 2: 3D Isometric Sci-Fi Laboratory', desc: 'ห้องแล็บไซไฟของนักโบราณคดีจากอนาคต สกัดข้อมูลดิบสู่ 5 ขั้น Discover → Apply' },
      { title: 'มุมมองที่ 3: ทรงกลมฮอโลกราฟิก & การสังเคราะห์ความรู้ (Holographic Sphere)', desc: 'แสดง Semantic Links (Part of, Causes, Used for) และ Knowledge Synthesis' },
      { title: 'มุมมองที่ 4: ฉบับโมเดิร์นอาร์ตบนพื้นกระดาษจดหมายเหตุ (Archive Paper)', desc: 'ความนิ่งเรียบสไตล์ Modern Art Gallery ในโทนสีกระดาษประวัติศาสตร์ Archive Paper' },
      { title: 'มุมมองที่ 5: แผนที่ความคิดการสังเคราะห์แสง & ชีวิต (Mind Map)', desc: 'ตัวอย่าง Knowledge Graph เรื่องการสังเคราะห์แสงและสิ่งแวดล้อมที่เข้าใจง่ายใน 3 วินาที' },
      { title: 'มุมมองที่ 6: แผนที่รวมความรู้มนุษยชาติ (Unified Map of Human Knowledge)', desc: 'มหากาพย์การบูรณาการอารยธรรมมนุษย์ ตอบคำถามที่ซับซ้อนเพื่อการนำไปใช้จริงในสังคม' }
    ];

    thumbs.forEach((thumb, idx) => {
      thumb.addEventListener('click', () => {
        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        const imgSrc = thumb.dataset.src;
        if (activeImg) activeImg.src = imgSrc;
        if (captionTitle && captions[idx]) captionTitle.textContent = captions[idx].title;
        if (captionDesc && captions[idx]) captionDesc.textContent = captions[idx].desc;
        playUiTone('click');
      });
    });

    if (activeImg && lightbox && lightboxImg) {
      activeImg.addEventListener('click', () => {
        lightboxImg.src = activeImg.src;
        lightbox.classList.add('open');
        playUiTone('click');
      });
    }

    if (lightboxClose && lightbox) {
      lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('open');
        playUiTone('click');
      });
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
          lightbox.classList.remove('open');
          playUiTone('click');
        }
      });
    }
  }

  // ---------------------------------------------------------------------------
  // INTERACTIVE PERSONA SWITCHER
  // ---------------------------------------------------------------------------
  function initPersonas() {
    const cards = document.querySelectorAll('.persona-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        playUiTone('click');
      });
    });
  }

  // ---------------------------------------------------------------------------
  // INTERACTIVE PERCEPTUAL MAP
  // ---------------------------------------------------------------------------
  function initPerceptualMap() {
    const points = document.querySelectorAll('.map-point');
    const infoTitle = document.getElementById('perceptual-point-title');
    const infoDesc = document.getElementById('perceptual-point-desc');

    points.forEach(point => {
      point.addEventListener('click', () => {
        points.forEach(p => p.classList.remove('active-point'));
        point.classList.add('active-point');
        if (infoTitle) infoTitle.textContent = point.dataset.name;
        if (infoDesc) infoDesc.textContent = point.dataset.desc;
        playUiTone('click');
      });
    });
  }

  // ---------------------------------------------------------------------------
  // KEYBOARD & GESTURE NAVIGATION
  // ---------------------------------------------------------------------------
  function initKeyboardAndTouch() {
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
        case ' ':
          e.preventDefault();
          nextSlide();
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          prevSlide();
          break;
        case 'Home':
          e.preventDefault();
          goToSlide(0);
          break;
        case 'End':
          e.preventDefault();
          goToSlide(state.totalSlides - 1);
          break;
        case 'o':
        case 'O':
        case 'Escape':
          toggleOverview();
          break;
        case 'n':
        case 'N':
          toggleNotes();
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case 'm':
        case 'M':
          toggleSound();
          break;
        case 't':
        case 'T':
          toggleTheme();
          break;
      }
    });

    // Touch Swipe
    let touchStartX = 0;
    let touchStartY = 0;

    window.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      const touchEndY = e.changedTouches[0].screenY;
      const dx = touchEndX - touchStartX;
      const dy = touchEndY - touchStartY;

      if (Math.abs(dx) > 60 && Math.abs(dy) < 80) {
        if (dx < 0) nextSlide();
        else prevSlide();
      }
    }, { passive: true });
  }

  // ---------------------------------------------------------------------------
  // DOM READY INITIALIZATION
  // ---------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    // Generate Dots
    const dotsContainer = document.getElementById('slide-dots');
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      for (let i = 0; i < state.totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = 'slide-dot';
        dot.title = `Slide ${i + 1}: ${slidesData[i].title}`;
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      }
    }

    // Generate Overview Cards
    const overviewGrid = document.getElementById('overview-grid');
    if (overviewGrid) {
      overviewGrid.innerHTML = '';
      slidesData.forEach((s, idx) => {
        const card = document.createElement('div');
        card.className = 'overview-card gr-chamfer';
        card.innerHTML = `
          <div class="overview-card-num">${s.code}</div>
          <div class="overview-card-title">${s.num}. ${s.title}</div>
          <div class="overview-card-desc">${s.subtitle}</div>
        `;
        card.addEventListener('click', () => {
          goToSlide(idx);
          toggleOverview(false);
        });
        overviewGrid.appendChild(card);
      });
    }

    // Header & Footer Buttons
    document.getElementById('prev-slide-btn')?.addEventListener('click', prevSlide);
    document.getElementById('next-slide-btn')?.addEventListener('click', nextSlide);
    document.getElementById('btn-overview')?.addEventListener('click', () => toggleOverview());
    document.getElementById('overview-close-btn')?.addEventListener('click', () => toggleOverview(false));
    document.getElementById('btn-notes')?.addEventListener('click', () => toggleNotes());
    document.getElementById('notes-close-btn')?.addEventListener('click', () => toggleNotes(false));
    document.getElementById('btn-theme')?.addEventListener('click', toggleTheme);
    document.getElementById('btn-fullscreen')?.addEventListener('click', toggleFullscreen);
    document.getElementById('btn-sound')?.addEventListener('click', toggleSound);

    // Initial Systems
    initKeyboardAndTouch();
    initDataBooming();
    initForceGraph();
    initKgGallery();
    initPersonas();
    initPerceptualMap();
    updateSlideUI();

    // Export helpers to window for slide interactions
    window.goToSlide = goToSlide;
    window.resizeForceCanvas = resizeForceCanvas;
  });

})();
