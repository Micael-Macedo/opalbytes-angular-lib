import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import type { Meta, StoryObj } from '@storybook/angular-vite';

import { CaoHint } from './hint';
import { CaoBaseInput } from '../base-input/base-input';
import { CaoFormField } from '../form-field/form-field';

@Component({
  selector: 'cao-hint-story',
  imports: [ReactiveFormsModule, CaoFormField, CaoBaseInput, CaoHint],
  template: `
    <div style="max-width: 420px;">
      <cao-form-field [control]="control" label="Usuário">
        <cao-input [control]="control" placeholder="nome.sobrenome"></cao-input>
        <cao-hint>{{ text }}</cao-hint>
      </cao-form-field>
    </div>
  `,
})
class CaoHintStoryComponent {
  control = new FormControl('');
  text = 'Use seu nome de usuário ou e-mail';
}

const render = (args: Partial<CaoHintStoryComponent>) => ({
  component: CaoHintStoryComponent,
  props: args,
});

const meta: Meta<CaoHint> = {
  title: 'Componentes/Hint',
  component: CaoHint,
  tags: ['autodocs'],
  argTypes: {
    text: { control: 'text' },
  },
  args: {
    text: 'Use seu nome de usuário ou e-mail',
  },
};

export default meta;
type Story = StoryObj<CaoHint>;

export const Padrao: Story = {
  render: () => render({ text: 'Uma dica para auxiliar o preenchimento' }),
};

export const ComTextoExemplo: Story = {
  render: () => render({ text: 'Formato esperado: 000.000.000-00' }),
};