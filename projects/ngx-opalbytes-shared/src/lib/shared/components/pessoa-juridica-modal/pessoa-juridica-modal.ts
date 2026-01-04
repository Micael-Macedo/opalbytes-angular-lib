import { Component, input, output, inject, OnInit, effect, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LegalPersonModel } from '@domain/models/legal-person-data';
import { User } from '@domain/models/user.model';
import {
  cnpjValidator,
  cepValidator,
  emailValidator,
  cpfValidator,
  passwordValidator,
  CepMaskDirective,
  CnpjMaskDirective,
  CpfMaskDirective,
  RgMaskDirective,
  dataNascimentoValidator,
} from '@shared/directives/directives';
import { CEPService } from '@domain/services/cep.service';
import { OrganizationService } from '@domain/services/organization.service';
import { OrganizationModel } from '@domain/models/organization.model';
import { FormErrorService } from '@core/services/form-error.service';
import { PermissionDirective } from '@shared/directives/permission.directive';

@Component({
  selector: 'app-pessoa-juridica-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CepMaskDirective,
    CnpjMaskDirective,
    CpfMaskDirective,
    RgMaskDirective,
    PermissionDirective,
  ],
  templateUrl: './pessoa-juridica-modal.html',
})
export class PessoaJuridicaModal implements OnInit {
  private fb = inject(FormBuilder);
  private cepService = inject(CEPService);
  private organizationService = inject(OrganizationService);
  private formErrorService = inject(FormErrorService);
  private cdr = inject(ChangeDetectorRef);

  isOpen = input.required<boolean>();
  userData = input<User | null>(null);
  isEditMode = input<boolean>(false);
  closed = output<void>();
  saved = output<LegalPersonModel>();

  form!: FormGroup;
  loadingCep = false;
  organizations: OrganizationModel[] = [];
  loadingOrganizations = false;
  private organizationsLoaded = false;

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.handleFormState();
        // Carregar organizações apenas quando o modal for aberto e ainda não foram carregadas
        // Usar queueMicrotask para evitar ExpressionChangedAfterItHasBeenCheckedError
        if (!this.organizationsLoaded) {
          queueMicrotask(() => {
            this.carregarOrganizacoes();
          });
        }
      }
    });
  }

  private handleFormState() {
    if (!this.form) {
      this.initForm();
      if (this.shouldPopulateForm()) {
        queueMicrotask(() => this.populateForm(this.userData()!));
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
    this.setupFormValidators();
  }

  private setupFormValidators() {
    this.setupPasswordValidators();
    this.setupResponsavelValidators();
    this.setupSobrenomeValidators();
    this.clearNomeValidators();
  }

  private setupPasswordValidators() {
    const passwordControl = this.form.get('password');
    if (passwordControl) {
      passwordControl.setValidators([Validators.required, passwordValidator()]);
      passwordControl.updateValueAndValidity();
    }
  }

  private setupResponsavelValidators() {
    const responsavelControl = this.form.get('responsavel');
    if (responsavelControl) {
      responsavelControl.setValidators([Validators.required]);
      responsavelControl.updateValueAndValidity();
    }
  }

  private setupSobrenomeValidators() {
    const sobrenomeControl = this.form.get('sobrenome');
    if (sobrenomeControl) {
      sobrenomeControl.setValidators([Validators.required]);
      sobrenomeControl.updateValueAndValidity();
    }
  }

  private clearNomeValidators() {
    const nomeControl = this.form.get('nome');
    if (nomeControl) {
      nomeControl.clearValidators();
      nomeControl.updateValueAndValidity();
    }
  }

  ngOnInit() {
    this.initForm();
    // Não carregar organizações aqui, será carregado no effect quando o modal abrir
  }

  carregarOrganizacoes() {
    // Evitar múltiplas chamadas simultâneas
    if (this.loadingOrganizations) {
      return;
    }

    this.loadingOrganizations = true;
    this.cdr.markForCheck();

    this.organizationService.search({}).subscribe({
      next: (response) => {
        this.organizations = response.data;
        this.loadingOrganizations = false;
        this.organizationsLoaded = true;
        this.cdr.markForCheck();
      },
      error: () => {
        this.organizations = [];
        this.loadingOrganizations = false;
        this.organizationsLoaded = false; // Permitir tentar novamente em caso de erro
        this.cdr.markForCheck();
      },
    });
  }

  private initForm() {
    this.form = this.fb.group({
      organizacaoId: [''],
      razaoSocial: ['', Validators.required],
      nomeFantasia: [''],
      cnpj: ['', [Validators.required, cnpjValidator()]],
      username: ['', Validators.required],
      password: ['', [Validators.required, passwordValidator()]],
      email: ['', [Validators.required, emailValidator()]],
      endereco: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      uf: ['', Validators.required],
      cep: ['', [Validators.required, cepValidator()]],
      setor: ['', Validators.required],
      responsavel: ['', Validators.required],
      cargoResponsavel: ['', Validators.required],
      cpf: ['', [Validators.required, cpfValidator()]],
      rg: ['', [Validators.required]],
      sexo: ['', Validators.required],
      nome: [''],
      sobrenome: [''],
      ativo: [true],
      dataNascimento: ['', [Validators.required, dataNascimentoValidator()]],
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

    const formValue = this.form.getRawValue();

    // Se uma organização foi selecionada, adiciona o ID no objeto de organização
    if (formValue.organizacaoId && formValue.razaoSocial) {
      formValue.organizacao = {
        id: formValue.organizacaoId,
        razaoSocial: formValue.razaoSocial,
        nomeFantasia: formValue.nomeFantasia || undefined,
        cnpj: formValue.cnpj || undefined,
      };
    }

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

  onOrganizationSelect(organizationId: string) {
    const organizationFields = ['razaoSocial', 'nomeFantasia', 'cnpj'];

    if (!organizationId) {
      this.form.patchValue({
        organizacaoId: '',
        razaoSocial: '',
        nomeFantasia: '',
        cnpj: '',
      });

      organizationFields.forEach((field) => {
        const control = this.form.get(field);
        if (control) {
          control.enable();
        }
      });
      return;
    }

    const organization = this.organizations.find((org) => org.id === organizationId);
    if (organization) {
      this.form.patchValue({
        organizacaoId: organization.id,
        razaoSocial: organization.razaoSocial,
        nomeFantasia: organization.nomeFantasia,
        cnpj: organization.cnpj,
      });

      organizationFields.forEach((field) => {
        const control = this.form.get(field);
        if (control) {
          control.disable();
        }
      });
    }
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

    const responsavel = user.nome || '';
    const rgFormatted = this.formatRg(user.rg);

    this.form.patchValue({
      organizacaoId: user.organizacao?.id || '',
      razaoSocial: user.organizacao?.razaoSocial || '',
      nomeFantasia: user.organizacao?.nomeFantasia || '',
      cnpj: user.organizacao?.cnpj || '',
      username: user.username || '',
      password: '',
      email: user.email || '',
      endereco: user.endereco?.logradouro || '',
      numero: user.endereco?.numero || '',
      complemento: user.endereco?.complemento || '',
      bairro: user.endereco?.bairro || '',
      cidade: user.endereco?.cidade || '',
      uf: user.endereco?.uf || '',
      cep: cepFormatted,
      setor: user.setor || '',
      responsavel: responsavel,
      cargoResponsavel: user.cargo || '',
      cpf: user.cpf || '',
      rg: rgFormatted,
      dataNascimento: dataNascimentoFormatted,
      sexo: user.sexo || '',
      nome: user.nome || '',
      sobrenome: user.sobrenome || '',
      ativo: !user.isDeleted,
    });

    if (this.isEditMode()) {
      const sexoControl = this.form.get('sexo');
      if (sexoControl && user.sexo) {
        sexoControl.setValue(user.sexo, { emitEvent: false });
      }

      const fieldsToDisable = [
        'organizacaoId',
        'razaoSocial',
        'nomeFantasia',
        'cnpj',
        'username',
        'password',
        'endereco',
        'numero',
        'complemento',
        'bairro',
        'cidade',
        'uf',
        'cep',
        'setor',
        'responsavel',
        'cargoResponsavel',
        'cpf',
        'rg',
        'dataNascimento',
        'sexo',
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
      const responsavelControl = this.form.get('responsavel');
      if (responsavelControl) {
        responsavelControl.clearValidators();
        responsavelControl.updateValueAndValidity();
      }
      const nomeControl = this.form.get('nome');
      const sobrenomeControl = this.form.get('sobrenome');
      if (nomeControl) {
        nomeControl.setValidators([Validators.required]);
        nomeControl.updateValueAndValidity();
      }
      if (sobrenomeControl) {
        sobrenomeControl.setValidators([Validators.required]);
        sobrenomeControl.updateValueAndValidity();
      }
    }
  }
}
