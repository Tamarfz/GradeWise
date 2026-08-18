/*
 * Creates a privacy-safe GradeWise demo dataset.
 *
 * Usage:
 *   npm run seed:demo             # preview only
 *   npm run seed:demo -- --apply  # write demo data to MongoDB
 *
 * The script only upserts its own demo records. It never deletes data.
 */

require('dotenv').config();

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../DB/entities/user.entity');
const PotentialUser = require('../DB/entities/potential_users.entity');
const Project = require('../DB/entities/project.entity');
const Grade = require('../DB/entities/grade.entity');
const ProjectsJudgesGroup = require('../DB/entities/projects_judges_group.entity');
const AvailablePreference = require('../DB/entities/available_preferences.entity');

const shouldApply = process.argv.includes('--apply');

const demoUsers = [
  { ID: '900000001', name: 'Demo Admin', email: 'admin@gradewise.demo', type: 'admin' },
  { ID: '900000002', name: 'Dana Cohen', email: 'dana@gradewise.demo', type: 'judge' },
  { ID: '900000003', name: 'Noam Levi', email: 'noam@gradewise.demo', type: 'judge' },
  ...Array.from({ length: 28 }, (_, index) => {
    const judgeNumber = index + 4;
    return {
      ID: String(900000000 + judgeNumber),
      name: `Demo Judge ${String(judgeNumber).padStart(2, '0')}`,
      email: `judge${String(judgeNumber).padStart(2, '0')}@gradewise.demo`,
      type: 'judge',
    };
  }),
];

const demoProjects = [
  {
    Title: 'CampusFlow',
    WorkshopName: 'Software Engineering Workshop',
    WorkshopId: '150001',
    ProjectNumber: '2025001',
    ProjectInfo: 'A campus navigation and event-planning platform for students.',
    ProjectOwners: 'Maya Green, Amit Shaham',
    Lecturer: 'Dr. Yael Cohen',
    StudentName: 'Maya Green',
    GitHubLink: 'https://github.com/gradewise-demo/campusflow',
    ProjectYear: '2025',
    CourseOfStudy: 'Applied Track',
  },
  {
    Title: 'MindTrack',
    WorkshopName: 'AI Product Development Workshop',
    WorkshopId: '150002',
    ProjectNumber: '2025002',
    ProjectInfo: 'A privacy-focused habit-tracking assistant with personalised insights.',
    ProjectOwners: 'Lior Ben-David, Neta Azulay',
    Lecturer: 'Dr. Ron Tal',
    StudentName: 'Lior Ben-David',
    GitHubLink: 'https://github.com/gradewise-demo/mindtrack',
    ProjectYear: '2025',
    CourseOfStudy: 'Applied Track',
  },
  {
    Title: 'EcoRoute',
    WorkshopName: 'Data Science Workshop',
    WorkshopId: '150003',
    ProjectNumber: '2025003',
    ProjectInfo: 'A route planner that estimates emissions and suggests lower-impact travel options.',
    ProjectOwners: 'Omer Katz, Shira Dayan',
    Lecturer: 'Dr. Dana Mor',
    StudentName: 'Omer Katz',
    GitHubLink: 'https://github.com/gradewise-demo/ecoroute',
    ProjectYear: '2025',
    CourseOfStudy: 'Data Track',
  },
  {
    Title: 'AccessHub',
    WorkshopName: 'Software Engineering Workshop',
    WorkshopId: '150001',
    ProjectNumber: '2025004',
    ProjectInfo: 'An accessibility audit tool that helps teams identify common web-interface issues.',
    ProjectOwners: 'Tomer Azulay, Rina Bar',
    Lecturer: 'Dr. Yael Cohen',
    StudentName: 'Tomer Azulay',
    GitHubLink: 'https://github.com/gradewise-demo/accesshub',
    ProjectYear: '2025',
    CourseOfStudy: 'Applied Track',
  },
  {
    Title: 'StudySphere',
    WorkshopName: 'AI Product Development Workshop',
    WorkshopId: '150002',
    ProjectNumber: '2025005',
    ProjectInfo: 'A collaborative study planner that recommends focused study sessions.',
    ProjectOwners: 'Adi Ben-Ami, Yuval Peretz',
    Lecturer: 'Dr. Ron Tal',
    StudentName: 'Adi Ben-Ami',
    GitHubLink: 'https://github.com/gradewise-demo/studysphere',
    ProjectYear: '2025',
    CourseOfStudy: 'Applied Track',
  },
  {
    Title: 'SafeSight',
    WorkshopName: 'Data Science Workshop',
    WorkshopId: '150003',
    ProjectNumber: '2025006',
    ProjectInfo: 'A computer-vision prototype for detecting safety hazards in shared spaces.',
    ProjectOwners: 'Eden Mizrahi, Gil Azulay',
    Lecturer: 'Dr. Dana Mor',
    StudentName: 'Eden Mizrahi',
    GitHubLink: 'https://github.com/gradewise-demo/safesight',
    ProjectYear: '2025',
    CourseOfStudy: 'Data Track',
  },
  {
    Title: 'DataGuardian',
    WorkshopName: 'Data Science Workshop',
    WorkshopId: '150003',
    ProjectNumber: '2025007',
    ProjectInfo: 'A data-quality dashboard that identifies incomplete, inconsistent, and duplicated records.',
    ProjectOwners: 'Niv Ron, Ella Shalev',
    Lecturer: 'Dr. Dana Mor',
    StudentName: 'Niv Ron',
    GitHubLink: 'https://github.com/gradewise-demo/dataguardian',
    ProjectYear: '2025',
    CourseOfStudy: 'Data Track',
  },
  {
    Title: 'TaskMint',
    WorkshopName: 'Software Engineering Workshop',
    WorkshopId: '150001',
    ProjectNumber: '2025008',
    ProjectInfo: 'A lightweight project-management tool for small student teams.',
    ProjectOwners: 'Yarden Levi, Lia Mor',
    Lecturer: 'Dr. Yael Cohen',
    StudentName: 'Yarden Levi',
    GitHubLink: 'https://github.com/gradewise-demo/taskmint',
    ProjectYear: '2025',
    CourseOfStudy: 'Applied Track',
  },
  {
    Title: 'FitFuel',
    WorkshopName: 'AI Product Development Workshop',
    WorkshopId: '150002',
    ProjectNumber: '2025009',
    ProjectInfo: 'A meal-planning assistant that creates flexible nutrition plans from personal goals.',
    ProjectOwners: 'Gal Bar, Shani Koren',
    Lecturer: 'Dr. Ron Tal',
    StudentName: 'Gal Bar',
    GitHubLink: 'https://github.com/gradewise-demo/fitfuel',
    ProjectYear: '2025',
    CourseOfStudy: 'Applied Track',
  },
  {
    Title: 'CrisisLens',
    WorkshopName: 'Data Science Workshop',
    WorkshopId: '150003',
    ProjectNumber: '2025010',
    ProjectInfo: 'A public-data dashboard that helps communities understand emergency updates quickly.',
    ProjectOwners: 'Ori Stern, Tamar Katz',
    Lecturer: 'Dr. Dana Mor',
    StudentName: 'Ori Stern',
    GitHubLink: 'https://github.com/gradewise-demo/crisislens',
    ProjectYear: '2025',
    CourseOfStudy: 'Data Track',
  },
  {
    Title: 'CodeCompass',
    WorkshopName: 'Software Engineering Workshop',
    WorkshopId: '150001',
    ProjectNumber: '2025011',
    ProjectInfo: 'A codebase onboarding guide that maps services, dependencies, and ownership.',
    ProjectOwners: 'Daniel Meir, Rotem Gil',
    Lecturer: 'Dr. Yael Cohen',
    StudentName: 'Daniel Meir',
    GitHubLink: 'https://github.com/gradewise-demo/codecompass',
    ProjectYear: '2025',
    CourseOfStudy: 'Applied Track',
  },
  {
    Title: 'GreenCart',
    WorkshopName: 'AI Product Development Workshop',
    WorkshopId: '150002',
    ProjectNumber: '2025012',
    ProjectInfo: 'A shopping assistant that recommends lower-waste alternatives for everyday products.',
    ProjectOwners: 'Shira Lavi, Itay Sharabi',
    Lecturer: 'Dr. Ron Tal',
    StudentName: 'Shira Lavi',
    GitHubLink: 'https://github.com/gradewise-demo/greencart',
    ProjectYear: '2025',
    CourseOfStudy: 'Applied Track',
  },
  {
    Title: 'SkillBridge',
    WorkshopName: 'Software Engineering Workshop',
    WorkshopId: '150001',
    ProjectNumber: '2025013',
    ProjectInfo: 'A mentoring platform that matches students with peers who can help them practise technical skills.',
    ProjectOwners: 'Noy Hadar, Ariel Cohen',
    Lecturer: 'Dr. Yael Cohen',
    StudentName: 'Noy Hadar',
    GitHubLink: 'https://github.com/gradewise-demo/skillbridge',
    ProjectYear: '2025',
    CourseOfStudy: 'Applied Track',
  },
  {
    Title: 'UrbanHarvest',
    WorkshopName: 'AI Product Development Workshop',
    WorkshopId: '150002',
    ProjectNumber: '2025014',
    ProjectInfo: 'A community platform that connects residents with local growers and surplus-food initiatives.',
    ProjectOwners: 'Moran Tal, Oren Kimhi',
    Lecturer: 'Dr. Ron Tal',
    StudentName: 'Moran Tal',
    GitHubLink: 'https://github.com/gradewise-demo/urbanharvest',
    ProjectYear: '2025',
    CourseOfStudy: 'Applied Track',
  },
  {
    Title: 'PulsePal',
    WorkshopName: 'Data Science Workshop',
    WorkshopId: '150003',
    ProjectNumber: '2025015',
    ProjectInfo: 'A wellbeing check-in application that visualises mood and energy trends over time.',
    ProjectOwners: 'Talia Amir, Ronen Dayan',
    Lecturer: 'Dr. Dana Mor',
    StudentName: 'Talia Amir',
    GitHubLink: 'https://github.com/gradewise-demo/pulsepal',
    ProjectYear: '2025',
    CourseOfStudy: 'Data Track',
  },
  {
    Title: 'LearnLoop',
    WorkshopName: 'Software Engineering Workshop',
    WorkshopId: '150001',
    ProjectNumber: '2025016',
    ProjectInfo: 'A feedback platform that helps lecturers identify difficult course topics early.',
    ProjectOwners: 'Yoni Malka, Dana Avital',
    Lecturer: 'Dr. Yael Cohen',
    StudentName: 'Yoni Malka',
    GitHubLink: 'https://github.com/gradewise-demo/learnloop',
    ProjectYear: '2025',
    CourseOfStudy: 'Applied Track',
  },
  {
    Title: 'RouteWise',
    WorkshopName: 'AI Product Development Workshop',
    WorkshopId: '150002',
    ProjectNumber: '2025017',
    ProjectInfo: 'A travel planner that balances travel time, cost, and accessibility needs.',
    ProjectOwners: 'Lena Shem, Guy Ariel',
    Lecturer: 'Dr. Ron Tal',
    StudentName: 'Lena Shem',
    GitHubLink: 'https://github.com/gradewise-demo/routewise',
    ProjectYear: '2025',
    CourseOfStudy: 'Applied Track',
  },
  {
    Title: 'CareConnect',
    WorkshopName: 'Data Science Workshop',
    WorkshopId: '150003',
    ProjectNumber: '2025018',
    ProjectInfo: 'A coordination tool for families who share caregiving responsibilities.',
    ProjectOwners: 'Maayan Shalev, Rafi Levi',
    Lecturer: 'Dr. Dana Mor',
    StudentName: 'Maayan Shalev',
    GitHubLink: 'https://github.com/gradewise-demo/careconnect',
    ProjectYear: '2025',
    CourseOfStudy: 'Data Track',
  },
  {
    Title: 'BudgetBloom',
    WorkshopName: 'Software Engineering Workshop',
    WorkshopId: '150001',
    ProjectNumber: '2025019',
    ProjectInfo: 'A simple budgeting tool that helps students plan goals and understand recurring expenses.',
    ProjectOwners: 'Ilan Mizrahi, Roni Paz',
    Lecturer: 'Dr. Yael Cohen',
    StudentName: 'Ilan Mizrahi',
    GitHubLink: 'https://github.com/gradewise-demo/budgetbloom',
    ProjectYear: '2025',
    CourseOfStudy: 'Applied Track',
  },
  {
    Title: 'SignalScout',
    WorkshopName: 'AI Product Development Workshop',
    WorkshopId: '150002',
    ProjectNumber: '2025020',
    ProjectInfo: 'A prototype that classifies noisy event signals and highlights patterns for analysts.',
    ProjectOwners: 'Ziv Koren, Tal Avraham',
    Lecturer: 'Dr. Ron Tal',
    StudentName: 'Ziv Koren',
    GitHubLink: 'https://github.com/gradewise-demo/signalscout',
    ProjectYear: '2025',
    CourseOfStudy: 'Applied Track',
  },
];

const demoAssignments = [
  { judgeIds: ['900000002'], projectIds: ['2025001', '2025002', '2025003'] },
  { judgeIds: ['900000003'], projectIds: ['2025004', '2025005', '2025006'] },
  { judgeIds: ['900000002'], projectIds: ['2025007'] },
  { judgeIds: ['900000003'], projectIds: ['2025008'] },
  { judgeIds: ['900000004'], projectIds: ['2025009'] },
  { judgeIds: ['900000005'], projectIds: ['2025010'] },
  { judgeIds: ['900000006'], projectIds: ['2025011'] },
  { judgeIds: ['900000007'], projectIds: ['2025012'] },
  { judgeIds: ['900000008'], projectIds: ['2025013'] },
  { judgeIds: ['900000009'], projectIds: ['2025014'] },
  { judgeIds: ['900000010'], projectIds: ['2025015'] },
  { judgeIds: ['900000011'], projectIds: ['2025016'] },
];

const demoGrades = [
  {
    judge_id: '900000002',
    project_id: '2025001',
    complexity: 8,
    usability: 9,
    innovation: 8,
    presentation: 8,
    proficiency: 9,
    additionalComment: 'Clear problem statement and a polished user flow.',
  },
  {
    judge_id: '900000003',
    project_id: '2025004',
    complexity: 9,
    usability: 8,
    innovation: 8,
    presentation: 9,
    proficiency: 8,
    additionalComment: 'Strong technical direction with a focused presentation.',
  },
  {
    judge_id: '900000002',
    project_id: '2025007',
    complexity: 8,
    usability: 8,
    innovation: 9,
    presentation: 8,
    proficiency: 9,
    additionalComment: 'Useful data-quality focus with clear visual feedback.',
  },
  {
    judge_id: '900000003',
    project_id: '2025008',
    complexity: 7,
    usability: 9,
    innovation: 8,
    presentation: 8,
    proficiency: 8,
    additionalComment: 'Practical scope and an intuitive collaboration workflow.',
  },
  {
    judge_id: '900000004',
    project_id: '2025009',
    complexity: 8,
    usability: 9,
    innovation: 8,
    presentation: 8,
    proficiency: 8,
    additionalComment: 'A thoughtful concept with clear user-centred decisions.',
  },
  {
    judge_id: '900000005',
    project_id: '2025010',
    complexity: 9,
    usability: 8,
    innovation: 8,
    presentation: 9,
    proficiency: 8,
    additionalComment: 'Strong use of public data and an effective dashboard design.',
  },
  {
    judge_id: '900000008',
    project_id: '2025013',
    complexity: 8,
    usability: 8,
    innovation: 9,
    presentation: 9,
    proficiency: 8,
    additionalComment: 'Good product focus with a convincing collaboration workflow.',
  },
  {
    judge_id: '900000011',
    project_id: '2025016',
    complexity: 8,
    usability: 9,
    innovation: 7,
    presentation: 8,
    proficiency: 9,
    additionalComment: 'Clear educational value and a well-scoped technical solution.',
  },
];

const demoPreferences = ['AI', 'Web Development', 'Data Science'];

function withTotalGrade(grade) {
  return {
    ...grade,
    grade: grade.complexity + grade.usability + grade.innovation + grade.presentation + grade.proficiency,
  };
}

async function main() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Missing MONGODB_URI. Add it to the backend .env file.');
  }

  if (!process.env.DEMO_PASSWORD) {
    throw new Error('Missing DEMO_PASSWORD. Add a local demo password to the backend .env file.');
  }

  console.log('Demo data preview:', {
    users: demoUsers.length,
    projects: demoProjects.length,
    assignments: demoAssignments.length,
    completedGrades: demoGrades.length,
  });

  if (!shouldApply) {
    console.log('Preview only. Re-run with --apply to write demo data to MongoDB.');
    return;
  }

  await mongoose.connect(process.env.MONGODB_URI);
  const passwordHash = await bcrypt.hash(process.env.DEMO_PASSWORD, 10);

  await PotentialUser.bulkWrite(demoUsers.map((user) => ({
    updateOne: {
      filter: { ID: user.ID },
      update: { $set: { ID: user.ID } },
      upsert: true,
    },
  })));

  await User.bulkWrite(demoUsers.map((user) => ({
    updateOne: {
      filter: { ID: user.ID },
      update: { $set: { ...user, password: passwordHash, avatar: 'default' } },
      upsert: true,
    },
  })));

  await Project.bulkWrite(demoProjects.map((project) => ({
    updateOne: {
      filter: { ProjectNumber: project.ProjectNumber },
      update: { $set: project },
      upsert: true,
    },
  })));

  for (const assignment of demoAssignments) {
    await ProjectsJudgesGroup.updateOne(
      { judge_ids: assignment.judgeIds, project_ids: assignment.projectIds },
      { $set: { judge_ids: assignment.judgeIds, project_ids: assignment.projectIds } },
      { upsert: true }
    );
  }

  await Grade.bulkWrite(demoGrades.map((grade) => {
    const gradeWithTotal = withTotalGrade(grade);
    return {
      updateOne: {
        filter: { judge_id: gradeWithTotal.judge_id, project_id: gradeWithTotal.project_id },
        update: { $set: gradeWithTotal },
        upsert: true,
      },
    };
  }));

  await AvailablePreference.bulkWrite(demoPreferences.map((Preference) => ({
    updateOne: {
      filter: { Preference },
      update: { $set: { Preference } },
      upsert: true,
    },
  })));

  console.log('Demo data was created or updated successfully.');
  console.log('Demo login IDs: 900000001 (admin), 900000002 and 900000003 (judges).');
}

main()
  .catch((error) => {
    console.error('Demo seed failed:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
