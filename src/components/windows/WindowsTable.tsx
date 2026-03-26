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
import { $createWindow, $updateWindow } from '#/server/windows'
import type { Window } from '#/db'

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
  width: string
  accurateHeight: string
  totalHeight: string
  totalArea: string
  count: string
  color: string
  glass: string
  glassColor: string
  wire: boolean
  materialType: string
  meterPrice: string
  totalPrice: string
}

function windowToFields(win: Window): RowFields {
  return {
    type: win.type,
    subtype: win.subtype,
    category: win.category,
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
  width: '',
  accurateHeight: '',
  totalHeight: '',
  totalArea: '',
  count: '',
  color: '',
  glass: '',
  glassColor: '',
  wire: false,
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
  return (
    <>
      <TableCell>
        <Input value={row.type} onChange={e => onChange('type', e.target.value)} placeholder="Type" className="min-w-[90px]" />
      </TableCell>
      <TableCell>
        <Input value={row.subtype} onChange={e => onChange('subtype', e.target.value)} placeholder="Subtype" className="min-w-[90px]" />
      </TableCell>
      <TableCell>
        <Input value={row.category} onChange={e => onChange('category', e.target.value)} placeholder="Category" className="min-w-[90px]" />
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
        <Input type="number" value={row.totalArea} onChange={e => onChange('totalArea', e.target.value)} placeholder="0.00" className="min-w-[70px]" />
      </TableCell>
      <TableCell>
        <Input type="number" value={row.count} onChange={e => onChange('count', e.target.value)} placeholder="0" className="min-w-[60px]" />
      </TableCell>
      <TableCell>
        <Input value={row.color} onChange={e => onChange('color', e.target.value)} placeholder="Color" className="min-w-[80px]" />
      </TableCell>
      <TableCell>
        <Input value={row.glass} onChange={e => onChange('glass', e.target.value)} placeholder="Glass" className="min-w-[80px]" />
      </TableCell>
      <TableCell>
        <Input value={row.glassColor} onChange={e => onChange('glassColor', e.target.value)} placeholder="Glass Color" className="min-w-[80px]" />
      </TableCell>
      <TableCell>
        <input
          type="checkbox"
          checked={row.wire}
          onChange={e => onChange('wire', e.target.checked)}
          className="h-4 w-4 cursor-pointer"
        />
      </TableCell>
      <TableCell>
        <Input value={row.materialType} onChange={e => onChange('materialType', e.target.value)} placeholder="Material" className="min-w-[80px]" />
      </TableCell>
      <TableCell>
        <Input type="number" value={row.meterPrice} onChange={e => onChange('meterPrice', e.target.value)} placeholder="0.00" className="min-w-[80px]" />
      </TableCell>
      <TableCell>
        <Input type="number" value={row.totalPrice} onChange={e => onChange('totalPrice', e.target.value)} placeholder="0.00" className="min-w-[80px]" />
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

  function setNewField(field: keyof RowFields, value: string | boolean) {
    setNewRow(prev => ({ ...prev, [field]: value }))
  }

  function setEditField(field: keyof RowFields, value: string | boolean) {
    setEditRow(prev => ({ ...prev, [field]: value }))
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

  async function saveNew() {
    setSaving(true)
    try {
      await $createWindow({
        data: {
          projectId,
          type: newRow.type,
          subtype: newRow.subtype,
          category: newRow.category,
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
              <TableCell>{win.width}</TableCell>
              <TableCell>{win.accurateHeight}</TableCell>
              <TableCell>{win.totalHeight}</TableCell>
              <TableCell>{win.totalArea}</TableCell>
              <TableCell>{win.count}</TableCell>
              <TableCell>{win.color}</TableCell>
              <TableCell>{win.glass}</TableCell>
              <TableCell>{win.glassColor}</TableCell>
              <TableCell>{win.wire ? 'Yes' : 'No'}</TableCell>
              <TableCell>{win.materialType}</TableCell>
              <TableCell>{win.meterPrice}</TableCell>
              <TableCell>{win.totalPrice}</TableCell>
              <TableCell />
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
