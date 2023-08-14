import fetch from 'node-fetch';

import { harperDBConfig } from '../harperdb';

class HarperDBClient {
  config = null;

  constructor(config) {
    this.config = config;
  }

  getProjects() {
    return this.submitRequest('projects', 'GET');
  }

  addProject(payload) {
    return this.submitRequest('projects', 'POST', payload);
  }

  deleteProject(projectId) {
    return this.submitRequest(`projects/${projectId}`, 'DELETE');
  }

  getTasks(projectId) {
    return this.submitRequest(`projects/${projectId}`, 'GET');
  }

  addTask(projectId, payload) {
    return this.submitRequest(`projects/${projectId}`, 'POST', payload);
  }

  archiveTask(projectId, taskId) {
    return this.submitRequest(`projects/${projectId}/${taskId}`, 'DELETE');
  }

  async submitRequest(endpoint, method, payload = undefined) {
    try {
      const response = await fetch(
        `${harperDBConfig.hostname}/${harperDBConfig.project}/${endpoint}`,
        {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: payload !== undefined ? JSON.stringify(payload) : undefined,
        }
      );
      return await response.json();
    } catch (e) {
      throw new Error(e);
    }
  }
}

export default HarperDBClient;
