/* eslint-disable no-nested-ternary */
import moment from 'moment';

import { firebase } from '../firebase';
import { collatedTasksExist } from '../helpers';
import { userId } from '../constants';

class FirebaseClient {
  config = null;

  constructor(config) {
    this.config = config;
  }

  async getProjects() {
    return new Promise((resolve) => {
      let unsubscribe = firebase
        .firestore()
        .collection('projects')
        .where('userId', '==', userId)
        .orderBy('projectId');

      unsubscribe = unsubscribe.onSnapshot((snapshot) => {
        const newProjects = snapshot.docs.map((project) => ({
          id: project.id,
          ...project.data(),
        }));

        unsubscribe();
        resolve(newProjects);
      });
    });
  }

  addProject(payload) {
    return firebase.firestore().collection('projects').add(payload);
  }

  deleteProject(docId) {
    return firebase.firestore().collection('projects').doc(docId).delete();
  }

  async getTasks(selectedProject) {
    return new Promise((resolve) => {
      let unsubscribe = firebase
        .firestore()
        .collection('tasks')
        .where('userId', '==', userId);

      unsubscribe =
        selectedProject && !collatedTasksExist(selectedProject)
          ? (unsubscribe = unsubscribe.where(
              'projectId',
              '==',
              selectedProject
            ))
          : selectedProject === 'TODAY'
          ? (unsubscribe = unsubscribe.where(
              'date',
              '==',
              moment().format('DD/MM/YYYY')
            ))
          : selectedProject === 'INBOX' || selectedProject === 0
          ? (unsubscribe = unsubscribe.where('date', '==', ''))
          : unsubscribe;

      unsubscribe = unsubscribe.onSnapshot((snapshot) => {
        const newTasks = snapshot.docs.map((task) => ({
          id: task.id,
          ...task.data(),
        }));

        unsubscribe();
        resolve(newTasks);
      });
    });
  }

  addTask(payload) {
    return firebase.firestore().collection('tasks').add(payload);
  }

  archiveTask(id) {
    return firebase.firestore().collection('tasks').doc(id).update({
      archived: true,
    });
  }
}

export default FirebaseClient;
