import React from 'react';
import PropTypes from 'prop-types';

import { dbClient } from '../constants';
import { FirebaseClient, HarperDBClient } from '../clients';

const firebase = new FirebaseClient();
const harperDb = new HarperDBClient();

export const Checkbox = ({ id, taskDesc, selectedProject, onArchive }) => {
  const archiveTask = async () => {
    switch (dbClient) {
      case 'firebase':
        await firebase.archiveTask(id);
        break;
      case 'harperdb':
        await harperDb.archiveTask(selectedProject, id);
        break;
      default:
        throw new Error(`Unsupported DB Client: ${dbClient}`);
    }

    onArchive();
  };

  return (
    <div
      className="checkbox-holder"
      data-testid="checkbox-action"
      onClick={() => archiveTask()}
      onKeyDown={(e) => {
        if (e.key === 'Enter') archiveTask();
      }}
      aria-label={`Mark ${taskDesc} as done?`}
      role="button"
      tabIndex={0}
    >
      <span className="checkbox" />
    </div>
  );
};

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  taskDesc: PropTypes.string.isRequired,
};
