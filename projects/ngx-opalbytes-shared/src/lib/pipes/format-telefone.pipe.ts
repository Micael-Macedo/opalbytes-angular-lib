import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "formatTelefone",
  standalone: true,
})
export class FormatTelefonePipe implements PipeTransform {
  transform(phone: string | null | undefined): string {
    if (!phone) {
      return "";
    }

    // Remove todos os caracteres não numéricos
    const numbers = phone.replace(/\D/g, "");

    if (numbers.length === 0) {
      return "";
    }

    // Telefone celular brasileiro: (DDD) 9XXXX-XXXX (11 dígitos)
    // Telefone fixo brasileiro: (DDD) XXXX-XXXX (10 dígitos)

    if (numbers.length <= 2) {
      // Apenas DDD
      return `(${numbers})`;
    } else if (numbers.length <= 6) {
      // DDD + início do número
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 10) {
      // Telefone fixo: (DDD) XXXX-XXXX
      const ddd = numbers.slice(0, 2);
      const firstPart = numbers.slice(2, 6);
      const secondPart = numbers.slice(6);
      return `(${ddd}) ${firstPart}-${secondPart}`;
    } else {
      // Telefone celular: (DDD) 9XXXX-XXXX
      const ddd = numbers.slice(0, 2);
      const firstPart = numbers.slice(2, 7);
      const secondPart = numbers.slice(7, 11);
      return `(${ddd}) ${firstPart}-${secondPart}`;
    }
  }
}
