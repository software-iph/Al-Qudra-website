/**
 * First-run content for the website, written from the company identity file
 * ("ملف الهوية المؤسسية", October 2026) and the previous website.
 * Everything here becomes editable in the dashboard after seeding; seeding
 * never overwrites a value that already exists in the database.
 */

type T = [key: string, label: string, type: "text" | "textarea" | "list", en: string, ar: string];

export const TEXT_GROUPS: Record<string, string> = {
  nav: "Menu & buttons",
  home: "Home page",
  about: "About page",
  services: "Services page",
  careers: "Careers page",
  gallery: "Gallery page",
  contact: "Contact page",
  footer: "Footer",
  forms: "Form messages",
};

export const TEXTS: T[] = [
  // ---- Menu ----
  ["nav.home", "Menu: Home", "text", "Home", "الرئيسية"],
  ["nav.about", "Menu: About", "text", "About us", "من نحن"],
  ["nav.services", "Menu: Services", "text", "Services", "خدماتنا"],
  ["nav.careers", "Menu: Careers", "text", "Careers", "الوظائف"],
  ["nav.gallery", "Menu: Gallery", "text", "Gallery", "معرض الصور"],
  ["nav.contact", "Menu: Contact", "text", "Contact", "تواصل معنا"],
  ["nav.cta", "Header button", "text", "Start a project", "ابدأ مشروعك"],
  ["nav.learn_more", "\"Learn more\" links", "text", "Learn more", "اعرف المزيد"],
  ["nav.view_all", "\"View all\" links", "text", "View all", "عرض الكل"],
  ["nav.scroll", "Home hero: scroll hint", "text", "Scroll", "مرّر"],

  // ---- Home ----
  ["home.hero_eyebrow", "Hero: small line above the title", "text", "Engineering consultancy · Libya", "استشارات هندسية · ليبيا"],
  ["home.hero_title", "Hero: title", "text", "Precision, governance and quality on every project.", "الدقة والحوكمة والجودة في كل مشروع."],
  ["home.hero_text", "Hero: paragraph", "textarea",
    "Al-Qudra for Engineering Consultancy and Services is a leading consultancy built on precision, innovation and an unwavering commitment to the highest standards of quality and engineering governance.",
    "شركة القدرة للاستشارات والخدمات الهندسية مؤسسة استشارية رائدة ومنظومة متكاملة تُبنى على الدقة والابتكار والالتزام بأعلى معايير الجودة والحوكمة الهندسية."],
  ["home.hero_primary", "Hero: main button", "text", "Explore our services", "استكشف خدماتنا"],
  ["home.hero_secondary", "Hero: second button", "text", "Talk to our team", "تحدث مع فريقنا"],
  ["home.about_eyebrow", "Who we are: small title", "text", "Who we are", "من نحن"],
  ["home.about_title", "Who we are: title", "text", "Engineering is a human and national responsibility.", "الهندسة مسؤولية إنسانية ووطنية."],
  ["home.about_text", "Who we are: paragraph", "textarea",
    "Al-Qudra is an integrated engineering consultancy that combines deep-rooted values with profound engineering expertise. Our specialists pair global engineering standards with a precise understanding of the local context to deliver effective, sustainable and detail-driven solutions.",
    "القدرة مؤسسة هندسية استشارية متكاملة تدمج بين القيم الراسخة والخبرة الهندسية العميقة. يعمل فريقنا من الخبراء على الدمج بين المعايير الهندسية العالمية والفهم الدقيق للبيئة المحلية، لتقديم حلول فعّالة ومستدامة تُعنى بأدق التفاصيل."],
  ["home.q3_eyebrow", "Q³: small title", "text", "Our methodology", "منهجيتنا"],
  ["home.q3_title", "Q³: title", "text", "The Q³ philosophy", "فلسفة Q³"],
  ["home.q3_text", "Q³: paragraph", "textarea",
    "Our brand identity is rooted in the Q³ philosophy, the core methodology that drives all of our advisory services through three fundamental pillars.",
    "ترتكز هويتنا على فلسفة Q³، وهي المنهجية التي تدير كافة خدماتنا الاستشارية من خلال ثلاث ركائز أساسية."],
  ["home.services_eyebrow", "Services: small title", "text", "What we do", "ماذا نقدم"],
  ["home.services_title", "Services: title", "text", "Managing and auditing every phase of strategic projects.", "إدارة وتدقيق كافة مراحل المشاريع الاستراتيجية."],
  ["home.strengths_eyebrow", "Strengths: small title", "text", "Why Al-Qudra", "لماذا القدرة"],
  ["home.strengths_title", "Strengths: title", "text", "We go beyond site supervision.", "لا نكتفي بالإشراف على المواقع."],
  ["home.strengths_text", "Strengths: paragraph", "textarea",
    "We take full responsibility for the success of every project, from the earliest planning stages through to final delivery.",
    "نتحمل مسؤولية النجاح الكامل لكل مشروع، من أولى مراحل التخطيط حتى لحظة التسليم النهائي."],
  ["home.gallery_eyebrow", "Gallery strip: small title", "text", "Inside Al-Qudra", "من داخل القدرة"],
  ["home.gallery_title", "Gallery strip: title", "text", "The team behind every approval.", "الفريق وراء كل اعتماد."],
  ["home.gallery_text", "Gallery strip: paragraph", "textarea",
    "Engineers, reviewers and specialists working side by side, from the first drawing review to the final site approval.",
    "مهندسون ومراجعون ومتخصصون يعملون جنبًا إلى جنب، من أول مراجعة للمخططات حتى الاعتماد النهائي في الموقع."],
  ["home.gallery_photos", "Gallery strip: \"photos\" label", "text", "photos", "صورة"],
  ["home.cta_title", "Bottom banner: title", "text", "Have a project that needs a trusted engineering partner?", "لديك مشروع يحتاج إلى شريك هندسي موثوق؟"],
  ["home.cta_text", "Bottom banner: paragraph", "textarea",
    "Tell us about it. Our engineers will get back to you with a clear plan for supervision, review and quality control.",
    "أخبرنا عنه، وسيتواصل معك مهندسونا بخطة واضحة للإشراف والمراجعة وضبط الجودة."],
  ["home.cta_button", "Bottom banner: button", "text", "Contact us", "تواصل معنا"],

  // ---- About ----
  ["about.title", "Page title", "text", "About Al-Qudra", "عن شركة القدرة"],
  ["about.intro", "Intro line under the title", "textarea",
    "A trusted partner in construction and development, specialised in engineering supervision, technical review and quality control.",
    "الشريك الموثوق في عالم الإنشاءات والتطوير، المتخصص في الإشراف الهندسي والمراجعة الفنية وضبط الجودة."],
  ["about.story_title", "Story: title", "text", "Our story", "قصتنا"],
  ["about.story", "Story: paragraphs (one per line)", "list",
    [
      "Al-Qudra for Engineering Consultancy and Services is a leading engineering consultancy firm and an integrated ecosystem built on precision, innovation, and an unwavering commitment to the highest standards of quality and engineering governance.",
      "The company was founded to be the trusted partner in the world of construction and development, specialising in engineering supervision, technical review, quality control management, and delivering integrated engineering solutions that balance operational efficiency with visual aesthetics.",
      "Throughout our journey, we have participated in the supervision of more than 1,000 projects for over 200 clients across cities throughout Libya, with a steadfast focus on the infrastructure and urban planning sectors.",
      "Every study receives dedicated attention, and every document undergoes rigorous review, because our philosophy is grounded in one principle: engineering is not merely designs and blueprints. It is a human and national responsibility that we carry with professionalism and devotion toward our clients, society, and the environment.",
    ].join("\n"),
    [
      "شركة القدرة للاستشارات والخدمات الهندسية مؤسسة استشارية رائدة ومنظومة متكاملة تُبنى على الدقة والابتكار والالتزام بأعلى معايير الجودة والحوكمة الهندسية.",
      "تأسست الشركة لتكون الشريك الموثوق في عالم الإنشاءات والتطوير، حيث تتخصص في الإشراف الهندسي والمراجعة الفنية وإدارة ضبط الجودة، وتقديم حلول هندسية متكاملة تجمع بين الكفاءة التشغيلية والجمالية البصرية.",
      "على مدار مسيرتنا، شاركنا في الإشراف على أكثر من 1,000 مشروع لأكثر من 200 عميل في أكثر من مدينة حول ليبيا، مع تركيز راسخ على قطاعي البنية التحتية والتخطيط العمراني.",
      "كل دراسة تحظى باهتمام خاص، وكل مستند يخضع لمراجعة دقيقة، لأن فلسفتنا تنطلق من مبدأ واحد: الهندسة ليست مجرد تصاميم ومخططات، بل هي مسؤولية إنسانية ووطنية نحملها باحترافية وإخلاص تجاه العميل والمجتمع والبيئة.",
    ].join("\n")],
  ["about.vision_title", "Vision: title", "text", "Our vision", "رؤيتنا"],
  ["about.vision", "Vision: text", "textarea",
    "To be the most trusted engineering consultancy on the local level, and the primary benchmark for supervisory excellence and engineering governance in major national projects.",
    "أن نكون الشركة الاستشارية الأكثر اعتمادًا على الصعيد المحلي، والمرجع الأول في جودة الإشراف والحوكمة الهندسية للمشاريع الوطنية الكبرى."],
  ["about.mission_title", "Mission: title", "text", "Our mission", "رسالتنا"],
  ["about.mission", "Mission: text", "textarea",
    "To deliver world-class engineering consultancy services grounded in rigorous governance, technical precision and innovation, while upholding the highest standards of safety and quality.",
    "تقديم خدمات واستشارات هندسية عالمية المستوى تعتمد على الحوكمة الدقيقة والضبط الفني والابتكار، مع الحفاظ على أعلى معايير السلامة والجودة."],
  ["about.values_title", "Values: title", "text", "Our core values", "قيمنا الجوهرية"],
  ["about.values_text", "Values: paragraph", "textarea",
    "Our core values form the foundation upon which every decision and every action within the company is built.",
    "تمثل قيمنا الجوهرية الركيزة التي يقوم عليها كل قرار وكل إجراء داخل الشركة."],
  ["about.goals_title", "Strategic goals: title", "text", "Strategic goals", "الأهداف الاستراتيجية"],
  ["about.quote", "Closing quote", "textarea",
    "Al-Qudra is not just a consultancy name. It is the standard of quality and the guarantee of structural safety for every facility under its supervision.",
    "القدرة ليست مجرد اسم استشاري، بل هي ضابط الجودة وصمام الأمان لكل منشأة تُشرف عليها."],

  // ---- Services ----
  ["services.title", "Page title", "text", "Our services", "خدماتنا"],
  ["services.intro", "Intro paragraph", "textarea",
    "Al-Qudra specialises in managing and auditing all phases of strategic projects and infrastructure in accordance with international quality standards.",
    "تتخصص القدرة في إدارة وتدقيق كافة مراحل المشاريع الاستراتيجية والبنية التحتية وفق معايير الجودة العالمية."],
  ["services.process_title", "How we work: title", "text", "How we work", "كيف نعمل"],
  ["services.process", "How we work: steps (one per line, \"Title: description\")", "list",
    [
      "Design review: We study the initial designs and engineering studies before work begins.",
      "Approvals: Shop drawings and work methods are audited against approved standards and specifications.",
      "Site supervision: Our engineers monitor execution quality and structural safety on site.",
      "Reporting & handover: Documented periodic reports through to the approval of final execution drawings.",
    ].join("\n"),
    [
      "مراجعة التصاميم: ندرس التصاميم الأولية والدراسات الهندسية قبل بدء التنفيذ.",
      "الاعتمادات: تدقيق المخططات التنفيذية وأساليب العمل وفق المعايير والمواصفات المعتمدة.",
      "الإشراف الميداني: متابعة جودة التنفيذ وضبط السلامة الإنشائية في الموقع.",
      "التقارير والتسليم: تقارير دورية موثقة حتى اعتماد المخططات التنفيذية النهائية.",
    ].join("\n")],

  ["services.video_eyebrow", "Video: small title", "text", "On site", "في الموقع"],
  ["services.video_title", "Video: title", "text", "Where every approval is earned.", "حيث يُكتسب كل اعتماد."],
  ["services.video_text", "Video: paragraph", "textarea",
    "Our engineers follow execution quality and structural safety in person, every day, until final handover.",
    "يتابع مهندسونا جودة التنفيذ والسلامة الإنشائية ميدانيًا، يومًا بيوم، حتى التسليم النهائي."],
  ["services.video_play", "Video: play button (screen readers)", "text", "Play video", "تشغيل الفيديو"],
  ["services.video_pause", "Video: pause button (screen readers)", "text", "Pause video", "إيقاف الفيديو"],

  // ---- Careers ----
  ["careers.title", "Page title", "text", "Careers", "الوظائف"],
  ["careers.intro", "Intro paragraph", "textarea",
    "Do you aspire to shape the future of engineering and leave a lasting impact on communities and industries? Join a team that trains and empowers national engineering talent to lead with precision.",
    "هل تطمح إلى صناعة مستقبل الهندسة وترك أثر دائم في المجتمعات والقطاعات؟ انضم إلى فريق يؤهل ويمكّن الكوادر الهندسية الوطنية لتقود بدقة واحترافية."],
  ["careers.openings_title", "Openings: title", "text", "Current openings", "الوظائف المتاحة"],
  ["careers.empty", "Text when there are no openings", "textarea",
    "There are no open positions right now. You are welcome to send us your CV for future opportunities.",
    "لا توجد وظائف شاغرة حاليًا. يسعدنا استلام سيرتك الذاتية للفرص القادمة."],
  ["careers.apply", "Apply button", "text", "Apply by email", "قدّم عبر البريد"],
  ["careers.send_cv", "Send CV line", "text", "Send your CV to", "أرسل سيرتك الذاتية إلى"],
  ["careers.full_time", "Label: Full time", "text", "Full time", "دوام كامل"],
  ["careers.part_time", "Label: Part time", "text", "Part time", "دوام جزئي"],
  ["careers.contract", "Label: Contract", "text", "Contract", "عقد"],
  ["careers.internship", "Label: Internship", "text", "Internship", "تدريب"],
  ["careers.on_site", "Label: On-site", "text", "On-site", "في الموقع"],
  ["careers.remote", "Label: Remote", "text", "Remote", "عن بُعد"],
  ["careers.hybrid", "Label: Hybrid", "text", "Hybrid", "هجين"],

  // ---- Gallery ----
  ["gallery.title", "Page title", "text", "Gallery", "معرض الصور"],
  ["gallery.intro", "Intro paragraph", "textarea",
    "A look inside Al-Qudra: our team, our offices and the work behind every approval.",
    "نظرة من داخل القدرة: فريقنا ومكاتبنا والعمل الذي يقف وراء كل اعتماد."],

  // ---- Contact ----
  ["contact.title", "Page title", "text", "Contact us", "تواصل معنا"],
  ["contact.intro", "Intro paragraph", "textarea",
    "Tell us about your project or question. Our team will get back to you as soon as possible.",
    "أخبرنا عن مشروعك أو استفسارك، وسيتواصل معك فريقنا في أقرب وقت ممكن."],
  ["contact.address", "Office address", "textarea", "4th Floor, Golden Square, Garyounis, Benghazi, Libya", "الطابق الرابع، المربع الذهبي، قاريونس، بنغازي، ليبيا"],
  ["contact.address_label", "Label: Address", "text", "Office", "المكتب"],
  ["contact.phone_label", "Label: Phone", "text", "Phone", "الهاتف"],
  ["contact.email_label", "Label: Email", "text", "Email", "البريد الإلكتروني"],
  ["contact.hours_label", "Label: Working hours", "text", "Working hours", "ساعات العمل"],
  ["contact.hours", "Working hours", "text", "Sunday – Thursday, 9:00 – 17:00", "الأحد – الخميس، 9:00 – 17:00"],
  ["contact.form_title", "Form title", "text", "Send us a message", "أرسل لنا رسالة"],
  ["contact.name", "Field: Name", "text", "Full name", "الاسم الكامل"],
  ["contact.email", "Field: Email", "text", "Email address", "البريد الإلكتروني"],
  ["contact.phone", "Field: Phone", "text", "Phone (optional)", "الهاتف (اختياري)"],
  ["contact.subject", "Field: Subject", "text", "Subject", "الموضوع"],
  ["contact.message", "Field: Message", "text", "How can we help?", "كيف يمكننا مساعدتك؟"],
  ["contact.send", "Send button", "text", "Send message", "إرسال الرسالة"],
  ["contact.map", "Map link text", "text", "Open in Google Maps", "افتح في خرائط Google"],

  // ---- Footer ----
  ["footer.about", "Short description", "textarea",
    "Engineering supervision, technical review and quality control for strategic projects and infrastructure across Libya.",
    "إشراف هندسي ومراجعة فنية وضبط جودة للمشاريع الاستراتيجية والبنية التحتية في جميع أنحاء ليبيا."],
  ["footer.links", "Column title: pages", "text", "Company", "الشركة"],
  ["footer.contact", "Column title: contact", "text", "Get in touch", "تواصل معنا"],
  ["footer.newsletter", "Newsletter title", "text", "Stay updated", "ابقَ على اطلاع"],
  ["footer.newsletter_text", "Newsletter text", "textarea", "News about our projects and opportunities, a few times a year.", "أخبار مشاريعنا وفرصنا، بضع مرات في السنة."],
  ["footer.rights", "Copyright line", "text", "Al-Qudra for Engineering Consultancy and Services. All rights reserved.", "شركة القدرة للاستشارات والخدمات الهندسية. جميع الحقوق محفوظة."],

  // ---- Form messages ----
  ["forms.sending", "While sending", "text", "Sending...", "جارٍ الإرسال..."],
  ["forms.contact_success", "Contact form: success", "text", "Thank you. Your message has been sent and we will be in touch soon.", "شكرًا لك. تم إرسال رسالتك وسنتواصل معك قريبًا."],
  ["forms.subscribe_placeholder", "Newsletter: placeholder", "text", "Your email address", "بريدك الإلكتروني"],
  ["forms.subscribe_button", "Newsletter: button", "text", "Subscribe", "اشترك"],
  ["forms.subscribe_success", "Newsletter: success", "text", "You're subscribed. Thank you!", "تم الاشتراك. شكرًا لك!"],
  ["forms.invalid", "Validation error", "text", "Please check the highlighted fields.", "يرجى مراجعة الحقول المحددة."],
  ["forms.error", "Server error", "text", "Something went wrong. Please try again.", "حدث خطأ ما. يرجى المحاولة مرة أخرى."],
];

type M = [key: string, group: string, label: string, type: "image" | "video", src: string];

export const MEDIA: M[] = [
  ["brand.logo_dark", "Brand", "Logo (navy, for light backgrounds)", "image", "/brand/logo-navy.png"],
  ["brand.logo_light", "Brand", "Logo (white, for dark backgrounds)", "image", "/brand/logo-white.png"],
  ["home.hero_video", "Home", "Hero background video", "video", "/videos/hero.mp4"],
  ["home.hero_poster", "Home", "Hero image (shown while the video loads)", "image", "/images/hero-poster.webp"],
  ["home.about_image", "Home", "Who we are: main photo", "image", "/images/about-b1.webp"],
  ["home.about_image_2", "Home", "Who we are: small photo", "image", "/images/about-two-three.webp"],
  ["home.q3_image", "Home", "Q³ section photo", "image", "/images/counter-image.webp"],
  ["home.cta_image", "Home", "Bottom banner background", "image", "/images/career-2.webp"],
  ["about.hero_image", "About page", "Header photo", "image", "/images/about-one.png"],
  ["about.story_image", "About page", "Our story photo", "image", "/images/building.jpg"],
  ["about.vision_image", "About page", "Vision & mission photo", "image", "/images/about-b2.webp"],
  ["services.hero_image", "Services page", "Header photo", "image", "/images/career-1.webp"],
  ["services.video", "Services page", "Office video", "video", "/videos/office.mp4"],
  ["careers.hero_image", "Careers page", "Header photo", "image", "/images/counter-b1.webp"],
  ["gallery.hero_image", "Gallery page", "Header photo", "image", "/images/counter-bb1.webp"],
  ["contact.hero_image", "Contact page", "Header photo", "image", "/images/career-2.webp"],
];

type S = [key: string, group: string, label: string, type: "text" | "email" | "url" | "phone", value: string];

export const SETTINGS: S[] = [
  ["phone", "Contact details", "Phone number", "phone", "+218 92 950 6638"],
  ["email", "Contact details", "Main email", "email", "info@alqudra-ec.com"],
  ["careers_email", "Contact details", "Careers email (CVs)", "email", "info@alqudra-ec.com"],
  ["map_url", "Contact details", "Google Maps link", "url", "https://www.google.com/maps/search/?api=1&query=Golden+Square+Garyounis+Benghazi"],
  ["whatsapp", "Contact details", "WhatsApp number (digits only, e.g. 218929506638)", "text", "218929506638"],
  ["facebook_url", "Social media", "Facebook", "url", ""],
  ["instagram_url", "Social media", "Instagram", "url", ""],
  ["linkedin_url", "Social media", "LinkedIn", "url", ""],
  ["x_url", "Social media", "X (Twitter)", "url", ""],
];

type L = { titleEn: string; titleAr: string; bodyEn: string; bodyAr: string; icon: string };

export const LISTS: Record<string, { label: string; items: L[] }> = {
  stats: {
    label: "Headline numbers",
    items: [
      { titleEn: "Projects supervised", titleAr: "مشروع تحت إشرافنا", bodyEn: "1000", bodyAr: "1000", icon: "building-2" },
      { titleEn: "Clients served", titleAr: "عميل وثق بنا", bodyEn: "200", bodyAr: "200", icon: "handshake" },
      { titleEn: "Engineers & specialists", titleAr: "مهندس ومتخصص", bodyEn: "100", bodyAr: "100", icon: "hard-hat" },
    ],
  },
  q3: {
    label: "Q³ pillars",
    items: [
      { titleEn: "Quality", titleAr: "الجودة", bodyEn: "An unshakeable commitment to delivering integrated engineering solutions that guarantee the highest levels of performance, efficiency and reliability.", bodyAr: "التزام ثابت بتقديم حلول هندسية متكاملة تضمن أعلى مستويات الكفاءة والاعتمادية في الأداء.", icon: "badge-check" },
      { titleEn: "Qualification", titleAr: "الكفاءة", bodyEn: "Leading projects through specialised expertise and elite engineering talent that ensures technical and operational superiority.", bodyAr: "قيادة المشاريع عبر كفاءات وخبرات متخصصة تضمن التفوق التقني والتشغيلي.", icon: "graduation-cap" },
      { titleEn: "Quantification", titleAr: "الدقة الهندسية", bodyEn: "Complete reliance on rigorous analysis, empirical data and measurable engineering methodologies to empower sound decision-making.", bodyAr: "الاعتماد الكلي على التحليل الدقيق والبيانات والمنهجيات الهندسية القابلة للقياس لدعم القرارات الصائبة.", icon: "ruler" },
    ],
  },
  values: {
    label: "Core values",
    items: [
      { titleEn: "Integrity", titleAr: "النزاهة", bodyEn: "Absolute impartiality and scientific honesty in all engineering reports and approvals.", bodyAr: "الحيادية والأمانة العلمية والفنية في كافة التقارير والاعتمادات.", icon: "scale" },
      { titleEn: "Commitment", titleAr: "الالتزام", bodyEn: "Dedication to engineering work, adherence to timelines and full compliance with technical specifications.", bodyAr: "التفاني في العمل الهندسي والالتزام بالجدول الزمني والمواصفات.", icon: "calendar-check" },
      { titleEn: "Accountability", titleAr: "المسؤولية والمحاسبة", bodyEn: "Full ownership of our advisory decisions, technical submittals and quality control.", bodyAr: "تحمّل المسؤولية الكاملة عن القرارات الاستشارية وضبط الجودة.", icon: "shield-check" },
      { titleEn: "Respect", titleAr: "الاحترام", bodyEn: "Honouring engineering codes, safety standards and collaborative industry relationships.", bodyAr: "احترام المعايير المهنية وسلامة البيئة وعلاقتنا مع الشركاء.", icon: "users" },
      { titleEn: "Excellence", titleAr: "التميز", bodyEn: "Pursuing continuous mastery, precision and governance across all operations.", bodyAr: "السعي المستمر للإتقان والتطوير والالتزام بأعلى أنظمة الجودة.", icon: "award" },
    ],
  },
  goals: {
    label: "Strategic goals",
    items: [
      { titleEn: "Consistent excellence", titleAr: "تميز متسق", bodyEn: "Deliver consistent, high-calibre engineering supervision and governance across all projects.", bodyAr: "تقديم خدمات إشراف هندسي وحوكمة عالية المستوى ومتسقة عبر جميع المشاريع.", icon: "target" },
      { titleEn: "Q³ as the benchmark", titleAr: "Q³ معيارًا", bodyEn: "Operationalise the Q³ framework as a standard benchmark to raise consultation efficiency.", bodyAr: "تفعيل منهجية Q³ كمعيار قياسي لرفع كفاءة واعتمادية الحلول الاستشارية.", icon: "gauge" },
      { titleEn: "A growing portfolio", titleAr: "محفظة متنامية", bodyEn: "Expand the Al-Qudra consultancy portfolio while maintaining elite quality control standards.", bodyAr: "التوسع في محفظة المشاريع الاستشارية للشركة مع الحفاظ على أعلى معايير ضبط الجودة.", icon: "trending-up" },
      { titleEn: "National talent", titleAr: "الكوادر الوطنية", bodyEn: "Train and empower national engineering talent to lead site supervision with precision.", bodyAr: "تأهيل وتدريب الكوادر الهندسية الوطنية للقيام بأعمال الإشراف والدراسات بمهارية ودقة.", icon: "graduation-cap" },
      { titleEn: "Strategic partnerships", titleAr: "شراكات استراتيجية", bodyEn: "Build enduring partnerships with government institutions, developers and key stakeholders.", bodyAr: "بناء شراكات استراتيجية مستدامة مع أجهزة الدولة والمطورين والمؤسسات الاقتصادية.", icon: "handshake" },
    ],
  },
  strengths: {
    label: "What sets us apart",
    items: [
      { titleEn: "The Q³ triad philosophy", titleAr: "فلسفة Q³ الثلاثية", bodyEn: "The foundation governing every decision we make and every service we deliver.", bodyAr: "الأساس الذي يحكم كل قرار نتخذه وكل خدمة نقدمها، ضمانًا لمخرجات هندسية بأعلى مستويات الجودة.", icon: "layers" },
      { titleEn: "Rigorous governance", titleAr: "حوكمة هندسية صارمة", bodyEn: "Integrated review systems that safeguard every project against technical and administrative gaps.", bodyAr: "أنظمة مراجعة متكاملة تُحصّن كل مشروع من أي ثغرات تقنية أو إدارية وفق أعلى المعايير الدولية.", icon: "file-check" },
      { titleEn: "A comprehensive vision", titleAr: "رؤية هندسية شاملة", bodyEn: "We accompany every project from initial design review to the approval of final execution drawings.", bodyAr: "نرافق المشروع في كل مراحله، من مراجعة التصاميم الأولية وصولًا إلى اعتماد المخططات التنفيذية النهائية.", icon: "route" },
      { titleEn: "Field competence", titleAr: "كفاءة ميدانية استثنائية", bodyEn: "A qualified team that controls risks before they escalate into costly challenges.", bodyAr: "فريق هندسي مؤهل يعمل باستباقية لإيجاد الحلول والسيطرة على المخاطر قبل أن تتحول إلى تحديات مكلفة.", icon: "hard-hat" },
      { titleEn: "Transparency as a standard", titleAr: "الشفافية كمعيار", bodyEn: "Structured periodic reports that reflect true project progress with complete accuracy.", bodyAr: "تقارير دورية موثقة تعكس التقدم الفعلي للمشروع بدقة وموضوعية تامة.", icon: "clipboard-list" },
      { titleEn: "Proven in major projects", titleAr: "حضور راسخ في المشاريع الكبرى", bodyEn: "The trust of government authorities and leading contractors, earned through technical precision.", bodyAr: "ثقة أجهزة الدولة وكبرى الشركات المنفذة، ثمرة سجل حافل بالدقة التقنية والالتزام المهني.", icon: "landmark" },
      { titleEn: "Environmental responsibility", titleAr: "مسؤولية بيئية", bodyEn: "Sustainability embedded into every decision: we build for the present and protect the future.", bodyAr: "هندسة مسؤولة تُدرج الاستدامة في صميم كل قرار، لأننا لا نبني للحاضر فحسب، بل نصون المستقبل.", icon: "leaf" },
      { titleEn: "A true partnership", titleAr: "شراكة حقيقية", bodyEn: "Our clients' success comes first, and every detail gets the care it deserves.", bodyAr: "نضع نجاح العميل في صدارة أولوياتنا ونمنح كل تفصيل العناية التي يستحقها.", icon: "heart-handshake" },
    ],
  },
};

export const SERVICES = [
  {
    titleEn: "On-site engineering supervision",
    titleAr: "الإشراف الهندسي الميداني",
    summaryEn: "Monitoring execution quality and controlling structural safety at the project site.",
    summaryAr: "متابعة جودة التنفيذ وضبط السلامة الإنشائية في موقع المشروع.",
    pointsEn: "Daily site inspection and execution follow-up\nStructural safety and quality control\nMaterial testing and acceptance\nProgress and compliance reporting",
    pointsAr: "تفتيش يومي ومتابعة للتنفيذ في الموقع\nضبط السلامة الإنشائية والجودة\nاختبار المواد واعتمادها\nتقارير التقدم والمطابقة",
    image: "/images/about-b1.webp",
    icon: "hard-hat",
  },
  {
    titleEn: "Technical review & approvals",
    titleAr: "المراجعة الفنية وإدارة الاعتمادات",
    summaryEn: "Auditing shop drawings and engineering studies, and reviewing work methods for full compliance with approved standards and specifications.",
    summaryAr: "تدقيق المخططات والدراسات الهندسية ومراجعة أساليب العمل لضمان تطابقها الكامل مع المعايير والمواصفات المعتمدة.",
    pointsEn: "Shop drawing and design review\nEngineering study audits\nMethod statement review\nSubmittal and approval management",
    pointsAr: "مراجعة المخططات التنفيذية والتصاميم\nتدقيق الدراسات الهندسية\nمراجعة أساليب العمل\nإدارة التقديمات والاعتمادات",
    image: "/images/counter-image.webp",
    icon: "file-check",
  },
  {
    titleEn: "Engineering governance & document control",
    titleAr: "الحوكمة الهندسية وتدقيق الوثائق",
    summaryEn: "Managing the document cycle and technical correspondence with the highest degree of precision.",
    summaryAr: "ضبط الدورة المستندية والمراسلات الفنية بدقة عالية.",
    pointsEn: "Document cycle management\nTechnical correspondence control\nQuality management systems\nAudit-ready project records",
    pointsAr: "إدارة الدورة المستندية\nضبط المراسلات الفنية\nأنظمة إدارة الجودة\nسجلات مشاريع جاهزة للتدقيق",
    image: "/images/career-1.webp",
    icon: "folder-kanban",
  },
];
