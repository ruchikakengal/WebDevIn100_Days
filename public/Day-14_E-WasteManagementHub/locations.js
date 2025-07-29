document.addEventListener('DOMContentLoaded', () => {
    const locationStatus = document.getElementById('locationStatus');
    const locationList = document.getElementById('locationList');
    const findLocationBtn = document.getElementById('findLocationBtn');
    const useCurrentLocationBtn = document.getElementById('useCurrentLocationBtn');
    const addressInput = document.getElementById('addressInput');
    
    // Mock data for e-waste drop-off locations
    const mockLocations = [
      {
        name: "City Recycling Center",
        address: "123 Green Street, Downtown",
        phone: "(555) 123-4567",
        hours: "Mon-Sat: 9AM-5PM",
        distance: 0.8
      },
      {
        name: "EcoTech Solutions",
        address: "456 Sustainability Ave, Midtown",
        phone: "(555) 987-6543",
        hours: "Mon-Fri: 8AM-7PM, Sat: 10AM-4PM",
        distance: 1.2
      },
      {
        name: "GreenDrop E-Waste Facility",
        address: "789 Recycle Road, West End",
        phone: "(555) 456-7890",
        hours: "Tue-Sun: 10AM-6PM",
        distance: 2.5
      },
      {
        name: "Electronics Recyclers International",
        address: "321 Circuit Blvd, East Side",
        phone: "(555) 789-0123",
        hours: "Mon-Sun: 24 hours (drop-off kiosk)",
        distance: 3.7
      },
      {
        name: "Community E-Waste Drive",
        address: "555 Main Street, City Hall",
        phone: "(555) 234-5678",
        hours: "Sat-Sun: 9AM-2PM",
        distance: 4.1
      }
    ];
    
    // Function to display the e-waste locations
    function displayLocations(locations) {
      locationList.innerHTML = '';
      
      if (locations.length === 0) {
        locationList.innerHTML = '<p>No locations found nearby. Please try a different address.</p>';
        return;
      }
      
      // Sort locations by distance
      const sortedLocations = [...locations].sort((a, b) => a.distance - b.distance);
      
      sortedLocations.forEach(location => {
        const locationCard = document.createElement('div');
        locationCard.className = 'location-card';
        locationCard.innerHTML = `
          <h4>${location.name}</h4>
          <p><strong>Address:</strong> ${location.address}</p>
          <p><strong>Phone:</strong> ${location.phone}</p>
          <p><strong>Hours:</strong> ${location.hours}</p>
          <p><strong>Distance:</strong> ${location.distance} miles away</p>
          <button class="directions-btn" data-address="${location.address}">Get Directions</button>
        `;
        locationList.appendChild(locationCard);
      });
      
      // Add event listeners to direction buttons
      document.querySelectorAll('.directions-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const address = btn.getAttribute('data-address');
          // Open Google Maps with the location
          window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
        });
      });
    }
    
    // Find locations based on address input
    findLocationBtn.addEventListener('click', () => {
      const address = addressInput.value.trim();
      
      if (!address) {
        locationStatus.textContent = 'Please enter an address or postal code.';
        locationStatus.className = 'error';
        return;
      }
      
      locationStatus.textContent = `Searching for e-waste drop-off locations near "${address}"...`;
      locationStatus.className = '';
      
      // Simulate location search with a timeout
      setTimeout(() => {
        // In a real implementation, you would call a geocoding API and then search for real locations
        locationStatus.textContent = `Found ${mockLocations.length} e-waste drop-off locations near you.`;
        displayLocations(mockLocations);
      }, 1500);
    });
    
    // Use current location
    useCurrentLocationBtn.addEventListener('click', () => {
      if (navigator.geolocation) {
        locationStatus.textContent = 'Detecting your current location...';
        locationStatus.className = '';
        
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            locationStatus.textContent = `Found your location at ${lat.toFixed(4)}, ${lng.toFixed(4)}. Searching for nearby e-waste drop-off points...`;
            
            // Simulate location search with a timeout
            setTimeout(() => {
              // In a real implementation, you would search for real locations near these coordinates
              locationStatus.textContent = `Found ${mockLocations.length} e-waste drop-off locations near you.`;
              displayLocations(mockLocations);
            }, 1500);
          },
          (error) => {
            console.error('Error getting location:', error);
            switch(error.code) {
              case error.PERMISSION_DENIED:
                locationStatus.textContent = 'Location access denied. Please enter your address manually or enable location services.';
                break;
              case error.POSITION_UNAVAILABLE:
                locationStatus.textContent = 'Location information unavailable. Please enter your address manually.';
                break;
              case error.TIMEOUT:
                locationStatus.textContent = 'Location request timed out. Please enter your address manually.';
                break;
              default:
                locationStatus.textContent = 'An unknown error occurred while getting location. Please enter your address manually.';
            }
            locationStatus.className = 'error';
          }
        );
      } else {
        locationStatus.textContent = 'Geolocation is not supported by your browser. Please enter your address manually.';
        locationStatus.className = 'error';
      }
    });
  });
  