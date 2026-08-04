import React, {
  useCallback,
  useEffect,
  useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { Text } from '@/components/ui/AppText';
import { SvgXml } from 'react-native-svg';
import { useI18n } from '@/context/I18nProvider';

import US from 'country-flag-icons/string/3x2/US';
import EU from 'country-flag-icons/string/3x2/EU';
import GB from 'country-flag-icons/string/3x2/GB';
import JP from 'country-flag-icons/string/3x2/JP';
import BR from 'country-flag-icons/string/3x2/BR';

// ── Fonts ────────────────────────────────────────────────────────────────────

const MONO = Platform.select({
  web: '"JetBrains Mono", "Courier New", monospace',
  ios: 'Courier',
  android: 'monospace',
  default: 'monospace',
});

const GROTESK = Platform.select({
  web: '"Space Grotesk", system-ui, sans-serif',
  ios: 'System',
  android: 'sans-serif',
  default: 'sans-serif',
});

// ── Design tokens (referência do cloud design) ───────────────────────────────

const C = {
  card: '#0e1014',
  border: '#1c1f26',
  inputBg: '#13161d',
  inputBorder: '#23272f',
  dropBg: '#0f121a',
  rateBg: '#101216',
  text: '#e8eaed',
  textSec: '#9aa0a8',
  textMuted: '#6b7280',
  textDim: '#5b616b',
  textUltra: '#3a3f47',
  cyan: '#38bdf8',
  green: '#34d399',
  amber: '#f5a623',
  red: '#ff4862',
} as const;

const CSS = `
  @keyframes cm-blink{0%,100%{opacity:1}50%{opacity:.25}}
  @keyframes cm-in{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
`;

// ── Icons ────────────────────────────────────────────────────────────────────

const SWAP_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 16V4m0 0L3 8m4-4l4 4"/><path d="M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>`;
const REFRESH_SVG = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#5b616b" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>`;

// ── Currency data ────────────────────────────────────────────────────────────

const FCA_API_KEY = 'fca_live_yEIvThBQd8hVNhWmoN5Ynp3mFA1UYm8HsHxPRm2B';
const FLAG_W = 22;
const FLAG_H = 15;

type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'BRL';

interface CurrencyConfig {
  code: Currency;
  flag: string;
  /** JPY não usa centavos — a precisão é por moeda, não global. */
  decimals: number;
}

const CURRENCIES: CurrencyConfig[] = [
  { code: 'USD', flag: US, decimals: 2 },
  { code: 'EUR', flag: EU, decimals: 2 },
  { code: 'GBP', flag: GB, decimals: 2 },
  { code: 'JPY', flag: JP, decimals: 0 },
  { code: 'BRL', flag: BR, decimals: 2 },
];

const CURRENCY_MAP: Record<string, CurrencyConfig> = Object.fromEntries(
  CURRENCIES.map((c) => [c.code, c]),
);

type RateMap = Record<string, number>;

// ── Textos ───────────────────────────────────────────────────────────────────

const COPY = {
  pt: {
    eyebrow: '// ferramenta · câmbio de moedas',
    titleA: 'Conversor de ',
    titleB: 'Moedas',
    subtitle: 'USD · EUR · GBP · JPY · BRL · cotações em tempo real',
    from: 'De',
    to: 'Para',
    error: 'Cotações indisponíveis. Verifique sua conexão.',
    retry: 'Tentar novamente',
    source: 'Fonte · freecurrencyapi.com',
    disclaimer: 'Dados para referência · não financeiro',
    ago: (n: number, u: 's' | 'min' | 'h') => `${n}${u} atrás`,
    names: {
      USD: 'Dólar Americano', EUR: 'Euro', GBP: 'Libra Esterlina',
      JPY: 'Iene Japonês',    BRL: 'Real Brasileiro',
    } as Record<Currency, string>,

    techLabel: '// detalhes técnicos',
    techTitle: 'Como funciona',
    techP1:
      'O conversor busca as paridades reais na Free Currency API assim que a tela monta e mantém tudo em memória — não há back-end próprio nem cache intermediário. Uma única requisição alimenta as cinco moedas.',
    techP2:
      'A API entrega todas as taxas relativas ao dólar. Converter BRL para EUR, portanto, não é uma consulta direta: a paridade é triangulada no cliente a partir das duas cotações contra USD.',
    reqLabel: 'Requisição',
    cards: [
      {
        n: '01',
        title: 'Integração REST',
        text: 'Uma chamada a GET /v1/latest com base_currency=USD retorna EUR, GBP, JPY e BRL. O USD é injetado como 1 no mapa de taxas para fechar a matriz e permitir qualquer par.',
      },
      {
        n: '02',
        title: 'Cotação cruzada',
        text: 'Como tudo chega ancorado no dólar, o par escolhido é derivado por divisão: taxa = destino ÷ origem. Pares sem USD saem de duas paridades, sem requisição extra.',
      },
      {
        n: '03',
        title: 'Precisão por moeda',
        text: 'Cada moeda declara suas casas decimais — o iene não tem centavos e é formatado com zero. A entrada aceita o formato pt-BR (1.000,50) e é normalizada antes do cálculo.',
      },
      {
        n: '04',
        title: 'Estados de rede',
        text: 'Carregando, sucesso e falha têm indicador próprio: ponto âmbar pulsante, verde e vermelho com botão de nova tentativa. Um contador relativo mostra a idade das cotações.',
      },
    ],
  },
  en: {
    eyebrow: '// tool · currency exchange',
    titleA: 'Currency ',
    titleB: 'Converter',
    subtitle: 'USD · EUR · GBP · JPY · BRL · real-time rates',
    from: 'From',
    to: 'To',
    error: 'Rates unavailable. Check your connection.',
    retry: 'Try again',
    source: 'Source · freecurrencyapi.com',
    disclaimer: 'Reference data · not financial advice',
    ago: (n: number, u: 's' | 'min' | 'h') => `${n}${u} ago`,
    names: {
      USD: 'US Dollar',      EUR: 'Euro',           GBP: 'British Pound',
      JPY: 'Japanese Yen',   BRL: 'Brazilian Real',
    } as Record<Currency, string>,

    techLabel: '// technical details',
    techTitle: 'How it works',
    techP1:
      'The converter fetches live parities from the Free Currency API as soon as the screen mounts and keeps them in memory — there is no back-end of its own and no intermediate cache. A single request feeds all five currencies.',
    techP2:
      'The API returns every rate relative to the US dollar. Converting BRL to EUR is therefore not a direct lookup: the parity is triangulated on the client from the two USD quotes.',
    reqLabel: 'Request',
    cards: [
      {
        n: '01',
        title: 'REST integration',
        text: 'One call to GET /v1/latest with base_currency=USD returns EUR, GBP, JPY and BRL. USD is injected as 1 into the rate map to close the matrix and allow any pair.',
      },
      {
        n: '02',
        title: 'Cross rates',
        text: 'Since everything arrives anchored to the dollar, the selected pair is derived by division: rate = target ÷ source. Pairs without USD come from two parities, with no extra request.',
      },
      {
        n: '03',
        title: 'Per-currency precision',
        text: 'Each currency declares its own decimal places — the yen has no cents and is formatted with zero. Input accepts the pt-BR format (1.000,50) and is normalized before the calculation.',
      },
      {
        n: '04',
        title: 'Network states',
        text: 'Loading, success and failure each have their own indicator: pulsing amber dot, green, and red with a retry button. A relative counter shows how old the rates are.',
      },
    ],
  },
} as const;

/** Requisição real, com a chave omitida. */
const REQ_LINES = [
  'GET api.freecurrencyapi.com/v1/latest',
  '    ?base_currency=USD',
  '    &currencies=EUR,GBP,JPY,BRL',
];

const STACK = [
  'React Native', 'TypeScript', 'Expo',
  'Free Currency API', 'react-native-svg', 'country-flag-icons',
];

function parseInput(text: string): number {
  if (text.includes(',')) {
    const cleaned = text.replace(/\./g, '').replace(',', '.');
    return parseFloat(cleaned);
  }
  return parseFloat(text);
}

function formatNum(value: number, currency: Currency): string {
  const d = CURRENCY_MAP[currency].decimals;
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
}

function timeAgo(date: Date, ago: (n: number, u: 's' | 'min' | 'h') => string): string {
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60) return ago(s, 's');
  const m = Math.floor(s / 60);
  return m < 60 ? ago(m, 'min') : ago(Math.floor(m / 60), 'h');
}

// ── Component ────────────────────────────────────────────────────────────────

export function ConversorMoedas() {
  const { currentLanguage } = useI18n();
  const L = currentLanguage === 'en' ? COPY.en : COPY.pt;

  const [from, setFrom] = useState<Currency>('BRL');
  const [to, setTo] = useState<Currency>('USD');
  const [fromInput, setFromInput] = useState('1000');
  const [rates, setRates] = useState<RateMap>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ratesLoadedAt, setRatesLoadedAt] = useState<Date | null>(null);
  const [pickerOpen, setPickerOpen] = useState<'from' | 'to' | null>(null);
  const [swapHover, setSwapHover] = useState(false);

  // ── API (mantida intacta) ──────────────────────────────────────────────────
  const fetchRates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `https://api.freecurrencyapi.com/v1/latest?apikey=${FCA_API_KEY}&base_currency=USD&currencies=EUR,GBP,JPY,BRL`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setRates({ USD: 1, ...json.data });
      setRatesLoadedAt(new Date());
    } catch {
      setError(L.error);
    } finally {
      setLoading(false);
    }
  }, [L.error]);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const el = document.createElement('style');
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => {
      document.head.removeChild(el);
    };
  }, []);

  // ── Derived values ─────────────────────────────────────────────────────────
  const hasRates = Object.keys(rates).length > 1;
  const amtNum = parseInput(fromInput);
  const rate =
    rates[from] && rates[to] ? (from === to ? 1 : rates[to] / rates[from]) : null;
  const resNum = !isNaN(amtNum) && rate !== null ? amtNum * rate : null;
  const result = resNum !== null ? formatNum(resNum, to) : '—';
  const rateDisplay =
    hasRates && rate !== null
      ? `1 ${from} = ${formatNum(rate, to)} ${to}`
      : '—';

  const dotColor = error ? C.red : loading ? C.amber : C.green;

  const selectCurrency = (side: 'from' | 'to', code: Currency) => {
    if (side === 'from') {
      if (code === to) {
        setTo(from);
        setFrom(code);
      } else {
        setFrom(code);
      }
    } else {
      setTo(code);
    }
    setPickerOpen(null);
  };

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
    setPickerOpen(null);
  };

  // ── Dropdown ───────────────────────────────────────────────────────────────
  const renderPicker = (side: 'from' | 'to', zIndex: number) => {
    const selected = side === 'from' ? from : to;
    const isOpen = pickerOpen === side;
    const options =
      side === 'from' ? CURRENCIES : CURRENCIES.filter((c) => c.code !== from);
    const cur = CURRENCY_MAP[selected];

    return (
      <View style={[styles.pickerWrap, { zIndex }]}>
        <Pressable
          style={[styles.select, isOpen && styles.selectOpen]}
          onPress={() => setPickerOpen(isOpen ? null : side)}
        >
          <SvgXml xml={cur.flag} width={FLAG_W} height={FLAG_H} />
          <Text style={[styles.selectCode, { fontFamily: MONO }]}>{cur.code}</Text>
          <Text style={[styles.selectName, { fontFamily: GROTESK }]} numberOfLines={1}>
            {L.names[cur.code]}
          </Text>
          <Text style={[styles.chevron, isOpen && styles.chevronOpen]}>▾</Text>
        </Pressable>

        {isOpen && (
          <>
            <Pressable style={styles.backdrop} onPress={() => setPickerOpen(null)} />
            <View style={[styles.dropdown, Platform.OS === 'web' ? webIn : null]}>
              {options.map((c) => {
                const active = selected === c.code;
                return (
                  <Pressable
                    key={c.code}
                    style={[styles.dropItem, active && styles.dropItemActive]}
                    onPress={() => selectCurrency(side, c.code)}
                  >
                    <SvgXml xml={c.flag} width={20} height={13} />
                    <Text
                      style={[
                        styles.dropCode,
                        { fontFamily: MONO, color: active ? C.cyan : C.text },
                      ]}
                    >
                      {c.code}
                    </Text>
                    <Text style={[styles.dropName, { fontFamily: GROTESK }]} numberOfLines={1}>
                      {L.names[c.code]}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        )}
      </View>
    );
  };

  return (
    <View style={styles.page}>
      <View style={styles.inner}>
        <View style={styles.hero}>
          <Text style={[styles.eyebrow, { fontFamily: MONO }]}>{L.eyebrow}</Text>
          <Text style={[styles.title, { fontFamily: GROTESK }]}>
            {L.titleA}<Text style={{ color: C.cyan }}>{L.titleB}</Text>
          </Text>
          <Text style={[styles.subtitle, { fontFamily: MONO }]}>
            {L.subtitle}</Text>
        </View>

        <View style={styles.card}>
        {/* Loading overlay */}
        {loading && (
          <View style={styles.overlay}>
            <ActivityIndicator color={C.cyan} />
          </View>
        )}

        {/* Error banner */}
        {error && (
          <View style={styles.errorBanner}>
            <Text style={[styles.errorText, { fontFamily: MONO }]}>{error}</Text>
            <Pressable style={styles.retryBtn} onPress={fetchRates}>
              <Text style={[styles.retryText, { fontFamily: MONO }]}>{L.retry}</Text>
            </Pressable>
          </View>
        )}

        {/* DE */}
        <View style={styles.fieldTop}>
          <Text style={[styles.label, { fontFamily: MONO }]}>{L.from}</Text>
          {renderPicker('from', 30)}
          <TextInput
            style={[styles.amountInput, { fontFamily: GROTESK }, webNoOutline]}
            value={fromInput}
            onChangeText={setFromInput}
            keyboardType="decimal-pad"
            placeholder="0"
            placeholderTextColor={C.textUltra}
          />
        </View>

        {/* Swap */}
        <View style={styles.swapRow}>
          <View style={styles.rule} />
          <Pressable
            style={[
              styles.swapBtn,
              swapHover && styles.swapBtnHover,
              swapHover && Platform.OS === 'web' ? ({ transform: [{ rotate: '180deg' }] } as object) : null,
            ]}
            onHoverIn={() => setSwapHover(true)}
            onHoverOut={() => setSwapHover(false)}
            onPress={handleSwap}
          >
            <SvgXml xml={SWAP_SVG} width={15} height={15} />
          </Pressable>
          <View style={styles.rule} />
        </View>

        {/* PARA */}
        <View style={styles.fieldBottom}>
          <Text style={[styles.label, { fontFamily: MONO }]}>{L.to}</Text>
          {renderPicker('to', 20)}
          <View style={styles.resultBox}>
            <Text style={[styles.resultText, { fontFamily: GROTESK }]}>{result}</Text>
          </View>
        </View>

        {/* Rate bar */}
        <View style={styles.rateBar}>
          <Text style={[styles.rateText, { fontFamily: MONO }]} numberOfLines={1}>
            {rateDisplay}
          </Text>
          <View style={styles.rateRight}>
            <View
              style={[
                styles.dot,
                { backgroundColor: dotColor },
                loading && Platform.OS === 'web'
                  ? ({ animation: 'cm-blink 1s infinite' } as object)
                  : null,
              ]}
            />
            <Text style={[styles.updated, { fontFamily: MONO }]}>
              {ratesLoadedAt ? timeAgo(ratesLoadedAt, L.ago) : '—'}
            </Text>
            <Pressable style={styles.refreshBtn} onPress={fetchRates}>
              <SvgXml xml={REFRESH_SVG} width={11} height={11} />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { fontFamily: MONO }]}>{L.source}</Text>
        <Text style={[styles.footerText, { fontFamily: MONO }]}>{L.disclaimer}</Text>
      </View>

      {/* ── Detalhes técnicos ── */}
      <View style={styles.tech}>
        <Text style={[styles.techLabel, { fontFamily: MONO }]}>{L.techLabel}</Text>
        <Text style={[styles.techTitle, { fontFamily: GROTESK }]}>{L.techTitle}</Text>

        <Text style={[styles.techPara, { fontFamily: GROTESK }]}>{L.techP1}</Text>
        <Text style={[styles.techPara, { fontFamily: GROTESK }]}>{L.techP2}</Text>

        {/* Requisição real — a chave da API é omitida de propósito */}
        <View style={styles.reqBox}>
          <Text style={[styles.reqLabel, { fontFamily: MONO }]}>{L.reqLabel}</Text>
          {REQ_LINES.map((line) => (
            <Text key={line} style={[styles.reqLine, { fontFamily: MONO }]}>{line}</Text>
          ))}
        </View>

        <View style={styles.techGrid}>
          {L.cards.map((c) => (
            <View key={c.n} style={styles.techCard}>
              <Text style={[styles.techCardNum, { fontFamily: MONO }]}>{c.n}</Text>
              <Text style={[styles.techCardTitle, { fontFamily: GROTESK }]}>{c.title}</Text>
              <Text style={[styles.techCardText, { fontFamily: GROTESK }]}>{c.text}</Text>
            </View>
          ))}
        </View>

        <View style={styles.stackRow}>
          {STACK.map((tech) => (
            <View key={tech} style={styles.stackChip}>
              <Text style={[styles.stackText, { fontFamily: MONO }]}>{tech}</Text>
            </View>
          ))}
        </View>
      </View>
      </View>
    </View>
  );
}

const webIn: object =
  Platform.OS === 'web' ? { animation: 'cm-in .16s ease both' } : {};
const webNoOutline: object =
  Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : {};

const styles = StyleSheet.create({
  page: {
    paddingTop: 64,
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  inner: { width: '100%', maxWidth: 640, alignSelf: 'center' },

  // Hero
  hero: { alignItems: 'center', marginBottom: 40 },
  eyebrow: {
    fontSize: 12,
    letterSpacing: 4,
    color: C.cyan,
    textTransform: 'uppercase',
    marginBottom: 16,
    textAlign: 'center',
  },
  title: {
    fontSize: 44,
    fontWeight: '700',
    color: C.text,
    letterSpacing: -1,
    lineHeight: 46,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 12,
    letterSpacing: 0.6,
    color: C.textDim,
    textAlign: 'center',
  },

  card: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderTopWidth: 2,
    borderTopColor: '#38bdf866',
    borderRadius: 20,
    padding: 24,
  },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10,11,13,0.82)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 60,
  },

  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#ff486214',
    borderWidth: 1,
    borderColor: '#ff486233',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 20,
  },
  errorText: { flex: 1, fontSize: 11, color: C.red, letterSpacing: 0.2 },
  retryBtn: {
    borderWidth: 1,
    borderColor: '#ff486244',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  retryText: { fontSize: 10, color: C.red, textTransform: 'uppercase', letterSpacing: 0.4 },

  fieldTop: { marginBottom: 16 },
  fieldBottom: { marginBottom: 24 },
  label: {
    fontSize: 10,
    letterSpacing: 2,
    color: C.textDim,
    textTransform: 'uppercase',
    marginBottom: 8,
  },

  // Picker / dropdown
  pickerWrap: { position: 'relative', marginBottom: 10 },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    backgroundColor: C.inputBg,
    borderWidth: 1,
    borderColor: C.inputBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
  },
  selectOpen: { borderColor: C.cyan },
  selectCode: { fontSize: 14, fontWeight: '600', letterSpacing: 0.5, color: C.text },
  selectName: { flex: 1, fontSize: 12, color: C.textMuted },
  chevron: { fontSize: 12, color: C.textMuted },
  chevronOpen: { color: C.cyan, transform: [{ rotate: '180deg' }] },

  backdrop: {
    position: 'absolute',
    top: -400,
    left: -400,
    right: -400,
    height: 900,
    zIndex: 40,
  },
  dropdown: {
    position: 'absolute',
    top: 58,
    left: 0,
    right: 0,
    backgroundColor: C.dropBg,
    borderWidth: 1,
    borderColor: C.inputBorder,
    borderRadius: 12,
    padding: 6,
    zIndex: 50,
  },
  dropItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderRadius: 8,
  },
  dropItemActive: { backgroundColor: '#38bdf80f' },
  dropCode: { fontSize: 12.5, fontWeight: '600', letterSpacing: 0.4, minWidth: 40 },
  dropName: { flex: 1, fontSize: 12.5, color: C.textSec },

  // Amount input
  amountInput: {
    backgroundColor: C.inputBg,
    borderWidth: 1,
    borderColor: C.inputBorder,
    borderRadius: 12,
    paddingHorizontal: 18,
    height: 56,
    fontSize: 26,
    fontWeight: '600',
    color: C.text,
    textAlign: 'right',
  },

  // Swap
  swapRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  rule: { flex: 1, height: 1, backgroundColor: C.border },
  swapBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.inputBg,
    borderWidth: 1,
    borderColor: C.inputBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swapBtnHover: { borderColor: C.cyan, backgroundColor: '#38bdf814' },

  // Result
  resultBox: {
    backgroundColor: '#38bdf80a',
    borderWidth: 1,
    borderColor: '#38bdf820',
    borderRadius: 12,
    paddingHorizontal: 18,
    height: 56,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  resultText: { fontSize: 26, fontWeight: '600', color: C.cyan },

  // Rate bar
  rateBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: C.rateBg,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  rateText: { flex: 1, fontSize: 12, color: '#9ca3af', letterSpacing: 0.2 },
  rateRight: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  updated: { fontSize: 10, color: C.textDim },
  refreshBtn: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Footer
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    paddingTop: 20,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  footerText: { fontSize: 10, color: C.textUltra, letterSpacing: 0.3 },

  // Detalhes técnicos
  tech: {
    marginTop: 56,
    paddingTop: 40,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  techLabel: {
    fontSize: 11,
    letterSpacing: 3,
    color: C.cyan,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  techTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: C.text,
    letterSpacing: -0.6,
    marginBottom: 18,
  },
  techPara: {
    fontSize: 14.5,
    lineHeight: 24,
    color: C.textSec,
    marginBottom: 14,
  },

  // Requisição
  reqBox: {
    backgroundColor: '#0c0e13',
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    padding: 14,
    marginTop: 8,
    marginBottom: 24,
  },
  reqLabel: {
    fontSize: 9.5,
    letterSpacing: 2,
    color: C.textDim,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  reqLine: { fontSize: 11.5, lineHeight: 19, color: '#9ca3af' },

  // Cards
  techGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  techCard: {
    flexGrow: 1,
    flexBasis: 240,
    minWidth: 220,
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderTopWidth: 2,
    borderTopColor: '#38bdf866',
    borderRadius: 14,
    padding: 18,
  },
  techCardNum: { fontSize: 10, fontWeight: '700', color: C.cyan, marginBottom: 8 },
  techCardTitle: { fontSize: 14.5, fontWeight: '600', color: C.text, marginBottom: 6 },
  techCardText: { fontSize: 12.5, lineHeight: 20, color: C.textSec },

  // Stack
  stackRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 20 },
  stackChip: {
    backgroundColor: C.rateBg,
    borderWidth: 1,
    borderColor: '#23272f',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 9,
  },
  stackText: { fontSize: 11, color: '#9ca3af' },
});
