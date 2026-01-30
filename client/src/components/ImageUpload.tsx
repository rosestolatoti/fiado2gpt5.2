import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
  maxSize?: number; // em bytes
  disabled?: boolean;
  className?: string;
}

export function ImageUpload({
  value = [],
  onChange,
  maxImages = 5,
  maxSize = 5 * 1024 * 1024, // 5MB
  disabled = false,
  className
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Para simplificar, vamos usar FileReader para converter para base64
  // Em produção, isso deve subir para um servidor ou CDN
  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || disabled) return;

    const validFiles = Array.from(files).filter(file => {
      if (!file.type.startsWith('image/')) {
        alert('Apenas imagens são permitidas');
        return false;
      }
      
      if (file.size > maxSize) {
        alert(`A imagem ${file.name} é muito grande. Máximo: ${Math.round(maxSize / 1024 / 1024)}MB`);
        return false;
      }
      
      return true;
    });

    if (value.length + validFiles.length > maxImages) {
      alert(`Máximo de ${maxImages} imagens permitidas`);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const newUrls: string[] = [];
      
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        const url = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
        
        newUrls.push(url);
        setUploadProgress(((i + 1) / validFiles.length) * 100);
      }

      onChange([...value, ...newUrls]);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      alert('Erro ao fazer upload das imagens');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [value, onChange, maxImages, maxSize, disabled]);

  const removeImage = useCallback((index: number) => {
    if (disabled) return;
    
    const newUrls = value.filter((_, i) => i !== index);
    onChange(newUrls);
  }, [value, onChange, disabled]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect, disabled]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Área de Upload */}
      {value.length < maxImages && !disabled && (
        <Card
          className="border-2 border-dashed border-muted-foreground/25 p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
            disabled={disabled}
          />
          
          <div className="space-y-2">
            <Upload className="size-8 mx-auto text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">
                {uploading ? 'Fazendo upload...' : 'Clique ou arraste imagens aqui'}
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, WEBP até {Math.round(maxSize / 1024 / 1024)}MB cada
              </p>
              <p className="text-xs text-muted-foreground">
                {value.length}/{maxImages} imagens
              </p>
            </div>
          </div>

          {uploading && (
            <div className="mt-4 space-y-2">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-xs text-muted-foreground">
                {Math.round(uploadProgress)}% completo
              </p>
            </div>
          )}
        </Card>
      )}

      {/* Preview das Imagens */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <Card key={index} className="relative overflow-hidden group">
              <div className="aspect-square relative">
                <img
                  src={url}
                  alt={`Imagem ${index + 1}`}
                  className="size-full object-cover"
                />
                
                {/* Botão de Remover */}
                {!disabled && (
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="size-3" />
                  </Button>
                )}

                {/* Indicador de Thumbnail */}
                {index === 0 && (
                  <div className="absolute top-2 left-2">
                    <div className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium">
                      Principal
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}

          {/* Botão para Adicionar Mais */}
          {value.length < maxImages && !disabled && !uploading && (
            <Card
              className="border-2 border-dashed border-muted-foreground/25 p-4 cursor-pointer hover:border-primary/50 transition-colors flex flex-col items-center justify-center min-h-[120px]"
              onClick={() => fileInputRef.current?.click()}
            >
              <Plus className="size-6 text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground">Adicionar imagem</p>
            </Card>
          )}
        </div>
      )}

      {/* Informações Adicionais */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>• A primeira imagem será a capa do produto</p>
        <p>• Arraste as imagens para reordenar (em breve)</p>
        <p>• Formatos aceitos: PNG, JPG, WEBP</p>
      </div>
    </div>
  );
}

// Import necessário (componente Plus)
import { Plus } from "lucide-react";