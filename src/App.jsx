import { useState, useEffect, useMemo } from "react";

const STAGES = ["Identified","Researching","Warm","Outreach Sent","In Conversation","Proposal Sent","Partner"];
const SECTORS = ["Health & Medicine","Science & Research","Social Services","Mental Health","Education","Environment","Advocacy & Policy","Arts & Culture","Community Development","Other"];
const BUDGET_SIGNALS = ["Unknown","Low (<$50k)","Mid ($50k–$150k)","High ($150k+)","Institutional ($20M+ org budget)"];
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
  {
    id:27, name:"Soil and Water Conservation Society (SWCS)", sector:"Environment",
    stage:"Identified", budget:"Low (<$50k)", storyReady:"No Story Yet",
    mission:"Conservation practitioners. Agricultural land, water quality, soil health.",
    contacts:"Executive Director",
    notes:"Soil is a sleeper documentary subject — the foundation of food systems. Small org but potential for co-sponsorship with a larger funder.",
    nextAction:"Review SWCS financials; budget may be too small unless co-sponsored",
    lastTouch:"", website:"swcs.org", priority:false
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
    stage:"Identified", budget:"Institutional ($20M+ org budget)", storyReady:"Clear Pitch",
    mission:"~134,000 psychologist members. Annual budget ~$134M. Mental health, trauma, equity advocacy.",
    contacts:"Chief Communications Officer; Public Affairs Director",
    notes:"APA has the budget and the urgency. The mental health crisis in America is the defining story of the decade. Pitch: a longitudinal doc on psychologists serving underserved communities — immigrant families, veterans, rural populations. They have published on access gaps but have no branded film presence.",
    nextAction:"Review APA's public-facing media hub; identify Chief Comms Officer on LinkedIn",
    lastTouch:"", website:"apa.org", priority:true
  },
  {
    id:40, name:"American Academy of Pediatrics (AAP)", sector:"Health & Medicine",
    stage:"Identified", budget:"Institutional ($20M+ org budget)", storyReady:"Story Forming",
    mission:"67,000 pediatricians. Annual budget ~$122M. Child health, mental health, gun violence, climate.",
    contacts:"VP of Communications; Media Relations",
    notes:"AAP has commissioning budget and a portfolio of urgent narratives: childhood gun violence, food insecurity, pediatric mental health crisis, immigrant child health. They've done major policy pushes but no branded documentary. High alignment with Think Out Loud's social impact positioning.",
    nextAction:"Review AAP's media center and any existing video/documentary work",
    lastTouch:"", website:"aap.org", priority:true
  },
  {
    id:41, name:"American Physical Therapy Association (APTA)", sector:"Health & Medicine",
    stage:"Identified", budget:"Institutional ($20M+ org budget)", storyReady:"Story Forming",
    mission:"~100,000 physical therapists and assistants. Annual budget ~$60M. Rehab access, chronic pain, opioid alternative.",
    contacts:"Director of Communications",
    notes:"PT is a powerful but under-documented profession. With opioid epidemic still unfolding, a doc positioning PT as the humane alternative to pain management has legs. APTA has the budget and the membership base to sponsor it.",
    nextAction:"Check APTA's YouTube and media presence; look for any prior video campaigns",
    lastTouch:"", website:"apta.org", priority:false
  },
  {
    id:42, name:"American Speech-Language-Hearing Association (ASHA)", sector:"Health & Medicine",
    stage:"Identified", budget:"Institutional ($20M+ org budget)", storyReady:"Story Forming",
    mission:"~228,000 audiologists, SLPs, and scientists. Annual budget ~$60M. Communication access and equity.",
    contacts:"Chief Communications Officer",
    notes:"SLPs are invisible heroes — working with stroke survivors, children with autism, trauma patients. ASHA has enormous reach and consistent advocacy messaging. A doc following several SLPs across different settings (schools, hospitals, rehabilitation centers) could be powerful.",
    nextAction:"Review ASHA's media; look for prior branded video or film work",
    lastTouch:"", website:"asha.org", priority:false
  },
  {
    id:43, name:"Society for Human Resource Management (SHRM)", sector:"Other",
    stage:"Identified", budget:"Institutional ($20M+ org budget)", storyReady:"Story Forming",
    mission:"325,000+ HR professionals globally. Annual budget ~$200M+. Workforce equity, DEI, future of work.",
    contacts:"Chief Communications Officer; Content Strategy",
    notes:"SHRM has massive budget and is actively reshaping the DEI and workforce narrative. A branded doc on the human cost of hiring discrimination, wage equity gaps, or the loneliness epidemic in workplaces could be transformative. They've invested heavily in media — but not documentary-scale storytelling.",
    nextAction:"Research SHRM's existing content studio; assess their doc appetite",
    lastTouch:"", website:"shrm.org", priority:false
  },
  {
    id:44, name:"American Institute of Architects (AIA)", sector:"Other",
    stage:"Identified", budget:"Institutional ($20M+ org budget)", storyReady:"Story Forming",
    mission:"~95,000 architects. Annual budget ~$65M. Climate-resilient design, equity in the built environment.",
    contacts:"Communications Director",
    notes:"Architecture has major storytelling potential that's rarely tapped at the documentary level. Climate-resilient design, community-led projects in underserved cities, and the story of who gets to shape urban environments are all powerful pitches. AIA has budget and national media relationships.",
    nextAction:"Review AIA's existing media and advocacy campaigns",
    lastTouch:"", website:"aia.org", priority:false
  },
  {
    id:45, name:"National Association of Social Workers (NASW)", sector:"Social Services",
    stage:"Identified", budget:"Institutional ($20M+ org budget)", storyReady:"Clear Pitch",
    mission:"~55,000 social workers. Annual budget ~$25M. Social justice, child welfare, mental health access.",
    contacts:"Director of Communications",
    notes:"Social workers are among the most underpaid and underrepresented professionals in America. NASW has a clear advocacy mandate and consistent budget. Pitch: a doc following several social workers across different settings — child welfare, hospital, immigration — over the course of a year. Strong equity frame.",
    nextAction:"Check NASW's video history; find comms director name",
    lastTouch:"", website:"socialworkers.org", priority:true
  },
  {
    id:46, name:"American Association of Critical Care Nurses (AACN)", sector:"Health & Medicine",
    stage:"Identified", budget:"Institutional ($20M+ org budget)", storyReady:"Clear Pitch",
    mission:"~120,000 critical care nurses. Annual budget ~$36M (990 verified). ICU workforce crisis.",
    contacts:"Chief Communications Officer",
    notes:"AACN has verified $36M+ revenue (Form 990, 2023). ICU nurses lived through COVID as no one else did — moral injury, understaffing, impossible choices. A doc set inside a critical care unit could be one of the most powerful healthcare films ever made. AACN has both the budget and the story urgency.",
    nextAction:"Look for any prior AACN documentary or film partnerships; identify comms officer",
    lastTouch:"", website:"aacn.org", priority:true
  },
  {
    id:47, name:"American Society of Clinical Oncology (ASCO)", sector:"Health & Medicine",
    stage:"Identified", budget:"Institutional ($20M+ org budget)", storyReady:"Story Forming",
    mission:"45,000+ oncologists globally. Annual budget ~$120M+. Cancer equity, clinical trial access, survivorship.",
    contacts:"Director of Communications; Media Relations",
    notes:"Cancer disparities — who gets access to clinical trials, cutting-edge drugs, specialized oncologists — is a major and underreported story. ASCO has enormous resources and a clear equity mandate. A doc on disparate cancer outcomes across race/class would align perfectly with their public advocacy.",
    nextAction:"Review ASCO's media presence; look for branded content or documentary investment history",
    lastTouch:"", website:"asco.org", priority:false
  },
  {
    id:48, name:"American Public Health Association (APHA)", sector:"Health & Medicine",
    stage:"Identified", budget:"Institutional ($20M+ org budget)", storyReady:"Clear Pitch",
    mission:"~25,000 public health professionals. Annual budget ~$25M. Prevention, health equity, policy.",
    contacts:"Communications Director",
    notes:"APHA has been operating for 150+ years and is the largest public health professional org in the US. 150th anniversary was in 2022 — they may be building toward the next campaign. Pitch: a doc on the invisible infrastructure of public health: disease surveillance, community health workers, local health departments. The pandemic made this story urgent; APHA could sponsor the film that explains what we almost lost.",
    nextAction:"Check APHA's media center; identify comms director and assess doc appetite",
    lastTouch:"", website:"apha.org", priority:true
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
  const AIRTABLE_TABLE = "Prospect Tracker";
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
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:p.budget.startsWith("Institutional")?"#2563eb":"#aaaabd"}}>{p.budget.startsWith("Institutional")?"$20M+ ORG":p.budget.split(" ")[0]}</div>
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
