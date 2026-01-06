import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "formatCep",
  standalone: true,
})
export class FormatCepPipe implements PipeTransform {
  transform(cep: string | null | undefined): string {
    if (!cep) {
      return "";
    }

    // Remove todos os caracteres não numéricos
    const numbers = cep.replace(/\D/g, "");

    if (numbers.length === 0) {
      return "";
    }

    // CEP brasileiro: 00000-000 (8 dígitos)
    // Formato solicitado: 00.000-000

    if (numbers.length <= 2) {
      // Apenas os primeiros 2 dígitos
      return numbers;
    } else if (numbers.length <= 5) {
      // 00.000
      return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
    } else {
      // 00.000-000 (limita a 8 dígitos)
      const cepNumbers = numbers.slice(0, 8);
      return `${cepNumbers.slice(0, 2)}.${cepNumbers.slice(2, 5)}-${cepNumbers.slice(5, 8)}`;
    }
  }
}
