"use client"

import type React from "react"

import { useEditor, EditorContent, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import Image from "@tiptap/extension-image"
import {
  Bold,
  Italic,
  UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  ImageIcon,
  Loader2,
} from "lucide-react"
import { Toggle } from "@/components/ui/toggle"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { useRef, useState } from "react"
import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import ImageCropper from "./ImageCropper"
import "../lib/editor.css"


interface RichTextEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  minHeight?: string
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Start typing...",
  minHeight = "200px",
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
        defaultAlignment: "left",
      }),
      Image.configure({
        inline: false,
        allowBase64: false, // Disable base64 to ensure we only use URLs
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: cn(
          "min-h-[100px] p-3 rounded-md border border-input bg-background focus:outline-none",
          "[&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-semibold",
          "prose-img:rounded-md prose-img:mx-auto prose-img:max-h-96",
        ),
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  return (
    <div className="flex flex-col gap-2 w-full">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} className="editor-content" />
    </div>
  )
}

interface ToolbarProps {
  editor: Editor | null
}

function Toolbar({ editor }: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [showCropper, setShowCropper] = useState(false)
  const generateUploadUrl = useMutation(api.upload.generateUploadUrl)

  if (!editor) {
    return null
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || !editor) return

    const file = files[0]
    setSelectedFile(file)
    setShowCropper(true)

    // Reset input value so the same file can be selected again
    if (e.target) e.target.value = ""
  }

  const handleCropCancel = () => {
    setShowCropper(false)
    setSelectedFile(null)
  }

  const handleCropDone = async (croppedImageUrl: string) => {
    if (!selectedFile || !editor) return

    setIsUploading(true)
    setShowCropper(false)

    try {
      // Convert blob URL to File object
      const response = await fetch(croppedImageUrl)
      const blob = await response.blob()
      const croppedFile = new File([blob], selectedFile.name, { type: selectedFile.type })

      // Generate upload URL from Convex
      const uploadUrl = await generateUploadUrl()

      // Upload the cropped file to the generated URL
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": croppedFile.type },
        body: croppedFile,
      })

      const { storageId } = await result.json()

      // Get the URL for the uploaded file
      const imageUrl = `/api/storage/${storageId}`

      // Insert the image with the URL
      editor.chain().focus().setImage({ src: imageUrl }).run()
    } catch (error) {
      console.error("Error uploading cropped image:", error)
    } finally {
      setIsUploading(false)
      setSelectedFile(null)

      // Revoke the object URL to avoid memory leaks
      URL.revokeObjectURL(croppedImageUrl)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-1 border rounded-md p-1 bg-muted/50">
      <div className="flex items-center gap-1">
        <Toggle
          size="sm"
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          aria-label="Bold"
        >
          <Bold className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive("underline")}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
          aria-label="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Toggle>
        <div className="flex items-center">
          <select
            className="text-sm px-2 py-1 rounded-md border border-input bg-background"
            value={
              editor.isActive("heading", { level: 1 })
                ? "h1"
                : editor.isActive("heading", { level: 2 })
                  ? "h2"
                  : "paragraph"
            }
            onChange={(e) => {
              const value = e.target.value
              editor.chain().focus().setParagraph().run()

              if (value === "h1") {
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              } else if (value === "h2") {
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
            }}
          >
            <option value="paragraph">Paragraph</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
          </select>
        </div>
      </div>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <div className="flex items-center gap-1">
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: "left" })}
          onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}
          aria-label="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: "center" })}
          onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}
          aria-label="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: "right" })}
          onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}
          aria-label="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: "justify" })}
          onPressedChange={() => editor.chain().focus().setTextAlign("justify").run()}
          aria-label="Justify"
        >
          <AlignJustify className="h-4 w-4" />
        </Toggle>
      </div>

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Toggle
        size="sm"
        onPressedChange={() => {
          if (fileInputRef.current) {
            fileInputRef.current.click()
          }
        }}
        aria-label="Insert Image"
        disabled={isUploading}
      >
        {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
      </Toggle>
      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileSelect} hidden />

      <div className="ml-auto flex items-center gap-1">
        <Toggle
          size="sm"
          onPressedChange={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          aria-label="Undo"
        >
          <Undo className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          onPressedChange={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          aria-label="Redo"
        >
          <Redo className="h-4 w-4" />
        </Toggle>
      </div>

      {showCropper && selectedFile && (
        <ImageCropper file={selectedFile} onCropDone={handleCropDone} onCancel={handleCropCancel} />
      )}
    </div>
  )
}
