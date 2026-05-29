/**
 * Converts a number (e.g., 14.5) into a human-readable time string (e.g., "2:30 PM").
 * @param timeVal - The numeric value representing the hour of the day.
 */
export function formatTime(timeVal: number): string {
    // 1. Separate the whole hours and the fractional minutes
    const hours24 = Math.floor(timeVal);
    const minutes = Math.round((timeVal - hours24) * 60);

    // 2. Determine AM or PM
    const period = hours24 >= 12 && hours24 < 24 ? 'PM' : 'AM';
    
    // 3. Convert 24-hour time to 12-hour time
    // Using % 12 handles 13:00 -> 1:00, and || 12 handles 0:00 -> 12:00
    const hours12 = hours24 % 12 || 12;

    // 4. Pad the minutes with a leading zero if needed (e.g., 5 -> "05")
    const minsStr = minutes.toString().padStart(2, '0');

    return `${hours12}:${minsStr} ${period}`;
}