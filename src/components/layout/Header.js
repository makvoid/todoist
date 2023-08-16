import React, { useState } from 'react';
import { FaPizzaSlice } from 'react-icons/fa';
import PropTypes from 'prop-types';

import { AddTask } from '../AddTask';
import { useProjectsValue, useSelectedProjectValue } from '../../context';

export const Header = ({ darkMode, setDarkMode }) => {
  const [shouldShowMain, setShouldShowMain] = useState(false);
  const [showQuickAddTask, setShowQuickAddTask] = useState(false);

  const { projects, setProjects } = useProjectsValue();
  const { selectedProject } = useSelectedProjectValue();

  const onAdd = (task, project) => {
    if (project === selectedProject) {
      setProjects([...projects, task]);
    }
  };

  return (
    <header className="header" data-testid="header">
      <nav>
        <div className="logo">
          <img src="https://i.imgur.com/u2S56rB.png" alt="Todoist" />
        </div>
        <div className="settings">
          <ul>
            <li className="settings__add">
              <button
                data-testid="quick-add-task-action"
                aria-label="Quick add task"
                type="button"
                onClick={() => {
                  setShowQuickAddTask(true);
                  setShouldShowMain(true);
                }}
              >
                +
              </button>
            </li>
            <li className="settings__darkmode">
              <button
                data-testid="dark-mode-action"
                aria-label="Darkmode on/off"
                type="button"
                onClick={() => setDarkMode(!darkMode)}
              >
                <FaPizzaSlice />
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <AddTask
        onAdd={onAdd}
        showAddTaskMain={false}
        shouldShowMain={shouldShowMain}
        showQuickAddTask={showQuickAddTask}
        setShowQuickAddTask={setShowQuickAddTask}
      />
    </header>
  );
};

Header.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  setDarkMode: PropTypes.func.isRequired,
};
