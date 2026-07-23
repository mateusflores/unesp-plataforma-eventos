/**
 * QR Code ILUSTRATIVO.
 * Gera um padrão determinístico a partir do código, apenas para representação
 * visual do ingresso — não é um QR válido nem faz validação real (conforme escopo).
 */
interface QRCodeProps {
  valor: string;
  tamanho?: number;
}

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function QRCode({ valor, tamanho = 160 }: QRCodeProps) {
  const n = 21; // grid clássico
  const cell = tamanho / n;
  const modulos: boolean[] = [];
  let seed = hash(valor);
  for (let i = 0; i < n * n; i++) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    modulos.push((seed >> 16) % 2 === 0);
  }

  const ehFinder = (x: number, y: number) => {
    const dentro = (cx: number, cy: number) => x >= cx && x < cx + 7 && y >= cy && y < cy + 7;
    return dentro(0, 0) || dentro(n - 7, 0) || dentro(0, n - 7);
  };

  const rects: JSX.Element[] = [];
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (ehFinder(x, y)) continue;
      if (modulos[y * n + x]) {
        rects.push(<rect key={`${x}-${y}`} x={x * cell} y={y * cell} width={cell} height={cell} />);
      }
    }
  }

  const Finder = ({ cx, cy }: { cx: number; cy: number }) => (
    <g>
      <rect x={cx * cell} y={cy * cell} width={7 * cell} height={7 * cell} rx={cell} />
      <rect x={(cx + 1) * cell} y={(cy + 1) * cell} width={5 * cell} height={5 * cell} rx={cell * 0.6} fill="#fff" />
      <rect x={(cx + 2) * cell} y={(cy + 2) * cell} width={3 * cell} height={3 * cell} rx={cell * 0.4} />
    </g>
  );

  return (
    <svg
      className="qr"
      width={tamanho}
      height={tamanho}
      viewBox={`0 0 ${tamanho} ${tamanho}`}
      role="img"
      aria-label={`QR Code do ingresso ${valor}`}
      style={{ fill: '#12131c' }}
    >
      <rect width={tamanho} height={tamanho} fill="#fff" />
      {rects}
      <Finder cx={0} cy={0} />
      <Finder cx={n - 7} cy={0} />
      <Finder cx={0} cy={n - 7} />
    </svg>
  );
}
