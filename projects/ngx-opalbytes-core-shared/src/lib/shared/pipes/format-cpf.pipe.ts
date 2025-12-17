import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "formatCpf",
  standalone: true,
})
export class FormatCpfPipe implements PipeTransform {
  transform(cpf: string | null | undefined): string {
    if (!cpf) {
      return "";
    }

    // Remove todos os caracteres não numéricos
    const numbers = cpf.replace(/\D/g, "");

    if (numbers.length === 0) {
      return "";
    }

    // Aplica a máscara de CPF seguindo a lógica do ngx-mask (000.000.000-00)
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    } else if (numbers.length <= 9) {
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    } else {
      // Limitar a 11 dígitos (tamanho máximo do CPF)
      const cpfNumbers = numbers.slice(0, 11);
      return `${cpfNumbers.slice(0, 3)}.${cpfNumbers.slice(3, 6)}.${cpfNumbers.slice(6, 9)}-${cpfNumbers.slice(9, 11)}`;
    }
  }
}
