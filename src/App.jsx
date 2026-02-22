import { useState, useEffect, useMemo } from "react";

const STAGES = ["Identified","Researching","Warm","Outreach Sent","In Conversation","Proposal Sent","Partner"];
const SECTORS = ["Health & Medicine","Science & Research","Social Services","Mental Health","Education","Environment","Advocacy & Policy","Arts & Culture","Community Development","Criminal Justice","Labor & Workforce","Housing","Food & Agriculture","Immigration","Philanthropy","Veterans","Disability","LGBTQ+","Racial Equity","Public Media","Pharma & Biotech","Family Foundation","Corporate Foundation","Global Health","Financial Services","Technology","Other"];
const BUDGET_SIGNALS = ["Unknown","Low (<$50k)","Mid ($50k–$150k)","High ($150k+)"];
const STORY_READINESS = ["No Story Yet","Story Forming","Clear Pitch","Pitch Sent"];

const STAGE_COLORS = {
  "Identified":"#f0f1f6","Researching":"#f3e8ff","Warm":"#fef3c7","Outreach Sent":"#e0f2fe",
  "In Conversation":"#d1fae5","Proposal Sent":"#fef9c3","Partner":"#fef3c7"
};
const STAGE_ACCENT = {
  "Identified":"#6b6b80","Researching":"#7c3aed","Warm":"#d97706","Outreach Sent":"#0284c7",
  "In Conversation":"#059669","Proposal Sent":"#ca8a04","Partner":"#b45309"
};

const ALL_PROSPECTS = [
  // ── HEALTH & MEDICINE ─────────────────────────────────────────────────────
  {
    id:1, name:"American College of Occupational & Environmental Medicine", sector:"Health & Medicine",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Story Forming",
    mission:"50k+ physician members; occupational health and workplace safety advocacy. No branded doc presence.",
    contacts:"Director of Communications (position listed on ACOEM.org)",
    notes:"Workforce health is a hot narrative right now post-COVID. Opportunity: a doc on the invisible toll of occupational illness.",
    nextAction:"Check ACOEM website for recent video content; find comms director name",
    lastTouch:"", website:"acoem.org", priority:false
  },
  {
    id:2, name:"Society for Public Health Education (SOPHE)", sector:"Health & Medicine",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"No Story Yet",
    mission:"4,000 members, health educators and practitioners. Mission-driven, no video team evident.",
    contacts:"Executive Director; Communications Staff",
    notes:"Celebrates 75th anniversary in 2026. Milestone years are prime doc commissioning moments.",
    nextAction:"Confirm 75th anniversary date; look for any video on YouTube channel",
    lastTouch:"", website:"sophe.org", priority:true
  },
  {
    id:3, name:"Association of State and Territorial Health Officials (ASTHO)", sector:"Health & Medicine",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Story Forming",
    mission:"State & territorial public health agency leaders. Deep policy influence. No branded docs evident.",
    contacts:"Communications Team",
    notes:"Public health infrastructure narrative is urgent and underfunded in media. Perfect doc subject.",
    nextAction:"Review ASTHO's YouTube channel; check for communications staff on LinkedIn",
    lastTouch:"", website:"astho.org", priority:true
  },
  {
    id:4, name:"National Association of Community Health Centers (NACHC)", sector:"Health & Medicine",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Clear Pitch",
    mission:"1,400+ community health centers serving 30M patients. Equity-focused. Lean comms team.",
    contacts:"VP of Communications",
    notes:"The community health center story is one of the most powerful and underrepresented in healthcare. Clear doc pitch: a center, a community, a year.",
    nextAction:"Draft one-paragraph pitch concept; find VP Communications name on NACHC site",
    lastTouch:"", website:"nachc.org", priority:true
  },
  {
    id:5, name:"American Association of Colleges of Nursing (AACN)", sector:"Health & Medicine",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Story Forming",
    mission:"Advances nursing education; 900+ member schools. Nursing pipeline crisis narrative is urgent.",
    contacts:"Communications Director",
    notes:"Nursing shortage is a major ongoing story. A doc following nursing students into their first year of practice would be powerful.",
    nextAction:"Review AACN's current video presence; check annual report for comms budget signals",
    lastTouch:"", website:"aacn.nche.edu", priority:false
  },
  {
    id:6, name:"American Occupational Therapy Association (AOTA)", sector:"Health & Medicine",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"No Story Yet",
    mission:"~60,000 OT practitioners. Advocacy-focused. OT is chronically under-recognized as a profession.",
    contacts:"Communications Team",
    notes:"'What is occupational therapy?' is a surprisingly powerful documentary question. Members feel invisible. AOTA could sponsor the answer.",
    nextAction:"Research AOTA current media; check if they've done video campaigns recently",
    lastTouch:"", website:"aota.org", priority:false
  },
  {
    id:7, name:"Society of Hospital Medicine (SHM)", sector:"Health & Medicine",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"No Story Yet",
    mission:"Hospitalists (in-hospital physicians) professional association. 20,000+ members.",
    contacts:"Communications Staff",
    notes:"Hospitalists are the hidden engine of modern hospitals. Strong branded doc story: a week in the life of a hospitalist unit.",
    nextAction:"Check SHM YouTube/Vimeo for video history",
    lastTouch:"", website:"hospitalmedicine.org", priority:false
  },

  // ── SCIENCE & RESEARCH ───────────────────────────────────────────────────
  {
    id:8, name:"Ecological Society of America (ESA)", sector:"Science & Research",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Clear Pitch",
    mission:"10,000 ecologists, conservation biologists. Strong public science communication mission.",
    contacts:"Communications Director",
    notes:"Strong alignment with your NatGeo/climate work. Pitch: a doc following field ecologists during a critical season.",
    nextAction:"Review ESA's Frontiers publication and social presence; identify comms lead",
    lastTouch:"", website:"esa.org", priority:true
  },
  {
    id:9, name:"American Meteorological Society (AMS)", sector:"Science & Research",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Story Forming",
    mission:"13,000 members, atmospheric and weather scientists. Deeply relevant amid climate crisis.",
    contacts:"Communications Director",
    notes:"The climate-weather connection is a compelling doc narrative. AMS could sponsor a film about what meteorologists are seeing that the public isn't.",
    nextAction:"Check AMS video content; look for climate communication initiatives",
    lastTouch:"", website:"ametsoc.org", priority:false
  },
  {
    id:10, name:"American Society for Microbiology (ASM)", sector:"Science & Research",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Story Forming",
    mission:"30,000+ members. Post-pandemic public science communication mandate.",
    contacts:"Director of Public Affairs",
    notes:"Strong doc opportunity around antimicrobial resistance — one of the most critical and least understood health crises.",
    nextAction:"Review ASM's current public-facing content; look for any branded video history",
    lastTouch:"", website:"asm.org", priority:false
  },
  {
    id:11, name:"American Institute of Biological Sciences (AIBS)", sector:"Science & Research",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"No Story Yet",
    mission:"Consortium of 130+ biology organizations. Policy focus. Small but influential.",
    contacts:"Executive Director; Policy Team",
    notes:"Science funding and biodiversity advocacy are urgent. AIBS is a coalition org — doc could represent the whole field.",
    nextAction:"Research AIBS annual budget via 990; assess communications capacity",
    lastTouch:"", website:"aibs.org", priority:false
  },

  // ── SOCIAL SERVICES ──────────────────────────────────────────────────────
  {
    id:12, name:"Child Welfare League of America (CWLA)", sector:"Social Services",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Clear Pitch",
    mission:"Child welfare agencies and advocacy. Focus on foster care, family preservation, youth in crisis.",
    contacts:"Communications Director",
    notes:"Foster care and family preservation are deeply undercovered narratives. A CWLA-commissioned doc could change policy conversations.",
    nextAction:"Check CWLA for prior video campaigns; review current advocacy priorities",
    lastTouch:"", website:"cwla.org", priority:true
  },
  {
    id:13, name:"National Alliance on Mental Illness (NAMI)", sector:"Social Services",
    stage:"Researching", budget:"Mid ($50k–$150k)", storyReady:"Story Forming",
    mission:"Nation's largest mental health advocacy org. 600+ affiliates. Strong grassroots base.",
    contacts:"VP of Communications and Public Affairs",
    notes:"NAMI has done some video work but nothing at documentary scale. The mental health crisis story is enormously powerful right now.",
    nextAction:"Watch existing NAMI video content; assess production quality to pitch an upgrade",
    lastTouch:"2025-11-01", website:"nami.org", priority:true
  },
  {
    id:14, name:"National Council for Mental Wellbeing (NCMW)", sector:"Social Services",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Story Forming",
    mission:"3,400 behavioral health and substance use treatment organizations. Policy and advocacy.",
    contacts:"Communications Team",
    notes:"Behavioral health access and parity are major legislative priorities. A doc on the treatment gap could anchor a campaign.",
    nextAction:"Identify communications lead; look at NCMW's recent advocacy campaigns",
    lastTouch:"", website:"thenationalcouncil.org", priority:false
  },
  {
    id:15, name:"American Public Human Services Association (APHSA)", sector:"Social Services",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"No Story Yet",
    mission:"State and local human services agencies. Workforce development, benefits delivery.",
    contacts:"Communications Director",
    notes:"Human services workers are underrepresented in media. A doc on the front lines of public welfare could be compelling.",
    nextAction:"Research APHSA's communications budget from IRS 990 filing",
    lastTouch:"", website:"aphsa.org", priority:false
  },
  {
    id:16, name:"Alliance for Strong Families and Communities", sector:"Social Services",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"No Story Yet",
    mission:"Network of 500+ social sector organizations. Racial equity and community resilience focus.",
    contacts:"Communications Team",
    notes:"Network-wide storytelling opportunity: a doc about one family served by multiple network organizations over a year.",
    nextAction:"Review Alliance website for any prior documentary or video work",
    lastTouch:"", website:"alliance1.org", priority:false
  },

  // ── MENTAL HEALTH ────────────────────────────────────────────────────────
  {
    id:17, name:"American Association for Marriage and Family Therapy (AAMFT)", sector:"Mental Health",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Story Forming",
    mission:"50,000 therapists. Advocacy won Medicare recognition for MFTs in 2024 — a victory story.",
    contacts:"CEO Chris Michaels; Director of Communications",
    notes:"The Medicare win is a ready-made documentary subject: 30 years of advocacy, one policy victory. Textbook doc structure.",
    nextAction:"Review AAMFT's current video content; draft a one-sentence pitch on the Medicare story",
    lastTouch:"", website:"aamft.org", priority:true
  },
  {
    id:18, name:"American Counseling Association (ACA)", sector:"Mental Health",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"No Story Yet",
    mission:"56,000 professional counselors. Mental health access advocacy. Lean comms team.",
    contacts:"Communications Director",
    notes:"The counseling profession is often conflated with therapy in public perception. ACA could commission a clarifying doc.",
    nextAction:"Check ACA's YouTube for video history",
    lastTouch:"", website:"counseling.org", priority:false
  },
  {
    id:19, name:"National Board for Certified Counselors (NBCC)", sector:"Mental Health",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"No Story Yet",
    mission:"Credentialing body for 1M+ counselors. Workforce development mandate.",
    contacts:"Communications Staff",
    notes:"Less a membership org and more an infrastructure org — but credentialing the mental health workforce is a compelling story.",
    nextAction:"Review NBCC communications budget signals; identify key staff",
    lastTouch:"", website:"nbcc.org", priority:false
  },

  // ── EDUCATION ────────────────────────────────────────────────────────────
  {
    id:20, name:"National Association of School Psychologists (NASP)", sector:"Education",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Story Forming",
    mission:"28,000 school psychologists. Youth mental health crisis is their core advocacy platform.",
    contacts:"Communications Director",
    notes:"School psych shortages are a major, underreported crisis. A doc inside a school psychology practice would be powerful.",
    nextAction:"Look at NASP's advocacy campaigns and recent video; identify comms contact",
    lastTouch:"", website:"nasponline.org", priority:true
  },
  {
    id:21, name:"American Association of Collegiate Registrars & Admissions Officers (AACRAO)", sector:"Education",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"No Story Yet",
    mission:"11,000 higher ed professionals. Access, enrollment, credential recognition advocacy.",
    contacts:"Communications Director",
    notes:"College access and completion is a major equity story. A doc framing the registrar's role in student success is unexplored.",
    nextAction:"Review AACRAO for any prior video investment",
    lastTouch:"", website:"aacrao.org", priority:false
  },
  {
    id:22, name:"National Association for the Education of Young Children (NAEYC)", sector:"Education",
    stage:"Researching", budget:"Mid ($50k–$150k)", storyReady:"Clear Pitch",
    mission:"60,000 early childhood educators. Childcare access, workforce pay equity advocacy.",
    contacts:"Communications Director",
    notes:"The childcare workforce crisis is one of the most emotionally powerful and policy-relevant doc subjects available right now.",
    nextAction:"Review NAEYC's recent advocacy campaigns; check for prior video commissions",
    lastTouch:"2025-10-15", website:"naeyc.org", priority:true
  },
  {
    id:23, name:"American School Counselor Association (ASCA)", sector:"Education",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Story Forming",
    mission:"40,000 school counselors. Student mental health and college access focus.",
    contacts:"Communications Team",
    notes:"Like NASP, the school counselor shortage is an urgent story. ASCA has done some video but nothing documentary-scale.",
    nextAction:"Review ASCA YouTube channel; assess quality of existing content",
    lastTouch:"", website:"schoolcounselor.org", priority:false
  },
  {
    id:24, name:"Association for Career and Technical Education (ACTE)", sector:"Education",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Story Forming",
    mission:"25,000 CTE educators. Workforce pipeline from high school to skilled trades.",
    contacts:"Communications Director",
    notes:"CTE/vocational education is having a major policy renaissance. A doc celebrating a CTE school's impact could be transformative.",
    nextAction:"Check ACTE for recent PR and video campaigns",
    lastTouch:"", website:"acteonline.org", priority:false
  },

  // ── ENVIRONMENT ──────────────────────────────────────────────────────────
  {
    id:25, name:"Society of Environmental Toxicology and Chemistry (SETAC)", sector:"Environment",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Story Forming",
    mission:"5,500 environmental scientists. PFAS, contamination, ecosystem research.",
    contacts:"Communications Director",
    notes:"PFAS contamination is one of the defining environmental stories of the decade. SETAC members are the ones measuring it.",
    nextAction:"Review SETAC's public communications; check for any media partnerships",
    lastTouch:"", website:"setac.org", priority:true
  },
  {
    id:26, name:"American Fisheries Society (AFS)", sector:"Environment",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Clear Pitch",
    mission:"8,000 fisheries scientists. Fish habitat, freshwater ecology, tribal fisheries.",
    contacts:"Communications Director",
    notes:"Strong visual story potential: freshwater fisheries are collapsing but the scientists monitoring them are compelling characters.",
    nextAction:"Review AFS website for any video history; check YouTube channel",
    lastTouch:"", website:"fisheries.org", priority:false
  },
  // ── ADVOCACY & POLICY ────────────────────────────────────────────────────
  {
    id:28, name:"Trust for America's Health (TFAH)", sector:"Advocacy & Policy",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Story Forming",
    mission:"Public health policy nonprofit. Annual 'State of Obesity' and health security reports.",
    contacts:"Communications Director",
    notes:"TFAH produces influential reports but no documentary-scale video. A film to accompany their annual State of Obesity report could be transformative.",
    nextAction:"Review TFAH's comms approach; check if they've used video for any reports",
    lastTouch:"", website:"tfah.org", priority:true
  },
  {
    id:29, name:"Families USA", sector:"Advocacy & Policy",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Clear Pitch",
    mission:"National health care consumer advocacy. ACA defense, Medicaid access.",
    contacts:"Communications Director",
    notes:"Health care access stories are perennial. Families USA could sponsor a doc following patients navigating the system.",
    nextAction:"Review Families USA's video and media campaigns from 2023-2025",
    lastTouch:"", website:"familiesusa.org", priority:false
  },
  {
    id:30, name:"League of Conservation Voters (LCV)", sector:"Advocacy & Policy",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Story Forming",
    mission:"Environmental political advocacy. Scores legislators. Strong comms operation.",
    contacts:"Communications Director",
    notes:"LCV has significant communications investment but mostly digital. A doc on a pivotal environmental vote could be powerful.",
    nextAction:"Review LCV's media work; evaluate if they've used documentary format before",
    lastTouch:"", website:"lcv.org", priority:false
  },
  {
    id:31, name:"National Immigration Law Center (NILC)", sector:"Advocacy & Policy",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Story Forming",
    mission:"Immigrant rights legal advocacy. DACA, deportation defense, labor rights.",
    contacts:"Communications Team",
    notes:"Immigration legal battles are some of the most powerful documentary subjects. NILC cases could anchor a compelling doc.",
    nextAction:"Review NILC's current media strategy and any prior film involvement",
    lastTouch:"", website:"nilc.org", priority:false
  },

  // ── COMMUNITY DEVELOPMENT ────────────────────────────────────────────────
  {
    id:32, name:"National Community Reinvestment Coalition (NCRC)", sector:"Community Development",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Story Forming",
    mission:"Community reinvestment, fair lending, economic equity. 600+ member organizations.",
    contacts:"Communications Director",
    notes:"Redlining's legacy in community disinvestment is a powerful and timely subject. NCRC could commission the story.",
    nextAction:"Review NCRC's communications approach; look for any prior video work",
    lastTouch:"", website:"ncrc.org", priority:false
  },
  {
    id:33, name:"National Low Income Housing Coalition (NLIHC)", sector:"Community Development",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Clear Pitch",
    mission:"Housing affordability advocacy. Annual 'Out of Reach' report. Homelessness prevention.",
    contacts:"Communications Director",
    notes:"Housing is one of the most visual and human documentary subjects. NLIHC's Out of Reach data could frame a stunning short doc.",
    nextAction:"Review NLIHC's current media work; draft a one-sentence pitch",
    lastTouch:"", website:"nlihc.org", priority:true
  },
  {
    id:34, name:"PolicyLink", sector:"Community Development",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Story Forming",
    mission:"Equity research and policy advocacy. Economic inclusion, health equity, infrastructure.",
    contacts:"Communications Team",
    notes:"PolicyLink produces influential reports. A doc translating their equity data into human stories could extend their reach enormously.",
    nextAction:"Review PolicyLink's current video and media strategy",
    lastTouch:"", website:"policylink.org", priority:false
  },

  // ── ARTS & CULTURE ───────────────────────────────────────────────────────
  {
    id:35, name:"Americans for the Arts", sector:"Arts & Culture",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Story Forming",
    mission:"National arts advocacy. Arts funding, education, economic impact research.",
    contacts:"Communications Director",
    notes:"Arts advocacy orgs rarely invest in documentary — but a doc on arts access in underserved communities could be transformative for them.",
    nextAction:"Review Americans for the Arts YouTube and recent campaigns",
    lastTouch:"", website:"americansforthearts.org", priority:false
  },
  {
    id:36, name:"Association of Art Museum Directors (AAMD)", sector:"Arts & Culture",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"No Story Yet",
    mission:"Directors of 240+ major art museums. Repatriation, access, DEI in museum leadership.",
    contacts:"Communications Staff",
    notes:"Museum repatriation and decolonization is a major, underexplored documentary subject. AAMD could be a co-sponsor.",
    nextAction:"Check AAMD for any video or documentary involvement",
    lastTouch:"", website:"aamd.org", priority:false
  },

  // ── SCIENCE/HEALTH CROSSOVER ─────────────────────────────────────────────
  {
    id:37, name:"Society for Adolescent Health and Medicine (SAHM)", sector:"Health & Medicine",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Clear Pitch",
    mission:"6,000 clinicians and researchers focused on teen and young adult health. Youth mental health crisis.",
    contacts:"Communications Director",
    notes:"Adolescent mental health is the defining health story of this decade. SAHM could commission a doc told from a clinician's perspective.",
    nextAction:"Review SAHM's communications; check for any prior film or media partnerships",
    lastTouch:"", website:"adolescenthealth.org", priority:true
  },
  {
    id:38, name:"American College of Preventive Medicine (ACPM)", sector:"Health & Medicine",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Story Forming",
    mission:"2,000 preventive medicine physicians. Prevention as cost-saving and equity-building.",
    contacts:"Executive Director; Communications Staff",
    notes:"Prevention is chronically undervalued in the US healthcare narrative. A doc reframing prevention as a public investment could be powerful.",
    nextAction:"Research ACPM's communications budget; look for any advocacy campaigns",
    lastTouch:"", website:"acpm.org", priority:false
  },

  // ── HIGH-BUDGET ORGANIZATIONS ($20M+ ANNUAL BUDGET) ─────────────────────
  {
    id:39, name:"American Psychological Association (APA)", sector:"Mental Health",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Clear Pitch",
    mission:"~134,000 psychologist members. Annual budget ~$134M. Mental health, trauma, equity advocacy.",
    contacts:"Chief Communications Officer; Public Affairs Director",
    notes:"APA has the budget and the urgency. The mental health crisis in America is the defining story of the decade. Pitch: a longitudinal doc on psychologists serving underserved communities — immigrant families, veterans, rural populations. They have published on access gaps but have no branded film presence.",
    nextAction:"Review APA's public-facing media hub; identify Chief Comms Officer on LinkedIn",
    lastTouch:"", website:"apa.org", priority:true
  },
  {
    id:40, name:"American Academy of Pediatrics (AAP)", sector:"Health & Medicine",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"67,000 pediatricians. Annual budget ~$122M. Child health, mental health, gun violence, climate.",
    contacts:"VP of Communications; Media Relations",
    notes:"AAP has commissioning budget and a portfolio of urgent narratives: childhood gun violence, food insecurity, pediatric mental health crisis, immigrant child health. They've done major policy pushes but no branded documentary. High alignment with Think Out Loud's social impact positioning.",
    nextAction:"Review AAP's media center and any existing video/documentary work",
    lastTouch:"", website:"aap.org", priority:true
  },
  {
    id:41, name:"American Physical Therapy Association (APTA)", sector:"Health & Medicine",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~100,000 physical therapists and assistants. Annual budget ~$60M. Rehab access, chronic pain, opioid alternative.",
    contacts:"Director of Communications",
    notes:"PT is a powerful but under-documented profession. With opioid epidemic still unfolding, a doc positioning PT as the humane alternative to pain management has legs. APTA has the budget and the membership base to sponsor it.",
    nextAction:"Check APTA's YouTube and media presence; look for any prior video campaigns",
    lastTouch:"", website:"apta.org", priority:false
  },
  {
    id:42, name:"American Speech-Language-Hearing Association (ASHA)", sector:"Health & Medicine",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~228,000 audiologists, SLPs, and scientists. Annual budget ~$60M. Communication access and equity.",
    contacts:"Chief Communications Officer",
    notes:"SLPs are invisible heroes — working with stroke survivors, children with autism, trauma patients. ASHA has enormous reach and consistent advocacy messaging. A doc following several SLPs across different settings (schools, hospitals, rehabilitation centers) could be powerful.",
    nextAction:"Review ASHA's media; look for prior branded video or film work",
    lastTouch:"", website:"asha.org", priority:false
  },
  {
    id:43, name:"Society for Human Resource Management (SHRM)", sector:"Other",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"325,000+ HR professionals globally. Annual budget ~$200M+. Workforce equity, DEI, future of work.",
    contacts:"Chief Communications Officer; Content Strategy",
    notes:"SHRM has massive budget and is actively reshaping the DEI and workforce narrative. A branded doc on the human cost of hiring discrimination, wage equity gaps, or the loneliness epidemic in workplaces could be transformative. They've invested heavily in media — but not documentary-scale storytelling.",
    nextAction:"Research SHRM's existing content studio; assess their doc appetite",
    lastTouch:"", website:"shrm.org", priority:false
  },
  {
    id:44, name:"American Institute of Architects (AIA)", sector:"Other",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~95,000 architects. Annual budget ~$65M. Climate-resilient design, equity in the built environment.",
    contacts:"Communications Director",
    notes:"Architecture has major storytelling potential that's rarely tapped at the documentary level. Climate-resilient design, community-led projects in underserved cities, and the story of who gets to shape urban environments are all powerful pitches. AIA has budget and national media relationships.",
    nextAction:"Review AIA's existing media and advocacy campaigns",
    lastTouch:"", website:"aia.org", priority:false
  },
  {
    id:45, name:"National Association of Social Workers (NASW)", sector:"Social Services",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Clear Pitch",
    mission:"~55,000 social workers. Annual budget ~$25M. Social justice, child welfare, mental health access.",
    contacts:"Director of Communications",
    notes:"Social workers are among the most underpaid and underrepresented professionals in America. NASW has a clear advocacy mandate and consistent budget. Pitch: a doc following several social workers across different settings — child welfare, hospital, immigration — over the course of a year. Strong equity frame.",
    nextAction:"Check NASW's video history; find comms director name",
    lastTouch:"", website:"socialworkers.org", priority:true
  },
  {
    id:46, name:"American Association of Critical Care Nurses (AACN)", sector:"Health & Medicine",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Clear Pitch",
    mission:"~120,000 critical care nurses. Annual budget ~$36M (990 verified). ICU workforce crisis.",
    contacts:"Chief Communications Officer",
    notes:"AACN has verified $36M+ revenue (Form 990, 2023). ICU nurses lived through COVID as no one else did — moral injury, understaffing, impossible choices. A doc set inside a critical care unit could be one of the most powerful healthcare films ever made. AACN has both the budget and the story urgency.",
    nextAction:"Look for any prior AACN documentary or film partnerships; identify comms officer",
    lastTouch:"", website:"aacn.org", priority:true
  },
  {
    id:47, name:"American Society of Clinical Oncology (ASCO)", sector:"Health & Medicine",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"45,000+ oncologists globally. Annual budget ~$120M+. Cancer equity, clinical trial access, survivorship.",
    contacts:"Director of Communications; Media Relations",
    notes:"Cancer disparities — who gets access to clinical trials, cutting-edge drugs, specialized oncologists — is a major and underreported story. ASCO has enormous resources and a clear equity mandate. A doc on disparate cancer outcomes across race/class would align perfectly with their public advocacy.",
    nextAction:"Review ASCO's media presence; look for branded content or documentary investment history",
    lastTouch:"", website:"asco.org", priority:false
  },
  {
    id:48, name:"American Public Health Association (APHA)", sector:"Health & Medicine",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Clear Pitch",
    mission:"~25,000 public health professionals. Annual budget ~$25M. Prevention, health equity, policy.",
    contacts:"Communications Director",
    notes:"APHA has been operating for 150+ years and is the largest public health professional org in the US. 150th anniversary was in 2022 — they may be building toward the next campaign. Pitch: a doc on the invisible infrastructure of public health: disease surveillance, community health workers, local health departments. The pandemic made this story urgent; APHA could sponsor the film that explains what we almost lost.",
    nextAction:"Check APHA's media center; identify comms director and assess doc appetite",
    lastTouch:"", website:"apha.org", priority:true
  },

  // ── HEALTH & MEDICINE (continued) ─────────────────────────────────────────
  {
    id:49, name:"American Nurses Association (ANA)", sector:"Health & Medicine",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Clear Pitch",
    mission:"~4M RNs represented. Annual budget ~$30M+. Nursing workforce crisis, workplace safety, equitable care.",
    contacts:"Chief Communications Officer; Media Relations Director",
    notes:"Nursing has never been more cinematically ready as a subject. Pandemic burnout, staffing ratios, racial disparities in nursing — ANA has the platform and urgency. Pitch: a doc following nurses across clinical settings over one year.",
    nextAction:"Review ANA's media hub; identify Chief Comms Officer",
    lastTouch:"", website:"nursingworld.org", priority:true
  },
  {
    id:50, name:"American Association of Nurse Practitioners (AANP)", sector:"Health & Medicine",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~360,000 NP members. Annual budget ~$25M. Access-to-care advocacy, scope of practice expansion.",
    contacts:"Communications Director",
    notes:"NPs are the fastest-growing segment of the healthcare workforce — and the story of expanding scope-of-practice fights is a compelling David vs. Goliath doc narrative. High moment given primary care deserts.",
    nextAction:"Review AANP's video/media presence; check for advocacy campaign assets",
    lastTouch:"", website:"aanp.org", priority:true
  },
  {
    id:51, name:"American College of Emergency Physicians (ACEP)", sector:"Health & Medicine",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Clear Pitch",
    mission:"~40,000 emergency physicians. Annual budget ~$35M+. ER overcrowding, boarding crisis, mental health in the ED.",
    contacts:"Director of Communications",
    notes:"The American ER is in collapse — psychiatric boarding, violence against staff, ambulance diversion. ACEP members live this daily. A doc inside an overwhelmed urban ED would be viscerally powerful and policy-relevant.",
    nextAction:"Review ACEP's media center; look for any prior film or video work",
    lastTouch:"", website:"acep.org", priority:true
  },
  {
    id:52, name:"National Rural Health Association (NRHA)", sector:"Health & Medicine",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Clear Pitch",
    mission:"21,000+ members including rural hospitals, clinics, and providers. Rural health equity advocacy.",
    contacts:"Communications Director",
    notes:"Rural health deserts, hospital closures, and the people left behind are one of the most powerful and underreported American stories. NRHA has the data and the network. A doc on a single rural community losing its hospital would be extraordinary.",
    nextAction:"Review NRHA's existing communications and advocacy campaigns",
    lastTouch:"", website:"ruralhealth.us", priority:true
  },
  {
    id:53, name:"Association of Maternal & Child Health Programs (AMCHP)", sector:"Health & Medicine",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Clear Pitch",
    mission:"State and territorial MCH programs. Maternal mortality, infant health equity, preterm birth.",
    contacts:"Communications Director",
    notes:"Maternal mortality in the US — especially for Black women — is a defining health crisis. AMCHP connects the policy infrastructure to the human stories. A doc on maternal mortality disparities would have enormous reach.",
    nextAction:"Review AMCHP's media strategy; assess doc appetite",
    lastTouch:"", website:"amchp.org", priority:true
  },
  {
    id:54, name:"American Diabetes Association (ADA)", sector:"Health & Medicine",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~37M Americans with diabetes; major research and advocacy org. Annual budget ~$200M+. Health equity, insulin pricing.",
    contacts:"Chief Communications Officer",
    notes:"Insulin pricing and diabetes as a poverty disease are among the most powerful health equity narratives in America. ADA has budget, scale, and an urgent policy moment. A doc on insulin access could anchor a major campaign.",
    nextAction:"Review ADA's existing video content and media campaigns",
    lastTouch:"", website:"diabetes.org", priority:true
  },
  {
    id:55, name:"American Heart Association (AHA)", sector:"Health & Medicine",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"Largest voluntary health org in the US. Annual budget ~$900M+. Cardiovascular disease equity, research funding.",
    contacts:"Chief Communications Officer; SVP of Communications",
    notes:"AHA has enormous resources and a national media infrastructure — but their documentary-scale storytelling has been limited. Heart disease as a racial equity issue is a powerful pitch. Note: large org with established agency relationships; harder entry point.",
    nextAction:"Research AHA's existing media partners; assess what differentiates a Think Out Loud approach",
    lastTouch:"", website:"heart.org", priority:false
  },
  {
    id:56, name:"Alzheimer's Association", sector:"Health & Medicine",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$320M annual budget. Alzheimer's research, caregiving support, dementia advocacy.",
    contacts:"Chief Communications Officer",
    notes:"The caregiver story behind Alzheimer's is deeply human and cinematically powerful. With the first disease-modifying drugs now approved, the policy stakes are enormous. A doc following caregivers and patients through diagnosis and treatment would be timely.",
    nextAction:"Review Alzheimer's Association media hub; look for any prior documentary involvement",
    lastTouch:"", website:"alz.org", priority:true
  },
  {
    id:57, name:"American College of Rheumatology (ACR)", sector:"Health & Medicine",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Story Forming",
    mission:"~9,000 rheumatologists. Autoimmune diseases, chronic pain, drug access advocacy.",
    contacts:"Communications Director",
    notes:"Autoimmune diseases disproportionately affect women and are chronically under-diagnosed. ACR could commission a doc on the years-long odyssey to diagnosis — a story millions of women live but rarely see on screen.",
    nextAction:"Review ACR's existing content; check for any video campaigns",
    lastTouch:"", website:"rheumatology.org", priority:false
  },
  {
    id:58, name:"Society of General Internal Medicine (SGIM)", sector:"Health & Medicine",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Story Forming",
    mission:"3,000+ general internists. Primary care workforce crisis, health equity, social determinants.",
    contacts:"Communications Director",
    notes:"Primary care is disappearing in America — fewer medical students choose it, rural areas go unserved. SGIM members see this daily. A doc on the future of primary care would be timely and policy-relevant.",
    nextAction:"Review SGIM's media presence; assess comms budget signals",
    lastTouch:"", website:"sgim.org", priority:false
  },

  // ── SCIENCE & RESEARCH (continued) ────────────────────────────────────────
  {
    id:59, name:"American Chemical Society (ACS)", sector:"Science & Research",
    stage:"Researching", budget:"High ($150k+)", storyReady:"Clear Pitch",
    mission:"~160,000 chemists and chemical engineers. Annual budget ~$500M+. Science communication, chemistry education.",
    contacts:"Director of Communications; Executive Director of Public Affairs",
    notes:"Strong existing relationship — leverage for next project. Chemistry underpins everything from pharmaceuticals to climate solutions but is deeply misunderstood publicly. Pitch an ACS-commissioned doc on chemistry's role in solving the defining problems of our era.",
    nextAction:"Follow up on ACS 150th anniversary content; propose next commissioned project",
    lastTouch:"2024-12-01", website:"acs.org", priority:true
  },
  {
    id:60, name:"American Institute of Physics (AIP)", sector:"Science & Research",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Story Forming",
    mission:"10 member societies, 120,000+ physical scientists. Physics education and public understanding.",
    contacts:"Communications Director",
    notes:"Physics is the foundation of everything from GPS to cancer imaging — but remains opaque to the public. AIP could commission a doc bridging pure science and daily life.",
    nextAction:"Review AIP's Niels Bohr Library media archives; assess comms capacity",
    lastTouch:"", website:"aip.org", priority:false
  },
  {
    id:61, name:"American Geophysical Union (AGU)", sector:"Science & Research",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Clear Pitch",
    mission:"~60,000 Earth and space scientists. Climate, natural hazards, ocean systems.",
    contacts:"Communications Director",
    notes:"AGU scientists are on the front lines of climate measurement — tracking sea level rise, glacier retreat, extreme heat. A doc following field scientists over a research season would be visually stunning and deeply urgent.",
    nextAction:"Review AGU's communications; check for existing media partnerships",
    lastTouch:"", website:"agu.org", priority:true
  },
  {
    id:62, name:"Society for Neuroscience (SfN)", sector:"Science & Research",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~36,000 neuroscientists. Brain research, mental health neuroscience, neurological disease.",
    contacts:"Communications Director",
    notes:"The neuroscience of mental illness, addiction, and trauma has never been more publicly relevant. SfN members are doing the foundational research that informs treatment. A doc translating cutting-edge brain science could be transformative for public understanding.",
    nextAction:"Review SfN's public-facing communications; assess doc appetite",
    lastTouch:"", website:"sfn.org", priority:true
  },
  {
    id:63, name:"American Anthropological Association (AAA)", sector:"Science & Research",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Story Forming",
    mission:"~10,000 anthropologists. Cultural diversity, race, migration, climate adaptation.",
    contacts:"Communications Director",
    notes:"Anthropology has the richest subject matter of any discipline but the least public presence. AAA could commission a doc on what anthropologists are learning about how communities are adapting to climate change and demographic shifts.",
    nextAction:"Review AAA's public communications and media; check for any prior video work",
    lastTouch:"", website:"americananthro.org", priority:false
  },
  {
    id:64, name:"Geological Society of America (GSA)", sector:"Science & Research",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Story Forming",
    mission:"~22,000 geoscientists. Natural hazards, climate, water resources, critical minerals.",
    contacts:"Communications Director",
    notes:"Critical minerals for the energy transition — lithium, cobalt, rare earths — are one of the defining geopolitical stories. GSA scientists are at the center. A doc on the geology of the clean energy future would be timely.",
    nextAction:"Review GSA's media presence; check for any video content",
    lastTouch:"", website:"geosociety.org", priority:false
  },

  // ── EDUCATION (continued) ─────────────────────────────────────────────────
  {
    id:65, name:"National Education Association (NEA)", sector:"Education",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~3M educators. Largest labor union in the US. Teacher pay, public school funding, student equity.",
    contacts:"Chief Communications Officer",
    notes:"The teacher retention crisis is one of the most consequential and underreported stories in American public life. NEA has massive reach. A doc following first-year teachers in underresourced schools would be both humanizing and politically potent.",
    nextAction:"Review NEA's media infrastructure; assess interest in documentary-scale work",
    lastTouch:"", website:"nea.org", priority:false
  },
  {
    id:66, name:"American Federation of Teachers (AFT)", sector:"Education",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~1.7M educators, paraprofessionals, and school staff. Teacher workforce, public school equity.",
    contacts:"Communications Director",
    notes:"AFT and NEA are distinct orgs with different political positioning — worth separate approaches. AFT's urban focus makes for a compelling doc angle on the inner-city school as community anchor.",
    nextAction:"Research AFT's existing media partnerships; identify comms lead",
    lastTouch:"", website:"aft.org", priority:false
  },
  {
    id:67, name:"Association for Supervision and Curriculum Development (ASCD)", sector:"Education",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Story Forming",
    mission:"~100,000 educators, administrators, instructional coaches. Curriculum equity, whole child education.",
    contacts:"Communications Director",
    notes:"Curriculum design and instructional equity rarely make it to documentary — but ASCD's 'whole child' framework is a compelling organizing concept for a doc about what school could be.",
    nextAction:"Review ASCD's video presence; check annual Whole Child Network",
    lastTouch:"", website:"ascd.org", priority:false
  },
  {
    id:68, name:"Council for Exceptional Children (CEC)", sector:"Education",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Clear Pitch",
    mission:"~27,000 special educators, therapists, researchers. Disability education rights, inclusion, IEP advocacy.",
    contacts:"Communications Director",
    notes:"Special education is chronically underfunded and deeply personal. A doc following several families through the IEP process — their fights for inclusion and services — would be emotionally powerful and policy-relevant.",
    nextAction:"Review CEC's current communications; look for any prior video campaigns",
    lastTouch:"", website:"exceptionalchildren.org", priority:true
  },
  {
    id:69, name:"National Association of Secondary School Principals (NASSP)", sector:"Education",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Story Forming",
    mission:"~18,000 middle and high school principals and administrators.",
    contacts:"Communications Director",
    notes:"The principal as a community leader holding a school together — often without adequate resources — is a powerful and underexplored documentary subject. NASSP could commission a verité doc inside one school over an academic year.",
    nextAction:"Review NASSP's media and advocacy campaigns",
    lastTouch:"", website:"nassp.org", priority:false
  },
  {
    id:70, name:"Institute for Higher Education Policy (IHEP)", sector:"Education",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Story Forming",
    mission:"Nonpartisan policy org focused on college access and success for low-income students and students of color.",
    contacts:"Communications Director",
    notes:"IHEP's equity data tells a story of who gets to finish college and who doesn't. A doc translating their research into human stories of first-gen students navigating higher ed would have enormous reach.",
    nextAction:"Review IHEP's current media and communications strategy",
    lastTouch:"", website:"ihep.org", priority:true
  },

  // ── ENVIRONMENT (continued) ────────────────────────────────────────────────
  {
    id:71, name:"Natural Resources Defense Council (NRDC)", sector:"Environment",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$175M annual budget. Environmental law, climate policy, clean energy, ocean and wilderness protection.",
    contacts:"Chief Communications Officer; Media Director",
    notes:"NRDC has the largest media operation of any environmental org — but no branded documentary history. Their legal victories and policy campaigns offer rich narrative material. Approach as a complement to their existing communications, not a replacement.",
    nextAction:"Review NRDC's media strategy; identify comms leadership",
    lastTouch:"", website:"nrdc.org", priority:false
  },
  {
    id:72, name:"Defenders of Wildlife", sector:"Environment",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Clear Pitch",
    mission:"~$40M annual budget. Wolf recovery, endangered species, wildlife corridors, coexistence.",
    contacts:"Communications Director",
    notes:"Wildlife corridors and the recovery of apex predators like wolves and mountain lions are visually stunning and scientifically significant. Defenders could commission a doc on coexistence — ranchers, wildlife scientists, and wolves sharing the same landscape.",
    nextAction:"Review Defenders' existing video content; check YouTube for campaign films",
    lastTouch:"", website:"defenders.org", priority:true
  },
  {
    id:73, name:"Ocean Conservancy", sector:"Environment",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Clear Pitch",
    mission:"~$40M annual budget. Ocean health, plastic pollution, Arctic, fisheries.",
    contacts:"Communications Director",
    notes:"Ocean plastic and the ghost gear crisis are visually compelling and deeply alarming. Ocean Conservancy's Trash Free Seas program is built around this data. A doc following a cleanup team through a season would be powerful.",
    nextAction:"Review Ocean Conservancy's existing video campaigns; check for any branded content work",
    lastTouch:"", website:"oceanconservancy.org", priority:true
  },
  {
    id:74, name:"American Rivers", sector:"Environment",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Clear Pitch",
    mission:"~$20M annual budget. River restoration, dam removal, drinking water, tribal water rights.",
    contacts:"Communications Director",
    notes:"Dam removal is one of the great underreported environmental success stories. American Rivers has led dozens of removals — returning rivers to life. A time-lapse and verité doc on a single major dam removal could be stunning.",
    nextAction:"Review American Rivers' existing media; identify comms lead",
    lastTouch:"", website:"americanrivers.org", priority:true
  },
  {
    id:75, name:"Wildlife Conservation Society (WCS)", sector:"Environment",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$300M annual budget. Global wildlife conservation, climate adaptation, species protection.",
    contacts:"Director of Communications",
    notes:"WCS has scientists operating in some of the most remote and visually spectacular places on Earth. Strong alignment with NatGeo experience. Pitch: a doc following WCS field scientists during a critical year in a threatened ecosystem.",
    nextAction:"Review WCS's existing media partnerships; check for any branded doc work",
    lastTouch:"", website:"wcs.org", priority:true
  },
  {
    id:76, name:"Rainforest Alliance", sector:"Environment",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$100M annual budget. Sustainable agriculture, forest conservation, climate-smart farming.",
    contacts:"Communications Director",
    notes:"The Rainforest Alliance certifies millions of acres — but few consumers know what that work actually looks like on the ground. A doc following a certification team through farms in the Amazon basin would be visually powerful.",
    nextAction:"Review Rainforest Alliance's existing branded content",
    lastTouch:"", website:"rainforest-alliance.org", priority:false
  },
  {
    id:77, name:"Center for Biological Diversity", sector:"Environment",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Story Forming",
    mission:"~$30M annual budget. Endangered species litigation, climate, reproductive rights.",
    contacts:"Communications Director",
    notes:"CBD wins major legal battles for species most Americans have never heard of. A doc on a single ESA listing fight — from petition to court to habitat recovery — would be a perfect legal-environmental thriller.",
    nextAction:"Review CBD's existing video; assess capacity for doc commission",
    lastTouch:"", website:"biologicaldiversity.org", priority:true
  },

  // ── ADVOCACY & POLICY (continued) ─────────────────────────────────────────
  {
    id:78, name:"The Leadership Conference on Civil and Human Rights", sector:"Advocacy & Policy",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Story Forming",
    mission:"Coalition of 230+ national organizations. Voting rights, civil rights enforcement, criminal justice.",
    contacts:"Communications Director",
    notes:"The voting rights story — from the Shelby County decision to state-level suppression efforts — is one of the defining civil rights battles of our era. The Leadership Conference coordinates the coalition response. A doc on the 2024-2026 voting rights fight would be historically significant.",
    nextAction:"Review The Leadership Conference's existing media strategy",
    lastTouch:"", website:"civilrights.org", priority:true
  },
  {
    id:79, name:"National Partnership for Women & Families", sector:"Advocacy & Policy",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Clear Pitch",
    mission:"~$10M budget. Workplace equity, paid leave, reproductive health, family economic security.",
    contacts:"Communications Director",
    notes:"Paid family leave is one of the most human policy stories available — and the US remains an outlier. National Partnership has the policy depth. A doc following families through the paid leave fight would be emotionally resonant.",
    nextAction:"Review National Partnership's existing video and media campaigns",
    lastTouch:"", website:"nationalpartnership.org", priority:true
  },
  {
    id:80, name:"Disability Rights Advocates (DRA)", sector:"Advocacy & Policy",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Clear Pitch",
    mission:"National legal center for disability rights. ADA enforcement, education access, healthcare discrimination.",
    contacts:"Communications Director",
    notes:"Disability rights cases rarely reach public consciousness — but DRA wins cases that transform daily life for millions. A doc following a multi-year DRA case would be a powerful legal-human rights film.",
    nextAction:"Review DRA's existing communications; look for any media partnerships",
    lastTouch:"", website:"dralegal.org", priority:true
  },
  {
    id:81, name:"UnidosUS (formerly NCLR)", sector:"Advocacy & Policy",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~300 affiliate orgs; largest Latino civil rights org. Immigration, education, health, economic equity.",
    contacts:"Chief Communications Officer",
    notes:"UnidosUS represents 60M+ Latinos but is rarely seen in documentary-scale storytelling. Immigration enforcement, DACA, health access — all are urgent. A doc on a year in the life of a UnidosUS affiliate serving a border community would be extraordinary.",
    nextAction:"Review UnidosUS's existing media strategy; assess doc appetite",
    lastTouch:"", website:"unidosus.org", priority:true
  },
  {
    id:82, name:"National Urban League (NUL)", sector:"Advocacy & Policy",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~100 affiliates; 100+ years of economic empowerment for Black Americans. Workforce, housing, education.",
    contacts:"Chief Communications Officer",
    notes:"The National Urban League has the prestige and the network — and its State of Black America report is a defining annual document. A doc marking a major NUL milestone year or following an affiliate's work in a single city would be powerful.",
    nextAction:"Review NUL's existing video content; check anniversary years",
    lastTouch:"", website:"nul.org", priority:true
  },
  {
    id:83, name:"NAACP Legal Defense Fund (LDF)", sector:"Advocacy & Policy",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Clear Pitch",
    mission:"~$30M budget. Civil rights law, voting rights, school integration, criminal justice.",
    contacts:"Communications Director",
    notes:"LDF is the legal arm of the civil rights movement — and its current caseload is as urgent as any in its history. A doc following an LDF attorney through a landmark case would be the definitive civil rights legal film of this decade.",
    nextAction:"Review LDF's media strategy; identify communications lead",
    lastTouch:"", website:"naacpldf.org", priority:true
  },
  {
    id:84, name:"Center for American Progress (CAP)", sector:"Advocacy & Policy",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$80M budget. Progressive policy research. Climate, health care, housing, immigration.",
    contacts:"Communications Director",
    notes:"CAP has enormous communications infrastructure but minimal documentary presence. Their data and reports create the architecture for powerful films — but they'd need a third-party producer to realize them. Approach as a co-production or sponsored content conversation.",
    nextAction:"Review CAP's existing media; assess appetite for branded doc work",
    lastTouch:"", website:"americanprogress.org", priority:false
  },

  // ── SOCIAL SERVICES (continued) ───────────────────────────────────────────
  {
    id:85, name:"Feeding America", sector:"Social Services",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Clear Pitch",
    mission:"~$4B revenue (food value + cash). 200+ food banks, 60,000+ food pantries. Food insecurity, SNAP advocacy.",
    contacts:"Chief Communications Officer",
    notes:"Food insecurity affects 44M Americans but rarely breaks through as a sustained documentary subject. Feeding America's network spans rural, suburban, and urban — a doc following one food bank through a year would reveal a hidden America.",
    nextAction:"Review Feeding America's existing video campaigns; assess branded doc appetite",
    lastTouch:"", website:"feedingamerica.org", priority:true
  },
  {
    id:86, name:"Catholic Charities USA", sector:"Social Services",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$4B in services. 165 local agencies. Immigration, refugee resettlement, poverty relief.",
    contacts:"Communications Director",
    notes:"Catholic Charities is one of the largest social service networks in the country — and its refugee resettlement work is deeply timely. A doc following a refugee family and the local Catholic Charities agency serving them could be extraordinarily moving.",
    nextAction:"Review Catholic Charities' existing media; assess appetite for film investment",
    lastTouch:"", website:"catholiccharitiesusa.org", priority:false
  },
  {
    id:87, name:"National Domestic Violence Hotline (The Hotline)", sector:"Social Services",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Story Forming",
    mission:"~$15M budget. DV crisis intervention, safety planning, technology-facilitated abuse.",
    contacts:"Communications Director",
    notes:"The Hotline sits at the intersection of crisis intervention and systemic advocacy. A doc on the advocates who answer calls — and the invisible epidemic they're navigating — could be deeply powerful if handled with care.",
    nextAction:"Review The Hotline's existing media; assess sensitivity protocols for doc approach",
    lastTouch:"", website:"thehotline.org", priority:true
  },
  {
    id:88, name:"National Center for Missing & Exploited Children (NCMEC)", sector:"Social Services",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$50M budget. Child safety, exploitation prevention, victim reunification.",
    contacts:"Communications Director",
    notes:"NCMEC's work spans law enforcement collaboration, technology policy, and survivor support — each thread a compelling documentary subject. A doc on the forensic analysts and case coordinators working missing children cases would be powerful if carefully handled.",
    nextAction:"Review NCMEC's existing communications; assess sensitivity protocols",
    lastTouch:"", website:"missingkids.org", priority:false
  },
  {
    id:89, name:"Urban Institute", sector:"Social Services",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$100M budget. Nonpartisan policy research. Housing, wealth gaps, criminal justice, health.",
    contacts:"Communications Director",
    notes:"Urban Institute produces the most rigorous equity data in the country but has minimal video presence. A doc translating their research into human stories — following the data behind wealth gaps or housing instability — could be transformational.",
    nextAction:"Review Urban Institute's existing communications strategy",
    lastTouch:"", website:"urban.org", priority:false
  },
  {
    id:90, name:"Covenant House", sector:"Social Services",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Clear Pitch",
    mission:"~$140M budget. Youth homelessness, trafficking prevention, transitional housing.",
    contacts:"Chief Communications Officer",
    notes:"Youth homelessness and aging out of foster care are among the most powerful and underreported stories in America. Covenant House serves youth in 31 cities. A doc inside a Covenant House shelter over a year could be one of the most important social justice films of this decade.",
    nextAction:"Review Covenant House's existing media; check for any prior film work",
    lastTouch:"", website:"covenanthouse.org", priority:true
  },

  // ── COMMUNITY DEVELOPMENT (continued) ────────────────────────────────────
  {
    id:91, name:"Local Initiatives Support Corporation (LISC)", sector:"Community Development",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$300M+. Community development finance. Affordable housing, small business, rural revitalization.",
    contacts:"Communications Director",
    notes:"LISC finances the physical transformation of disinvested communities — a deeply visual story. A doc following a LISC-financed affordable housing development from groundbreaking to occupancy, through the eyes of residents, would be powerful.",
    nextAction:"Review LISC's existing communications; assess appetite for doc commission",
    lastTouch:"", website:"lisc.org", priority:true
  },
  {
    id:92, name:"Enterprise Community Partners", sector:"Community Development",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$300M+ annual investments. Affordable housing finance, economic mobility, climate resilience.",
    contacts:"Communications Director",
    notes:"Similar to LISC but with a stronger climate-resilience framing for housing. Their work on green affordable housing offers a compelling doc angle at the intersection of housing justice and climate adaptation.",
    nextAction:"Review Enterprise's existing media; differentiate approach from LISC pitch",
    lastTouch:"", website:"enterprisecommunity.org", priority:false
  },
  {
    id:93, name:"National League of Cities (NLC)", sector:"Community Development",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Story Forming",
    mission:"~2,900 cities and towns. Municipal governance, infrastructure, equity, climate resilience.",
    contacts:"Communications Director",
    notes:"Cities are where climate policy, equity, and democracy intersect most visibly. NLC could commission a doc on how a handful of peer cities are tackling the same interlocking crises in very different ways.",
    nextAction:"Review NLC's existing media and communications strategy",
    lastTouch:"", website:"nlc.org", priority:false
  },
  {
    id:94, name:"National Congress of American Indians (NCAI)", sector:"Community Development",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Clear Pitch",
    mission:"~500 tribal nation members. Tribal sovereignty, federal trust responsibility, treaty rights, Native data.",
    contacts:"Communications Director",
    notes:"Tribal sovereignty and the fight for treaty rights are among the most underrepresented stories in American documentary. NCAI coordinates advocacy across 500+ nations — a doc on a major tribal sovereignty fight would be historically significant.",
    nextAction:"Review NCAI's existing communications; approach with genuine partnership framing",
    lastTouch:"", website:"ncai.org", priority:true
  },
  {
    id:95, name:"National Association of Counties (NACo)", sector:"Community Development",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Story Forming",
    mission:"~3,000 county governments. Rural services, public health infrastructure, criminal justice, infrastructure.",
    contacts:"Communications Director",
    notes:"Counties are the invisible layer of American government — running jails, public health departments, and social services. A doc on what county government actually does would be a civics doc unlike anything made before.",
    nextAction:"Review NACo's existing media; check for any video investment history",
    lastTouch:"", website:"naco.org", priority:false
  },

  // ── ARTS & CULTURE (continued) ────────────────────────────────────────────
  {
    id:96, name:"National Endowment for the Arts (NEA)", sector:"Arts & Culture",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$200M annual appropriation. Federal arts funding. Access, creative economy, community arts.",
    contacts:"Communications Director",
    notes:"The NEA funds arts in every congressional district — a fact most Americans don't know. A doc on how a single NEA grant transforms a rural community arts program could be a powerful defense of public arts funding at a moment of budget threat.",
    nextAction:"Review NEA's existing communications and media strategy",
    lastTouch:"", website:"arts.gov", priority:true
  },
  {
    id:97, name:"PEN America", sector:"Arts & Culture",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Clear Pitch",
    mission:"~$10M budget. Free expression, book bans, literary freedom, journalist safety.",
    contacts:"Communications Director",
    notes:"Book banning in public schools has exploded since 2021. PEN America documents every case. A doc following the communities, librarians, and families at the center of book ban fights would be a First Amendment film with enormous reach.",
    nextAction:"Review PEN America's existing media; check for any prior film partnerships",
    lastTouch:"", website:"pen.org", priority:true
  },
  {
    id:98, name:"American Alliance of Museums (AAM)", sector:"Arts & Culture",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Story Forming",
    mission:"~35,000 member institutions. Museum access, decolonization, community engagement.",
    contacts:"Communications Director",
    notes:"Museums are reckoning with their colonial origins in ways that rarely make the news. AAM could commission a doc on repatriation negotiations — one object's journey home — that would reframe how the public thinks about cultural heritage.",
    nextAction:"Review AAM's existing media and advocacy materials",
    lastTouch:"", website:"aam-us.org", priority:false
  },
  {
    id:99, name:"National Assembly of State Arts Agencies (NASAA)", sector:"Arts & Culture",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"No Story Yet",
    mission:"56 state and jurisdictional arts agencies. Public arts funding policy, creative economy.",
    contacts:"Executive Director",
    notes:"NASAA is the connective tissue between federal arts policy and state implementation — a small but influential org that rarely has communication infrastructure for documentary-scale work. Potential for co-sponsorship with NEA.",
    nextAction:"Research NASAA's annual budget via 990; assess communications capacity",
    lastTouch:"", website:"nasaa-arts.org", priority:false
  },
  {
    id:100, name:"Theatre Communications Group (TCG)", sector:"Arts & Culture",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Story Forming",
    mission:"~700 member theaters. Nonprofit theater advocacy, playwright development, audience access.",
    contacts:"Communications Director",
    notes:"Regional theater is in a post-pandemic crisis but also a creative renaissance. TCG could commission a doc on the survival of a beloved regional theater — a story about community, art, and institutional resilience.",
    nextAction:"Review TCG's existing media; check for any prior video content",
    lastTouch:"", website:"tcg.org", priority:false
  },

  // ── CRIMINAL JUSTICE ──────────────────────────────────────────────────────
  {
    id:102, name:"Vera Institute of Justice", sector:"Criminal Justice",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Clear Pitch",
    mission:"~$60M budget. Pretrial detention, immigration enforcement, reentry, police accountability.",
    contacts:"Communications Director",
    notes:"Vera combines rigorous research with on-the-ground reform programs. Their pretrial work — fighting money bail — is a perfect documentary subject: one person's time in jail awaiting trial can destroy a family and a life.",
    nextAction:"Review Vera's existing media; look for any prior film or doc involvement",
    lastTouch:"", website:"vera.org", priority:true
  },
  {
    id:103, name:"Equal Justice Initiative (EJI)", sector:"Criminal Justice",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Clear Pitch",
    mission:"Bryan Stevenson's org. ~$50M budget. Death row representation, racial terror lynching history, museum.",
    contacts:"Communications Director",
    notes:"EJI is perhaps the most powerful storytelling organization in the criminal justice space — the National Memorial for Peace and Justice, Just Mercy, Bryan Stevenson's public presence. A new commissioned doc on EJI's ongoing capital representation work could be extraordinary.",
    nextAction:"Research EJI's existing media partnerships; identify where Think Out Loud adds value",
    lastTouch:"", website:"eji.org", priority:true
  },
  {
    id:105, name:"Brennan Center for Justice", sector:"Criminal Justice",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$30M budget. Voting rights, criminal justice reform, democracy protection.",
    contacts:"Communications Director",
    notes:"Brennan Center is the premier democracy and justice policy org — covering voting rights, gerrymandering, dark money, and criminal justice all under one roof. A doc commissioned by Brennan on the state of American democracy would be timely and urgently needed.",
    nextAction:"Review Brennan Center's media strategy; assess interest in documentary-scale work",
    lastTouch:"", website:"brennancenter.org", priority:true
  },

  // ── LABOR & WORKFORCE ─────────────────────────────────────────────────────
  {
    id:106, name:"Economic Policy Institute (EPI)", sector:"Labor & Workforce",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Story Forming",
    mission:"~$10M budget. Wage policy, labor market research, union advocacy, racial economic equity.",
    contacts:"Communications Director",
    notes:"EPI produces the most cited wage data in American policy debates — but their work remains inside the Beltway. A doc translating their minimum wage and worker power research into stories of workers would reach a broad public audience.",
    nextAction:"Review EPI's existing media strategy; assess appetite for doc commission",
    lastTouch:"", website:"epi.org", priority:true
  },
  {
    id:107, name:"National Employment Law Project (NELP)", sector:"Labor & Workforce",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Clear Pitch",
    mission:"~$7M budget. Minimum wage, worker misclassification, unemployment insurance, gig economy.",
    contacts:"Communications Director",
    notes:"Gig economy misclassification — Uber drivers, delivery workers, domestic workers denied basic labor protections — is one of the defining labor stories of this era. NELP has been litigating and documenting it. A doc following misclassified workers in multiple industries would be powerful.",
    nextAction:"Review NELP's existing campaigns; look for any prior video or media work",
    lastTouch:"", website:"nelp.org", priority:true
  },
  {
    id:108, name:"Coalition of Immigrant and Refugee Rights (CHIRLA)", sector:"Labor & Workforce",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Story Forming",
    mission:"~$15M budget. Immigrant worker rights, DACA, deportation defense, labor organizing in LA.",
    contacts:"Communications Director",
    notes:"CHIRLA is one of the most active immigrant rights organizations in the country, particularly in California. A doc on undocumented workers and the labor movement — who makes California agriculture, construction, and care work possible — would be extraordinary.",
    nextAction:"Review CHIRLA's existing media; assess appetite for doc commission",
    lastTouch:"", website:"chirla.org", priority:true
  },

  // ── HOUSING ───────────────────────────────────────────────────────────────
  {
    id:109, name:"National Housing Trust (NHT)", sector:"Housing",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Story Forming",
    mission:"Affordable rental housing preservation. Low-income housing tax credits, community ownership.",
    contacts:"Communications Director",
    notes:"The affordable housing preservation story — saving existing affordable units from conversion — is less visible than new construction but equally urgent. NHT could commission a doc on a building and the residents fighting to stay in their homes.",
    nextAction:"Review NHT's communications; assess budget signals via 990",
    lastTouch:"", website:"nationalhousingtrust.org", priority:false
  },
  {
    id:110, name:"NeighborWorks America", sector:"Housing",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$250M in grants. 240 nonprofit housing and community development orgs. Homeownership, rental, foreclosure.",
    contacts:"Communications Director",
    notes:"NeighborWorks has one of the most extensive community development networks in the country. A doc on homeownership as a wealth-building tool — following a first-time homebuyer through a NeighborWorks counseling program and into a home — could be a powerful economic mobility film.",
    nextAction:"Review NeighborWorks' existing media; identify comms lead",
    lastTouch:"", website:"neighborworks.org", priority:true
  },

  // ── FOOD & AGRICULTURE ────────────────────────────────────────────────────
  {
    id:111, name:"National Sustainable Agriculture Coalition (NSAC)", sector:"Food & Agriculture",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Story Forming",
    mission:"~100 grassroots farming, food, and conservation orgs. Farm bill advocacy, beginning farmer support.",
    contacts:"Communications Director",
    notes:"The family farm is disappearing — and the next Farm Bill fight will determine the future of sustainable agriculture. NSAC coordinates advocacy across the country. A doc on a Farm Bill cycle, from field to Congress, would be powerful.",
    nextAction:"Review NSAC's existing media and advocacy materials",
    lastTouch:"", website:"sustainableagriculture.net", priority:true
  },
  // ── IMMIGRATION ───────────────────────────────────────────────────────────
  {
    id:113, name:"International Rescue Committee (IRC)", sector:"Immigration",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$1B global budget; significant US operations. Refugee resettlement, crisis response, economic inclusion.",
    contacts:"Chief Communications Officer; Media Director",
    notes:"IRC operates on multiple continents at the intersection of conflict and displacement. A doc following a refugee family from camp to US resettlement — through the IRC network — would be a definitive refugee story for this era.",
    nextAction:"Review IRC's existing media strategy and branded content; assess what Think Out Loud adds",
    lastTouch:"", website:"rescue.org", priority:true
  },
  {
    id:114, name:"Refugee and Immigrant Center for Education and Legal Services (RAICES)", sector:"Immigration",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Clear Pitch",
    mission:"~$40M budget. Immigration legal services, family reunification, asylum, policy advocacy.",
    contacts:"Communications Director",
    notes:"RAICES became nationally known during family separation. Their ongoing legal work — defending asylum seekers, reuniting families — remains urgently important and deeply human. A doc inside RAICES would be a landmark immigration film.",
    nextAction:"Review RAICES' existing media; look for any prior documentary involvement",
    lastTouch:"", website:"raicestexas.org", priority:true
  },

  // ── PHILANTHROPY ──────────────────────────────────────────────────────────
  {
    id:115, name:"Council on Foundations", sector:"Philanthropy",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Story Forming",
    mission:"~1,500 foundation members. Philanthropic practice, equity in grantmaking, nonprofit sustainability.",
    contacts:"Communications Director",
    notes:"Philanthropy is rarely interrogated at documentary scale — but the question of who decides what gets funded, and whose communities are prioritized, is enormously important. Council on Foundations could commission a reflective doc on the practice of giving.",
    nextAction:"Review Council on Foundations' existing media; assess appetite for self-reflective doc",
    lastTouch:"", website:"cof.org", priority:false
  },
  {
    id:116, name:"Philanthropy Roundtable", sector:"Philanthropy",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"No Story Yet",
    mission:"Conservative-leaning philanthropy network. Donor freedom, education reform, civil society.",
    contacts:"Communications Director",
    notes:"A different political profile from most prospects — but documentary storytelling about philanthropy and civil society is genuinely nonpartisan. Worth a careful approach if there's appetite.",
    nextAction:"Research Philanthropy Roundtable's communications strategy; assess alignment",
    lastTouch:"", website:"philanthropyroundtable.org", priority:false
  },

  // ── VETERANS ──────────────────────────────────────────────────────────────
  {
    id:117, name:"Iraq and Afghanistan Veterans of America (IAVA)", sector:"Veterans",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Clear Pitch",
    mission:"~500,000 veteran members. PTSD, suicide prevention, women veterans, burn pit exposure.",
    contacts:"Communications Director",
    notes:"The burn pit exposure crisis — hundreds of thousands of veterans with toxic exposure illnesses — is one of the most important veteran stories rarely told in depth. IAVA led the PACT Act fight. A doc on veterans navigating the VA for burn pit treatment would be powerful.",
    nextAction:"Review IAVA's existing media; check for any prior documentary involvement",
    lastTouch:"", website:"iava.org", priority:true
  },
  {
    id:118, name:"Fisher House Foundation", sector:"Veterans",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$60M budget. Free housing for military families during hospitalization; scholarship programs.",
    contacts:"Communications Director",
    notes:"Fisher House is the most emotionally accessible veteran-adjacent story: families staying together during the worst moments of a military member's life. A verité doc inside a Fisher House during a critical period would be deeply moving.",
    nextAction:"Review Fisher House's existing media; identify comms lead",
    lastTouch:"", website:"fisherhouse.org", priority:true
  },

  // ── DISABILITY ────────────────────────────────────────────────────────────
  {
    id:119, name:"National Council on Disability (NCD)", sector:"Disability",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Story Forming",
    mission:"Federal agency. Disability policy, ADA enforcement, integration advocacy.",
    contacts:"Communications Director",
    notes:"NCD is the bridge between disability communities and federal policymaking. A doc on the unfinished business of the ADA — from employment gaps to inaccessible technology — would be timely on any ADA anniversary.",
    nextAction:"Review NCD's communications; assess appetite for commissioned doc work",
    lastTouch:"", website:"ncd.gov", priority:true
  },
  {
    id:120, name:"ADAPT", sector:"Disability",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Clear Pitch",
    mission:"Grassroots disability rights org. Community integration, attendant services, nursing home alternatives.",
    contacts:"Communications Director",
    notes:"ADAPT has a radical, direct-action tradition — chaining wheelchairs to buses, occupying the Senate floor. A doc on their decades of activism would be one of the great untold civil rights stories.",
    nextAction:"Research ADAPT's structure and communications; approach as community partnership",
    lastTouch:"", website:"adapt.org", priority:true
  },

  // ── LGBTQ+ ────────────────────────────────────────────────────────────────
  {
    id:122, name:"GLSEN (Gay, Lesbian and Straight Education Network)", sector:"LGBTQ+",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Story Forming",
    mission:"~$15M budget. LGBTQ+ student safety, inclusive curricula, GSA support.",
    contacts:"Communications Director",
    notes:"GLSEN sits at the intersection of LGBTQ+ rights and education — two of the most contested spaces in American public life right now. A doc on a GSA student and their school navigating a hostile environment would be a powerful portrait of youth resilience.",
    nextAction:"Review GLSEN's existing media; look for any prior film involvement",
    lastTouch:"", website:"glsen.org", priority:true
  },

  // ── RACIAL EQUITY ─────────────────────────────────────────────────────────
  {
    id:123, name:"Advancement Project", sector:"Racial Equity",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Clear Pitch",
    mission:"~$10M budget. Voting rights, school-to-prison pipeline, police accountability, racial justice.",
    contacts:"Communications Director",
    notes:"Advancement Project has led some of the most important racial justice legal battles of the past two decades. A doc on their school-to-prison pipeline work — following a school discipline case from classroom to courtroom — would be extraordinarily powerful.",
    nextAction:"Review Advancement Project's existing media and communications strategy",
    lastTouch:"", website:"advancementproject.org", priority:true
  },
  {
    id:124, name:"Race Forward", sector:"Racial Equity",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Story Forming",
    mission:"~$15M budget. Racial equity organizational change, systemic racism, narrative strategy.",
    contacts:"Communications Director",
    notes:"Race Forward works at the intersection of organizational change and racial equity narrative — a meta-level story about how institutions change. A doc on a major institution going through Race Forward's equity transformation process would be unique.",
    nextAction:"Review Race Forward's existing media; assess appetite for doc commission",
    lastTouch:"", website:"raceforward.org", priority:true
  },
  {
    id:125, name:"Color of Change", sector:"Racial Equity",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$30M budget. Digital racial justice, corporate accountability, criminal justice, media representation.",
    contacts:"Chief Communications Officer",
    notes:"Color of Change has reshaped how corporations and media talk about race — through campaigns, petitions, and accountability journalism. A doc on a major Color of Change campaign from inside the org would be a powerful portrait of digital organizing.",
    nextAction:"Review Color of Change's existing media strategy",
    lastTouch:"", website:"colorofchange.org", priority:true
  },

  // ── PUBLIC MEDIA ──────────────────────────────────────────────────────────
  {
    id:126, name:"Association of Public Television Stations (APTS)", sector:"Public Media",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"No Story Yet",
    mission:"~120 public TV station members. Public media funding, local news, educational content.",
    contacts:"Communications Director",
    notes:"Public media is under existential funding threat. APTS could commission a doc on local public television stations in small communities — and what disappears when they close.",
    nextAction:"Review APTS communications; assess appetite for self-referential doc on public media's value",
    lastTouch:"", website:"apts.org", priority:false
  },
  {
    id:127, name:"Public Media Alliance (PMA)", sector:"Public Media",
    stage:"Identified", budget:"Mid ($50k–$150k)", storyReady:"Story Forming",
    mission:"Global network of public media orgs. Media freedom, disinformation, public service journalism.",
    contacts:"Communications Director",
    notes:"PMA's global scope makes it a natural partner for a doc on public media as a democratic institution — told through case studies of public broadcasters under attack.",
    nextAction:"Review PMA's existing media and partnerships",
    lastTouch:"", website:"publicmediaalliance.org", priority:false
  },

  // ── FAMILY FOUNDATIONS ────────────────────────────────────────────────────
  {
    id:128, name:"Ford Foundation", sector:"Family Foundation",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Clear Pitch",
    mission:"~$16B in assets; ~$600M in annual grants. Focuses on reducing inequality across economic, racial, and social dimensions. Funds art, journalism, and documentary work directly through its arts and culture programs.",
    contacts:"Chief Communications Officer; Director of Media & Journalism",
    notes:"Ford has a long history of funding documentary film and media storytelling, making them a natural co-production partner rather than just a funder. Their 'Build Power' narrative around economic justice is a ready-made documentary arc. They frequently commission multimedia content to accompany major grant initiatives.",
    nextAction:"Research Ford's current 'BUILD' initiative grantees and draft a co-production pitch for their communications and arts teams",
    lastTouch:"", website:"fordfoundation.org", priority:true
  },
  {
    id:129, name:"MacArthur Foundation", sector:"Family Foundation",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Clear Pitch",
    mission:"~$7B in assets; ~$300M in annual grants. Known for 'genius grants' (Fellows Program) and major initiatives in criminal justice reform, climate, journalism, and nuclear risk. Explicitly funds documentary and narrative journalism.",
    contacts:"Director of Communications; Program Officer, Journalism & Media",
    notes:"MacArthur's 100andChange grant competition and journalism initiative are both documentary-ready narratives. They have funded documentary projects through their journalism and arts portfolios for decades. Their criminal justice reform initiative ('Safe and Just') has compelling human stories embedded in systemic change.",
    nextAction:"Identify MacArthur's current 100andChange cohort and reach out to their Director of Communications about a co-production concept",
    lastTouch:"", website:"macfound.org", priority:true
  },
  {
    id:130, name:"Hewlett Foundation", sector:"Family Foundation",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$12B in assets; ~$450M in annual grants. Funds education, environment, performing arts, global development, and democracy. Strong interest in communications and narrative strategy to advance policy goals.",
    contacts:"Chief Communications Officer; Director, Performing Arts Program",
    notes:"Hewlett's performing arts and education programs provide natural documentary subject matter, particularly around arts access in underserved communities. Their democracy program is funding work on civic participation that could become a powerful political documentary. They have commissioned multimedia storytelling projects to amplify grantee work.",
    nextAction:"Request a call with Hewlett's communications team to present a concept linking their performing arts and democracy portfolios into a single documentary narrative",
    lastTouch:"", website:"hewlett.org", priority:true
  },
  {
    id:131, name:"Packard Foundation", sector:"Family Foundation",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$9B in assets; ~$350M in annual grants. Focuses on conservation and science, population and reproductive health, and community development in Northern California. Strong tradition of funding media and storytelling to advance conservation narratives.",
    contacts:"Director of Communications; Program Officer, Conservation Science",
    notes:"Packard's conservation science program funds some of the most visually compelling environmental work in the world, including ocean conservation and climate science — ideal documentary territory. They have co-funded nature documentary content before. Their reproductive health portfolio opens an underexplored documentary angle.",
    nextAction:"Connect with Packard's conservation communications team about a visual storytelling partnership tied to their ocean science portfolio",
    lastTouch:"", website:"packard.org", priority:true
  },
  {
    id:132, name:"Bloomberg Philanthropies", sector:"Family Foundation",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Clear Pitch",
    mission:"~$1B+ in annual giving across public health, environment, arts, education, and government innovation. Known for high-production communications and media campaigns across public health and climate initiatives. Strong brand identity and communications infrastructure.",
    contacts:"Chief Communications Officer; Director, Arts Program",
    notes:"Bloomberg Philanthropies functions almost like a media-savvy political operation — it commissions high-quality content as part of its advocacy strategy. Their 'American Cities Climate Challenge' and tobacco control work have clear documentary arcs. They have already partnered with media organizations on documentary-style content.",
    nextAction:"Draft a treatment for a short documentary series tied to the American Cities Climate Challenge and pitch to Bloomberg's communications director",
    lastTouch:"", website:"bloomberg.org", priority:true
  },
  {
    id:133, name:"Walton Family Foundation", sector:"Family Foundation",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$2B+ in annual giving. Focuses on K-12 education reform, environmental conservation (particularly oceans and rivers), and economic development in Arkansas and the Mississippi Delta.",
    contacts:"Chief Communications Officer; Program Director, Environment",
    notes:"Walton's ocean conservation work — including support for marine protected areas — is visually rich documentary territory with global stakes. Their K-12 education work is a compelling 'two sides of a debate' documentary format. Their Delta Stewardship program covers rural Southern community development — a visually powerful and underserved landscape.",
    nextAction:"Research Walton's current ocean conservation grantees and propose a documentary following marine conservation scientists they fund",
    lastTouch:"", website:"waltonfamilyfoundation.org", priority:true
  },
  {
    id:134, name:"Schmidt Futures", sector:"Family Foundation",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"Eric and Wendy Schmidt's philanthropic initiative with ~$100M+ in annual giving. Focuses on science, technology, and society. Supports AI ethics, climate solutions, and ocean science through Schmidt Ocean Institute, which operates its own research vessels.",
    contacts:"Chief Communications Officer; Director of Strategic Initiatives",
    notes:"Schmidt Ocean Institute produces extraordinary visual content from deep-sea expeditions — a natural documentary partner. Schmidt Futures' AI and emerging technology work is at the center of one of the defining public debates of our era. Their Rhodes Scholars and Technologists for the Global Good programs feature compelling individual characters.",
    nextAction:"Contact Schmidt Ocean Institute's communications director about a co-produced documentary tied to an upcoming research expedition",
    lastTouch:"", website:"schmidtfutures.com", priority:true
  },
  {
    id:135, name:"Lumina Foundation", sector:"Family Foundation",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Clear Pitch",
    mission:"~$1.3B in assets; ~$80M in annual grants exclusively focused on expanding access to higher education and workforce credentials. Funds research, policy, and communications work to increase postsecondary attainment rates for adults and underrepresented students.",
    contacts:"Chief Communications Officer; Director of Strategic Communications",
    notes:"Lumina has a sophisticated communications strategy and explicitly funds media and storytelling to advance its education equity mission. Their 'adult learner' narrative — millions of Americans with some college but no degree — is a ready-made documentary arc with abundant individual stories. They have partnered with public radio and journalism outlets before.",
    nextAction:"Send a documentary treatment on adult learner stories to Lumina's Chief Communications Officer with a proposed partnership model",
    lastTouch:"", website:"luminafoundation.org", priority:true
  },
  {
    id:136, name:"Carnegie Corporation of New York", sector:"Family Foundation",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$3.5B in assets; ~$150M in annual grants. Focuses on education, democracy, international peace, and higher education. Has a long history of funding public media, journalism, and documentary film as tools for democratic civic engagement.",
    contacts:"Director of Communications; Program Officer, Democracy",
    notes:"Carnegie has directly funded PBS documentaries and public media for decades — a proven relationship pathway. Their democracy and civic education program is urgently relevant. Their education work, particularly around early childhood and K-12 reform, includes systemic change stories that work well in documentary format.",
    nextAction:"Review Carnegie's recent democracy initiative grants and request a meeting with their communications director to discuss a co-production on civic education",
    lastTouch:"", website:"carnegie.org", priority:true
  },
  {
    id:137, name:"Open Society Foundations", sector:"Family Foundation",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Clear Pitch",
    mission:"George Soros's global philanthropy with ~$1B+ in annual giving focused on democracy, human rights, justice, and open societies worldwide. Funds media, documentary film, and investigative journalism directly through its arts and journalism programs. Operates in 100+ countries.",
    contacts:"Director of Communications; Program Director, Arts & Culture",
    notes:"Open Society has one of the most active documentary film funding programs of any foundation, historically supporting human rights documentaries around the world. Their criminal justice reform work in the US — bail reform, prosecution reform, voting rights — is a proven documentary genre with urgent relevance.",
    nextAction:"Contact Open Society's arts program officer directly about co-producing a criminal justice documentary aligned with their prosecution reform initiative",
    lastTouch:"", website:"opensocietyfoundations.org", priority:true
  },
  {
    id:138, name:"Annie E. Casey Foundation", sector:"Family Foundation",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Clear Pitch",
    mission:"~$3B in assets; ~$170M in annual grants focused on improving outcomes for disadvantaged children and families in America. Operates data, advocacy, and direct community investment programs.",
    contacts:"Chief Communications Officer; Director of Advocacy & Policy",
    notes:"Casey's child welfare reform work — particularly around reducing foster care placements and juvenile incarceration — is deeply human storytelling territory. Their 'KIDS COUNT' annual data report is a recognized national resource that could anchor an annual documentary series. Their racial equity and family economic security programs tie systemic and personal narratives together.",
    nextAction:"Pitch a documentary concept tied to Casey's foster care reform initiative to their Chief Communications Officer",
    lastTouch:"", website:"aecf.org", priority:true
  },
  {
    id:139, name:"Robert Wood Johnson Foundation", sector:"Family Foundation",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Clear Pitch",
    mission:"~$12B in assets; ~$600M in annual grants — largest US foundation dedicated to health. Focuses on health equity, public health infrastructure, childhood obesity, and social determinants of health. Has a robust communications and media program.",
    contacts:"Chief Communications Officer; Director of Media & Communications",
    notes:"RWJF has a well-established history of funding health-focused documentary film and public media — they are a proven production partner. Their 'Culture of Health' initiative is explicitly about changing narratives around health equity, making documentary storytelling a strategic fit. They fund health policy debates that are ripe for documentary treatment.",
    nextAction:"Submit a formal documentary proposal through RWJF's media and communications team aligned with their health equity narrative strategy",
    lastTouch:"", website:"rwjf.org", priority:true
  },
  {
    id:140, name:"Doris Duke Charitable Foundation", sector:"Family Foundation",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$1.8B in assets; ~$100M in annual grants. Focuses on performing arts, environmental conservation, child abuse prevention, and building careers of emerging artists. Long history of supporting jazz, dance, and theater.",
    contacts:"Program Officer, Performing Arts; Director of Communications",
    notes:"Doris Duke's performing arts program — focused on jazz, contemporary dance, and theater — offers visually rich documentary material about artistic excellence and cultural heritage. Their climate and conservation work has strong documentary potential. Their artist career development programs feature compelling individual journeys.",
    nextAction:"Connect with Doris Duke's performing arts program officer about a documentary concept centered on artist fellowship recipients",
    lastTouch:"", website:"ddcf.org", priority:true
  },
  {
    id:141, name:"Skoll Foundation", sector:"Family Foundation",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Clear Pitch",
    mission:"~$1.3B in assets; ~$60M in annual grants focused on social entrepreneurship. Funds 'social entrepreneurs' scaling innovative solutions. Has a direct media and film program and a historic relationship with documentary film through the Sundance Documentary Film Fund.",
    contacts:"Director of Storytelling & Media; Chief Communications Officer",
    notes:"Skoll has one of the most sophisticated relationships with documentary film of any foundation — they explicitly use film as a tool for advancing social entrepreneurship narratives and have funded multiple award-winning documentaries. Their Skoll Award for Social Entrepreneurship recipients read as a documentary subject list.",
    nextAction:"Reach out to Skoll's Director of Storytelling directly about co-producing a documentary following one of their current Skoll Award recipients",
    lastTouch:"", website:"skoll.org", priority:true
  },
  {
    id:142, name:"Arnold Ventures", sector:"Family Foundation",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$300M+ in annual giving. Focuses on criminal justice reform, health care, public pensions, and education policy. Known for evidence-based, policy-reform-focused grantmaking with a strong communications strategy. Funds investigative journalism and research.",
    contacts:"Chief Communications Officer; Program Director, Criminal Justice",
    notes:"Arnold Ventures' criminal justice reform portfolio — including bail reform, prosecution reform, and policing — is documentary-ready. Their work on drug pricing and pharmaceutical transparency is a high-stakes investigative documentary subject. They fund journalism partners explicitly as part of their communications strategy, signaling openness to media co-production.",
    nextAction:"Propose a documentary on bail reform to Arnold Ventures' criminal justice communications lead, referencing their existing journalism partnerships",
    lastTouch:"", website:"arnoldventures.org", priority:true
  },
  {
    id:143, name:"Chan Zuckerberg Initiative", sector:"Family Foundation",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"Mark Zuckerberg and Priscilla Chan's philanthropic LLC with billions committed over their lifetimes. Focuses on education, science (basic biomedical research), and criminal justice/immigration reform. Structured as an LLC giving it flexibility to fund advocacy and media.",
    contacts:"Chief Communications Officer; Director, Education Initiative",
    notes:"CZI's education initiative — focused on personalized learning and education technology — is an underexplored documentary subject with strong access potential. Their science initiative (funding basic biomedical research) offers a compelling look at how philanthropy is reshaping scientific discovery. Their criminal justice and immigration work provides human story angles.",
    nextAction:"Request a meeting with CZI's education communications team about a documentary following schools implementing their supported learning tools",
    lastTouch:"", website:"chanzuckerberg.com", priority:true
  },
  {
    id:144, name:"Bezos Earth Fund", sector:"Family Foundation",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Clear Pitch",
    mission:"Jeff Bezos's $10 billion commitment to fight climate change and protect biodiversity. Focuses on nature-based solutions, clean energy transition, and food systems transformation. Actively building its communications and storytelling infrastructure as a new, high-profile philanthropy.",
    contacts:"Chief Communications Officer; Director of Strategic Partnerships",
    notes:"The Bezos Earth Fund is actively building its communications infrastructure, making now an ideal time to pitch a documentary partnership. Their nature-based solutions and biodiversity work is visually extraordinary documentary material. The scale of their ambition — $10 billion — means budget for high-production documentary content.",
    nextAction:"Identify the Bezos Earth Fund's Director of Communications and pitch a documentary partnership concept tied to their first major grant cohort",
    lastTouch:"", website:"bezosearthfund.org", priority:true
  },
  {
    id:145, name:"Wellcome Trust (US Programs)", sector:"Family Foundation",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"London-based global health research charity with ~$35B in assets; ~$1.3B in annual grants. Increasingly funds US-based work in infectious disease, mental health, and climate/health intersections. Has an active public engagement and media program including documentary commissions.",
    contacts:"Director of Public Engagement; Head of Media & Communications",
    notes:"Wellcome has directly commissioned documentary films and media content about health research as part of its public engagement strategy. Their mental health initiative is a major new program actively seeking narrative communications partners. Their climate and health work — exploring how climate change impacts human health — is a relatively unexplored documentary genre.",
    nextAction:"Contact Wellcome's public engagement team about co-producing a documentary on their mental health or climate-and-health initiative",
    lastTouch:"", website:"wellcome.org", priority:true
  },
  {
    id:146, name:"Pivotal Ventures (Melinda French Gates)", sector:"Family Foundation",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"Melinda French Gates's investment and incubation company with hundreds of millions committed to expanding opportunity for women and families. Focuses on women's economic empowerment, childcare, and representation in media. Explicitly invests in media and entertainment projects that expand women's representation.",
    contacts:"Chief Communications Officer; Director of Strategic Investments",
    notes:"Pivotal explicitly invests in media and film that expands the representation and narrative of women — making it a direct documentary co-production prospect. Their childcare and economic mobility work has rich human story content. Melinda French Gates's public profile makes any associated documentary project highly promotable.",
    nextAction:"Research Pivotal Ventures' current media investment portfolio and request a meeting with their Director of Strategic Investments about a co-production concept",
    lastTouch:"", website:"pivotalventures.org", priority:true
  },
  {
    id:147, name:"W.K. Kellogg Foundation", sector:"Family Foundation",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$9B in assets; ~$300M in annual grants focused on vulnerable children and families. Programs address racial equity, early childhood development, food systems, and community engagement. Strong equity-focused communications approach.",
    contacts:"Chief Communications Officer; Program Director, Racial Equity",
    notes:"Kellogg's racial equity program — including their 'Truth, Racial Healing, and Transformation' initiative — is explicitly narrative-driven and designed to change the stories we tell about race in America, making documentary film a natural strategy. Their early childhood and food systems work in rural and Native communities is underrepresented in documentary film.",
    nextAction:"Request a meeting with Kellogg's communications team about a documentary tied to their Truth, Racial Healing, and Transformation initiative",
    lastTouch:"", website:"wkkf.org", priority:true
  },
  {
    id:148, name:"Rockefeller Foundation", sector:"Family Foundation",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Clear Pitch",
    mission:"~$6B in assets; ~$350M+ in annual spending. Focuses on food systems, health, energy access, and economic inclusion. Has a robust communications and media operation with a dedicated 'narrative change' function on staff.",
    contacts:"Director of Communications; Senior Director, Narrative Change",
    notes:"Rockefeller has explicitly funded documentary films and narrative media as part of its strategy to shift public thinking about food, energy, and health. Their 'Equity x Design' and food system initiatives are active documentary subjects. The presence of a dedicated narrative change function is a major signal of documentary appetite.",
    nextAction:"Contact Rockefeller's Narrative Change team directly about a co-production concept tied to their food system transformation initiative",
    lastTouch:"", website:"rockefellerfoundation.org", priority:true
  },
  {
    id:149, name:"Bill & Melinda Gates Foundation", sector:"Family Foundation",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Clear Pitch",
    mission:"~$70B in assets; ~$6B in annual grants — the largest private foundation in the world. Focuses on global health, global development, US education, and gender equality. Has a substantial communications and media program including past documentary partnerships.",
    contacts:"Director of Global Media & Advocacy; Chief Communications Officer",
    notes:"Gates has co-produced and funded documentary content as part of its advocacy strategy on issues from polio eradication to malaria to US education. Their global health work — with cinematic settings across Sub-Saharan Africa, South Asia, and Latin America — is proven documentary territory. Their media advocacy team specifically seeks documentary partners.",
    nextAction:"Submit a formal pitch to the Gates Foundation's global media and advocacy team for a documentary on global health eradication efforts",
    lastTouch:"", website:"gatesfoundation.org", priority:true
  },
  {
    id:150, name:"Knight Foundation", sector:"Family Foundation",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Clear Pitch",
    mission:"~$2.5B in assets; ~$150M in annual grants. Focuses on journalism, arts, and community engagement — particularly in the 26 communities where the Knight brothers owned newspapers. Has the most sophisticated journalism funding program of any US foundation.",
    contacts:"Chief Communications Officer; Program Director, Journalism",
    notes:"Knight is the most important media and journalism philanthropy in the US — making them a natural co-production partner for documentary journalism projects. Their journalism program funds investigative and narrative journalism that frequently overlaps with documentary subject matter. Their arts program in Knight communities supports documentary film directly.",
    nextAction:"Contact Knight's journalism program director about a co-production partnership for a documentary on local news deserts in Knight communities",
    lastTouch:"", website:"knightfoundation.org", priority:true
  },
  {
    id:151, name:"McCormick Foundation", sector:"Family Foundation",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$1.5B in assets; ~$75M in annual grants. Focuses on civic education, journalism, early childhood, and veterans. Connected to the Tribune Company legacy. One of the largest journalism philanthropies in the country.",
    contacts:"Director of Communications; Program Officer, Journalism; CEO",
    notes:"McCormick's journalism program is a natural documentary co-production partner, with deep relationships across the journalism ecosystem. Their civic education work, including the Cantigny War Museum and military history, provides distinctive documentary subject matter. Their veterans' program supports post-military transitions with compelling individual stories.",
    nextAction:"Contact McCormick Foundation's journalism program officer about co-producing a documentary on local journalism survival in the digital age",
    lastTouch:"", website:"mccormickfoundation.org", priority:true
  },
  {
    id:152, name:"Luminate (Omidyar)", sector:"Family Foundation",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$100M+ in annual giving. Focuses on civic empowerment, data and digital rights, fiscal transparency, and independent media. Spun off from Omidyar Network with a specific mandate to strengthen civic life and democratic accountability.",
    contacts:"Chief Communications Officer; Director of Strategic Communications; Program Director",
    notes:"Luminate's focus on independent media funding — supporting investigative journalism and civic technology globally — makes it a natural documentary partner. Their data and digital rights work, exploring how surveillance and algorithmic power affect citizens, is a high-stakes investigative documentary subject.",
    nextAction:"Contact Luminate's communications director about a documentary on digital rights and surveillance, tying their grantee network to compelling individual stories",
    lastTouch:"", website:"luminategroup.com", priority:true
  },

  // ── PHARMA & BIOTECH ──────────────────────────────────────────────────────
  {
    id:153, name:"Pfizer", sector:"Pharma & Biotech",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$58B in annual revenue. Extensive corporate affairs and patient advocacy programs including the Pfizer Foundation. Produces substantial communications content around patient journeys, breakthrough therapies, and public health campaigns.",
    contacts:"Chief Communications Officer; VP of Corporate Affairs; Director of Patient Advocacy",
    notes:"Pfizer's experience developing and distributing COVID-19 vaccines — one of the most consequential public health moments of the century — is unfinished documentary territory with both scientific and human story dimensions. Their patient advocacy programs across oncology, rare disease, and infectious disease regularly feature extraordinary patient journeys.",
    nextAction:"Contact Pfizer's Corporate Affairs team about a documentary concept tied to their rare disease or patient advocacy programs",
    lastTouch:"", website:"pfizer.com", priority:true
  },
  {
    id:154, name:"Johnson & Johnson", sector:"Pharma & Biotech",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$85B in annual revenue. Major corporate social responsibility and public health communications programs including the J&J Foundation. Known for campaigns around nursing, global health equity, and mental health.",
    contacts:"Chief Communications Officer; VP of Global Corporate Affairs; Director, J&J Foundation",
    notes:"J&J's 'Campaign for Nursing's Future' — a decades-long investment in nursing workforce — is a documentary subject that hasn't been fully told at the feature level. Their global health work in HIV/AIDS and vaccine access in low-income countries is powerful visual storytelling territory. Their mental health initiative is a growing communications focus.",
    nextAction:"Pitch a documentary on the nursing workforce crisis to J&J's communications and foundation teams, referencing their existing Campaign for Nursing infrastructure",
    lastTouch:"", website:"jnj.com", priority:true
  },
  {
    id:155, name:"Merck & Co.", sector:"Pharma & Biotech",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$60B in annual revenue. Major corporate responsibility program including Merck for Mothers ($500M initiative to end maternal mortality globally). Focuses on global health access and patient advocacy.",
    contacts:"Chief Communications Officer; Director, Merck for Mothers; VP of Global Public Policy",
    notes:"Merck for Mothers is a high-visibility, human-centered program perfectly suited to documentary storytelling. Their HIV treatment access work in sub-Saharan Africa has been a decades-long narrative of science, diplomacy, and human resilience. Their oncology pipeline features extraordinary patient stories.",
    nextAction:"Reach out to Merck for Mothers' communications lead about co-producing a documentary on their global maternal health initiative",
    lastTouch:"", website:"merck.com", priority:true
  },
  {
    id:156, name:"Bristol-Myers Squibb", sector:"Pharma & Biotech",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$47B in annual revenue. Known for immuno-oncology breakthroughs (Opdivo, Yervoy). BMS Foundation focused on cancer health equity and cardiovascular disease. Strong patient advocacy and communications programs.",
    contacts:"Chief Communications Officer; Director, BMS Foundation; VP of Patient Advocacy",
    notes:"BMS's immuno-oncology work — helping the immune system fight cancer — is a scientific revolution with extraordinary patient survivor stories. Their cancer health equity work, focusing on disparities in cancer outcomes across racial and economic lines, is urgent documentary territory. The BMS Foundation's cardiovascular health equity program is another underexplored subject.",
    nextAction:"Pitch a documentary on immuno-oncology patient survivors to BMS's Chief Communications Officer, linking the scientific story to the patient equity narrative",
    lastTouch:"", website:"bms.com", priority:true
  },
  {
    id:157, name:"Gilead Sciences", sector:"Pharma & Biotech",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Clear Pitch",
    mission:"~$27B in annual revenue. Known for transformative HIV and hepatitis C treatments. The Gilead Foundation invests in HIV, viral hepatitis, and lung disease communities. Deep relationship with LGBTQ+ communities through HIV advocacy.",
    contacts:"Chief Communications Officer; Director, Gilead Foundation; VP of Patient Advocacy",
    notes:"Gilead's role in transforming HIV from a death sentence to a manageable condition — and their development of PrEP (Truvada) — is one of the great scientific and advocacy stories of the last 40 years. Their hepatitis C cure and its access controversy is a powerful investigative documentary subject. Their ongoing HIV equity work in communities of color is urgent and underrepresented.",
    nextAction:"Contact Gilead Foundation's director about a documentary on HIV prevention equity in the American South, tied to their community health programs",
    lastTouch:"", website:"gilead.com", priority:true
  },
  {
    id:158, name:"Eli Lilly", sector:"Pharma & Biotech",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$45B in annual revenue. Known for insulin, diabetes care, and breakthrough Alzheimer's and obesity drugs (Mounjaro/Zepbound). Major patient advocacy and communications programs around diabetes, mental health (Lilly Cares), and oncology.",
    contacts:"Chief Communications Officer; VP of Corporate Affairs; Director, Lilly Foundation",
    notes:"Lilly's insulin pricing controversy — and their eventual decision to cap insulin costs — is a fully documentary-ready narrative arc about corporate responsibility, patient advocacy, and political pressure. Their Alzheimer's drug development is a high-stakes scientific story with deeply human family narratives. The obesity drug revolution (GLP-1s) represents a societal shift Lilly is at the center of.",
    nextAction:"Propose a documentary on diabetes patient advocacy and insulin access to Lilly's corporate affairs team, positioning Lilly as a company that listened",
    lastTouch:"", website:"lilly.com", priority:true
  },
  {
    id:159, name:"Moderna", sector:"Pharma & Biotech",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$18B in revenue. Built on mRNA technology that produced a COVID-19 vaccine in record time. Has a corporate responsibility program focused on equitable vaccine access. Currently developing mRNA vaccines for cancer, influenza, and HIV.",
    contacts:"Chief Communications Officer; VP of Corporate Affairs; Head of Global Access",
    notes:"Moderna's origin story — a startup that used mRNA technology to develop a COVID-19 vaccine in record time — is a compelling documentary narrative that hasn't been definitively told. Their pipeline of mRNA cancer vaccines (personalized cancer vaccines) is one of the most exciting medical frontiers and a powerful documentary subject.",
    nextAction:"Pitch a documentary on Moderna's mRNA cancer vaccine program to their Chief Communications Officer, positioning the film around the next chapter of mRNA medicine",
    lastTouch:"", website:"modernatx.com", priority:true
  },
  {
    id:160, name:"Biogen", sector:"Pharma & Biotech",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$10B in annual revenue focused on neurological diseases including Alzheimer's, MS, ALS, and spinal muscular atrophy. Has patient advocacy programs in neurology and the Biogen Foundation.",
    contacts:"Chief Communications Officer; Director, Patient Advocacy; VP of Corporate Affairs",
    notes:"Biogen's Alzheimer's drug controversy — including the FDA's accelerated approval of Aduhelm and subsequent scrutiny — is one of the most dramatic regulatory stories in pharmaceutical history. Their SMA treatment work involves infant patient families with deeply emotional journeys. Their MS patient community is one of the most organized and vocal in pharma.",
    nextAction:"Propose a documentary on the Alzheimer's drug development and approval landscape to Biogen's Chief Communications Officer, centering patient and family voices",
    lastTouch:"", website:"biogen.com", priority:true
  },
  {
    id:161, name:"Genentech / Roche", sector:"Pharma & Biotech",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"South San Francisco-based biotech (subsidiary of Roche, ~$60B global revenue) that pioneered modern biotechnology and cancer immunotherapy. Known for Herceptin (breast cancer), Avastin (cancer), and many other biologics. Has patient advocacy, science education, and health equity programs.",
    contacts:"Chief Communications Officer; Director, Genentech Foundation; VP of Patient Advocacy",
    notes:"Genentech's founding story — a startup that created the biotech industry by synthesizing human insulin in the 1970s — is corporate history that hasn't been definitively documented on film. Their cancer treatment breakthroughs, particularly in HER2+ breast cancer (Herceptin), involve patient communities with living memory of how the drug changed outcomes.",
    nextAction:"Pitch a documentary on the biotech revolution and its patient impact to Genentech's communications team, tied to their historical leadership in the field",
    lastTouch:"", website:"gene.com", priority:true
  },
  {
    id:162, name:"Regeneron", sector:"Pharma & Biotech",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$14B in annual revenue. Known for Dupixent (atopic dermatitis/asthma), Eylea (macular degeneration), and COVID antibody treatments. Has the Regeneron Science Talent Search — the nation's oldest and most prestigious science competition for high school students.",
    contacts:"Chief Communications Officer; VP of Corporate Affairs; Director, Science Education",
    notes:"Regeneron's Science Talent Search is a proven documentary subject with strong character-driven potential — following young scientists competing for national recognition. Their Dupixent patient stories, involving people who suffered from debilitating eczema or severe asthma, are compelling transformative narratives.",
    nextAction:"Contact Regeneron's science education team about a documentary on the Science Talent Search competition and the young scientists who participate",
    lastTouch:"", website:"regeneron.com", priority:false
  },

  // ── CORPORATE FOUNDATIONS ─────────────────────────────────────────────────
  {
    id:163, name:"Google.org", sector:"Corporate Foundation",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"Google's philanthropic arm with ~$200M+ in annual grants and significant in-kind contributions. Focuses on economic opportunity, racial equity, crisis response, and education. Supports nonprofits using technology to solve social problems.",
    contacts:"Director of Communications; Head of Google.org; VP of Community Engagement",
    notes:"Google.org's support for AI-powered nonprofits and technology-for-good organizations creates documentary subjects at the intersection of tech and social impact — an underexplored genre. Their racial equity fund has supported hundreds of organizations with compelling stories. Their crisis response work features organizations deploying technology in high-stakes situations.",
    nextAction:"Request a meeting with Google.org's communications team about a documentary on AI-for-good nonprofits in their grant portfolio",
    lastTouch:"", website:"google.org", priority:true
  },
  {
    id:164, name:"Microsoft Philanthropies", sector:"Corporate Foundation",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"Microsoft's philanthropic and corporate responsibility arm with hundreds of millions in annual giving. Focuses on digital equity, AI for accessibility, sustainability, and workforce development. Operates through direct grants and technology donations to nonprofits globally.",
    contacts:"Chief Communications Officer; Director, Microsoft Philanthropies; VP of Corporate Affairs",
    notes:"Microsoft's AI accessibility work — developing technology to help people with disabilities — is a documentary subject at the intersection of technology, disability rights, and human potential. Their digital equity initiative reaches millions in underserved communities with powerful individual stories. Their sustainability commitments and technology infrastructure are documentary-worthy.",
    nextAction:"Contact Microsoft Philanthropies' communications team about a documentary on their AI for Accessibility grants and the communities they serve",
    lastTouch:"", website:"microsoft.com/philanthropies", priority:true
  },
  {
    id:165, name:"JPMorgan Chase Foundation", sector:"Corporate Foundation",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$300M+ in annual giving. Focuses on workforce development, small business growth, community development, financial health, and racial equity. 'Advancing Cities' program targets economic opportunity in mid-size US cities including Detroit, Chicago, and Washington, D.C.",
    contacts:"Chief Communications Officer; Director, JPMorgan Chase Foundation; Head of Policy Center",
    notes:"JPMorgan Chase's 'Advancing Cities' initiative — making major investments in economic opportunity in specific cities — is a city-by-city documentary series waiting to happen. Their small business development work features entrepreneurs overcoming structural barriers. Their workforce development programs connect low-income residents to career pathways.",
    nextAction:"Pitch a documentary on JPMorgan Chase's Advancing Cities investment in Detroit to their communications and foundation team",
    lastTouch:"", website:"jpmorganchase.com/impact", priority:true
  },

  // ── GLOBAL HEALTH ─────────────────────────────────────────────────────────
  {
    id:166, name:"CDC Foundation", sector:"Global Health",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Clear Pitch",
    mission:"Atlanta-based 501(c)(3) that builds partnerships for the CDC with ~$260M in annual revenue. Funds public health emergency response, workforce development, and health equity programs. Works across infectious disease, chronic disease prevention, and global health security.",
    contacts:"Chief Communications Officer; Director of Marketing & Communications",
    notes:"The CDC Foundation's work spans every major public health emergency — COVID-19, Ebola, mpox, opioids — making it a natural documentary partner for health crisis narratives. Their workforce development work trains the next generation of public health professionals. Their health equity programs in underserved communities provide human-centered documentary content.",
    nextAction:"Pitch a documentary on CDC Foundation-supported public health emergency response to their communications director, timing around a relevant health observance",
    lastTouch:"", website:"cdcfoundation.org", priority:true
  },
  {
    id:167, name:"PATH", sector:"Global Health",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"Seattle-based global health nonprofit with ~$600M in annual revenue. Works to accelerate health equity by advancing health solutions — vaccines, diagnostics, drugs — for populations most in need. Works across Africa, Asia, and Latin America on malaria, HIV, maternal health, and nutrition.",
    contacts:"Director of Communications; Senior Director of Partnerships",
    notes:"PATH's work developing affordable health technologies for low-income countries is a story of how global health innovation operates outside the commercial market. Their work in sub-Saharan Africa and South Asia provides cinematic international settings. Their malaria vaccine work — collaboration on the first approved malaria vaccine — is a decades-long narrative of scientific persistence.",
    nextAction:"Contact PATH's communications director about a documentary on malaria vaccine access and rollout in sub-Saharan Africa",
    lastTouch:"", website:"path.org", priority:true
  },
  {
    id:168, name:"CARE", sector:"Global Health",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"Atlanta-based international humanitarian organization with ~$700M in annual revenue. Works in 100+ countries on poverty, gender equality, emergency response, and food security. One of the largest humanitarian organizations in the world.",
    contacts:"Chief Communications Officer; Director of Media & Public Engagement",
    notes:"CARE's humanitarian response work — from Syrian refugee camps to East African food crises — has cinematic scope and urgent human stakes. Their gender equality programs, particularly economic empowerment for women in the developing world, feature remarkable individual transformation stories. They have a sophisticated communications infrastructure.",
    nextAction:"Contact CARE's Chief Communications Officer about a documentary partnership tied to their gender equity and economic empowerment programs",
    lastTouch:"", website:"care.org", priority:true
  },
  {
    id:169, name:"Global Fund for Women", sector:"Global Health",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$25M+ in annual revenue. Funds grassroots women's organizations worldwide. Focuses on gender justice, bodily autonomy, and economic power for women and girls. Has an active communications and storytelling program.",
    contacts:"Director of Communications; CEO; Director of Storytelling",
    notes:"Global Fund for Women's grantees are grassroots women's organizations in the global South — women farmers, activists, and leaders operating under extraordinary constraints. Their funding model, trusting local women's organizations to lead their own advocacy, is itself a documentary subject. Their work on gender-based violence, land rights, and bodily autonomy spans continents.",
    nextAction:"Contact Global Fund for Women's Director of Storytelling about a documentary following international grantees in multiple countries",
    lastTouch:"", website:"globalfundforwomen.org", priority:true
  },
  {
    id:170, name:"Conservation International", sector:"Environment",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$200M+ in annual revenue. Works to protect nature and biodiversity in 30+ countries, with focus on tropical forests, oceans, and the climate-nature nexus. Has notable celebrity engagement (including Harrison Ford) and strong communications capacity.",
    contacts:"Chief Communications Officer; Director of Media; VP of Creative",
    notes:"Conservation International has worked with major media organizations and celebrities to produce conservation communications content. Their work in tropical forests (Amazon, Congo, Borneo) provides some of the most visually stunning documentary settings in the world. Their science teams work in remote and rarely filmed ecosystems.",
    nextAction:"Reach out to Conservation International's communications team about a documentary partnership tied to a flagship conservation initiative in a high-profile biodiversity hotspot",
    lastTouch:"", website:"conservation.org", priority:true
  },

  // ── LARGE ADVOCACY & ENVIRONMENT (continued) ───────────────────────────────
  {
    id:171, name:"American Medical Association", sector:"Health & Medicine",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$300M+ in annual revenue. Advocates for physicians and the physician-patient relationship, sets medical standards, and funds medical education. Has a major communications and advocacy program including media and public health campaigns.",
    contacts:"Chief Communications Officer; VP of Advocacy Communications; Director of Media Relations",
    notes:"The AMA's physician advocacy work — around burnout, scope of practice, telehealth, prior authorization — tells a story of a healthcare system under extreme stress that would resonate with broad audiences. Their health equity initiatives, including explicit commitment to ending systemic racism in medicine, are documentary-worthy institutional reckoning narratives.",
    nextAction:"Contact the AMA's communications team about a documentary on physician burnout and the state of the American healthcare workforce",
    lastTouch:"", website:"ama-assn.org", priority:true
  },
  {
    id:172, name:"American Civil Liberties Union (ACLU)", sector:"Advocacy & Policy",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Clear Pitch",
    mission:"~$300M+ in annual revenue (including ACLU Foundation). Litigates landmark civil liberties cases, lobbies, and organizes on free speech, privacy, voting rights, immigration, and reproductive rights.",
    contacts:"Director of Communications; Chief Media Officer; VP of Advocacy Communications",
    notes:"The ACLU is involved in many of the most consequential constitutional cases of our era — reproductive rights post-Dobbs, voting rights, transgender rights — each of which offers a documentary narrative following the lawyers and plaintiffs behind landmark cases. They have a sophisticated media operation and have worked with documentary filmmakers.",
    nextAction:"Contact ACLU's communications team about a documentary following a current landmark case through the appellate courts",
    lastTouch:"", website:"aclu.org", priority:true
  },
  {
    id:173, name:"Sierra Club Foundation", sector:"Environment",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$100M+ in annual revenue. Funds environmental advocacy, litigation, grassroots organizing, and clean energy transition work. Has a major communications program including multimedia storytelling.",
    contacts:"Director of Communications; Chief Engagement Officer; Director of Media",
    notes:"Sierra Club's 'Beyond Coal' campaign — which has retired hundreds of coal plants — is a decade-long story of organizing, litigation, and community transformation. Their environmental justice work in frontline communities offers compelling individual and community stories. Their Beyond Dirty Fuels campaign has dramatic political and economic stakes.",
    nextAction:"Propose a documentary on an environmental justice community the Sierra Club Foundation supports to their communications director",
    lastTouch:"", website:"sierraclubfoundation.org", priority:true
  },
  {
    id:174, name:"Environmental Defense Fund", sector:"Environment",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$300M+ in annual revenue. Uses economic and scientific tools to find practical solutions to environmental problems. Known for market-based approaches to climate, fisheries reform, and methane reduction.",
    contacts:"Chief Communications Officer; Director of Media; VP of Strategy",
    notes:"EDF's 'methane hunters' — scientists measuring methane emissions from oil and gas facilities using satellite technology — is a visually extraordinary documentary subject at the frontier of climate science. Their fisheries reform work, using market incentives to restore fish stocks, has transformed coastal fishing communities. Their work on carbon markets is a policy documentary subject.",
    nextAction:"Contact EDF's communications director about a documentary on their satellite methane detection program and its implications for climate policy",
    lastTouch:"", website:"edf.org", priority:true
  },
  {
    id:175, name:"The Nature Conservancy", sector:"Environment",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$1B+ in annual revenue. Operations in 72 countries. Focuses on land and water conservation, climate solutions, and freshwater protection. Has extensive media and communications infrastructure.",
    contacts:"Chief Communications Officer; Director of Media & Brand; VP of External Affairs",
    notes:"TNC's land conservation work takes place in some of the most visually stunning settings on Earth, from the Amazon to the Appalachians. Their 'NatureVest' impact investing work brings a finance-meets-environment documentary angle. Their water fund programs in Latin America feature community-conservation partnerships.",
    nextAction:"Contact TNC's Chief Communications Officer about a documentary partnership tied to one of their flagship conservation initiatives",
    lastTouch:"", website:"nature.org", priority:true
  },
  {
    id:176, name:"World Wildlife Fund (WWF-US)", sector:"Environment",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Clear Pitch",
    mission:"~$380M in annual US revenue. Focuses on wildlife conservation, ocean protection, freshwater, food, and climate. Known globally for its brand and conservation storytelling.",
    contacts:"Chief Communications Officer; Director of Media; VP of Marketing",
    notes:"WWF has the most globally recognized conservation brand in the world and already operates as a sophisticated media organization. Their wildlife trafficking work — following rangers, smuggling networks, and endangered species — has thriller-level narrative potential. Their ocean plastics and fisheries work has urgent environmental stakes.",
    nextAction:"Pitch a documentary on WWF-supported wildlife conservation rangers to their Chief Communications Officer, proposing embedded access to field teams",
    lastTouch:"", website:"worldwildlife.org", priority:true
  },
  {
    id:177, name:"Earthjustice", sector:"Environment",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$175M+ in annual revenue. The largest environmental law organization in the US, litigating environmental cases at no cost to clients. Works on clean air, clean water, climate, and public lands protection.",
    contacts:"Chief Communications Officer; Director of Media; VP of Litigation Communications",
    notes:"Earthjustice's legal battles to stop polluting facilities, protect wilderness, and enforce clean air and water laws are dramatic courtroom stories with real environmental stakes. Their attorneys often represent frontline communities — indigenous tribes, low-income neighborhoods. Their Alaskan wilderness and Western public lands cases involve extraordinary visual settings.",
    nextAction:"Contact Earthjustice's communications team about a documentary following a current high-profile environmental justice lawsuit and the community plaintiffs",
    lastTouch:"", website:"earthjustice.org", priority:true
  },
  {
    id:178, name:"Human Rights Watch", sector:"Advocacy & Policy",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$100M+ in annual revenue. Investigates and reports on human rights abuses in 90+ countries. Known for detailed research and advocacy that influences policy, litigation, and public opinion.",
    contacts:"Director of Communications; Deputy Executive Director for External Relations; Global Media Director",
    notes:"Human Rights Watch's investigators work in the world's most dangerous and urgent human rights situations — from Ukraine to Yemen to Myanmar — creating extraordinary documentary opportunities. Their investigative methodology — gathering testimony, analyzing satellite imagery, building legal cases — is a compelling behind-the-scenes documentary subject.",
    nextAction:"Contact HRW's global communications director about embedded access for a documentary following an investigation team in the field",
    lastTouch:"", website:"hrw.org", priority:true
  },
  {
    id:179, name:"Kaiser Family Foundation (KFF)", sector:"Health & Medicine",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$60M+ in annual revenue. Produces trusted, nonpartisan health policy research and journalism. Operates KFF Health News, a major health journalism outlet consumed by policymakers, media, and the public.",
    contacts:"Chief Communications Officer; Editor, KFF Health News; VP of Communications",
    notes:"KFF Health News produces investigative health journalism that regularly uncovers systemic failures in healthcare delivery — from hospital billing to nursing home conditions — that translate directly into documentary narratives. Their Medicaid and insurance coverage research tells the story of the uninsured in America. A documentary co-produced with KFF Health News would have built-in distribution.",
    nextAction:"Propose a documentary co-production with KFF Health News to their editor, leveraging their investigative journalism as the research spine of a feature documentary",
    lastTouch:"", website:"kff.org", priority:true
  },
  {
    id:180, name:"AARP", sector:"Social Services",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$1.6B in annual revenue. The largest membership organization in the US with 38 million members. Advocacy organization for adults 50+ on healthcare, financial security, and social engagement. Has AARP Foundation focused on senior hunger, poverty, housing, and workforce re-entry.",
    contacts:"Chief Communications Officer; VP of Brand Strategy; Director, AARP Foundation",
    notes:"AARP's work on senior poverty and economic insecurity is an underrepresented documentary subject. Their 'Back to Work 50+' program, helping older adults re-enter the workforce, features inspiring career reinvention stories. Their litigation work protecting senior rights in housing and employment is dramatic legal storytelling.",
    nextAction:"Pitch a documentary on workforce re-entry for adults over 50 to AARP's communications team, tying to their Back to Work 50+ program",
    lastTouch:"", website:"aarp.org", priority:true
  },
  {
    id:181, name:"Teach For America", sector:"Education",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$300M+ in annual revenue. Recruits and trains teachers for under-resourced communities. Has placed 65,000+ corps members in high-need schools across the US since 1990. Has a major alumni network active in education policy, politics, and community leadership.",
    contacts:"Chief Communications Officer; VP of Strategic Communications; Director of Media",
    notes:"TFA's model — placing high-achieving recent graduates in the most challenging schools in America — is a controversial and compelling documentary subject, with passionate advocates and critics. Their corps members experience dramatic first-year teaching stories that are inherently cinematic. Their 30-year alumni impact in education and politics tells a long-form story about systemic change.",
    nextAction:"Pitch a documentary on a first-year TFA corps cohort to their Chief Communications Officer, proposing embedded access to classrooms and training",
    lastTouch:"", website:"teachforamerica.org", priority:false
  },
  {
    id:182, name:"UNCF (United Negro College Fund)", sector:"Education",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$150M+ in annual revenue. Provides scholarships and programmatic support for Historically Black Colleges and Universities (HBCUs). Supports 37 private HBCUs and thousands of students annually.",
    contacts:"Chief Communications Officer; Senior VP of Marketing & Communications; Director of Media",
    notes:"UNCF's HBCU support work — particularly the financing and preservation of schools that have educated Black Americans since Reconstruction — is a rich historical and contemporary documentary subject. Individual scholarship recipient stories feature extraordinary journeys of first-generation college students. The broader HBCU narrative is a cinematic subject with deep historical resonance.",
    nextAction:"Contact UNCF's Chief Communications Officer about a documentary on HBCU students and institutional sustainability, tied to UNCF's funding and advocacy",
    lastTouch:"", website:"uncf.org", priority:true
  },
  {
    id:183, name:"Habitat for Humanity International", sector:"Housing",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$500M+ in annual revenue. Builds and rehabilitates homes for low-income families in 70+ countries. Partners with faith communities, corporations, and volunteers to address the global housing crisis.",
    contacts:"Chief Communications Officer; VP of Marketing; Director of Media Relations",
    notes:"Habitat's model — requiring future homeowners to invest 'sweat equity' in their own home construction — produces compelling individual character stories of aspiration, hard work, and transformation. Their global work, particularly in post-disaster reconstruction, involves extraordinary visual settings and urgent timelines. The US affordable housing crisis gives their domestic work renewed urgency.",
    nextAction:"Contact Habitat's communications team about a documentary following families through their homebuilding journey in different national contexts",
    lastTouch:"", website:"habitat.org", priority:true
  },
  {
    id:184, name:"National Alliance to End Homelessness", sector:"Housing",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$10M+ in annual revenue. Advances evidence-based policy solutions and supports communities implementing Housing First approaches. Major voice in federal homelessness policy.",
    contacts:"Director of Communications; CEO; VP of Policy",
    notes:"The national homelessness crisis — visible in nearly every major US city — is an urgent documentary subject. Their 'Housing First' approach, which has strong evidence behind it, is being debated and implemented across cities, creating policy-level documentary drama. Individual stories of people experiencing homelessness are deeply human.",
    nextAction:"Contact the National Alliance to End Homelessness about a documentary on Housing First implementation in a major US city",
    lastTouch:"", website:"endhomelessness.org", priority:true
  },
  {
    id:185, name:"National Immigration Law Center (NILC)", sector:"Immigration",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$30M+ in annual revenue. Focused on protecting the rights of low-income immigrants through litigation, policy advocacy, and coalition building. Known for landmark immigration cases and DACA defense.",
    contacts:"Director of Communications; Deputy Director; Director of Policy",
    notes:"NILC's litigation and advocacy work on immigration — DACA, deportation defense, public charge rules — is at the center of the most politically charged domestic policy debate in America. Their legal teams and clients provide both high-stakes courtroom narrative and deeply personal immigrant stories.",
    nextAction:"Pitch a documentary on DACA defense litigation to NILC's communications director, centering the stories of DACA recipients and the attorneys representing them",
    lastTouch:"", website:"nilc.org", priority:true
  },
  {
    id:186, name:"Legal Services Corporation", sector:"Advocacy & Policy",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"Federal corporation with ~$700M+ in annual congressional appropriation funding civil legal aid for low-income Americans through 132 independent grantee organizations. Provides legal assistance in housing, family, consumer, and benefits cases to millions.",
    contacts:"Vice President of Communications; Director of Media Relations; President",
    notes:"LSC funds the civil legal aid safety net for low-income Americans — a critically underfunded system that determines outcomes in eviction, domestic violence, custody, and benefits cases. A documentary following LSC-funded attorneys and their clients would expose the civil justice gap to broad audiences. Their survival amid political attempts to defund them is an institutional drama.",
    nextAction:"Contact LSC's communications team about a documentary on civil legal aid and the access-to-justice gap, proposing embedded access with an LSC-funded legal aid organization",
    lastTouch:"", website:"lsc.gov", priority:true
  },
  {
    id:187, name:"Mental Health America", sector:"Mental Health",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$15M+ in annual revenue. Advocates for the mental health system, provides screening tools used by millions annually, and supports people living with mental health conditions. A century-old organization modernizing its communications approach.",
    contacts:"Director of Communications; CEO; VP of Advocacy",
    notes:"Mental Health America's century of work — from institutionalization to deinstitutionalization to the current mental health crisis — is a historical arc that contextualizes today's epidemic. Their online mental health screening tools, used by millions, capture the hidden scale of undiagnosed mental illness. Their advocacy for insurance parity is a policy battle with human stakes.",
    nextAction:"Contact Mental Health America's communications team about a documentary on the mental health crisis in America tied to their screening data and advocacy work",
    lastTouch:"", website:"mhanational.org", priority:true
  },
  {
    id:188, name:"National Council for Mental Wellbeing", sector:"Mental Health",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$50M+ in annual revenue representing 3,400+ mental health and substance use treatment organizations. Advocates for funding, policy, and workforce development in behavioral health. Hosts the largest mental health conference in the US.",
    contacts:"Director of Communications; CEO; VP of Policy",
    notes:"The National Council represents the organizations delivering mental health care at the community level — the clinics, treatment centers, and crisis lines that constitute the behavioral health safety net. Their work on mental health workforce shortages is a systemic crisis documentary subject. Their Zero Suicide initiative is a compelling institutional change story.",
    nextAction:"Pitch a documentary on community mental health centers to the National Council's communications director, proposing access to member organization staff and clients",
    lastTouch:"", website:"thenationalcouncil.org", priority:true
  },
  {
    id:189, name:"PolicyLink", sector:"Racial Equity",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$30M+ in annual revenue. Advances racial and economic equity in America through research, policy advocacy, and narrative change work on housing, health, economy, and infrastructure. Has an explicit 'narrative change' function on staff.",
    contacts:"Director of Communications; CEO; Director of Narrative Change",
    notes:"PolicyLink's explicit 'narrative change' function — working to shift public narratives about race and equity — makes them a natural documentary partner. Their research on racial wealth gaps, infrastructure inequity, and health disparities provides the data spine for a compelling documentary investigation. Their grassroots connections in communities of color give access to human stories.",
    nextAction:"Contact PolicyLink's Director of Narrative Change about a documentary partnership tying their research on racial infrastructure equity to community stories in affected neighborhoods",
    lastTouch:"", website:"policylink.org", priority:true
  },
  {
    id:190, name:"Partnership for Public Service", sector:"Advocacy & Policy",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$30M+ in annual revenue. Focused on making the federal government more effective. Advocates for civil service, trains government leaders, and produces the 'Best Places to Work in the Federal Government' rankings. Runs the 'Sammies' — Samuel J. Heyman Service to America Medals.",
    contacts:"Director of Communications; CEO; Director of Marketing",
    notes:"The Partnership's mission — at the center of debates about government effectiveness, civil service protection, and public trust — is urgently relevant in the current political environment. Their Sammies honor federal employees doing extraordinary but unknown work — the perfect documentary character. Their work training federal leaders is a story about democratic governance rarely told from the inside.",
    nextAction:"Contact Partnership for Public Service's communications director about a documentary on Sammies honorees — federal public servants doing extraordinary hidden work",
    lastTouch:"", website:"ourpublicservice.org", priority:true
  },
  {
    id:191, name:"Institute for Healthcare Improvement (IHI)", sector:"Health & Medicine",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$50M+ in annual revenue. Works to improve health and healthcare systems worldwide. Known for the 'Triple Aim' framework and large-scale improvement initiatives including reducing preventable patient deaths and closing racial gaps in healthcare quality.",
    contacts:"Chief Communications Officer; Director of Media; VP of Strategy",
    notes:"IHI's '100,000 Lives Campaign' — which aimed to prevent 100,000 unnecessary deaths in US hospitals — is a landmark public health story that deserves documentary treatment. Their work on health equity, particularly closing racial gaps in healthcare quality and outcomes, is urgent documentary territory. Their global work in low-resource settings features dramatic quality improvement stories.",
    nextAction:"Contact IHI's Chief Communications Officer about a documentary on health equity improvement in hospital systems, proposing access to quality improvement teams",
    lastTouch:"", website:"ihi.org", priority:true
  },
  {
    id:192, name:"Food & Water Watch", sector:"Food & Agriculture",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$15M+ in annual revenue. Campaigns against factory farming, water privatization, and fracking. Known for grassroots organizing and investigative research on corporate control of food, water, and energy systems.",
    contacts:"Executive Director; Director of Communications; Media Director",
    notes:"Food & Water Watch's investigative work on industrial agriculture — factory farming conditions, water contamination, corporate consolidation — is proven documentary territory with dramatic visual potential. Their water privatization campaigns, fighting corporate control of public water systems, have documented human crises like Flint. Their anti-fracking organizing features community members fighting for environmental protection.",
    nextAction:"Contact Food & Water Watch's communications director about a documentary on corporate consolidation in food and agriculture",
    lastTouch:"", website:"foodandwaterwatch.org", priority:true
  },
  {
    id:193, name:"American Bar Association", sector:"Advocacy & Policy",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$180M+ in annual revenue. The professional association for lawyers. Advocates for justice, access to legal services, and the rule of law. Has programs in law school accreditation, pro bono legal work, and civil rights.",
    contacts:"Director of Communications; Chief Policy Officer; Director, ABA Foundation",
    notes:"The ABA's access to justice work — documenting the civil legal aid crisis where 80% of the civil legal needs of low-income Americans go unmet — is a powerful systemic documentary subject. Their rule of law programs internationally (training lawyers in developing democracies) provide international documentary settings. Their pro bono legal work features lawyers taking on landmark civil rights cases.",
    nextAction:"Contact the ABA's communications team about a documentary on the civil legal aid crisis and the access-to-justice gap",
    lastTouch:"", website:"americanbar.org", priority:false
  },
  {
    id:194, name:"United Way Worldwide", sector:"Social Services",
    stage:"Identified", budget:"High ($150k+)", storyReady:"No Story Yet",
    mission:"~$3.6B in annual revenue across US and international affiliates. Focuses on education, financial stability, and health. The backbone infrastructure for community impact philanthropy in hundreds of US cities.",
    contacts:"Chief Communications Officer; Director of Brand & Marketing; VP of Partnerships",
    notes:"United Way's transformation from a workplace giving clearinghouse to a community impact organization is an underexplored institutional change narrative. Their local affiliate system — each operating independently in its community — produces a mosaic of American philanthropy from Detroit to rural Iowa. Their COVID-19 response coordination across communities was a massive untold story.",
    nextAction:"Contact United Way's communications team about a documentary on local affiliate innovation and community impact strategy",
    lastTouch:"", website:"unitedway.org", priority:false
  },
  {
    id:195, name:"Boys & Girls Clubs of America", sector:"Social Services",
    stage:"Identified", budget:"High ($150k+)", storyReady:"Story Forming",
    mission:"~$600M+ in annual revenue. Operates 4,700+ clubs nationally. Serves 4 million+ young people with afterschool programs, mentoring, and college prep. Has a major brand presence and communications infrastructure.",
    contacts:"Chief Communications Officer; VP of Brand Marketing; National Director of Partnerships",
    notes:"The Boys & Girls Club's work in under-resourced communities — serving children who have few other safe spaces after school — features extraordinary individual transformation stories. Their staff mentors are often community members who give character depth. The clubs' role as community anchors in neighborhoods facing poverty and violence is a powerful documentary subject.",
    nextAction:"Propose a documentary following staff and students at a flagship Boys & Girls Club location to their communications team, with embedded access over a full academic year",
    lastTouch:"", website:"bgca.org", priority:false
  },
  {
    id:196, name:"U.S. Conference of Mayors", sector:"Advocacy & Policy",
    stage:"Identified", budget:"High ($150k+)", storyReady:"No Story Yet",
    mission:"Organization of US mayors of cities with populations over 30,000. Advocates for city interests in federal policy on infrastructure, public safety, housing, and economic development. Convenes mayors across the country on shared urban challenges.",
    contacts:"Executive Director; Director of Communications; Policy Director",
    notes:"Following a cohort of mayors through their terms offers a political leadership documentary with national stakes — pandemic, unrest, inflation, migration. Their infrastructure and housing policy advocacy tells the story of cities fighting for federal resources. A documentary on three mayors navigating shared challenges with different approaches would be compelling.",
    nextAction:"Contact the US Conference of Mayors' communications director about a documentary on mayoral leadership during the current urban housing and infrastructure crisis",
    lastTouch:"", website:"usmayors.org", priority:false
  },
  {
    id:197, name:"Brookings Institution", sector:"Advocacy & Policy",
    stage:"Identified", budget:"High ($150k+)", storyReady:"No Story Yet",
    mission:"~$130M+ in annual revenue. Produces policy research across economics, governance, foreign policy, and social policy. One of the most cited think tanks in the world, with a major media and communications operation.",
    contacts:"Vice President of Communications; Director of Media Relations; Editor, Brookings Press",
    notes:"Brookings' researchers are embedded in the most consequential policy debates of our era — from AI governance to climate policy to democratic resilience — providing expert access for documentary investigation. Their Metropolitan Policy Program researches American cities with documentary-worthy stories. Their foreign policy work includes researchers who have operated in conflict zones.",
    nextAction:"Contact Brookings' VP of Communications about a documentary concept exploring how policy research translates into real-world change",
    lastTouch:"", website:"brookings.edu", priority:false
  },
  {
    id:198, name:"RAND Corporation", sector:"Advocacy & Policy",
    stage:"Identified", budget:"High ($150k+)", storyReady:"No Story Yet",
    mission:"~$350M+ in annual revenue. Conducts research for government, military, and public sector clients across defense, health, education, justice, and social policy. Has extraordinary access to high-level government policy processes.",
    contacts:"Director of Communications; VP of External Affairs; Media Relations Director",
    notes:"RAND's access to Department of Defense, intelligence agencies, and senior government policymakers provides a rare behind-the-scenes documentary access opportunity. Their health policy research — on opioids, mental health, gun violence — is policy documentary territory. Their social science work has shaped American public policy for 75 years.",
    nextAction:"Contact RAND's communications director about a documentary on how RAND research shapes policy, gaining access to an ongoing study and its policy impact",
    lastTouch:"", website:"rand.org", priority:false
  },
  {
    id:199, name:"SHRM (Society for Human Resource Management)", sector:"Labor & Workforce",
    stage:"Identified", budget:"High ($150k+)", storyReady:"No Story Yet",
    mission:"~$400M+ in annual revenue; 330,000+ members globally. Sets HR standards and best practices. Works at the center of the most contested workplace issues of our era — remote work, DEI, AI and automation, mental health benefits, and pay equity.",
    contacts:"Chief Communications Officer; VP of Media Relations; Director of Research",
    notes:"A documentary following HR professionals navigating these tensions — DEI, automation, employee mental health simultaneously — would find a large and engaged audience. Their workforce equity research documents systemic issues in hiring, pay, and advancement. The 'modern workplace' is an underexplored documentary subject with broad audience appeal.",
    nextAction:"Propose a documentary on the modern HR professional's role in American workplaces to SHRM's Chief Communications Officer",
    lastTouch:"", website:"shrm.org", priority:false
  },
  {
    id:200, name:"Wellspring Philanthropic Fund", sector:"Philanthropy",
    stage:"Identified", budget:"High ($150k+)", storyReady:"No Story Yet",
    mission:"~$100M+ in annual giving. Focuses on human rights, reproductive rights, LGBTQ+ rights, and democracy. One of the larger anonymous foundations in the US that primarily funds advocacy and litigation organizations.",
    contacts:"Program Officer, Human Rights; Executive Director; Director of Communications",
    notes:"Wellspring's focus on human rights, reproductive rights, and LGBTQ+ rights — all urgently relevant post-Dobbs — makes the organizations they fund natural documentary subjects. As a relatively anonymous foundation, a documentary partnership could be structured through grantee organizations. Their international human rights work crosses borders and cultures.",
    nextAction:"Identify Wellspring's publicly disclosed grantees in reproductive rights or LGBTQ+ advocacy and propose a documentary through those grantee relationships",
    lastTouch:"", website:"wellspringphilanthropicfund.org", priority:false
  },
];

const formatDate = (d) => { if (!d) return "—"; return new Date(d+"T00:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}); };
const daysSince = (d) => { if (!d) return null; return Math.floor((Date.now()-new Date(d+"T00:00:00").getTime())/86400000); };

const STORY_COLORS = { "No Story Yet":"#f0f1f6","Story Forming":"#fef3c7","Clear Pitch":"#d1fae5","Pitch Sent":"#fed7aa" };
const STORY_TEXT = { "No Story Yet":"#6b6b80","Story Forming":"#92400e","Clear Pitch":"#065f46","Pitch Sent":"#c2410c" };

export default function ProspectTracker() {
  const [prospects, setProspects] = useState(() => {
    try { const s=localStorage.getItem("tol_v3"); return s?JSON.parse(s):ALL_PROSPECTS; } catch { return ALL_PROSPECTS; }
  });
  const [view, setView] = useState("list");
  const [selectedId, setSelectedId] = useState(null);
  const [filterStage, setFilterStage] = useState("All");
  const [filterSector, setFilterSector] = useState("All");
  const [filterStory, setFilterStory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [sortBy, setSortBy] = useState("name");
  const [form, setForm] = useState({name:"",sector:SECTORS[0],stage:"Identified",budget:"Unknown",storyReady:"No Story Yet",mission:"",contacts:"",notes:"",lastTouch:"",nextAction:"",website:"",priority:false});
  const [syncStatus, setSyncStatus] = useState("idle"); // idle | syncing | success | error
  const [lastSynced, setLastSynced] = useState(() => { try { return localStorage.getItem("tol_last_synced")||null; } catch { return null; }});

  const AIRTABLE_BASE = "appW7briSaV0w3qnH";
  const AIRTABLE_TABLE = "Table 1";
  const AIRTABLE_TOKEN = "patJA17IX5TdSq9hL.7d63a1431762497895edc673ace4eaa4b662a89959f0de0e81f1b0c9f190a800";
  const AIRTABLE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${encodeURIComponent(AIRTABLE_TABLE)}`;
  const AIRTABLE_HEADERS = {
    "Authorization": `Bearer ${AIRTABLE_TOKEN}`,
    "Content-Type": "application/json",
  };

  const syncToSheets = async () => {
    setSyncStatus("syncing");
    try {
      // 1. Fetch all existing records so we can match by prospect ID
      let existingRecords = [];
      let offset = null;
      do {
        const url = offset ? `${AIRTABLE_URL}?offset=${offset}` : AIRTABLE_URL;
        const res = await fetch(url, { headers: AIRTABLE_HEADERS });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error?.message || "Failed to fetch records");
        existingRecords = existingRecords.concat(json.records || []);
        offset = json.offset || null;
      } while (offset);

      // Build a map of prospect id -> airtable record id
      const recordMap = {};
      existingRecords.forEach(r => {
        if (r.fields["ID"]) recordMap[r.fields["ID"]] = r.id;
      });

      // 2. Split prospects into creates and updates
      const toCreate = [];
      const toUpdate = [];
      prospects.forEach(p => {
        const fields = {
          "ID": String(p.id),
          "Name": p.name,
          "Sector": p.sector,
          "Stage": p.stage,
          "Budget": p.budget,
          "Story Readiness": p.storyReady,
          "Priority": p.priority ? "Yes" : "No",
          "Mission": p.mission,
          "Contacts": p.contacts,
          "Notes": p.notes,
          "Next Action": p.nextAction,
          "Last Touch": p.lastTouch,
          "Website": p.website,
        };
        if (recordMap[String(p.id)]) {
          toUpdate.push({ id: recordMap[String(p.id)], fields });
        } else {
          toCreate.push({ fields });
        }
      });

      // 3. Create new records in batches of 10 (Airtable limit)
      for (let i = 0; i < toCreate.length; i += 10) {
        const batch = toCreate.slice(i, i + 10);
        const res = await fetch(AIRTABLE_URL, {
          method: "POST",
          headers: AIRTABLE_HEADERS,
          body: JSON.stringify({ records: batch }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error?.message || "Create failed");
      }

      // 4. Update existing records in batches of 10
      for (let i = 0; i < toUpdate.length; i += 10) {
        const batch = toUpdate.slice(i, i + 10);
        const res = await fetch(AIRTABLE_URL, {
          method: "PATCH",
          headers: AIRTABLE_HEADERS,
          body: JSON.stringify({ records: batch }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error?.message || "Update failed");
      }

      const now = new Date().toLocaleString("en-US",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"});
      setLastSynced(now);
      try { localStorage.setItem("tol_last_synced", now); } catch {}
      setSyncStatus("success");
      setTimeout(() => setSyncStatus("idle"), 3000);
    } catch (err) {
      console.error("Sync failed:", err);
      setSyncStatus("error");
      setTimeout(() => setSyncStatus("idle"), 4000);
    }
  };

  useEffect(() => { try{localStorage.setItem("tol_v3",JSON.stringify(prospects));}catch{} }, [prospects]);

  const filtered = useMemo(() => {
    let list = prospects.filter(p => {
      if (filterStage!=="All" && p.stage!==filterStage) return false;
      if (filterSector!=="All" && p.sector!==filterSector) return false;
      if (filterStory!=="All" && p.storyReady!==filterStory) return false;
      if (searchQuery) { const q=searchQuery.toLowerCase(); return p.name.toLowerCase().includes(q)||p.sector.toLowerCase().includes(q)||p.mission.toLowerCase().includes(q)||p.notes.toLowerCase().includes(q); }
      return true;
    });
    return list.sort((a,b) => {
      if (sortBy==="name") return a.name.localeCompare(b.name);
      if (sortBy==="stage") return STAGES.indexOf(a.stage)-STAGES.indexOf(b.stage);
      if (sortBy==="story") return STORY_READINESS.indexOf(b.storyReady)-STORY_READINESS.indexOf(a.storyReady);
      if (sortBy==="priority") return (b.priority?1:0)-(a.priority?1:0);
      return 0;
    });
  }, [prospects, filterStage, filterSector, filterStory, searchQuery, sortBy]);

  const selected = prospects.find(p=>p.id===selectedId);
  const openNew = () => { setEditingId(null); setForm({name:"",sector:SECTORS[0],stage:"Identified",budget:"Unknown",storyReady:"No Story Yet",mission:"",contacts:"",notes:"",lastTouch:"",nextAction:"",website:"",priority:false}); setShowForm(true); };
  const openEdit = (p) => { setEditingId(p.id); setForm({...p}); setShowForm(true); };
  const saveForm = () => {
    if (!form.name.trim()) return;
    if (editingId) setProspects(prev=>prev.map(p=>p.id===editingId?{...form,id:editingId}:p));
    else setProspects(prev=>[...prev,{...form,id:Date.now()}]);
    setShowForm(false);
  };
  const deleteProspect = (id) => { setProspects(prev=>prev.filter(p=>p.id!==id)); if(selectedId===id) setSelectedId(null); };
  const advanceStage = (id) => { setProspects(prev=>prev.map(p=>{ if(p.id!==id) return p; const i=STAGES.indexOf(p.stage); return i<STAGES.length-1?{...p,stage:STAGES[i+1]}:p; })); };
  const logTouch = (id) => { const today=new Date().toISOString().split("T")[0]; setProspects(prev=>prev.map(p=>p.id===id?{...p,lastTouch:today}:p)); };

  const stats = {
    total: prospects.length,
    priority: prospects.filter(p=>p.priority).length,
    clearPitch: prospects.filter(p=>p.storyReady==="Clear Pitch"||p.storyReady==="Pitch Sent").length,
    active: prospects.filter(p=>["In Conversation","Proposal Sent"].includes(p.stage)).length,
    stale: prospects.filter(p=>p.lastTouch&&daysSince(p.lastTouch)>60).length,
  };

  const sectorCounts = useMemo(() => {
    const c={};
    SECTORS.forEach(s=>{ c[s]=prospects.filter(p=>p.sector===s).length; });
    return c;
  },[prospects]);

  return (
    <div style={{fontFamily:"'Inter','Helvetica Neue',Arial,sans-serif",background:"#ffffff",minHeight:"100vh",color:"#1a1a2e"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
        *{box-sizing:border-box;}
        ::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:#f0f1f4;}::-webkit-scrollbar-thumb{background:#c8cad4;border-radius:2px;}
        .btn{cursor:pointer;border:none;transition:all 0.18s;}
        .row-hover{transition:background 0.15s,border-color 0.15s;cursor:pointer;}
        .row-hover:hover{background:#f0f1f6!important;}
        .action-btn{background:none;border:1px solid #d0d3dd;color:#666;padding:4px 10px;border-radius:2px;font-family:'JetBrains Mono',monospace;font-size:10px;cursor:pointer;transition:all 0.15s;letter-spacing:0.04em;}
        .action-btn:hover{border-color:#2563eb;color:#2563eb;}
        .input-s{background:#ffffff;border:1px solid #d0d3dd;color:#1a1a2e;padding:7px 11px;border-radius:2px;font-family:'Inter',sans-serif;font-size:13px;width:100%;outline:none;transition:border-color 0.2s;}
        .input-s:focus{border-color:#2563eb;}
        textarea.input-s{resize:vertical;min-height:65px;}
        .tab{background:none;border:none;cursor:pointer;color:#888899;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.12em;padding:5px 12px;text-transform:uppercase;transition:color 0.15s;}
        .tab.on{color:#2563eb;border-bottom:1px solid #2563eb;}
        .tab:hover{color:#4a4a5a;}
        .select-s{appearance:none;background:#ffffff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5'%3E%3Cpath d='M0 0l4 5 4-5z' fill='%23999'/%3E%3C/svg%3E") no-repeat right 9px center;cursor:pointer;}
        .modal-bg{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px;}
        .stat-n{font-family:'Inter',sans-serif;font-size:30px;font-weight:600;color:#2563eb;line-height:1;}
        .stat-l{font-family:'JetBrains Mono',monospace;font-size:9px;color:#888899;text-transform:uppercase;letter-spacing:0.12em;margin-top:3px;}
        .pill{font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:0.07em;padding:2px 7px;border-radius:1px;}
        .slide-in{animation:sli 0.2s ease;}
        @keyframes sli{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}
        .sort-btn{background:none;border:none;cursor:pointer;color:#888899;font-family:'JetBrains Mono',monospace;font-size:9px;text-transform:uppercase;letter-spacing:0.1em;padding:2px 6px;transition:color 0.15s;}
        .sort-btn:hover,.sort-btn.on{color:#2563eb;}
        .priority-dot{width:5px;height:5px;border-radius:50%;background:#2563eb;display:inline-block;}
      `}</style>

      {/* Header */}
      <div style={{borderBottom:"1px solid #e2e4e9",padding:"0 28px"}}>
        <div style={{maxWidth:1500,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:58}}>
          <div style={{display:"flex",alignItems:"baseline",gap:14}}>
            <span style={{fontFamily:"'Inter',sans-serif",fontSize:17,fontWeight:600,letterSpacing:"0.04em"}}>Think Out Loud Productions</span>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#aaaabd",letterSpacing:"0.16em",textTransform:"uppercase"}}>/ Prospect Cultivation System v7</span>
          </div>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <button className="tab on" style={{color:view==="list"?"#2563eb":"#888899",borderBottom:view==="list"?"1px solid #2563eb":"none"}} onClick={()=>setView("list")}>List</button>
            <button className="tab" style={{color:view==="board"?"#2563eb":"#888899",borderBottom:view==="board"?"1px solid #2563eb":"none"}} onClick={()=>setView("board")}>Board</button>
            <button className="tab" style={{color:view==="sectors"?"#2563eb":"#888899",borderBottom:view==="sectors"?"1px solid #2563eb":"none"}} onClick={()=>setView("sectors")}>Sectors</button>
            <div style={{width:1,height:18,background:"#d8dae4",margin:"0 6px"}}/>
            <button className="btn" onClick={openNew} style={{background:"#2563eb",color:"#ffffff",padding:"6px 14px",borderRadius:2,fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",fontWeight:500}}>+ Add</button>
            <button className="btn" onClick={syncToSheets} disabled={syncStatus==="syncing"}
              style={{
                background: syncStatus==="success"?"#059669": syncStatus==="error"?"#dc2626": syncStatus==="syncing"?"#93c5fd":"#f0f1f6",
                color: syncStatus==="idle"?"#444":"#ffffff",
                padding:"6px 14px",borderRadius:2,fontFamily:"'JetBrains Mono',monospace",fontSize:10,
                letterSpacing:"0.1em",textTransform:"uppercase",fontWeight:500,
                border:"1px solid",
                borderColor: syncStatus==="success"?"#059669": syncStatus==="error"?"#dc2626": syncStatus==="syncing"?"#93c5fd":"#d0d3dd",
                transition:"all 0.2s",cursor:syncStatus==="syncing"?"wait":"pointer",
                opacity:syncStatus==="syncing"?0.8:1,
              }}>
              {syncStatus==="syncing"?"Syncing…": syncStatus==="success"?"✓ Synced": syncStatus==="error"?"✗ Failed":"↑ Sync to Sheets"}
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{borderBottom:"1px solid #e8eaed",padding:"14px 28px"}}>
        <div style={{maxWidth:1500,margin:"0 auto",display:"flex",gap:40,alignItems:"center"}}>
          {[["total","Total"],[`priority`,"Priority"],["clearPitch","Pitch Ready"],["active","Active"],["stale","Stale 60d+"]].map(([k,l])=>(
            <div key={k}>
              <div className="stat-n" style={{color:k==="stale"&&stats[k]>0?"#dc2626":"#2563eb"}}>{stats[k]}</div>
              <div className="stat-l">{l}</div>
            </div>
          ))}
          {lastSynced&&(
            <div style={{marginLeft:8}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#059669",letterSpacing:"0.08em"}}>✓ Sheets synced</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#aaaabd",marginTop:2}}>{lastSynced}</div>
            </div>
          )}
          <div style={{marginLeft:"auto",display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
            <input className="input-s" placeholder="Search..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} style={{width:180,padding:"5px 10px",fontSize:11}}/>
            <select className="input-s select-s" value={filterSector} onChange={e=>setFilterSector(e.target.value)} style={{width:180,padding:"5px 10px",fontSize:11}}>
              <option value="All">All Sectors</option>
              {SECTORS.map(s=><option key={s}>{s}</option>)}
            </select>
            <select className="input-s select-s" value={filterStage} onChange={e=>setFilterStage(e.target.value)} style={{width:150,padding:"5px 10px",fontSize:11}}>
              <option value="All">All Stages</option>
              {STAGES.map(s=><option key={s}>{s}</option>)}
            </select>
            <select className="input-s select-s" value={filterStory} onChange={e=>setFilterStory(e.target.value)} style={{width:150,padding:"5px 10px",fontSize:11}}>
              <option value="All">All Story Readiness</option>
              {STORY_READINESS.map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{maxWidth:1500,margin:"0 auto",padding:"20px 28px"}}>

        {/* LIST VIEW */}
        {view==="list" && (
          <div style={{display:"flex",gap:20}}>
            {/* Table */}
            <div style={{flex:selectedId?"0 0 560px":"1",overflowY:"auto",maxHeight:"calc(100vh - 180px)"}}>
              {/* Sort bar */}
              <div style={{display:"flex",alignItems:"center",gap:2,paddingBottom:8,borderBottom:"1px solid #e8eaed",marginBottom:4}}>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#aaaabd",letterSpacing:"0.1em",textTransform:"uppercase",marginRight:8}}>Sort:</span>
                {[["name","Name"],["stage","Stage"],["story","Story"],["priority","Priority"]].map(([k,l])=>(
                  <button key={k} className={`sort-btn ${sortBy===k?"on":""}`} onClick={()=>setSortBy(k)}>{l}</button>
                ))}
                <span style={{marginLeft:"auto",fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#aaaabd"}}>{filtered.length} orgs</span>
              </div>

              {filtered.map(p=>{
                const ds=daysSince(p.lastTouch);
                const isOn=p.id===selectedId;
                return (
                  <div key={p.id} className="row-hover" onClick={()=>setSelectedId(isOn?null:p.id)}
                    style={{display:"grid",gridTemplateColumns:"16px 1fr 130px 100px 60px 70px",alignItems:"center",gap:10,padding:"10px 12px",background:isOn?"#eff6ff":"transparent",borderBottom:"1px solid #e8eaed",borderLeft:isOn?"3px solid #2563eb":"3px solid transparent"}}>
                    <div>{p.priority&&<span className="priority-dot"/>}</div>
                    <div>
                      <div style={{fontFamily:"'Inter',sans-serif",fontSize:14,fontWeight:600,color:isOn?"#2563eb":"#1a1a2e",lineHeight:1.2}}>{p.name}</div>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#888899",letterSpacing:"0.07em",marginTop:2}}>{p.sector}</div>
                    </div>
                    <div>
                      <span className="pill" style={{background:STAGE_COLORS[p.stage]+"40",color:STAGE_ACCENT[p.stage],border:`1px solid ${STAGE_COLORS[p.stage]}`}}>{p.stage}</span>
                    </div>
                    <div>
                      <span className="pill" style={{background:STORY_COLORS[p.storyReady]+"60",color:STORY_TEXT[p.storyReady],border:`1px solid ${STORY_COLORS[p.storyReady]}`}}>{p.storyReady}</span>
                    </div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:ds>60?"#c05030":"#444",display:"flex",alignItems:"center",gap:4}}>
                      {ds!==null?<><span style={{width:4,height:4,borderRadius:"50%",background:ds>60?"#c05030":"#3a8a5a",display:"inline-block"}}/>{ds}d</>:<span style={{color:"#2a2a35"}}>—</span>}
                    </div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#aaaabd"}}>{p.budget.split(" ")[0]}</div>
                  </div>
                );
              })}
              {filtered.length===0&&<div style={{color:"#aaaabd",fontFamily:"'JetBrains Mono',monospace",fontSize:11,padding:"40px 0",textAlign:"center"}}>No matches.</div>}
            </div>

            {/* Detail */}
            {selected&&(
              <div className="slide-in" style={{flex:1,background:"#f8f9fa",border:"1px solid #e2e4e9",borderRadius:2,padding:24,overflowY:"auto",maxHeight:"calc(100vh - 180px)"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
                  <div>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                      <h2 style={{fontFamily:"'Inter',sans-serif",fontSize:20,fontWeight:600,margin:0,color:"#1a1a2e"}}>{selected.name}</h2>
                      {selected.priority&&<span style={{color:"#2563eb",fontSize:14}}>★</span>}
                    </div>
                    <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                      <span className="pill" style={{background:STAGE_COLORS[selected.stage]+"40",color:STAGE_ACCENT[selected.stage],border:`1px solid ${STAGE_COLORS[selected.stage]}`}}>{selected.stage}</span>
                      <span className="pill" style={{background:STORY_COLORS[selected.storyReady]+"60",color:STORY_TEXT[selected.storyReady],border:`1px solid ${STORY_COLORS[selected.storyReady]}`}}>{selected.storyReady}</span>
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#888899"}}>{selected.sector}</span>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"flex-end"}}>
                    <button className="action-btn" onClick={()=>openEdit(selected)}>Edit</button>
                    <button className="action-btn" onClick={()=>advanceStage(selected.id)} style={{borderColor:"#d1fae5",color:"#059669"}}>Advance →</button>
                    <button className="action-btn" onClick={()=>logTouch(selected.id)} style={{borderColor:"#e0f2fe",color:"#0284c7"}}>Log Touch</button>
                    <button className="action-btn" onClick={()=>{setSelectedId(null);deleteProspect(selected.id);}} style={{borderColor:"#fee2e2",color:"#dc2626"}}>Delete</button>
                  </div>
                </div>

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
                  {[["Budget Signal",selected.budget],["Website",selected.website||"—"],["Last Touch",formatDate(selected.lastTouch)],["Contact Staleness",selected.lastTouch?`${daysSince(selected.lastTouch)} days ago`:"Never contacted"]].map(([label,val])=>(
                    <div key={label} style={{background:"#f4f5f7",border:"1px solid #e8eaed",borderRadius:2,padding:10}}>
                      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"#aaaabd",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:3}}>{label}</div>
                      <div style={{fontSize:12,color:"#3d3d4e"}}>{val}</div>
                    </div>
                  ))}
                </div>

                {[["Mission & Story Alignment",selected.mission],["Key Contacts",selected.contacts],["Research Notes",selected.notes],["Next Action",selected.nextAction]].map(([label,val])=>val&&(
                  <div key={label} style={{marginBottom:14}}>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"#aaaabd",letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:5}}>{label}</div>
                    <div style={{fontSize:12,color:"#3d3d4e",lineHeight:1.75,borderLeft:"3px solid #e2e4e9",paddingLeft:12}}>{val}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* BOARD VIEW */}
        {view==="board" && (
          <div style={{display:"flex",gap:14,overflowX:"auto",paddingBottom:16}}>
            {STAGES.map(stage=>(
              <div key={stage} style={{minWidth:210,flex:"0 0 210px"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                  <div style={{display:"flex",alignItems:"center",gap:7}}>
                    <span style={{width:7,height:7,borderRadius:"50%",background:STAGE_ACCENT[stage],display:"inline-block"}}/>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#6b6b80",letterSpacing:"0.1em",textTransform:"uppercase"}}>{stage}</span>
                  </div>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#aaaabd"}}>{prospects.filter(p=>p.stage===stage).length}</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {filtered.filter(p=>p.stage===stage).map(p=>{
                    const ds=daysSince(p.lastTouch);
                    return (
                      <div key={p.id} onClick={()=>{setSelectedId(p.id);setView("list");}}
                        style={{background:"#f8f9fa",border:`1px solid ${p.id===selectedId?"#2563eb":"#e2e4e9"}`,borderRadius:2,padding:12,cursor:"pointer",transition:"border-color 0.15s"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                          <span style={{fontFamily:"'Inter',sans-serif",fontSize:13,fontWeight:600,color:"#1a1a2e",lineHeight:1.3}}>{p.name}</span>
                          {p.priority&&<span style={{color:"#2563eb",fontSize:11}}>★</span>}
                        </div>
                        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"#888899",letterSpacing:"0.07em",marginBottom:6,textTransform:"uppercase"}}>{p.sector}</div>
                        <div style={{marginBottom:6}}>
                          <span className="pill" style={{background:STORY_COLORS[p.storyReady]+"50",color:STORY_TEXT[p.storyReady],border:`1px solid ${STORY_COLORS[p.storyReady]}`}}>{p.storyReady}</span>
                        </div>
                        {p.nextAction&&<div style={{fontSize:10,color:"#777",lineHeight:1.4,fontStyle:"italic"}}>{p.nextAction.slice(0,65)}{p.nextAction.length>65?"…":""}</div>}
                        {ds!==null&&<div style={{marginTop:6,fontSize:9,color:ds>60?"#c05030":"#444",fontFamily:"'JetBrains Mono',monospace",display:"flex",alignItems:"center",gap:4}}>
                          <span style={{width:4,height:4,borderRadius:"50%",background:ds>60?"#c05030":"#3a7a5a",display:"inline-block"}}/>{ds}d
                        </div>}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SECTORS VIEW */}
        {view==="sectors" && (
          <div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16}}>
              {SECTORS.filter(s=>sectorCounts[s]>0).map(s=>{
                const orgs=prospects.filter(p=>p.sector===s);
                const pitchReady=orgs.filter(p=>p.storyReady==="Clear Pitch"||p.storyReady==="Pitch Sent").length;
                const priority=orgs.filter(p=>p.priority).length;
                return (
                  <div key={s} style={{background:"#f8f9fa",border:"1px solid #e2e4e9",borderRadius:2,padding:18,cursor:"pointer"}}
                    onClick={()=>{setFilterSector(s);setView("list");}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                      <div style={{fontFamily:"'Inter',sans-serif",fontSize:16,fontWeight:600,color:"#1a1a2e"}}>{s}</div>
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:18,fontWeight:500,color:"#2563eb"}}>{orgs.length}</span>
                    </div>
                    <div style={{display:"flex",gap:8,marginBottom:10}}>
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#4ab585"}}>● {pitchReady} pitch-ready</span>
                      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#2563eb"}}>★ {priority} priority</span>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",gap:4}}>
                      {orgs.slice(0,3).map(p=>(
                        <div key={p.id} style={{display:"flex",alignItems:"center",gap:8}}>
                          <span style={{width:4,height:4,borderRadius:"50%",background:STORY_TEXT[p.storyReady],display:"inline-block",flexShrink:0}}/>
                          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#888899",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.name}</span>
                        </div>
                      ))}
                      {orgs.length>3&&<div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#aaaabd"}}>+{orgs.length-3} more</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm&&(
        <div className="modal-bg" onClick={e=>{if(e.target===e.currentTarget)setShowForm(false);}}>
          <div style={{background:"#ffffff",border:"1px solid #e2e4e9",borderRadius:3,padding:28,width:"100%",maxWidth:600,maxHeight:"90vh",overflowY:"auto"}}>
            <h3 style={{fontFamily:"'Inter',sans-serif",fontSize:17,fontWeight:600,margin:"0 0 20px",color:"#1a1a2e"}}>{editingId?"Edit Prospect":"New Prospect"}</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
              {[["Organization Name","name","text",true],["Website","website","text",false]].map(([label,key,type,req])=>(
                <div key={key}>
                  <label style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"#888899",letterSpacing:"0.12em",textTransform:"uppercase",display:"block",marginBottom:4}}>{label}{req?" *":""}</label>
                  <input className="input-s" type={type} value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))}/>
                </div>
              ))}
              {[["Sector","sector",SECTORS],["Stage","stage",STAGES],["Budget Signal","budget",BUDGET_SIGNALS],["Story Readiness","storyReady",STORY_READINESS]].map(([label,key,opts])=>(
                <div key={key}>
                  <label style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"#888899",letterSpacing:"0.12em",textTransform:"uppercase",display:"block",marginBottom:4}}>{label}</label>
                  <select className="input-s select-s" value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))}>
                    {opts.map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div>
                <label style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"#888899",letterSpacing:"0.12em",textTransform:"uppercase",display:"block",marginBottom:4}}>Last Touch</label>
                <input type="date" className="input-s" value={form.lastTouch} onChange={e=>setForm(f=>({...f,lastTouch:e.target.value}))}/>
              </div>
            </div>
            {[["Mission & Alignment","mission","Why would they commission a doc?"],["Key Contacts","contacts","Names, titles, emails"],["Research Notes","notes","Prior video work, budget signals, connections"],["Next Action","nextAction","Concrete next step"]].map(([label,key,placeholder])=>(
              <div key={key} style={{marginBottom:12}}>
                <label style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:"#888899",letterSpacing:"0.12em",textTransform:"uppercase",display:"block",marginBottom:4}}>{label}</label>
                <textarea className="input-s" value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} placeholder={placeholder}/>
              </div>
            ))}
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:20}}>
              <input type="checkbox" id="pri" checked={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.checked}))} style={{accentColor:"#2563eb",cursor:"pointer"}}/>
              <label htmlFor="pri" style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#6b6b80",cursor:"pointer"}}>Mark as Priority ★</label>
            </div>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <button className="action-btn" onClick={()=>setShowForm(false)}>Cancel</button>
              <button className="btn" onClick={saveForm} style={{background:"#2563eb",color:"#ffffff",padding:"7px 20px",borderRadius:2,fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",fontWeight:500}}>{editingId?"Save":"Add Prospect"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
