// Converts a number like 14.5 into "2:30 PM"
export function formatTime(timeVal: number): string {
    // Separate the whole hours and the fractional minutes
    const hours24 = Math.floor(timeVal);
    const minutes = Math.round((timeVal - hours24) * 60);

    // Determine AM or PM
    const period = hours24 >= 12 && hours24 < 24 ? 'PM' : 'AM';
    
    // Convert 24-hour time to 12-hour time
    const hours12 = hours24 % 12 || 12; // The '|| 12' turns 0 (midnight) into 12

    // Pad the minutes with a leading zero if needed (e.g., '0' becomes '00')
    const minsStr = minutes.toString().padStart(2, '0');

    return `${hours12}:${minsStr} ${period}`;
}