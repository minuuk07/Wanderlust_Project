mapboxgl.accessToken = mapToken;


const coordinates = listing.geometry.coordinates; 


const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: coordinates,
  zoom: 9
});


console.log("Coordinates:", coordinates);
console.log("Location:", listing.location);


const popup = new mapboxgl.Popup({ offset: 25 })
  .setHTML(`
    <h4>${listing.location}</h4>
    <p>Exact location provided after booking.</p>
  `);


new mapboxgl.Marker({ color: 'red' })
  .setLngLat(coordinates)
  .setPopup(popup)
  .addTo(map);
