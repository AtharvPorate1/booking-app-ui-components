// src/components/ArcadeBookingUI.js
import React, { useState } from 'react';
import {
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Chip,
} from '@mui/material';

// Placeholder data for arcades
const arcadesData = [
  { id: 1, name: 'Fun Arcade', snookerTables: [1, 2] },
  // Add more arcades as needed
];

// Placeholder data for snooker tables
const snookerTablesData = [
  { id: 1, arcadeId: 1, tableNumber: 101, isAvailable: true },
  { id: 2, arcadeId: 1, tableNumber: 102, isAvailable: true },
  // Add more snooker tables as needed
];

const ArcadeBookingUI = () => {
  const [selectedArcade, setSelectedArcade] = useState(null);
  const [selectedSnookerTable, setSelectedSnookerTable] = useState(null);

  // Function to handle arcade selection
  const handleArcadeSelect = (arcadeId) => {
    setSelectedArcade(arcadesData.find((arcade) => arcade.id === arcadeId));
  };

  // Function to handle snooker table selection
  const handleSnookerTableSelect = (tableId) => {
    setSelectedSnookerTable(snookerTablesData.find((table) => table.id === tableId));
  };

  // Placeholder function for booking arcade and snooker table
  const handleBookArcade = () => {
    // Add logic to check availability and book arcade and snooker table
    // You may need to implement backend logic for this
    console.log('Booking arcade and snooker table...');
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Arcade Booking
      </Typography>

      {/* Display Arcades */}
      <Typography variant="h6" gutterBottom>
        Select Arcade:
      </Typography>
      <Grid container spacing={2}>
        {arcadesData.map((arcade) => (
          <Grid item key={arcade.id}>
            <Button
              variant="outlined"
              onClick={() => handleArcadeSelect(arcade.id)}
              sx={{ width: '120px', textAlign: 'center' }}
            >
              <Typography>{arcade.name}</Typography>
            </Button>
          </Grid>
        ))}
      </Grid>

      {/* Display Snooker Tables of Selected Arcade */}
      {selectedArcade && (
        <>
          <Typography variant="h6" gutterBottom>
            Snooker Tables at {selectedArcade.name}:
          </Typography>
          <Grid container spacing={2}>
            {snookerTablesData
              .filter((table) => table.arcadeId === selectedArcade.id)
              .map((table) => (
                <Grid item key={table.id}>
                  <Button
                    variant="outlined"
                    onClick={() => handleSnookerTableSelect(table.id)}
                  >
                    {`Table ${table.tableNumber} (${table.isAvailable ? 'Available' : 'Booked'})`}
                  </Button>
                </Grid>
              ))}
          </Grid>
        </>
      )}

      {/* Display Selected Arcade and Snooker Table */}
      <Typography variant="h6" gutterBottom>
        Selected {selectedArcade ? 'Arcade' : 'Snooker Table'}:
      </Typography>
      <Grid container spacing={1}>
        {selectedArcade && (
          <Grid item key={selectedArcade.id}>
            <Chip
              label={selectedArcade.name}
              onDelete={() => setSelectedArcade(null)}
              color="primary"
              variant="outlined"
              sx={{ marginRight: 1 }}
            />
          </Grid>
        )}

        {selectedSnookerTable && (
          <Grid item key={selectedSnookerTable.id}>
            <Chip
              label={`Snooker Table ${selectedSnookerTable.tableNumber} (${selectedSnookerTable.isAvailable ? 'Available' : 'Booked'})`}
              onDelete={() => setSelectedSnookerTable(null)}
              color="primary"
              variant="outlined"
              sx={{ marginRight: 1 }}
            />
          </Grid>
        )}
      </Grid>

      {/* Book Arcade Button (Placeholder) */}
      <Button
        variant="contained"
        color="primary"
        disabled={!selectedArcade || !selectedSnookerTable}
        onClick={handleBookArcade}
        sx={{ marginTop: 2 }}
      >
        Book Arcade
      </Button>
    </Container>
  );
};

export default ArcadeBookingUI;
