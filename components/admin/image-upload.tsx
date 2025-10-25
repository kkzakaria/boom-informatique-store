"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  onImageUploaded?: (imageData: UploadedImage) => void
  maxFiles?: number
  accept?: string
}

interface UploadedImage {
  url: string
  fileName: string
  originalName: string
  size: number
  type: string
}

export function ImageUpload({
  onImageUploaded,
  maxFiles = 5,
  accept = "image/*"
}: ImageUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    // Check if adding these files would exceed the limit
    if (uploadedImages.length + files.length > maxFiles) {
      setError(`Vous ne pouvez pas uploader plus de ${maxFiles} images.`)
      return
    }

    setUploading(true)
    setError("")

    try {
      const newImages: UploadedImage[] = []

      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Erreur lors de l\'upload')
        }

        newImages.push(result)
      }

      setUploadedImages(prev => [...prev, ...newImages])

      // Call callback for each uploaded image
      newImages.forEach(image => {
        onImageUploaded?.(image)
      })

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors de l\'upload')
    } finally {
      setUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="image-upload">Images du produit</Label>
        <p className="text-sm text-gray-600 mt-1">
          Formats acceptés: JPEG, PNG, WebP. Taille maximum: 5MB par image.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Upload Area */}
      <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
        <CardContent className="p-6">
          <div className="text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={openFileDialog}
                disabled={uploading || uploadedImages.length >= maxFiles}
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Upload en cours...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Sélectionner des images
                  </>
                )}
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                ou glissez-déposez vos fichiers ici
              </p>
            </div>
            <Input
              ref={fileInputRef}
              type="file"
              accept={accept}
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading || uploadedImages.length >= maxFiles}
            />
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Images Preview */}
      {uploadedImages.length > 0 && (
        <div className="space-y-2">
          <Label>Images uploadées ({uploadedImages.length}/{maxFiles})</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {uploadedImages.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={image.url}
                    alt={image.originalName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1 truncate" title={image.originalName}>
                  {image.originalName}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Progress Info */}
      {uploading && (
        <div className="text-sm text-blue-600">
          Upload des images en cours...
        </div>
      )}
    </div>
  )
}