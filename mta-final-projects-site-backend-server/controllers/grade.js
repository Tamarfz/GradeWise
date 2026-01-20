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

/**
 * Factory to create handler for getting list of projects assigned to current judge
 * Usage in router: getProjectsForJudge(collections)
 */
const getProjectsForJudge = (collections) => {
  return async (req, res) => {
    try {
      const queryForGroups = { judge_ids: { $in: [req.user.id] } };
      const cursor = await collections.projects_judges_groups.find(queryForGroups);
      const matchingProjectGroups = await cursor.toArray();

      // Extract distinct project IDs
      const projectIds = [];
      matchingProjectGroups.forEach((group) => {
        if (group.project_ids && Array.isArray(group.project_ids)) {
          group.project_ids.forEach((pId) => {
            if (!projectIds.includes(pId)) {
              projectIds.push(pId);
            }
          });
        }
      });

      console.log('projectIds:', projectIds);

      // Base filter: projects that match the judge's allowed projects
      const filter = { ProjectNumber: { $in: projectIds } };
      // Check for search params and add filtering if provided
      const { searchTerm, searchField } = req.query;
      if (searchTerm && searchField) {
        filter[searchField] = { $regex: searchTerm, $options: 'i' }; // case-insensitive regex match
      }

      // Find projects matching the filter
      const projectsCursor = await collections.project_schemas.find(filter);
      const projects = await projectsCursor.toArray();

      res.json({ projects });
    } catch (error) {
      console.error('Error fetching projects:', error);
      res
        .status(500)
        .json({ error: 'An error occurred while fetching projects' });
    }
  };
};

module.exports = {
  getProjectGrade,
  getProjectsForJudge,
};

