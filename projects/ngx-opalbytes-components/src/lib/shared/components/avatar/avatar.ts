import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { CAO_AVATAR_DEFAULT_SRC, CAO_AVATAR_SIZES } from './avatar.constants';
import { CaoAvatarPresetSize, CaoAvatarShape, CaoAvatarStrokeStyle } from './avatar.model';

type CaoAvatarMode = 'image'  | 'label' | 'default';

@Component({
  selector: 'cao-avatar',
  imports: [],
  templateUrl: './avatar.html',
  styleUrl: './avatar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaoAvatarComponent {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly defaultUrl: SafeUrl = this.sanitizer.bypassSecurityTrustUrl(CAO_AVATAR_DEFAULT_SRC);
  private readonly failedSrc = signal<string | null>(null);

  /** URL da imagem. Se vazia ou inválida, usa ícone, label ou a imagem padrão (nessa ordem). */
  readonly src = input<string | null | undefined>('');
  /** Imagem padrão customizada, usada quando nada é informado ou `src` falha ao carregar. */
  readonly defaultSrc = input<string>('');
  /** Texto exibido (ex.: iniciais) quando não há imagem nem ícone. */
  readonly label = input<string>('');
  /** Nome do ícone Lucide ou imagem usada como ícone. */
  readonly icon = input<string>('');
  readonly isLucideIcon = input<boolean>(true);
  readonly iconColor = input<string>('');

  /** Tamanho: `'small' | 'normal' | 'large' | 'xlarge'`, número em px ou string (`'72px'`, `'4.5rem'`). */
  readonly size = input<CaoAvatarPresetSize | number | string>('normal');
  /** Formato do avatar. */
  readonly shape = input<CaoAvatarShape>('circle');

  /** Espessura do contorno (stroke). Número = px. `0` remove o contorno. */
  readonly strokeWidth = input<number | string>(0);
  readonly strokeColor = input<string>('#ffffff');
  readonly strokeStyle = input<CaoAvatarStrokeStyle>('solid');

  readonly bgColor = input<string>('');
  readonly textColor = input<string>('');

  readonly alt = input<string>('');
  readonly ariaLabel = input<string>('');
  readonly dataCy = input<string>('');

  protected readonly sizePx = computed<number>(() => this.resolveSize(this.size()));
  protected readonly fontSizePx = computed<number>(() => Math.round(this.sizePx() * 0.4));
  protected readonly iconSizePx = computed<number>(() => Math.round(this.sizePx() * 0.55));

  protected readonly strokeWidthCss = computed<string>(() => {
    const width = this.strokeWidth();
    return typeof width === 'number' ? `${width}px` : width;
  });

  protected readonly mode = computed<CaoAvatarMode>(() => {
    const src = this.src();
    if (src && this.failedSrc() !== src) {return 'image';}
    if (this.label()) {return 'label';}
    return 'default';
  });

  protected readonly defaultImage = computed<string | SafeUrl>(() => this.defaultSrc() || this.defaultUrl);

  protected readonly accessibleName = computed<string>(
    () => this.ariaLabel() || this.alt() || this.label() || 'Avatar',
  );

  protected onImageError(): void {
    this.failedSrc.set(this.src() ?? null);
  }

  private resolveSize(value: CaoAvatarPresetSize | number | string): number {
    if (typeof value === 'number') {return value > 0 ? value : CAO_AVATAR_SIZES.normal;}
    if (value in CAO_AVATAR_SIZES) {return CAO_AVATAR_SIZES[value as CaoAvatarPresetSize];}

    const parsed = Number.parseFloat(value);
    if (Number.isNaN(parsed) || parsed <= 0) {return CAO_AVATAR_SIZES.normal;}
    return value.trim().endsWith('rem') || value.trim().endsWith('em') ? parsed * 16 : parsed;
  }
}