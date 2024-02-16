import { format, parseISO } from "date-fns";

const useFormattedDateTime = (
  dateTimeString: string | undefined,
  formatString: string = "MMM do, yyyy, h:mm a"
): string => {
  if (!dateTimeString) {
    return "";
  }

  try {
    const dateTime = parseISO(dateTimeString);
    return format(dateTime, formatString);
  } catch (error) {
    console.error("Invalid date-time string:", error);
    return "";
  }
};

export default useFormattedDateTime;
