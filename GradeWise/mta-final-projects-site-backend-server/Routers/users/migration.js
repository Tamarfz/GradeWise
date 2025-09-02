const { getCollections } = require('../../DB/index');

async function migrateGradeIds() {
  try {
    const collections = await getCollections();
    
    console.log('Starting migration: Converting numeric IDs to strings in grades collection...');
    
    // Get all grades
    const grades = await collections.grades.find({}).toArray();
    console.log(`Found ${grades.length} grades to migrate`);
    
    let updatedCount = 0;
    
    for (const grade of grades) {
      // Check if IDs are numbers and need conversion
      const needsUpdate = typeof grade.project_id === 'number' || typeof grade.judge_id === 'number';
      
      if (needsUpdate) {
        const updateData = {};
        
        if (typeof grade.project_id === 'number') {
          updateData.project_id = grade.project_id.toString();
        }
        
        if (typeof grade.judge_id === 'number') {
          updateData.judge_id = grade.judge_id.toString();
        }
        
        // Update the document
        await collections.grades.updateOne(
          { _id: grade._id },
          { $set: updateData }
        );
        
        updatedCount++;
        console.log(`Updated grade ${grade._id}: project_id=${grade.project_id} -> ${updateData.project_id}, judge_id=${grade.judge_id} -> ${updateData.judge_id}`);
      }
    }
    
    console.log(`Migration completed! Updated ${updatedCount} grades.`);
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Export the migration function
module.exports = { migrateGradeIds };
