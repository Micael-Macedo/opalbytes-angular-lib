import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "formatCpfCnpj",
  standalone: true,
})
export class FormatCpfCnpjPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) {
      return "";
    }

    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, "");

    if (numbers.length === 0) {
      return "";
    }

    // Se tiver 11 dígitos, formata como CPF (000.000.000-00)
    if (numbers.length === 11) {
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
    }

    // Se tiver 14 dígitos, formata como CNPJ (00.000.000/0000-00)
    if (numbers.length === 14) {
      return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`;
    }

    // Se tiver menos de 11 dígitos, aplica máscara parcial de CPF
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    } else if (numbers.length <= 9) {
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    } else if (numbers.length <= 11) {
      const cpfNumbers = numbers.slice(0, 11);
      return `${cpfNumbers.slice(0, 3)}.${cpfNumbers.slice(3, 6)}.${cpfNumbers.slice(6, 9)}-${cpfNumbers.slice(9, 11)}`;
    }

    // Se tiver entre 12 e 13 dígitos, aplica máscara parcial de CNPJ
    if (numbers.length <= 12) {
      return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}`;
    } else if (numbers.length <= 14) {
      const cnpjNumbers = numbers.slice(0, 14);
      return `${cnpjNumbers.slice(0, 2)}.${cnpjNumbers.slice(2, 5)}.${cnpjNumbers.slice(5, 8)}/${cnpjNumbers.slice(8, 12)}-${cnpjNumbers.slice(12, 14)}`;
    }

    // Se tiver mais de 14 dígitos, limita a 14 e formata como CNPJ
    const cnpjNumbers = numbers.slice(0, 14);
    return `${cnpjNumbers.slice(0, 2)}.${cnpjNumbers.slice(2, 5)}.${cnpjNumbers.slice(5, 8)}/${cnpjNumbers.slice(8, 12)}-${cnpjNumbers.slice(12, 14)}`;
  }
}
