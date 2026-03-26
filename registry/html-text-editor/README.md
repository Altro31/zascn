# HTML Text Editor Components

Este directorio contiene un editor HTML moderno y componentizado que permite crear, editar y previsualizar código HTML en tiempo real.

## Estructura de Componentes

### Archivo Principal
- **`html-rich-editor.tsx`** - Componente principal que exporta el editor (mantiene compatibilidad)
- **`html-editor-main.tsx`** - Componente principal refactorizado que integra todos los subcomponentes

### Componentes Modulares

#### `editor-header.tsx`
Header del editor con:
- Logo y título de la aplicación
- Badge de versión
- Diseño con gradiente y efectos de cristal

#### `editor-toolbar.tsx`
Barra de herramientas con grupos de funcionalidades:
- **Grupo de archivos**: Importar y exportar
- **Grupo de edición**: Copiar código y limpiar editor
- **Grupo de plantillas**: Insertar plantillas predefinidas

#### `code-editor.tsx`
Editor de código HTML con:
- Área de texto para código HTML
- Estadísticas en tiempo real (líneas, caracteres, palabras)
- Diseño con gradiente sutil

#### `preview-panel.tsx`
Panel de vista previa con:
- Vista previa en tiempo real del HTML
- Selector de dispositivos (Desktop, Tablet, Mobile)
- Iframe con sandbox para seguridad

#### `help-guide.tsx`
Guía de ayuda con:
- Funciones principales del editor
- Información sobre vista previa
- Consejos profesionales de uso

### Utilidades y Configuración

#### `types.ts`
Definiciones de tipos TypeScript:
- `PreviewDevice` - Tipos de dispositivos para vista previa
- `EditorStats` - Estadísticas del editor
- `Template` - Estructura de plantillas

#### `templates.ts`
Plantillas HTML predefinidas:
- `defaultTemplate` - Plantilla por defecto con ejemplos
- `modernTemplate` - Plantilla moderna minimalista
- `portfolioTemplate` - Plantilla para portfolio personal

#### `useHTMLEditor.ts`
Hook personalizado que maneja:
- Estado del contenido HTML
- Navegación entre tabs
- Manejo de archivos (importar/exportar)
- Notificaciones con toast
- Inserción de plantillas
- Cálculo de estadísticas

#### `index.ts`
Archivo de barril que exporta:
- Componente principal
- Subcomponentes individuales
- Hook personalizado
- Tipos y plantillas

## Uso

### Importación básica
```tsx
import HTMLEditor from "@/components/html-text-editor"

export default function App() {
  return <HTMLEditor />
}
```

### Uso de componentes individuales
```tsx
import { 
  CodeEditor, 
  PreviewPanel, 
  useHTMLEditor 
} from "@/components/html-text-editor"

export default function CustomEditor() {
  const { htmlContent, setHtmlContent, stats } = useHTMLEditor()
  
  return (
    <div>
      <CodeEditor 
        htmlContent={htmlContent}
        onContentChange={setHtmlContent}
        stats={stats}
      />
      <PreviewPanel 
        htmlContent={htmlContent}
        previewDevice="desktop"
        onDeviceChange={() => {}}
      />
    </div>
  )
}
```

## Características

### 🎨 Diseño Moderno
- Gradientes y efectos de cristal (glassmorphism)
- Animaciones suaves de transición
- Diseño responsive
- Tema coherente con colores azul/púrpura

### ⚡ Funcionalidades
- Editor de código en tiempo real
- Vista previa instantánea en iframe seguro
- Simulación de dispositivos (Desktop/Tablet/Mobile)
- Importación/exportación de archivos HTML
- Plantillas predefinidas modernas
- Copia al portapapeles
- Estadísticas del código en tiempo real

### 🔧 Tecnología
- React 18+ con TypeScript
- Hooks personalizados para manejo de estado
- Componentes modulares y reutilizables
- Notificaciones con react-toastify
- Sandbox seguro para preview
- Diseño con Tailwind CSS

### 🛡️ Seguridad
- Vista previa en iframe con sandbox
- Validación de tipos de archivo
- Manejo seguro de errores

## Dependencias

El componente utiliza las siguientes dependencias del proyecto:
- `@/components/button/button` - Botones personalizados
- `@/components/badge/badge` - Badges informativos  
- `@/components/cards/card` - Componentes de tarjeta
- `lucide-react` - Iconos modernos
- `react-toastify` - Notificaciones toast
- Tailwind CSS para estilos

## Mantenimiento

### Agregar nuevas plantillas
1. Añadir la plantilla en `templates.ts`
2. Exportarla en el archivo
3. Añadir botón en `editor-toolbar.tsx`

### Personalizar estilos
- Los estilos principales están en cada componente
- Usar las clases de Tailwind existentes
- Mantener el tema de gradientes azul/púrpura

### Agregar funcionalidades
- Crear nuevos hooks en archivos separados
- Mantener la separación de responsabilidades
- Actualizar tipos en `types.ts` si es necesario
