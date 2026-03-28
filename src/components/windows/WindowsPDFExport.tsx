import type { Window } from '#/db'
import { CATEGORY_IMAGES } from '#/constants/windows'

function getWindowImage(category: string): string {
  return CATEGORY_IMAGES[category] ?? '/images/windows/placeholder.png'
}

type PDFProject = {
  name: string
  address: string
  city: string
  clientFirstName: string | null
  clientLastName: string | null
  clientPhone: string | null
  clientPhone2: string | null
}

interface WindowsPDFExportProps {
  project: PDFProject
  windows: Window[]
}

const CITY_LABELS: Record<string, string> = {
  cairo: 'القاهرة',
  alex: 'الإسكندرية',
  giza: 'الجيزة',
}

export function WindowsPDFExport({ project, windows }: WindowsPDFExportProps) {
  const clientName =
    [project.clientFirstName, project.clientLastName].filter(Boolean).join(' ') || '—'
  const phones = [project.clientPhone, project.clientPhone2].filter(Boolean).join(' / ')
  const cityLabel = CITY_LABELS[project.city] ?? project.city

  return (
    <div id="pdf-export-content" dir="rtl">
      {/*
        Using a <table> so the browser automatically repeats <thead>
        at the top of every printed page with correct spacing.
      */}
      <table style={s.table}>
        {/* ── Repeating page header ───────────────────────────────────── */}
        <thead>
          <tr>
            <td style={s.headerCell}>
              <div style={s.header}>
                <div style={s.companyText}>
                  <div style={s.companyName}>Origin UPVC</div>
                  <div style={s.companySubtitle}>للأبواب والنوافذ والواجهات</div>
                </div>
                <img src="/images/origin-logo.png" alt="Origin Logo" style={s.logo} />
              </div>
              <div style={s.headerDivider} />
            </td>
          </tr>
        </thead>

        {/* ── Body ────────────────────────────────────────────────────── */}
        <tbody>
          <tr>
            <td style={s.bodyCell}>

              {/* Client info */}
              <div style={s.clientRow}>
                <div style={s.clientChip}>
                  <span style={s.chipLabel}>اسم العميل</span>
                  <span style={s.chipValue}>{clientName}</span>
                </div>
                {phones && (
                  <div style={s.clientChip}>
                    <span style={s.chipLabel}>الهاتف</span>
                    <span style={s.chipValue}>{phones}</span>
                  </div>
                )}
                {project.address && (
                  <div style={s.clientChip}>
                    <span style={s.chipLabel}>العنوان</span>
                    <span style={s.chipValue}>{project.address}</span>
                  </div>
                )}
                {project.city && (
                  <div style={s.clientChip}>
                    <span style={s.chipLabel}>المدينة</span>
                    <span style={s.chipValue}>{cityLabel}</span>
                  </div>
                )}
              </div>

              {/* Windows */}
              {windows.map((win, idx) => (
                <div key={win.id} style={s.windowBlock}>
                  <div style={s.windowRow}>
                    {/* Info table */}
                    <table style={s.infoTable}>
                      <tbody>
                        {([
                          ['اسم الوحدة', win.category],
                          ['المكان', win.place],
                          ['العدد', String(win.count)],
                          ['نوع القطاع', win.materialType],
                          ['اللون', win.color],
                          ['نوع الزجاج', win.glass],
                          ['لون الزجاج', win.glassColor],
                          ['السلك', win.wire],
                          ['العرض', `${(parseFloat(win.width) / 100).toFixed(2)} م`, true],
                          ['الارتفاع الكلي', `${(parseFloat(win.totalHeight) / 100).toFixed(2)} م`, true],
                          ['المساحة', win.totalArea],
                          ['سعر المتر', Number(win.meterPrice)],
                          ['السعر الكلي للصنف', Number(win.totalPrice), true],
                        ] as [string, string, boolean?][]).map(([label, value, bold]) => (
                          <tr key={label}>
                            <td style={{ ...s.labelCell, ...(label === 'السعر الكلي للصنف' ? s.totalLabelCell : {}) }}>
                              {label}
                            </td>
                            <td style={{ ...s.valueCell, ...(bold ? s.boldValue : {}) }}>
                              {value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Window image with dimensions */}
                    <div style={s.imageWrap}>
                      {/* Height label on the right */}
                      <div style={s.dimHeight}>
                        {(parseFloat(win.totalHeight) / 100).toFixed(2)} م
                      </div>
                      {/* Image + width label stacked */}
                      <div style={s.imageCol}>
                        <img
                          src={getWindowImage(win.category)}
                          alt={win.category}
                          style={s.windowImage}
                          onError={e => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none'
                          }}
                        />
                        {/* Width label below image */}
                        <div style={s.dimWidth}>
                          {(parseFloat(win.width) / 100).toFixed(2)} م
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Signature */}
                  <div style={s.signature}>توقيع العميل</div>

                  {/* Separator between windows */}
                  {idx < windows.length - 1 && <hr style={s.separator} />}
                </div>
              ))}

              {/* ── شروط التعاقد ──────────────────────────────────────── */}
              <div style={s.termsSection}>
                <div style={s.termsTitle}>شروط التعاقد</div>
                <ol style={s.termsList}>
                  <li style={s.termsItem}>يلتزم العميل بسداد ٥٠٪ من إجمالي قيمة العقد كدفعة مقدمة عند توقيع العقد، والباقي عند التسليم.</li>
                  <li style={s.termsItem}>مدة التنفيذ المتفق عليها لا تشمل فترات التأخير الناتجة عن ظروف خارجة عن إرادة الشركة.</li>
                  <li style={s.termsItem}>تضمن الشركة جميع المنتجات لمدة سنة من تاريخ التسليم ضد عيوب الصناعة والتركيب.</li>
                  <li style={s.termsItem}>أي تعديلات على المواصفات بعد توقيع العقد تستلزم موافقة خطية من الطرفين وقد تؤثر على السعر والمدة.</li>
                </ol>
              </div>

            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

// ── Styles ───────────────────────────────────────────────────────────────────

const s: Record<string, React.CSSProperties> = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  headerCell: {
    padding: '6mm 14mm 3mm',
  },
  bodyCell: {
    padding: '4mm 14mm 14mm',
    verticalAlign: 'top',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },
  companyText: {
    textAlign: 'right',
  },
  companyName: {
    fontWeight: 700,
    fontSize: 22,
    letterSpacing: 1,
  },
  companySubtitle: {
    fontSize: 15,
    marginTop: 2,
  },
  logo: {
    height: 64,
    objectFit: 'contain',
  },
  headerDivider: {
    borderTop: '2px solid #000',
  },
  clientRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
    justifyContent: 'flex-end',
  },
  clientChip: {
    display: 'inline-flex',
    alignItems: 'center',
    border: '1px solid #aaa',
    borderRadius: 4,
    overflow: 'hidden',
    fontSize: 13,
  },
  chipLabel: {
    background: '#e8e8e8',
    fontWeight: 700,
    padding: '4px 10px',
    borderLeft: '1px solid #aaa',
  },
  chipValue: {
    padding: '4px 10px',
  },
  windowBlock: {
    pageBreakInside: 'avoid',
    breakInside: 'avoid',
  },
  windowRow: {
    display: 'flex',
    gap: 16,
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  infoTable: {
    flex: '0 0 48%',
    borderCollapse: 'collapse',
    fontSize: 13,
    width: '48%',
  },
  labelCell: {
    border: '1px solid #bbb',
    padding: '4px 10px',
    fontWeight: 700,
    background: '#e8e8e8',
    whiteSpace: 'nowrap',
    textAlign: 'right',
  },
  totalLabelCell: {
    background: '#d0d0d0',
  },
  valueCell: {
    border: '1px solid #bbb',
    padding: '4px 10px',
    textAlign: 'right',
  },
  boldValue: {
    fontWeight: 700,
  },
  imageWrap: {
    flex: '0 0 48%',
    width: '48%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
    border: '1px solid #ddd',
    borderRadius: 4,
    background: '#fafafa',
    padding: 8,
    gap: 6,
  },
  imageCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  windowImage: {
    maxWidth: '100%',
    maxHeight: 220,
    objectFit: 'contain',
  },
  dimWidth: {
    fontSize: 12,
    fontWeight: 700,
    color: '#333',
    textAlign: 'center',
  },
  dimHeight: {
    fontSize: 12,
    fontWeight: 700,
    color: '#333',
    writingMode: 'vertical-rl',
    textOrientation: 'mixed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signature: {
    fontSize: 13,
    fontWeight: 700,
    textAlign: 'left',
    marginBottom: 8,
    marginTop: 4,
  },
  separator: {
    border: 'none',
    borderTop: '1px solid #ccc',
    margin: '16px 0',
  },
  termsSection: {
    marginTop: 32,
    borderTop: '2px solid #000',
    paddingTop: 12,
  },
  termsTitle: {
    fontWeight: 700,
    fontSize: 15,
    marginBottom: 10,
    textAlign: 'right',
  },
  termsList: {
    margin: 0,
    paddingRight: 20,
    paddingLeft: 0,
    textAlign: 'right',
  },
  termsItem: {
    marginBottom: 6,
    fontSize: 12,
    lineHeight: 1.7,
  },
}
