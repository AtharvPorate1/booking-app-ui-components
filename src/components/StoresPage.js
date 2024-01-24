// src/components/StoresPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemText } from '@mui/material';

const StoresPage = ({ storeData }) => {
  return (
    <div>
      <h2>Stores Page</h2>
      <List>
        {storeData.map((store) => (
          <ListItem button key={store.type} component={Link} to={`/${store.type}`}>
            <ListItemText primary={store.name} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default StoresPage;
