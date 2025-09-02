"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Edit2, Check, XIcon } from "lucide-react"

interface ConfigListManagerProps {
  title: string
  items: string[]
  onAdd: (item: string) => void
  onRemove: (item: string) => void
  onEdit?: (oldItem: string, newItem: string) => void
  placeholder: string
}

export function ConfigListManager({ title, items, onAdd, onRemove, onEdit, placeholder }: ConfigListManagerProps) {
  const [newItem, setNewItem] = useState("")
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")

  const handleAdd = () => {
    if (newItem.trim() && !items.includes(newItem.trim())) {
      onAdd(newItem.trim())
      setNewItem("")
    }
  }

  const handleEdit = (item: string) => {
    setEditingItem(item)
    setEditValue(item)
  }

  const handleSaveEdit = () => {
    if (editValue.trim() && editValue !== editingItem && !items.includes(editValue.trim())) {
      onEdit?.(editingItem!, editValue.trim())
    }
    setEditingItem(null)
    setEditValue("")
  }

  const handleCancelEdit = () => {
    setEditingItem(null)
    setEditValue("")
  }

  return (
    <Card className="bg-rose-50/50 border-rose-200">
      <CardHeader>
        <CardTitle className="text-rose-800">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new item */}
        <div className="flex gap-2">
          <Input
            placeholder={placeholder}
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAdd()}
            className="border-rose-200 focus:border-rose-400"
          />
          <Button onClick={handleAdd} size="sm" className="bg-rose-600 hover:bg-rose-700 text-white">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Items list */}
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <div key={item} className="flex items-center gap-1">
              {editingItem === item ? (
                <div className="flex items-center gap-1 bg-white rounded-md p-1 border border-rose-200">
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="h-6 text-xs border-0 p-1 min-w-0 w-20"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") handleSaveEdit()
                      if (e.key === "Escape") handleCancelEdit()
                    }}
                    autoFocus
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleSaveEdit}
                    className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCancelEdit}
                    className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
                  >
                    <XIcon className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <Badge
                  variant="secondary"
                  className="bg-rose-100 text-rose-800 hover:bg-rose-200 flex items-center gap-1 pr-1"
                >
                  <span>{item}</span>
                  <div className="flex items-center gap-0.5">
                    {onEdit && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(item)}
                        className="h-4 w-4 p-0 text-rose-600 hover:text-rose-700"
                      >
                        <Edit2 className="h-2.5 w-2.5" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRemove(item)}
                      className="h-4 w-4 p-0 text-rose-600 hover:text-rose-700"
                    >
                      <X className="h-2.5 w-2.5" />
                    </Button>
                  </div>
                </Badge>
              )}
            </div>
          ))}
        </div>

        {items.length === 0 && <p className="text-rose-600 text-sm italic">No hay elementos configurados</p>}
      </CardContent>
    </Card>
  )
}
