// Stub nativo: no iOS/Android o PDF é aberto externamente (Linking), então o
// modal não é usado. A versão web (PdfModal.web.tsx) traz a implementação real.
export type PdfModalProps = {
  visible: boolean;
  uri?: string;
  onClose: () => void;
  title?: string;
  accent?: string;
};

export function PdfModal(_props: PdfModalProps) {
  return null;
}
