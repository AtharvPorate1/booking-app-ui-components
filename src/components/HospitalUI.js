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

const HospitalUI = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  // Temporary data for doctors
  const doctorsData = [
    { id: 1, name: 'Dr. Smith', services: [1, 2] },
    { id: 2, name: 'Dr. Johnson', services: [3, 4] },
    // Add more doctors as needed
  ];

  // Temporary data for services
  const servicesData = [
    { id: 1, name: 'Dental Checkup', duration: 30 },
    { id: 2, name: 'Tooth Extraction', duration: 60 },
    { id: 3, name: 'Eye Exam', duration: 45 },
    { id: 4, name: 'Gynecology Consultation', duration: 60 },
    // Add more services as needed
  ];

  // Function to handle doctor selection
  const handleDoctorSelect = (doctorId) => {
    setSelectedDoctor(doctorsData.find((doctor) => doctor.id === doctorId));
  };

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
    <Container>
      <Typography variant="h4" gutterBottom>
        Doctor Booking
      </Typography>

      {/* Select Doctor */}
      <Typography variant="h6" gutterBottom>
        Select Doctor:
      </Typography>
      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel id="doctor-label">Choose a Doctor</InputLabel>
        <Select
          labelId="doctor-label"
          id="doctor-select"
          value={selectedDoctor ? selectedDoctor.id : ''}
          onChange={(e) => handleDoctorSelect(e.target.value)}
          label="Choose a Doctor"
          sx={{ height: 40 }} // Reduce the size of the selector
        >
          {doctorsData.map((doctor) => (
            <MenuItem key={doctor.id} value={doctor.id}>
              {doctor.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Select Services */}
      <Typography variant="h6" gutterBottom>
        Select Services:
      </Typography>
      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel id="services-label">Select Services</InputLabel>
        <Select
          labelId="services-label"
          id="services-select"
          value={selectedServiceId || ''}
          onChange={handleServiceSelect}
          label="Select Services"
          sx={{ height: 40 }} // Reduce the size of the selector
        >
          {selectedDoctor &&
            servicesData
              .filter((service) => selectedDoctor.services.includes(service.id))
              .map((service) => (
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
      <Typography variant="h6" gutterBottom>
        Selected Services:
      </Typography>
      <Grid container spacing={1}>
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
      <Typography variant="h6" gutterBottom>
        Total Duration: {calculateTotalDuration()} min
      </Typography>

      {/* Select Date */}
      <Typography variant="h6" gutterBottom>
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
          <Typography variant="h6" gutterBottom>
            Available Time Slots on {selectedDate.toLocaleDateString()}:
          </Typography>
          {/* Placeholder for available time slots */}
          <Grid container spacing={2}>
            {/* Display available time slots here */}
          </Grid>
        </div>
      )}

      {/* Book Appointment Button (Placeholder) */}
      <Button variant="contained" color="primary" sx={{ marginTop: 2 }}>
        Book Appointment
      </Button>
    </Container>
  );
};

export default HospitalUI;
