/* eslint-disable no-nested-ternary */
import { useState, useEffect } from 'react';
import moment from 'moment';

import { dbClient } from '../constants';
import HarperDBClient from '../clients/harperdb';
import FirebaseClient from '../clients/firebase';

const firebase = new FirebaseClient();
const harperDb = new HarperDBClient();

export const useTasks = (selectedProject) => {
  const [tasks, setTasks] = useState([]);
  const [archivedTasks, setArchivedTasks] = useState([]);

  const getTasks = async () => {
    let newTasks = [];
    switch (dbClient) {
      case 'firebase':
        newTasks = await firebase.getTasks(selectedProject);
        break;
      case 'harperdb':
        newTasks = await harperDb.getTasks(selectedProject);
        break;
      default:
        throw new Error(`Unsupported DB Client: ${dbClient}`);
    }

    setTasks(
      selectedProject === 'NEXT_7'
        ? newTasks.filter(
            (task) =>
              moment(task.date, 'DD-MM-YYYY').diff(moment(), 'days') <= 7 &&
              task.archived !== true
          )
        : newTasks.filter((task) => task.archived !== true)
    );
    setArchivedTasks(newTasks.filter((task) => task.archived !== false));
  };

  useEffect(() => {
    getTasks();
  }, [selectedProject]);

  return { tasks, archivedTasks, setTasks };
};

export const useProjects = () => {
  const [projects, setProjects] = useState([]);

  const getProjects = async () => {
    let allProjects;
    switch (dbClient) {
      case 'firebase':
        allProjects = await firebase.getProjects();
        break;
      case 'harperdb':
        allProjects = await harperDb.getProjects();
        break;
      default:
        throw new Error(`Unsupported DB Client: ${dbClient}`);
    }
    if (JSON.stringify(allProjects) !== JSON.stringify(projects)) {
      setProjects(allProjects);
    }
  };

  useEffect(() => {
    getProjects();
  }, [projects]);

  return { projects, setProjects };
};
