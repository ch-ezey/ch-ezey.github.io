/* ==========================================================================
   data.js: all of the site's written content
   --------------------------------------------------------------------------
   Edit this file to change text, add a project, add a job and so on.
   Nothing in here touches the page. The other scripts import these lists
   and turn them into HTML.
   ========================================================================== */

/* Skill groups, shown as cards under the About card (rendered by js/home.js). */
export const SKILLS = [
  { title: "Languages", items: ["Java", "JavaScript", "Python", "SQL"] },
  { title: "Frameworks", items: ["Spring Boot", "Hibernate/JPA", "React", "Node.js", "React Native"] },
  { title: "Cloud and DevOps", items: ["AWS", "Google Cloud", "Docker", "Kubernetes (learning)", "GitHub Actions", "GitLab CI"] },
  { title: "Data", items: ["MySQL", "MongoDB", "Firebase", "BigQuery", "Redis"] },
  { title: "Practice", items: ["REST API design", "TDD", "Agile (Scrum)", "Microservices", "Secure coding"] }
];

/* Projects: one tile each on the Channels screen (js/projects.js) and one page
   each in the project modal (js/modal.js). The order here is the tile order and
   the order the modal's previous/next arrows step through.

   id          unique; used in links such as #project-rootine
   name        title on the tile and in the modal
   kind        small label at the top of the tile
   tagline     line at the bottom of the tile
   colorClass  tile/cover colour, defined in css/screens/projects.css
   repo        GitHub link
   screenshots optional; shown in the modal instead of the coloured cover
   description paragraph in the modal
   highlights  "What it does" bullet points
   stack       "Built with" chips
   status      small grey line at the end of the modal text */
export const PROJECTS = [
  {
    id: "rootine", name: "Rootine", kind: "Web app", tagline: "AI-assisted routines", colorClass: "c-rootine",
    repo: "https://github.com/ch-ezey/rootine",
    description: "An AI-assisted routine manager. Describe the routine you want, let AI turn it into a structured draft, then manage it with full create, edit, delete and reorder controls. Includes sign-up, login and task ordering.",
    highlights: [
      "Sign-up and login secured with Spring Security",
      "Create, edit, delete and reorder routines and tasks",
      "Generates and updates routines from natural-language prompts using the OpenAI API",
      "Containerised with Docker; AWS deployment being explored"
    ],
    stack: ["Java 17", "Spring Boot", "JPA", "Spring Security", "MySQL", "React", "Vite", "OpenAI API", "Docker"],
    status: "In progress, MVP stage"
  },
  {
    id: "motive", name: "MOTIVE", kind: "Mobile app", tagline: "Find events, build community", colorClass: "c-motive",
    repo: "https://github.com/ch-ezey/Motive",
    screenshots: [
      { src: "assets/images/motive-1.png", alt: "Motive log in screen" },
      { src: "assets/images/motive-2.png", alt: "Motive event feed" },
      { src: "assets/images/motive-3.png", alt: "Motive edit profile screen" }
    ],
    description: "Motive is a mobile app (built with React Native) that helps users find exciting events, connect with like-minded people, and build a community around shared experiences.",
    highlights: [
      "Event search and filters by location, keywords and interests",
      "Create events and manage guest lists; save events for later",
      "Profiles, friend connections and real-time chat",
      "Firebase authentication and Realtime Database"
    ],
    stack: ["React Native", "Expo", "TypeScript", "Firebase", "Android Studio"],
    status: "Full-stack mobile project"
  },
  {
    id: "clothing-tracker", name: "Clothing Tracker", kind: "Python tool", tagline: "Size and stock tracker", colorClass: "c-clothing",
    repo: "https://github.com/ch-ezey/clothing-tracker",
    description: "Tracks clothing sizes and availability across retailer websites including ASOS and H&M. Scrapers fetch data on demand or on a schedule, outdated items are removed, and everything is stored in SQLite with a test mode for development.",
    highlights: [
      "Separate scrapers for ASOS, H&M and Next",
      "Manual and scheduled updates; removes outdated items",
      "SQLite storage with an in-memory test mode",
      "Automated tests and an alerts module"
    ],
    stack: ["Python", "Web scraping", "SQLite", "Scheduler"],
    status: "Command line tool"
  },
  {
    id: "ai-storyteller", name: "AI Storyteller", kind: "Java game", tagline: "Procedural stories", colorClass: "c-story",
    repo: "https://github.com/ch-ezey/AI-Storyteller",
    description: "A procedural storytelling game in Java. It uses OpenAI prompt engineering to generate branching narratives, with separate classes for the opening, the story path and the conclusion.",
    highlights: [
      "Object-oriented Java design with separate opening, story and conclusion generators",
      "Prompt engineering and fine-tuning with OpenAI language models",
      "Storyline parsing and an interactive game loop"
    ],
    stack: ["Java", "OpenAI API", "Object-oriented design"],
    status: "University project"
  },
  {
    id: "hospital-system", name: "Hospital System", kind: "Group project", tagline: "Java Swing and SQL", colorClass: "c-hospital",
    repo: "https://github.com/ch-ezey/co559",
    description: "A group project: a Java Swing desktop app backed by a remote SQL database. Administrators manage doctor profiles and patients book appointments, with the schema designed in MySQL Workbench.",
    highlights: [
      "Java Swing interface with login, doctor, patient and booking screens",
      "Reads and writes a remote MySQL database",
      "Schema designed in MySQL Workbench",
      "Built collaboratively as a group assignment"
    ],
    stack: ["Java", "Swing", "MySQL", "Team project"],
    status: "University group project (CO559)"
  }
];

/* Jobs, newest first, shown as cards on the Save data screen (js/experience.js).
   The card layout in js/experience.js expects exactly three jobs. */
export const JOBS = [
  {
    title: "Rentokil Initial", role: "Cloud IoT and Data Engineering", when: "Recent",
    bullets: [
      "Built and maintained real-time IoT data features on Google Cloud: Dataflow and Apache Beam pipelines, Pub/Sub, Firestore, BigQuery, Redis and Python Cloud Functions.",
      "Added Redis-backed activity processing and a shared movement-count model that replaced duplicated device-specific logic.",
      "Improved logging, audit outputs and deployment troubleshooting for staging and production rollouts.",
      "Wrote regression tests across the Java and Python services, with 109 Java and 46 Python tests passing in the full suite."
    ],
    skills: ["Google Cloud", "Dataflow / Beam", "Pub/Sub", "Firestore", "BigQuery", "Redis", "Python", "Java"]
  },
  {
    title: "MThree Alumni Programme", role: "Full-Stack Java Developer, London", when: "Feb 2025 to Aug 2025",
    bullets: [
      "Designed and built secure RESTful microservices with Java 17+, Spring Boot and TDD.",
      "Worked in cross-functional Agile teams: sprint planning, reviews and stand-ups.",
      "Maintained and scaled backend services for financial systems.",
      "Set up CI/CD pipelines with Docker and GitLab, and took part in peer code reviews."
    ],
    skills: ["Spring Boot", "Java 17", "Docker", "GitLab CI", "TDD"]
  },
  {
    title: "TransPerfect", role: "Data Analyst, London", when: "Sep 2024 to Dec 2024",
    bullets: [
      "Annotated and cleaned large datasets used to train natural language processing models.",
      "Worked with engineers to improve data pipelines and keep data accurate across systems."
    ],
    skills: ["NLP data", "Data quality"]
  }
];

/* Education entries, grouped into a single "Education" card on the Save data screen.
   description is optional. */
export const EDUCATION = [
  { title: "University of Kent, Canterbury", role: "BSc (Hons) Computer Science (AI), 2:1", when: "Jul 2020 to Jul 2023" },
  {
    title: "AWS Training", role: "AWS re/Start (completed) · Cloud Practitioner (in progress)", when: "Cloud",
    description: "Built cloud architectures on EC2, S3 and RDS, with VPC networking, security groups and CloudWatch monitoring."
  }
];

/* Contact slots on the Contact screen (js/contact.js), left to right.
   A slot with only a name is drawn as a greyed-out empty slot.
   Give a slot either href + linkText (shows a link button)
   or copyText (shows a button that copies `main` to the clipboard). */
export const CONTACTS = [
  { name: "Email", lead: "If you’re interested in working together, feel free to shoot me an email:", main: "cezey01@gmail.com", copyText: "Copy address" },
  { name: "GitHub", lead: "Browse my projects and source code on GitHub:", main: "github.com/ch-ezey", href: "https://github.com/ch-ezey", linkText: "Open GitHub" },
  { name: "LinkedIn", lead: "Let’s connect, or read more about my experience on LinkedIn:", main: "linkedin.com/in/ch-ezey", href: "https://www.linkedin.com/in/ch-ezey/", linkText: "Open LinkedIn" },
  { name: "Empty" },
  { name: "Empty" }
];
