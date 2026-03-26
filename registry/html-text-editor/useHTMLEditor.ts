import { useState } from "react"
import { toast } from "react-toastify"
import { defaultTemplate } from "./templates"
import type { PreviewDevice, EditorStats } from "./types"

export function useHTMLEditor() {
  const [htmlContent, setHtmlContent] = useState(defaultTemplate)
  const [activeTab, setActiveTab] = useState("editor")
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>("desktop")

  const stats: EditorStats = {
    lineCount: htmlContent.split("\n").length,
    charCount: htmlContent.length,
    wordCount: htmlContent.trim().split(/\s+/).length,
  }

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type === "text/html" || file.name.endsWith(".html") || file.name.endsWith(".htm")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target?.result as string
          setHtmlContent(content)
          toast.success(`🎉 ¡Archivo importado! ${file.name} se ha cargado correctamente.`)
        }
        reader.readAsText(file)
      } else {
        toast.error("❌ Tipo de archivo no válido. Por favor, selecciona un archivo HTML (.html o .htm).")
      }
    }
  }

  const handleExport = () => {
    const blob = new Blob([htmlContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "mi-documento.html"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success("📥 ¡Archivo exportado! Tu archivo HTML se ha descargado correctamente.")
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(htmlContent)
      toast.success("📋 ¡Código copiado! El código HTML se ha copiado al portapapeles.")
    } catch {
      toast.error("❌ Error al copiar. No se pudo copiar el código al portapapeles.")
    }
  }

  const handleClear = () => {
    setHtmlContent("")
    toast.success("🧹 ¡Editor limpiado! El contenido del editor se ha eliminado.")
  }

  const insertTemplate = (template: string, name: string) => {
    setHtmlContent(template)
    toast.success(`✨ ¡Plantilla insertada! Se ha cargado la plantilla: ${name}`)
  }

  return {
    htmlContent,
    setHtmlContent,
    activeTab,
    setActiveTab,
    previewDevice,
    setPreviewDevice,
    stats,
    handleFileImport,
    handleExport,
    handleCopyCode,
    handleClear,
    insertTemplate,
  }
}
