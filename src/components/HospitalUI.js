import React, { useState, useEffect } from 'react';
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
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import axios from 'axios';
import dayjs from 'dayjs';

const HospitalUI = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [doctorsData, setDoctorsData] = useState([]);
  const [servicesData, setServicesData] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [consultationTime, setConsultationTime] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hospitalResponse = await axios.get('http://localhost:3002/doctors');
        const servicesResponse = await axios.get('http://localhost:3002/specializations');

        setDoctorsData(hospitalResponse.data);
        setServicesData(servicesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleDoctorSelect = (doctorId) => {
    const selectedDoctor = doctorsData.find((doctor) => doctor.id === doctorId);
    setSelectedDoctor(selectedDoctor);
    setConsultationTime(selectedDoctor.specializations[0]?.consultancyTime || 0);
  };

  const handleServiceSelect = (event) => {
    const newSelectedServiceId = event.target.value;
    setSelectedServiceId(newSelectedServiceId);
  };

  const handleAddService = () => {
    const selectedService = servicesData.find((service) => service.id === selectedServiceId);
  
    if (selectedService && !selectedServices.some((service) => service.id === selectedService.id)) {
      setSelectedServices((prevSelectedServices) => [
        ...prevSelectedServices,
        {
          id: selectedService.id,
          name: selectedService.name,
          consultancyTime: selectedDoctor.specializations.find(spec => spec.id === selectedService.id)?.consultancyTime || 0,
        },
      ]);
      setSelectedServiceId(null);
    }
  };

  const handleServiceRemove = (serviceId) => {
    setSelectedServices((prevSelectedServices) =>
      prevSelectedServices.filter((service) => service.id !== serviceId)
    );
  };

  const calculateTotalDuration = () => {
    return selectedServices.reduce((total, service) => total + service.consultancyTime, 0);
  };

  const getTimeSlots = (consultancyTime) => {
    const timeSlots = [];
    let currentTime = dayjs('09:00 AM', 'h:mm A');

    while (currentTime.isBefore(dayjs('06:00 PM', 'h:mm A'))) {
      timeSlots.push(currentTime.clone());
      currentTime = currentTime.add(consultancyTime, 'minutes');
    }

    return timeSlots;
  };

  const handleTimeSlotSelect = (selectedTime) => {
    setSelectedTimeSlot(selectedTime);
  };

  const handleBookAppointment = () => {
    if (selectedDate && calculateTotalDuration() > 0 && selectedTimeSlot) {
      try {
        const updatedBookedSlots = [
          ...bookedSlots,
          {
            date: selectedDate.format('YYYY-MM-DD'),
            time: selectedTimeSlot.format('HH:mm'),
            duration: calculateTotalDuration(),
            doctor: selectedDoctor.name,
            services: selectedServices.map((service) => ({
              name: service.name,
              duration: service.consultancyTime,
            })),
          },
        ];
        setBookedSlots(updatedBookedSlots);

        axios.post('http://localhost:3002/bookings', {
          booked_time_slots: updatedBookedSlots,
        })
          .then(() => {
            console.log(
              `Appointment booked on ${selectedDate.format('YYYY-MM-DD')} at ${selectedTimeSlot.format('HH:mm')}`
            );
            alert('Appointment booked successfully!');
          })
          .catch((error) => {
            console.error('Error updating booked slots:', error);
            alert('Error booking appointment. Please try again.');
          });
      } catch (error) {
        console.error('Error handling time slot selection:', error);
        alert('Error booking appointment. Please try again.');
      }
    } else {
      alert('Please select a valid date, time slot, and services before booking.');
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Doctor Booking
      </Typography>

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
          sx={{ height: 40 }}
        >
          {doctorsData && doctorsData.map((doctor) => (
            <MenuItem key={doctor.id} value={doctor.id}>
              {doctor.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

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
          sx={{ height: 40 }}
        >
          {selectedDoctor &&
            servicesData &&
            selectedDoctor.specializations.map((spec) => (
              <MenuItem key={spec.id} value={spec.id}>
                {`${spec.name} (${spec.consultancyTime} min)`}
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      <Button
        variant="contained"
        color="primary"
        disabled={!selectedServiceId}
        onClick={handleAddService}
        sx={{ marginBottom: 2 }}
      >
        Add Service
      </Button>

      <Typography variant="h6" gutterBottom>
        Selected Services:
      </Typography>
      <Grid container spacing={1}>
        {selectedServices.map((service) => (
          <Grid item key={service.id}>
            <Chip
              label={`${service.name} (${service.consultancyTime} min)`}
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

      <Typography variant="h6" gutterBottom>
        Select Date:
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
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

      {selectedDate && selectedDoctor && (
        <div>
          <Typography variant="h6" gutterBottom>
            Available Time Slots on {selectedDate.format('YYYY-MM-DD')}:
          </Typography>
          <Grid container spacing={2}>
            {getTimeSlots(consultationTime).map((timeSlot, index) => (
              <Grid item key={index}>
                <Button variant="outlined" onClick={() => handleTimeSlotSelect(timeSlot)}>
                  {timeSlot.format('h:mm A')}
                </Button>
              </Grid>
            ))}
          </Grid>
        </div>
      )}

      <Button
        variant="contained"
        color="primary"
        disabled={!selectedDate || calculateTotalDuration() === 0}
        onClick={handleBookAppointment}
        sx={{ marginTop: 2 }}
      >
        Book Appointment
      </Button>
    </Container>
  );
};

export default HospitalUI;
