import { Directive, ElementRef, HostListener, Input, OnInit, Optional, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCpfEmailMask]',
  standalone: true,
})
export class CpfEmailMaskDirective implements OnInit {
  @Input() appCpfEmailMask: string | boolean = true;

  private element: HTMLInputElement;
  private isUpdating = false;
  private readonly CPF_MASK = '000.000.000-00';

  constructor(
    private el: ElementRef,
    @Optional() @Self() private ngControl?: NgControl,
  ) {
    this.element = this.el.nativeElement;
  }

  ngOnInit() {
    this.element.setAttribute('autocomplete', 'username');

    // Se o campo já tem um valor (vindo do ngModel), formatá-lo visualmente
    if (this.element.value) {
      const value = this.element.value;
      if (this.isCpfPattern(value)) {
        const maskedValue = this.applyCpfMask(value);
        if (maskedValue !== value) {
          this.isUpdating = true;
          this.element.value = maskedValue;
          this.isUpdating = false;
        }
      }
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    if (this.isUpdating) {
      return;
    }

    const target = event.target as HTMLInputElement;
    const value = target.value;

    // Se contém @ ou parece com email, não aplicar máscara
    if (this.isEmail(value)) {
      return;
    }

    // Se parece com CPF (apenas números), aplicar máscara usando ngx-mask
    if (this.isCpfPattern(value)) {
      const numbers = value.replace(/\D/g, '');
      const maskedValue = this.applyCpfMask(value);

      // Atualizar o valor visual do input com a máscara
      if (maskedValue !== value) {
        this.isUpdating = true;
        target.value = maskedValue;
        this.isUpdating = false;
      }

      // Atualizar o ngModel com apenas os números (sem formatação)
      const input = target;

      // Se tiver acesso ao NgControl, atualizar diretamente
      if (this.ngControl && this.ngControl.control) {
        this.ngControl.control.setValue(numbers, { emitEvent: false });
      }

      // Restaurar o valor visual após o ngModel processar
      setTimeout(() => {
        if (input.value === numbers) {
          input.value = maskedValue;
        }
      }, 0);
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Permitir teclas de navegação e controle
    const allowedKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'Escape',
      'Enter',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Home',
      'End',
      'Control',
      'Meta',
      'Alt',
    ];

    if (allowedKeys.includes(event.key)) {
      return;
    }

    // Permitir Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if (event.ctrlKey || event.metaKey) {
      return;
    }

    const currentValue = (event.target as HTMLInputElement).value;
    const newValue = currentValue + event.key;

    // Se parece com email, permitir qualquer caractere
    if (this.isEmail(newValue)) {
      return;
    }

    // Se parece com CPF, permitir apenas números
    if (this.isCpfPattern(newValue)) {
      if (!/\d/.test(event.key)) {
        event.preventDefault();
      }
    }
  }

  private isEmail(value: string): boolean {
    // Verifica se contém @ ou se parece com email (contém letras)
    return value.includes('@') || /[a-zA-Z]/.test(value);
  }

  private isCpfPattern(value: string): boolean {
    // Verifica se contém apenas números (possível CPF)
    const numbers = value.replace(/\D/g, '');
    return numbers.length > 0 && /^\d+$/.test(numbers) && !value.includes('@');
  }

  private applyCpfMask(value: string): string {
    // Usar lógica do ngx-mask para aplicar a máscara de CPF
    // A máscara '000.000.000-00' do ngx-mask significa: 3 dígitos, ponto, 3 dígitos, ponto, 3 dígitos, hífen, 2 dígitos
    // Esta implementação segue a mesma lógica do ngx-mask, aplicando a máscara progressivamente
    const numbers = value.replace(/\D/g, '');

    if (numbers.length === 0) {
      return '';
    }

    // Aplicar máscara progressivamente conforme o usuário digita (lógica do ngx-mask)
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

  @HostListener('focus')
  onFocus() {
    // Manter a formatação visual no foco (não limpar)
    // O valor do modelo já está sem formatação
  }

  @HostListener('blur', ['$event'])
  onBlur(event: FocusEvent) {
    // Reaplicar máscara ao sair do campo (apenas para CPF)
    const target = event.target as HTMLInputElement;
    const value = target.value;
    if (this.isCpfPattern(value)) {
      const maskedValue = this.applyCpfMask(value);
      if (maskedValue !== value) {
        this.isUpdating = true;
        target.value = maskedValue;
        this.isUpdating = false;
      }

      // Garantir que o ngModel tenha apenas números (sem formatação)
      const numbers = value.replace(/\D/g, '');
      if (this.ngControl && this.ngControl.control && numbers !== this.ngControl.control.value) {
        this.ngControl.control.setValue(numbers, { emitEvent: true });
      }
    }
  }
}
