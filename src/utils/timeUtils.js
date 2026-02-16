/**
 * Parses hours string like "08:00 - 22:00" and checks if current time is within range
 * Handles special case "00:00 - 24:00" for 24-hour shops
 */
export function isOpen(hoursString) {
  if (!hoursString) return false

  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  // Parse "HH:MM - HH:MM" format
  const match = hoursString.match(/(\d{2}):(\d{2})\s*-\s*(\d{2}):(\d{2})/)
  if (!match) return false

  const [, openHour, openMin, closeHour, closeMin] = match
  const openMinutes = parseInt(openHour) * 60 + parseInt(openMin)
  let closeMinutes = parseInt(closeHour) * 60 + parseInt(closeMin)

  // Handle "24:00" as end of day
  if (closeMinutes === 24 * 60) {
    closeMinutes = 24 * 60 - 1
  }

  // Handle overnight hours (e.g., "22:00 - 06:00")
  if (closeMinutes < openMinutes) {
    return currentMinutes >= openMinutes || currentMinutes <= closeMinutes
  }

  return currentMinutes >= openMinutes && currentMinutes <= closeMinutes
}

/**
 * Generate Google Maps directions URL
 */
export function getDirectionsUrl(lat, lng) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
}
