import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "formatRg",
  standalone: true,
})
export class FormatRgPipe implements PipeTransform {
  transform(rg: string | null | undefined): string {
    if (!rg) {
      return "";
    }

    // Remove todos os caracteres não numéricos
    const numbers = rg.replace(/\D/g, "");

    if (numbers.length === 0) {
      return "";
    }

    // Limita a 10 dígitos (tamanho máximo do RG)
    const rgNumbers = numbers.slice(0, 10);

    // Aplica a máscara de RG: 08.867.470-0 ou 08.867.470-00
    if (rgNumbers.length <= 2) {
      return rgNumbers;
    } else if (rgNumbers.length <= 5) {
      return `${rgNumbers.slice(0, 2)}.${rgNumbers.slice(2)}`;
    } else if (rgNumbers.length <= 8) {
      return `${rgNumbers.slice(0, 2)}.${rgNumbers.slice(2, 5)}.${rgNumbers.slice(5)}`;
    } else if (rgNumbers.length === 9) {
      return `${rgNumbers.slice(0, 2)}.${rgNumbers.slice(2, 5)}.${rgNumbers.slice(5, 8)}-${rgNumbers.slice(8, 9)}`;
    } else {
      return `${rgNumbers.slice(0, 2)}.${rgNumbers.slice(2, 5)}.${rgNumbers.slice(5, 8)}-${rgNumbers.slice(8, 10)}`;
    }
  }
}
