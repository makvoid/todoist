import { SCHEMA_NAME, VERBOSE_LOGGING } from './config.js'

const tables = ['project', 'task']
const attributes = {
  project: ['projectId', 'name', 'userId'],
  task: ['archived', 'projectId', 'name', 'date', 'userId']
}

export default async (hdbCore, logger) => {
  // Create the schema
  try {
    await hdbCore.requestWithoutAuthentication({
      body: {
        operation: 'create_schema',
        schema: SCHEMA_NAME
      }
    })
  } catch (_) {
    if (VERBOSE_LOGGING) logger.notify(`Schema ${SCHEMA_NAME} exists already.`)
  }

  // Create the tables required
  for (const table of tables) {
    try {
      await hdbCore.requestWithoutAuthentication({
        body: {
          operation: 'create_table',
          schema: SCHEMA_NAME,
          table,
          hash_attribute: 'id'
        }
      })
    } catch (_) {
      if (VERBOSE_LOGGING) logger.notify(`Table ${SCHEMA_NAME}.${table} exists already.`)
    }

    // Create the attributes required for the table
    for (const attribute of attributes[table]) {
      try {
        await hdbCore.requestWithoutAuthentication({
          body: {
            operation: 'create_attribute',
            schema: SCHEMA_NAME,
            table,
            attribute
          }
        })
      } catch (_) {
        if (VERBOSE_LOGGING) logger.notify(`Table ${SCHEMA_NAME}.${table}.${attribute} exists already.`)
      }
    }
  }
}