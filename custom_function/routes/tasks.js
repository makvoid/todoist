'use strict';

import { SCHEMA_NAME } from '../helpers/config.js'
import init from '../helpers/init.js'
import submitRequest from '../helpers/submit-request.js'

export default async (server, { hdbCore, logger }) => {
  // Get Project Tasks
  server.route({
    url: '/projects/:projectId',
    method: 'GET',
    handler: async (request) => {
      // Ensure schema / tables are initialized
      await init(hdbCore, logger)

      const body = {
        operation: 'search_by_value',
        schema: SCHEMA_NAME,
        table: 'task',
        search_attribute: 'projectId',
        search_value: request.params.projectId,
        get_attributes: ['*']
      }

      return submitRequest(hdbCore, logger, body)
    }
  })

  // Add a Task to a Project
  server.route({
    url: '/projects/:projectId',
    method: 'POST',
    handler: async (request) => {
      // Ensure all fields are present
      if (!request.body.task) {
        return {
          success: false,
          message: 'Must supply the following body field: task'
        }
      }

      // Ensure schema / tables are initialized
      await init(hdbCore, logger)

      const body = {
        operation: 'insert',
        schema: SCHEMA_NAME,
        table: 'task',
        records: [
          {
            id: request.body.id,
            projectId: request.params.projectId,
            task: request.body.task,
            date: request.body.date,
            archived: false,
            userId: request.body.userId
          }
        ]
      }

      return submitRequest(hdbCore, logger, body)
    }
  })

  // Archive / Delete a Task from a Project
  server.route({
    url: '/projects/:projectId/:taskId',
    method: 'DELETE',
    handler: async (request) => {
      // Ensure schema / tables are initialized
      await init(hdbCore, logger)

      const body = {
        operation: 'delete',
        schema: SCHEMA_NAME,
        table: 'task',
        hash_values: [request.params.taskId]
      }

      return submitRequest(hdbCore, logger, body)
    }
  })
}
