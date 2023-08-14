'use strict';

import { SCHEMA_NAME } from '../helpers/config.js'
import init from '../helpers/init.js'
import submitRequest from '../helpers/submit-request.js'

export default async (server, { hdbCore, logger }) => {
  // Get All Projects
  server.route({
    url: '/projects',
    method: 'GET',
    handler: async () => {
      // Ensure schema / tables are initialized
      await init(hdbCore, logger)

      const body = {
        operation: 'sql',
        sql: `SELECT * FROM ${SCHEMA_NAME}.project ORDER BY __createdtime__ ASC`
      }

      return submitRequest(hdbCore, logger, body)
    }
  })

  // Create a Project
  server.route({
    url: '/projects',
    method: 'POST',
    handler: async (request) => {
      // Ensure schema / tables are initialized
      await init(hdbCore, logger)

      if (!request.body.projectName || !request.body.projectId) {
        return {
          success: false,
          message: 'Must supply the following body field: projectId, projectName'
        }
      }

      const body = {
        operation: 'insert',
        schema: SCHEMA_NAME,
        table: 'project',
        records: [
          { id: request.body.projectId, projectId: request.body.projectId, name: request.body.projectName }
        ]
      }

      return submitRequest(hdbCore, logger, body)
    }
  })

  // Project Deletion
  server.route({
    url:  '/projects/:projectId',
    method: 'DELETE',
    handler: async (request) => {
      // Ensure schema / tables are initialized
      await init(hdbCore, logger)

      // Delete the project
      const body = {
        operation: 'delete',
        schema: SCHEMA_NAME,
        table: 'project',
        hash_values: [request.params.projectId]
      }
      const deleteProject = await submitRequest(hdbCore, logger, body)
      if (!deleteProject.success) {
        return deleteProject
      }

      // Delete the project's tasks
      const deleteTasksBody = {
        operation: 'sql',
        sql: `DELETE FROM ${SCHEMA_NAME}.task WHERE projectId = '${request.params.projectId}'`
      }
      // Delete the project's tasks
      const deleteTasks = await submitRequest(hdbCore, logger, deleteTasksBody)
      if (!deleteTasks.success) {
        return deleteTasks
      }

      return { success: true }
    }
  })
}
