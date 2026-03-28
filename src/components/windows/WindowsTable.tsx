import { useState } from 'react'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '#/components/ui/table'
import { Input } from '#/components/ui/input'
import { Button } from '#/components/ui/button'
import { $createWindow, $updateWindow, $deleteWindow, $duplicateWindow } from '#/server/windows'
import type { Window } from '#/db'
import {
  WINDOW_TYPES,
  SUBTYPES,
  CATEGORIES,
  PLACE_OPTIONS,
  COLOR_OPTIONS,
  GLASS_OPTIONS,
  GLASS_COLOR_OPTIONS,
  WIRE_OPTIONS,
  MATERIAL_OPTIONS,
} from '#/constants/windows'
import type { WindowType } from '#/constants/windows'

const selectClass =
  'h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 md:text-sm dark:bg-input/30'

interface WindowsTableProps {
  windows: Window[]
  projectId: number
  isAdding: boolean
  onCancel: () => void
  onWindowAdded: () => void
}

type RowFields = {
  type: string
  subtype: string
  category: string
  place: string
  width: string
  accurateHeight: string
  totalHeight: string
  totalArea: string
  count: string
  color: string
  glass: string
  glassColor: string
  wire: string
  materialType: string
  meterPrice: string
  totalPrice: string
}

function windowToFields(win: Window): RowFields {
  return {
    type: win.type,
    subtype: win.subtype,
    category: win.category,
    place: win.place ?? '',
    width: win.width,
    accurateHeight: win.accurateHeight,
    totalHeight: win.totalHeight,
    totalArea: win.totalArea,
    count: String(win.count),
    color: win.color,
    glass: win.glass,
    glassColor: win.glassColor,
    wire: win.wire,
    materialType: win.materialType,
    meterPrice: win.meterPrice,
    totalPrice: win.totalPrice,
  }
}

const emptyRow: RowFields = {
  type: '',
  subtype: '',
  category: '',
  place: '',
  width: '',
  accurateHeight: '',
  totalHeight: '',
  totalArea: '',
  count: '',
  color: '',
  glass: '',
  glassColor: '',
  wire: '',
  materialType: '',
  meterPrice: '',
  totalPrice: '',
}

function RowInputs({
  row,
  onChange,
}: {
  row: RowFields
  onChange: (field: keyof RowFields, value: string | boolean) => void
}) {
  const subtypeOptions = row.type in SUBTYPES ? SUBTYPES[row.type as WindowType] : []
  const categoryOptions = row.subtype in CATEGORIES ? CATEGORIES[row.subtype] : []

  return (
    <>
      <TableCell>
        <select
          value={row.type}
          onChange={e => {
            onChange('type', e.target.value)
            onChange('subtype', '')
            onChange('category', '')
          }}
          className={`${selectClass} min-w-[110px]`}
        >
          <option value="">-- اختر --</option>
          {WINDOW_TYPES.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </TableCell>
      <TableCell>
        <select
          value={row.subtype}
          onChange={e => {
            onChange('subtype', e.target.value)
            onChange('category', '')
          }}
          className={`${selectClass} min-w-[150px]`}
          disabled={subtypeOptions.length === 0}
        >
          <option value="">-- اختر --</option>
          {subtypeOptions.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </TableCell>
      <TableCell>
        <select
          value={row.category}
          onChange={e => onChange('category', e.target.value)}
          className={`${selectClass} min-w-[200px]`}
          disabled={categoryOptions.length === 0}
        >
          <option value="">-- اختر --</option>
          {categoryOptions.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </TableCell>
      <TableCell>
        <select value={row.place} onChange={e => onChange('place', e.target.value)} className={`${selectClass} min-w-[120px]`}>
          <option value="">-- اختر --</option>
          {PLACE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </TableCell>
      <TableCell>
        <Input type="number" value={row.width} onChange={e => onChange('width', e.target.value)} placeholder="0.00" className="min-w-[70px]" />
      </TableCell>
      <TableCell>
        <Input type="number" value={row.accurateHeight} onChange={e => onChange('accurateHeight', e.target.value)} placeholder="0.00" className="min-w-[70px]" />
      </TableCell>
      <TableCell>
        <Input type="number" value={row.totalHeight} onChange={e => onChange('totalHeight', e.target.value)} placeholder="0.00" className="min-w-[70px]" />
      </TableCell>
      <TableCell>
        <Input type="number" value={row.totalArea} readOnly placeholder="0.00" className="min-w-[70px] bg-muted/50 cursor-default" />
      </TableCell>
      <TableCell>
        <Input type="number" value={row.count} onChange={e => onChange('count', e.target.value)} placeholder="0" className="min-w-[60px]" />
      </TableCell>
      <TableCell>
        <select value={row.color} onChange={e => onChange('color', e.target.value)} className={`${selectClass} min-w-[110px]`}>
          <option value="">-- اختر --</option>
          {COLOR_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </TableCell>
      <TableCell>
        <select value={row.glass} onChange={e => onChange('glass', e.target.value)} className={`${selectClass} min-w-[170px]`}>
          <option value="">-- اختر --</option>
          {GLASS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </TableCell>
      <TableCell>
        <select value={row.glassColor} onChange={e => onChange('glassColor', e.target.value)} className={`${selectClass} min-w-[120px]`}>
          <option value="">-- اختر --</option>
          {GLASS_COLOR_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </TableCell>
      <TableCell>
        <select value={row.wire} onChange={e => onChange('wire', e.target.value)} className={`${selectClass} min-w-[110px]`}>
          <option value="">-- اختر --</option>
          {WIRE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </TableCell>
      <TableCell>
        <select value={row.materialType} onChange={e => onChange('materialType', e.target.value)} className={`${selectClass} min-w-[90px]`}>
          <option value="">-- اختر --</option>
          {MATERIAL_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </TableCell>
      <TableCell>
        <Input type="number" value={row.meterPrice} onChange={e => onChange('meterPrice', e.target.value)} placeholder="0.00" className="min-w-[80px]" />
      </TableCell>
      <TableCell>
        <Input type="number" value={row.totalPrice} readOnly placeholder="0.00" className="min-w-[80px] bg-muted/50 cursor-default" />
      </TableCell>
    </>
  )
}

export function WindowsTable({
  windows,
  projectId,
  isAdding,
  onCancel,
  onWindowAdded,
}: WindowsTableProps) {
  const [newRow, setNewRow] = useState<RowFields>(emptyRow)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editRow, setEditRow] = useState<RowFields>(emptyRow)
  const [saving, setSaving] = useState(false)

  function withDerived(prev: RowFields, field: keyof RowFields, value: string | boolean): RowFields {
    const next = { ...prev, [field]: value }
    const area = (parseFloat(next.totalHeight) || 0) * (parseFloat(next.width) || 0)
    next.totalArea = area > 0 ? String(area) : ''
    const price = (parseFloat(next.meterPrice) || 0) * area * (parseInt(next.count) || 0)
    next.totalPrice = price > 0 ? String(price) : ''
    return next
  }

  function setNewField(field: keyof RowFields, value: string | boolean) {
    setNewRow(prev => withDerived(prev, field, value))
  }

  function setEditField(field: keyof RowFields, value: string | boolean) {
    setEditRow(prev => withDerived(prev, field, value))
  }

  function startEdit(win: Window) {
    setEditingId(win.id)
    setEditRow(windowToFields(win))
  }

  function cancelEdit() {
    setEditingId(null)
    setEditRow(emptyRow)
  }

  function handleCancel() {
    setNewRow(emptyRow)
    onCancel()
  }

  async function deleteWin(id: number) {
    setSaving(true)
    try {
      await $deleteWindow({ data: id })
      onWindowAdded()
    } finally {
      setSaving(false)
    }
  }

  async function duplicateWin(id: number) {
    setSaving(true)
    try {
      await $duplicateWindow({ data: id })
      onWindowAdded()
    } finally {
      setSaving(false)
    }
  }

  async function saveNew() {
    setSaving(true)
    try {
      await $createWindow({
        data: {
          projectId,
          type: newRow.type,
          subtype: newRow.subtype,
          category: newRow.category,
          place: newRow.place,
          width: newRow.width,
          accurateHeight: newRow.accurateHeight,
          totalHeight: newRow.totalHeight,
          totalArea: newRow.totalArea,
          count: Number(newRow.count),
          color: newRow.color,
          glass: newRow.glass,
          glassColor: newRow.glassColor,
          wire: newRow.wire,
          materialType: newRow.materialType,
          meterPrice: newRow.meterPrice,
          totalPrice: newRow.totalPrice,
        },
      })
      setNewRow(emptyRow)
      onWindowAdded()
    } finally {
      setSaving(false)
    }
  }

  async function saveEdit() {
    if (editingId === null) return
    setSaving(true)
    try {
      await $updateWindow({
        data: {
          id: editingId,
          type: editRow.type,
          subtype: editRow.subtype,
          category: editRow.category,
          place: editRow.place,
          width: editRow.width,
          accurateHeight: editRow.accurateHeight,
          totalHeight: editRow.totalHeight,
          totalArea: editRow.totalArea,
          count: Number(editRow.count),
          color: editRow.color,
          glass: editRow.glass,
          glassColor: editRow.glassColor,
          wire: editRow.wire,
          materialType: editRow.materialType,
          meterPrice: editRow.meterPrice,
          totalPrice: editRow.totalPrice,
        },
      })
      setEditingId(null)
      onWindowAdded()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-8">#</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Subtype</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Place</TableHead>
          <TableHead>Width</TableHead>
          <TableHead>Acc. Height</TableHead>
          <TableHead>Total Height</TableHead>
          <TableHead>Total Area</TableHead>
          <TableHead>Count</TableHead>
          <TableHead>Color</TableHead>
          <TableHead>Glass</TableHead>
          <TableHead>Glass Color</TableHead>
          <TableHead>Wire</TableHead>
          <TableHead>Material</TableHead>
          <TableHead>Meter Price</TableHead>
          <TableHead>Total Price</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {windows.map((win, i) =>
          editingId === win.id ? (
            <TableRow key={win.id}>
              <TableCell>{i + 1}</TableCell>
              <RowInputs row={editRow} onChange={setEditField} />
              <TableCell>
                <div className="flex gap-1">
                  <Button size="sm" onClick={saveEdit} disabled={saving}>
                    {saving ? 'Saving…' : 'Save'}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={cancelEdit} disabled={saving}>
                    Cancel
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            <TableRow
              key={win.id}
              onDoubleClick={() => startEdit(win)}
              className="cursor-pointer select-none"
              title="Double-click to edit"
            >
              <TableCell>{i + 1}</TableCell>
              <TableCell>{win.type}</TableCell>
              <TableCell>{win.subtype}</TableCell>
              <TableCell>{win.category}</TableCell>
              <TableCell>{win.place}</TableCell>
              <TableCell>{win.width}</TableCell>
              <TableCell>{win.accurateHeight}</TableCell>
              <TableCell>{win.totalHeight}</TableCell>
              <TableCell>{win.totalArea}</TableCell>
              <TableCell>{win.count}</TableCell>
              <TableCell>{win.color}</TableCell>
              <TableCell>{win.glass}</TableCell>
              <TableCell>{win.glassColor}</TableCell>
              <TableCell>{win.wire}</TableCell>
              <TableCell>{win.materialType}</TableCell>
              <TableCell>{win.meterPrice}</TableCell>
              <TableCell>{win.totalPrice}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={e => { e.stopPropagation(); duplicateWin(win.id) }}
                    disabled={saving}
                  >
                    duplicate
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    onClick={e => { e.stopPropagation(); deleteWin(win.id) }}
                    disabled={saving}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )
        )}

        {isAdding && (
          <TableRow>
            <TableCell />
            <RowInputs row={newRow} onChange={setNewField} />
            <TableCell>
              <div className="flex gap-1">
                <Button size="sm" onClick={saveNew} disabled={saving}>
                  {saving ? 'Saving…' : 'Save'}
                </Button>
                <Button size="sm" variant="ghost" onClick={handleCancel} disabled={saving}>
                  Cancel
                </Button>
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
