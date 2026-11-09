const DEFAULT_AVATAR_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' +
  '<rect width="64" height="64" fill="#e5e7eb"/>' +
  '<circle cx="32" cy="25" r="11" fill="#9ca3af"/>' +
  '<path d="M10 64c0-13 10-22 22-22s22 9 22 22z" fill="#9ca3af"/>' +
  '</svg>';

/** Imagem padrão (silhueta) usada quando nenhuma fonte é informada ou a imagem falha ao carregar. */
export const CAO_AVATAR_DEFAULT_SRC = `data:image/svg+xml;utf8,${encodeURIComponent(DEFAULT_AVATAR_SVG)}`;

/** Tamanhos predefinidos, em px. */
export const CAO_AVATAR_SIZES = {
  small: 24,
  normal: 32,
  large: 48,
  xlarge: 64,
} as const;