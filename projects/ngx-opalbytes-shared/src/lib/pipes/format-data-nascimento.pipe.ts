import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "formatDataNascimento",
  standalone: true,
})
export class FormatDataNascimentoPipe implements PipeTransform {
  transform(date: Date | string | null | undefined): string {
    if (!date) {
      return "";
    }

    // Se for string, pode estar no formato "dd-mm-yyyy" ou ISO
    let dateObj: Date;

    if (typeof date === "string") {
      // Verifica se está no formato "dd-mm-yyyy" ou "dd/mm/yyyy"
      const dateMatch = date.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
      if (dateMatch) {
        // Converte "dd-mm-yyyy" para Date (mês é 0-indexed)
        dateObj = new Date(
          parseInt(dateMatch[3]),
          parseInt(dateMatch[2]) - 1,
          parseInt(dateMatch[1])
        );
      } else {
        // Tenta parsear como ISO ou formato padrão
        dateObj = new Date(date);
      }
    } else {
      dateObj = date;
    }

    // Verifica se a data é válida
    if (isNaN(dateObj.getTime())) {
      return "";
    }

    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getFullYear();

    return `${day}/${month}/${year}`;
  }
}
