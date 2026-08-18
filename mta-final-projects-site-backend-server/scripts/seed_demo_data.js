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
];

const demoAssignments = [
  { judgeIds: ['900000002'], projectIds: ['2025001', '2025002', '2025003'] },
  { judgeIds: ['900000003'], projectIds: ['2025004', '2025005', '2025006'] },
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
