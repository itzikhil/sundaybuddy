/**
 * Parses various hour string formats and checks if current time is within range
 * Handles:
 * - Simple: "08:00 - 22:00"
 * - OSM format: "Mo-Su 08:00-22:00", "Mo-Fr 09:00-18:00; Sa 10:00-14:00"
 * - 24/7 shops
 * - "off" or "closed" indicators
 */
export function parseHoursString(hoursString) {
  if (!hoursString) return { canParse: false }

  const normalized = hoursString.toLowerCase().trim()

  // Check for 24/7
  if (normalized === '24/7' || normalized.includes('24/7')) {
    return { canParse: true, isCurrentlyOpen: true }
  }

  // Check for explicitly closed
  if (normalized === 'off' || normalized === 'closed' || normalized.includes('su off')) {
    return { canParse: true, isCurrentlyOpen: false }
  }

  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  // Try to find time range pattern: HH:MM-HH:MM or HH:MM - HH:MM
  const timeMatch = hoursString.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/)
  if (timeMatch) {
    const [, openHour, openMin, closeHour, closeMin] = timeMatch
    const openMinutes = parseInt(openHour) * 60 + parseInt(openMin)
    let closeMinutes = parseInt(closeHour) * 60 + parseInt(closeMin)

    // Handle "24:00" as end of day
    if (closeMinutes === 24 * 60) {
      closeMinutes = 24 * 60 - 1
    }

    // Handle overnight hours (e.g., "22:00 - 06:00")
    if (closeMinutes < openMinutes) {
      return {
        canParse: true,
        isCurrentlyOpen: currentMinutes >= openMinutes || currentMinutes <= closeMinutes,
      }
    }

    return {
      canParse: true,
      isCurrentlyOpen: currentMinutes >= openMinutes && currentMinutes <= closeMinutes,
    }
  }

  // Could not parse
  return { canParse: false }
}

/**
 * Determines if a shop is open, with fallback to isOpen flag
 * @param {string} hoursString - The hours string to parse
 * @param {boolean} isOpenFlag - The shop's isOpen flag from database
 * @returns {boolean} - Whether the shop should display as open
 */
export function isOpen(hoursString, isOpenFlag = true) {
  const parsed = parseHoursString(hoursString)

  // If we can parse the hours string, use that result
  if (parsed.canParse) {
    return parsed.isCurrentlyOpen
  }

  // Otherwise, fall back to the isOpen flag (default true for Sunday shops)
  return isOpenFlag
}

/**
 * Generate Google Maps directions URL
 */
export function getDirectionsUrl(lat, lng) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
}
