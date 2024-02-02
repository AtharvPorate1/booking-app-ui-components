// src/components/SalonBookingUI.js
import React, { useState,useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  TextField,
  Chip,
  Avatar,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import './SalonBookingUI.css';
import axios from 'axios';
import dayjs from 'dayjs';

// Placeholder data for stylists

const SalonBookingUI = () => {
  const [selectedOption, setSelectedOption] = useState(''); // 'stylist' or 'service'
  const [selectedStylistId, setSelectedStylistId] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [stylists, setStylists] = useState([]);
  const [services, setServices] = useState([]);
  const [isSelectingStylist, setIsSelectingStylist] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stylistsResponse = await axios.get('http://localhost:3001/stylists');
        const servicesResponse = await axios.get('http://localhost:3001/services');

        // Set the fetched data to your state variables
        setStylists(stylistsResponse.data);
        setServices(servicesResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  const servicesData = services;
  const stylistsData = stylists;

  // Function to handle option selection
  const handleOptionSelect = (event, newOption) => {
    if (newOption !== null) {
      setSelectedOption(newOption);
      setSelectedStylistId(null);
      setSelectedServices([]);
      setSelectedDate(null);
      setIsSelectingStylist(false);
    }
  };

  // Function to handle stylist selection
  const handleStylistSelect = (stylistId) => {
    setSelectedStylistId(stylistId);
    setIsSelectingStylist(true); // Set to true to indicate that the user is selecting a stylist
  };

  // Function to handle service selection
  const handleServiceSelect = (serviceId) => {
    const selectedService = servicesData.find((service) => service.id === serviceId);
    if (
      selectedService &&
      !selectedServices.some((service) => service.id === selectedService.id)
    ) {
      setSelectedServices((prevSelectedServices) => [
        ...prevSelectedServices,
        selectedService,
      ]);
    }
  };

  // Function to calculate total duration of selected services
  const calculateTotalDuration = () => {
    return selectedServices.reduce((total, service) => total + service.duration, 0);
  };

  // Function to handle date selection
  const handleDateSelect = (newDate) => {
    setSelectedDate(newDate);
  };

  // Placeholder for checking availability and booking appointment
  const handleBookAppointment = () => {
    if (selectedDate && calculateTotalDuration() > 0 && selectedTimeSlot) {
      try {
        // Get the selected stylist's name
        const selectedStylistName =
          selectedOption === 'stylist' && selectedStylistId !== null
            ? stylistsData.find((stylist) => stylist.id === selectedStylistId).name
            : null;
  
        // Get the names and durations of selected services
        const selectedServiceInfo = selectedServices.map((service) => ({
          name: service.name,
          duration: service.duration,
        }));
  
        // Update booked slots in the state
        const updatedBookedSlots = [
          ...bookedSlots,
          {
            date: selectedDate.format('YYYY-MM-DD'),
            time: selectedTimeSlot.format('HH:mm'),
            duration: calculateTotalDuration(),
            stylist: selectedStylistName,
            services: selectedServiceInfo,
          },
        ];
        setBookedSlots(updatedBookedSlots);
  
        // Update booked slots on the JSON server
        axios.post('http://localhost:3001/store', {
          booked_time_slots: updatedBookedSlots,
        })
          .then(() => {
            console.log(
              `Appointment booked on ${selectedDate.format(
                'YYYY-MM-DD'
              )} at ${selectedTimeSlot.format('HH:mm')}`
            );
            // Optionally, display a success message
            alert('Appointment booked successfully!');
          })
          .catch((error) => {
            console.error('Error updating booked slots:', error);
            // Optionally, display an error message
            alert('Error booking appointment. Please try again.');
          });
      } catch (error) {
        console.error('Error handling time slot selection:', error);
        // Optionally, display an error message
        alert('Error booking appointment. Please try again.');
      }
    } else {
      // Display a message indicating that the date, time slot, or total duration is not valid
      alert('Please select a valid date, time slot, and services before booking.');
    }
  };
  

  const getTimeSlots = (startingTime, closingTime, totalDuration) => {
    const timeSlots = [];
    let currentTime = startingTime.clone();
    
    // Ensure that the current time is before the closing time
    while (currentTime.isBefore(closingTime)) {
      timeSlots.push(currentTime.clone());
      currentTime = currentTime.add(totalDuration, 'minutes');
    }
  
    return timeSlots;
  };

  // Placeholder starting and closing times
  const startingTime = dayjs('09:00 AM', 'h:mm A');
  const closingTime = dayjs('06:00 PM', 'h:mm A');


  const handleTimeSlotSelect = (selectedTime) => {
    // Set the selected time slot only when the user clicks on a time slot button
    setSelectedTimeSlot(selectedTime);
  };
  
  

  return (
    <div className="Container">
      <Typography variant="h3" gutterBottom className='StoreName'>
        Salon Booking
      </Typography>
    <div className="toggle-btn">
      <ToggleButtonGroup
        value={selectedOption}
        exclusive
        onChange={handleOptionSelect}
        aria-label="Select option"
        className="ToggleButtonGroup"
        
      >
        <ToggleButton value="stylist">Select by Stylist</ToggleButton>
        <ToggleButton value="service">Select by Service</ToggleButton>
      </ToggleButtonGroup>
      </div>
      {selectedOption === 'stylist' && !isSelectingStylist && (
        <>
          <Typography variant="h5" gutterBottom>
            Select Stylist:
          </Typography>
          <Grid container spacing={2} className="Grid">
            {stylistsData.map((stylist) => (
              <Grid item key={stylist.id} className="GridItem">
                <Button
                  variant="outlined"
                  onClick={() => handleStylistSelect(stylist.id)}
                  className="custom-button ButtonHoverAnimation"
                >
                  <Avatar alt={stylist.name} src={stylist.photo} />
                  <Typography variant="body2">{stylist.name}</Typography>
                </Button>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {selectedOption === 'stylist' && isSelectingStylist && selectedStylistId !== null && (
        // If the user has selected a stylist, prompt them to select services
        <>
          {/* Display Selected Stylist */}
          <Typography variant="h6" gutterBottom>
            Selected Stylist:
          </Typography>
          <Grid container spacing={1}>
            {stylistsData
              .filter((stylist) => stylist.id === selectedStylistId)
              .map((stylist) => (
                <Grid item key={stylist.id}>
                  <Chip
                    label={stylist.name}
                    onDelete={() => setIsSelectingStylist(false)}
                    color="primary"
                    variant="outlined"
                    sx={{ marginRight: 1 }}
                  />
                </Grid>
              ))}
          </Grid>

          {/* Display Services of Selected Stylist */}
          <Typography variant="h6" gutterBottom>
            Select Services provided by {stylistsData.find((stylist) => stylist.id === selectedStylistId).name}:
          </Typography>
          <Grid container spacing={2}>
            {stylistsData
              .find((stylist) => stylist.id === selectedStylistId)
              .services.map((serviceId) => (
                <Grid item key={serviceId}>
                  <Button
                    variant="outlined"
                    onClick={() => handleServiceSelect(serviceId)}
                  >
                    {servicesData.find((service) => service.id === serviceId).name}
                  </Button>
                </Grid>
              ))}
          </Grid>
        </>
      )}

      {selectedOption === 'service' && (
        // If the user selects to choose by service
        <>
          {/* Select Services */}
          <Typography variant="h6" gutterBottom>
            Select Services:
          </Typography>
          <Grid container spacing={2}>
            {servicesData.map((service) => (
              <Grid item key={service.id}>
                <Button
                  variant="outlined"
                  onClick={() => handleServiceSelect(service.id)}
                >
                  {service.name}
                </Button>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Display Selected Stylist or Services */}
      <Typography variant="h6" gutterBottom className='SelectedServices-Stylist'>
        {isSelectingStylist ? 'Selected Stylist:' : 'Selected Services:'}
      </Typography>
      <Grid container spacing={1}>
        {selectedOption === 'stylist' &&
          stylistsData
            .filter((stylist) => stylist.id === selectedStylistId)
            .map((stylist) =>
              stylist.services.map((serviceId) => {
                const service = servicesData.find((s) => s.id === serviceId);
                const isServiceSelected = selectedServices.some((s) => s.id === service.id);
                return (
                  isServiceSelected && (
                    <Grid item key={service.id}>
                      <Chip
                        label={`${service.name} (${service.duration} min)`}
                        onDelete={() =>
                          setSelectedServices((prevSelectedServices) =>
                            prevSelectedServices.filter((s) => s.id !== service.id)
                          )
                        }
                        color="primary"
                        variant="outlined"
                        sx={{ marginRight: 1 }}
                      />
                    </Grid>
                  )
                );
              })
            )}

        {selectedOption === 'service' &&
          selectedServices.map((service) => (
            <Grid item key={service.id}>
              <Chip
                label={`${service.name} (${service.duration} min)`}
                onDelete={() =>
                  setSelectedServices((prevSelectedServices) =>
                    prevSelectedServices.filter((s) => s.id !== service.id)
                  )
                }
                color="primary"
                variant="outlined"
                sx={{ marginRight: 1 }}
              />
            </Grid>
          ))}
      </Grid>

      {/* Display Total Duration */}
      <Typography variant="h6" gutterBottom>
        Total Duration: {calculateTotalDuration()} min
      </Typography>

      {/* Select Date */}
      <Typography variant="h6" gutterBottom>
        Select Date:
      </Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        
        <DatePicker label="Basic date picker" value={selectedDate} onChange={(newDate) => handleDateSelect(newDate)} />
      </LocalizationProvider>

      {/* Display Available Time Slots (Placeholder) */}
      {selectedDate && (
  <div>
    <Typography variant="h6" gutterBottom>
      Available Time Slots on {selectedDate.format('YYYY-MM-DD')}:
    </Typography>
    {/* Placeholder for available time slots */}
    <Grid container spacing={2}>
      {getTimeSlots(startingTime, closingTime, calculateTotalDuration()).map((timeSlot, index) => (
        <Grid item key={index}>
          <Button variant="outlined" onClick={() => handleTimeSlotSelect(timeSlot)}>
            {timeSlot.format('h:mm A')}
          </Button>
        </Grid>
      ))}
    </Grid>
  </div>
)}

      {/* Book Appointment Button (Placeholder) */}
      <Button
        variant="contained"
        color="primary"
        disabled={!selectedDate || calculateTotalDuration() === 0}
        onClick={handleBookAppointment}
        className="BookAppointmentButton ButtonHoverAnimation"
      >
        Book Appointment
      </Button>
    </div>
  );
};

export default SalonBookingUI;
