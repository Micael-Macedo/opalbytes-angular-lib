import { Component, input, output, OnInit, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NaturalPersonModel } from '@domain/models/natural-person-data';
import { User } from '@domain/models/user.model';
import {
  emailValidator,
  cpfValidator,
  cepValidator,
  telefoneValidator,
  dataNascimentoValidator,
  passwordValidator,
  CepMaskDirective,
  CpfMaskDirective,
  RgMaskDirective,
} from '@shared.directives/directives';
import { CEPService } from '@domain/services/cep.service';
import { FormErrorService } from '@core/services/form-error.service';
import { PermissionDirective } from '@shared/directives/permission.directive';

@Component({
  selector: 'app-pessoa-fisica-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CepMaskDirective,
    CpfMaskDirective,
    RgMaskDirective,
    PermissionDirective,
  ],
  templateUrl: './pessoa-fisica-modal.html',
})
export class PessoaFisicaModal implements OnInit {
  private cepService = inject(CEPService);
  private fb = inject(FormBuilder);
  private formErrorService = inject(FormErrorService);

  isOpen = input.required<boolean>();
  userData = input<User | null>(null);
  isEditMode = input<boolean>(false);
  closed = output<void>();
  saved = output<NaturalPersonModel>();

  form!: FormGroup;
  loadingCep = false;

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.handleFormState();
      }
    });
  }

  private handleFormState() {
    if (!this.form) {
      this.initForm();
      if (this.shouldPopulateForm()) {
        setTimeout(() => this.populateForm(this.userData()!), 0);
      }
      return;
    }

    if (this.shouldPopulateForm()) {
      this.populateForm(this.userData()!);
    } else {
      this.resetForm();
    }
  }

  private shouldPopulateForm(): boolean {
    return !!(this.userData() && this.isEditMode());
  }

  private resetForm() {
    this.form.reset();
    this.form.patchValue({ ativo: true });
    this.form.enable();
    this.setupPasswordValidators();
  }

  private setupPasswordValidators() {
    const passwordControl = this.form.get('password');
    if (passwordControl) {
      passwordControl.setValidators([Validators.required, passwordValidator()]);
      passwordControl.updateValueAndValidity();
    }
  }

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      sobrenome: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', [Validators.required, passwordValidator()]],
      email: ['', [Validators.required, emailValidator()]],
      cpf: ['', [Validators.required, cpfValidator()]],
      rg: ['', [Validators.required]],
      dataNascimento: ['', [Validators.required, dataNascimentoValidator()]],
      sexo: ['', Validators.required],
      telefone: ['', telefoneValidator()],
      endereco: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      uf: ['', Validators.required],
      cep: ['', [Validators.required, cepValidator()]],
      setor: ['', Validators.required],
      cargo: ['', Validators.required],
    });
  }

  onSubmit(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!this.form) {
      return;
    }

    Object.keys(this.form.controls).forEach((key) => {
      this.form.get(key)?.markAsTouched();
    });

    const formValue = this.form.value;

    if (this.form.valid) {
      this.saved.emit(formValue);
    } else {
      this.form.markAllAsTouched();
    }
  }

  getErrorMessage(field: string): string {
    return this.formErrorService.getErrorMessage(this.form, field);
  }

  getSexoLabel(value: string): string {
    const sexoMap: Record<string, string> = {
      M: 'Masculino',
      F: 'Feminino',
      Outro: 'Outro',
    };
    return sexoMap[value] || value;
  }

  onCepBlur() {
    const cepValue = this.form.get('cep')?.value;
    if (cepValue) {
      const cepClean = cepValue.replace(/\D/g, '');
      if (cepClean.length === 8) {
        this.buscarCep(cepClean);
      }
    }
  }

  private buscarCep(cep: string) {
    this.loadingCep = true;
    this.cepService.searchCEP(cep).subscribe({
      next: (data) => {
        if (data) {
          this.form.patchValue({
            endereco: data.logradouro || '',
            bairro: data.bairro || '',
            cidade: data.localidade || '',
            uf: data.uf || '',
          });
        }
        this.loadingCep = false;
      },
      error: () => {
        this.loadingCep = false;
      },
    });
  }

  private formatRg(rg: string | null | undefined): string {
    if (!rg) {
      return '';
    }

    const numbers = rg.replace(/\D/g, '');
    if (numbers.length === 0) {
      return '';
    }

    const rgNumbers = numbers.slice(0, 10);

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

  private populateForm(user: User) {
    let dataNascimentoFormatted = '';
    if (user.dataNascimento) {
      const date = new Date(user.dataNascimento);
      if (!isNaN(date.getTime())) {
        dataNascimentoFormatted = date.toISOString().split('T')[0];
      }
    }

    let cepFormatted = user.endereco?.cep || '';
    if (cepFormatted && !cepFormatted.includes('-')) {
      cepFormatted = `${cepFormatted.slice(0, 5)}-${cepFormatted.slice(5)}`;
    }

    const rgFormatted = this.formatRg(user.rg);

    this.form.patchValue({
      nome: user.nome || '',
      sobrenome: user.sobrenome || '',
      username: user.username || '',
      password: '',
      email: user.email || '',
      cpf: user.cpf || '',
      rg: rgFormatted,
      dataNascimento: dataNascimentoFormatted,
      sexo: user.sexo || '',
      telefone: user.telefone || '',
      endereco: user.endereco?.logradouro || '',
      numero: user.endereco?.numero || '',
      complemento: user.endereco?.complemento || '',
      bairro: user.endereco?.bairro || '',
      cidade: user.endereco?.cidade || '',
      uf: user.endereco?.uf || '',
      cep: cepFormatted,
      setor: user.setor || '',
      cargo: user.cargo || '',
      razaoSocial: user.organizacao?.razaoSocial || '',
      nomeFantasia: user.organizacao?.nomeFantasia || '',
      cnpj: user.organizacao?.cnpj || '',
      ativo: !user.isDeleted,
    });

    if (this.isEditMode()) {
      // Garantir que o valor do sexo seja setado antes de desabilitar
      const sexoControl = this.form.get('sexo');
      if (sexoControl && user.sexo) {
        sexoControl.setValue(user.sexo, { emitEvent: false });
      }

      const fieldsToDisable = [
        'username',
        'password',
        'cpf',
        'rg',
        'dataNascimento',
        'sexo',
        'telefone',
        'endereco',
        'numero',
        'complemento',
        'bairro',
        'cidade',
        'uf',
        'cep',
        'setor',
        'cargo',
        'razaoSocial',
        'nomeFantasia',
        'cnpj',
        'ativo',
      ];

      fieldsToDisable.forEach((field) => {
        const control = this.form.get(field);
        if (control) {
          control.disable();
        }
      });

      const passwordControl = this.form.get('password');
      if (passwordControl) {
        passwordControl.clearValidators();
        passwordControl.updateValueAndValidity();
      }
    }
  }
}
