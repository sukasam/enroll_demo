/**
 * Utility function to join classes
 *
 * @param classes Array of classes to append
 * @returns An string with the classes
 */
const clsx = (...classes) => classes.filter(Boolean).join(" ");
export default clsx;
