import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useFormContext } from "react-hook-form";
import { useState, useEffect } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface ChapterFormProps {
  index: number;
  onRemove: () => void;
  initialImageUrl?: string;
}

export function ChapterForm({ index, onRemove, initialImageUrl }: ChapterFormProps) {
  const form = useFormContext();
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (initialImageUrl) {
      setImagePreview(initialImageUrl);
      form.setValue(`chapters.${index}.imageUrl`, initialImageUrl);
    }
  }, [initialImageUrl, form, index]);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const fileExt = file.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError, data } = await supabase.storage
          .from('chapter-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('chapter-images')
          .getPublicUrl(filePath);

        setImagePreview(publicUrl);
        form.setValue(`chapters.${index}.imageUrl`, publicUrl);
        form.setValue(`chapters.${index}.imageFile`, file);

        toast.success('Image uploaded successfully');
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Failed to upload image');
      }
    }
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Chapter {index + 1}</h4>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <FormField
          control={form.control}
          name={`chapters.${index}.title`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chapter Title</FormLabel>
              <FormControl>
                <Input placeholder="Chapter title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`chapters.${index}.content`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chapter Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your chapter content here..."
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`chapters.${index}.imageUrl`}
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Chapter Image</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                    {...field}
                  />
                  {imagePreview && (
                    <AspectRatio ratio={16 / 9}>
                      <img
                        src={imagePreview}
                        alt="Chapter preview"
                        className="rounded-md object-cover w-full h-full"
                      />
                    </AspectRatio>
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`chapters.${index}.order`}
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <Input type="hidden" {...field} value={index} />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
