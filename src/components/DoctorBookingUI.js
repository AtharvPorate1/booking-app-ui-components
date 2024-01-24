// src/components/DoctorBookingUI.js
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
  TextField,
  Chip,
} from '@mui/material';
import { DateRangePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

import './DoctorBookingUI.css'; // Import the CSS file for styling

const DoctorBookingUI = () => {
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  // Temporary services data for a dentist
  const servicesData = [
    { id: 1, name: 'Dental Checkup', duration: 30 },
    { id: 2, name: 'Tooth Extraction', duration: 60 },
    // Add more services as needed
  ];

  // Function to handle service selection
  const handleServiceSelect = (event) => {
    const newSelectedServiceId = event.target.value;
    setSelectedServiceId(newSelectedServiceId);
  };

  // Function to add the selected service to the list
  const handleAddService = () => {
    const selectedService = servicesData.find((service) => service.id === selectedServiceId);

    if (selectedService && !selectedServices.some((service) => service.id === selectedService.id)) {
      setSelectedServices((prevSelectedServices) => [...prevSelectedServices, selectedService]);
      setSelectedServiceId(null); // Reset the selected service
    }
  };

  // Function to remove a selected service
  const handleServiceRemove = (serviceId) => {
    setSelectedServices((prevSelectedServices) =>
      prevSelectedServices.filter((service) => service.id !== serviceId)
    );
  };

  // Function to calculate total duration of selected services
  const calculateTotalDuration = () => {
    return selectedServices.reduce((total, service) => total + service.duration, 0);
  };

  return (
    <Container className="booking-container">
      <Typography variant="h4" className="booking-heading" gutterBottom>
        Doctor Booking - Dentist
      </Typography>

      <div className="dentist-info">
        <Typography variant="body2" className="dentist-description">
          Welcome to our dental clinic! Our experienced dentist is here to provide you with quality
          dental care.
        </Typography>
      </div>

      {/* Select Services */}
      <FormControl fullWidth className="select-services" sx={{ marginBottom: 2 }}>
        <InputLabel id="services-label">Select Services</InputLabel>
        <Select
          labelId="services-label"
          id="services-select"
          value={selectedServiceId || ''}
          onChange={handleServiceSelect}
          label="Select Services"
          sx={{ height: 40 }} // Reduce the size of the selector
        >
          {servicesData.map((service) => (
            <MenuItem key={service.id} value={service.id}>
              {service.name} ({service.duration} min)
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Add Selected Service Button */}
      <Button
        variant="contained"
        color="primary"
        disabled={!selectedServiceId}
        onClick={handleAddService}
        sx={{ marginBottom: 2 }}
      >
        Add Service
      </Button>

      {/* Display Selected Services and Total Duration */}
      <Typography variant="h6" className="selected-services-heading">
        Selected Services:
      </Typography>
      <Grid container spacing={1} className="selected-services-container">
        {selectedServices.map((service) => (
          <Grid item key={service.id}>
            <Chip
              label={`${service.name} (${service.duration} min)`}
              onDelete={() => handleServiceRemove(service.id)}
              color="primary"
              variant="outlined"
              sx={{ marginRight: 1 }}
            />
          </Grid>
        ))}
      </Grid>
      <Typography variant="h6" gutterBottom className="total-duration">
        Total Duration: {calculateTotalDuration()} min
      </Typography>

      {/* Select Date */}
      <Typography variant="h6" className="select-date-heading">
        Select Date:
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateRangePicker
          startText="Start Date"
          endText="End Date"
          value={selectedDate}
          onChange={(newDate) => setSelectedDate(newDate)}
          renderInput={(startProps, endProps) => (
            <>
              <TextField {...startProps} fullWidth margin="normal" helperText="" />
              <TextField {...endProps} fullWidth margin="normal" helperText="" />
            </>
          )}
        />
      </LocalizationProvider>

      {/* Display Available Time Slots (Placeholder) */}
      {selectedDate && (
        <div>
          <Typography variant="h6" className="available-slots-heading">
            Available Time Slots on {selectedDate.toLocaleDateString()}:
          </Typography>
          {/* Placeholder for available time slots */}
          <Grid container spacing={2} className="available-slots-container">
            {/* Display available time slots here */}
          </Grid>
        </div>
      )}

      {/* Book Appointment Button (Placeholder) */}
      <Button variant="contained" color="primary" sx={{ marginTop: 2 }} className="book-appointment-btn">
        Book Appointment
      </Button>
    </Container>
  );
};

export default DoctorBookingUI;
