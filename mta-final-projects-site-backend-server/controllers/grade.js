/**
 * Factory to create handler for getting a project's grade for the current judge
 * Usage in router: getProjectGrade(collections)
 */
const getProjectGrade = (collections) => {
  return async (req, res) => {
    try {
      // Use the judge's ID (from the verified token) and the provided project ID
      const judge_id = req.user.id;
      const projectId = req.params.projectId;

      // Look up the grade document for this project and judge
      const grade = await collections.grades.findOne({
        project_id: projectId.toString(),
        judge_id: judge_id.toString(),
      });

      if (!grade) {
        return res
          .status(404)
          .json({ error: 'Grade not found for this project.' });
      }

      // Return the grade info
      res.status(200).json({ gradeInfo: grade });
    } catch (error) {
      console.error('Error retrieving grade:', error);
      res
        .status(500)
        .json({ error: 'An error occurred while retrieving the grade.' });
    }
  };
};

module.exports = {
  getProjectGrade,
};

