export async function POST(req) {
  try {
    const { userLat, userLon, issueLat, issueLon } = await req.json();

    if (!userLat || !userLon || !issueLat || !issueLon) {
      return new Response(
        JSON.stringify({ message: "Invalid location data" }),
        { status: 400 }
      );
    }

    const distance = getDistance(userLat, userLon, issueLat, issueLon);
    const allowedRadius = 1000; 

    return new Response(
      JSON.stringify({ eligible: distance <= allowedRadius })
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Error processing request" }),
      { status: 500 }
    );
  }
}

// Haversine formula to calculate distance between two locations
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}
