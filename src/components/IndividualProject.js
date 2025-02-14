import React, { useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import PropTypes from 'prop-types';

import { useProjectsValue, useSelectedProjectValue } from '../context';
import { dbClient } from '../constants';
import { FirebaseClient, HarperDBClient } from '../clients';

const firebase = new FirebaseClient();
const harperDb = new HarperDBClient();

export const IndividualProject = ({ project }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const { projects, setProjects } = useProjectsValue();
  const { setSelectedProject } = useSelectedProjectValue();

  const deleteProject = async () => {
    switch (dbClient) {
      case 'firebase':
        await firebase.deleteProject(project.id);
        break;
      case 'harperdb':
        await harperDb.deleteProject(project.id);
        break;
      default:
        throw new Error(`Unsupported DB Client: ${dbClient}`);
    }
    setProjects([...projects]);
    setSelectedProject('INBOX');
  };

  return (
    <>
      <span className="sidebar__dot">•</span>
      <span className="sidebar__project-name">{project.name}</span>
      <span
        className="sidebar__project-delete"
        data-testid="delete-project"
        onClick={() => setShowConfirm(!showConfirm)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') setShowConfirm(!showConfirm);
        }}
        tabIndex={0}
        role="button"
        aria-label="Confirm deletion of project"
      >
        <FaTrashAlt />
        {showConfirm && (
          <div className="project-delete-modal">
            <div className="project-delete-modal__inner">
              <p>Are you sure you want to delete this project?</p>
              <span className="project-delete-modal__actions">
                <button type="button" onClick={() => deleteProject()}>
                  Delete
                </button>
                <span
                  onClick={() => setShowConfirm(!showConfirm)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') setShowConfirm(!showConfirm);
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label="Cancel adding project, do not delete"
                >
                  Cancel
                </span>
              </span>
            </div>
          </div>
        )}
      </span>
    </>
  );
};

IndividualProject.propTypes = {
  project: PropTypes.object.isRequired,
};
