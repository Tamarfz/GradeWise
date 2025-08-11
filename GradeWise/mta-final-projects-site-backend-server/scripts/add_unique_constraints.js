// Script to add unique constraints to prevent duplicate project-judge assignments
const { MongoClient } = require('mongodb');

async function addUniqueConstraints() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('mta_final_projects');
    
    // Add unique index to grades collection to prevent duplicate project-judge combinations
    console.log('Adding unique index to grades collection...');
    await db.collection('grades').createIndex(
      { project_id: 1, judge_id: 1 }, 
      { unique: true, name: 'unique_project_judge' }
    );
    console.log('✅ Unique index added to grades collection');

    // Add unique index to projects_judges_groups collection
    console.log('Adding unique index to projects_judges_groups collection...');
    await db.collection('projects_judges_groups').createIndex(
      { judge_ids: 1, project_ids: 1 }, 
      { unique: true, name: 'unique_judge_project_group' }
    );
    console.log('✅ Unique index added to projects_judges_groups collection');

    console.log('🎉 All unique constraints added successfully!');
    
  } catch (error) {
    console.error('Error adding unique constraints:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the script
addUniqueConstraints().catch(console.error);
