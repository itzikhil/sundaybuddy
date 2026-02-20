/**
 * Day name mappings for OSM format
 */
const dayMap = {
  mo: 1, monday: 1,
  tu: 2, tuesday: 2,
  we: 3, wednesday: 3,
  th: 4, thursday: 4,
  fr: 5, friday: 5,
  sa: 6, saturday: 6,
  su: 0, sunday: 0,
}

/**
 * Check if a day code/range includes today
 */
function isDayIncluded(daySpec, currentDay) {
  const spec = daySpec.toLowerCase().trim()

  // Check for day range like "Mo-Fr" or "Mo-Su"
  const rangeMatch = spec.match(/^([a-z]{2})-([a-z]{2})$/)
  if (rangeMatch) {
    const startDay = dayMap[rangeMatch[1]]
    const endDay = dayMap[rangeMatch[2]]
    if (startDay !== undefined && endDay !== undefined) {
      if (startDay <= endDay) {
        return currentDay >= startDay && currentDay <= endDay
      } else {
        // Wrap around (e.g., Fr-Mo means Fri, Sat, Sun, Mon)
        return currentDay >= startDay || currentDay <= endDay
      }
    }
  }

  // Check for single day like "Su"
  const singleDay = dayMap[spec]
  if (singleDay !== undefined) {
    return currentDay === singleDay
  }

  return null // Can't determine
}

/**
 * Parse time range and check if current time is within it
 */
function isTimeInRange(timeSpec, currentMinutes) {
  const timeMatch = timeSpec.match(/(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/)
  if (!timeMatch) return null

  const [, openHour, openMin, closeHour, closeMin] = timeMatch
  const openMinutes = parseInt(openHour) * 60 + parseInt(openMin)
  let closeMinutes = parseInt(closeHour) * 60 + parseInt(closeMin)

  // Handle "24:00" as end of day
  if (closeMinutes === 24 * 60) {
    closeMinutes = 24 * 60 - 1
  }

  // Handle overnight hours (e.g., "22:00-06:00")
  if (closeMinutes < openMinutes) {
    return currentMinutes >= openMinutes || currentMinutes <= closeMinutes
  }

  return currentMinutes >= openMinutes && currentMinutes <= closeMinutes
}

/**
 * Parses OSM opening_hours format and checks if currently open
 * Handles:
 * - Simple: "08:00-22:00"
 * - With days: "Mo-Fr 09:00-18:00", "Su 10:00-16:00"
 * - Multiple rules: "Mo-Sa 08:00-20:00; Su 10:00-18:00"
 * - 24/7 shops
 * - Explicitly closed: "off", "closed", "Su off"
 */
export function parseHoursString(hoursString) {
  if (!hoursString) return { canParse: false, isCurrentlyOpen: false }

  const normalized = hoursString.toLowerCase().trim()
  const now = new Date()
  const currentDay = now.getDay() // 0 = Sunday
  const currentMinutes = now.getHours() * 60 + now.getMinutes()

  // Check for 24/7
  if (normalized === '24/7' || normalized.includes('24/7')) {
    return { canParse: true, isCurrentlyOpen: true }
  }

  // Check for completely closed
  if (normalized === 'off' || normalized === 'closed') {
    return { canParse: true, isCurrentlyOpen: false }
  }

  // Split by semicolon for multiple rules
  const rules = normalized.split(';').map(r => r.trim())

  for (const rule of rules) {
    // Check if this rule explicitly closes Sunday
    if (rule.match(/^su\s*(off|closed)$/i) || rule.match(/su\s*off/i)) {
      if (currentDay === 0) { // Today is Sunday
        return { canParse: true, isCurrentlyOpen: false }
      }
      continue
    }

    // Check for "off" pattern for other days
    if (rule.includes('off') || rule.includes('closed')) {
      continue
    }

    // Try to match "Day(s) HH:MM-HH:MM" pattern
    const dayTimeMatch = rule.match(/^([a-z]{2}(?:-[a-z]{2})?(?:,\s*[a-z]{2}(?:-[a-z]{2})?)*)\s+(\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2})$/i)
    if (dayTimeMatch) {
      const daySpec = dayTimeMatch[1]
      const timeSpec = dayTimeMatch[2]

      // Check each day specification (could be comma-separated)
      const dayParts = daySpec.split(',').map(d => d.trim())
      for (const dayPart of dayParts) {
        const dayIncluded = isDayIncluded(dayPart, currentDay)
        if (dayIncluded === true) {
          const inTimeRange = isTimeInRange(timeSpec, currentMinutes)
          if (inTimeRange !== null) {
            return { canParse: true, isCurrentlyOpen: inTimeRange }
          }
        }
      }
      continue
    }

    // Try simple time range without day specification (applies to all days)
    const simpleTimeMatch = rule.match(/^(\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2})$/)
    if (simpleTimeMatch) {
      const inTimeRange = isTimeInRange(simpleTimeMatch[1], currentMinutes)
      if (inTimeRange !== null) {
        return { canParse: true, isCurrentlyOpen: inTimeRange }
      }
    }
  }

  // Could not determine from parsing
  return { canParse: false, isCurrentlyOpen: false }
}

/**
 * Determines if a shop is CURRENTLY open based on hours string
 * This is for real-time "Open Now" filtering
 *
 * @param {string} hoursString - The hours string to parse (e.g., "Mo-Su 08:00-22:00")
 * @returns {boolean} - Whether the shop is currently open RIGHT NOW
 */
export function isOpenNow(hoursString) {
  const parsed = parseHoursString(hoursString)
  return parsed.isCurrentlyOpen
}

/**
 * Determines if a shop should display as open (for UI purposes)
 * Falls back to the database flag if parsing fails
 *
 * @param {string} hoursString - The hours string to parse
 * @param {boolean} isOpenFlag - The shop's isOpen flag from database (means "open on Sundays")
 * @returns {boolean} - Whether the shop should display as open
 */
export function isOpen(hoursString, isOpenFlag = true) {
  const parsed = parseHoursString(hoursString)

  // If we can parse the hours string, use that result
  if (parsed.canParse) {
    return parsed.isCurrentlyOpen
  }

  // Otherwise, fall back to the isOpen flag
  // But only if today is Sunday (since this is SundayBuddy)
  const now = new Date()
  if (now.getDay() === 0) { // Sunday
    return isOpenFlag
  }

  // On other days, we can't determine from the flag alone
  return false
}

/**
 * Generate Google Maps directions URL
 */
export function getDirectionsUrl(lat, lng) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
}
