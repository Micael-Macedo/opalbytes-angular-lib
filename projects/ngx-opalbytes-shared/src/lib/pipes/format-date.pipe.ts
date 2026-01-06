import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "formatDate",
  standalone: true,
})
export class FormatDatePipe implements PipeTransform {
  transform(date: Date | string | null | undefined, format = "DD/MM/YYYY"): string {
    if (!date) {
      return "";
    }

    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return "";
    }

    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getFullYear();

    switch (format) {
      case "YYYY-MM-DD":
        return `${year}-${month}-${day}`;
      case "DD/MM/YYYY":
      default:
        return `${day}/${month}/${year}`;
    }
  }
}
