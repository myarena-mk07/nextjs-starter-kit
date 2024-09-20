"use client"

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ColorPicker } from '@/components/ui/color-picker'
import { useDropzone } from 'react-dropzone'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChevronDown, ChevronUp, Download, RefreshCw, Edit2 } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { cn } from "@/lib/utils"
import { useMediaQuery } from '@/hooks/use-media-query'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion';
import { AutoSuggestedBackgrounds } from './_components/AutoSuggestedBackgrounds';
import ColorThief from 'colorthief';

// Update the BackgroundType
type BackgroundType = 'gradient' | 'image' | 'custom' | 'freeform';

type ColorPoint = {
  color: string;
  x: number;
  y: number;
};

const ImagePreview = ({ image, containerRef, backgroundSettings, imageSettings, shadowSettings, previewSize, onDownloadableCanvasReady }: {
  image: HTMLImageElement;
  containerRef: React.RefObject<HTMLDivElement>;
  backgroundSettings: {
    type: BackgroundType;
    color: string | ColorPoint[];
    image: string | null;
    customImage: string | null;
    opacity: number;
    cornerRadius: number;
  };
  imageSettings: {
    cornerRadius: number;
    offsetX: number;
    offsetY: number;
    padding: number;
  };
  shadowSettings: {
    color: string;
    opacity: number;
    blur: number;
    distance: number;
  };
  previewSize: {
    width: number;
    height: number;
  };
  onDownloadableCanvasReady: (canvas: HTMLCanvasElement) => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const downloadableCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (image && previewSize.width && previewSize.height) {
      const canvas = canvasRef.current;
      const downloadableCanvas = downloadableCanvasRef.current;
      if (!canvas || !downloadableCanvas) return;
      const ctx = canvas.getContext('2d');
      const downloadableCtx = downloadableCanvas.getContext('2d');
      if (!ctx || !downloadableCtx) return;

      const imageAspectRatio = image.width / image.height;
      let previewWidth = previewSize.width;
      let previewHeight = previewSize.height;
      const containerAspectRatio = previewWidth / previewHeight;

      if (imageAspectRatio > containerAspectRatio) {
        previewHeight = previewWidth / imageAspectRatio;
      } else {
        previewWidth = previewHeight * imageAspectRatio;
      }

      canvas.width = previewWidth;
      canvas.height = previewHeight;
      downloadableCanvas.width = image.width;
      downloadableCanvas.height = image.height;

      applyImageEffects(ctx, canvas.width, canvas.height, image, backgroundSettings, imageSettings, shadowSettings);
      applyImageEffects(downloadableCtx, downloadableCanvas.width, downloadableCanvas.height, image, backgroundSettings, imageSettings, shadowSettings);

      onDownloadableCanvasReady(downloadableCanvas);
    }
  }, [image, backgroundSettings, imageSettings, shadowSettings, previewSize, onDownloadableCanvasReady]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="max-w-full max-h-full object-contain"
      />
      <canvas ref={downloadableCanvasRef} style={{ display: 'none' }} />
    </>
  );
};

const applyImageEffects = (
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  image: HTMLImageElement,
  backgroundSettings: {
    type: BackgroundType;
    color: string | ColorPoint[];
    image: string | null;
    customImage: string | null;
    opacity: number;
    cornerRadius: number;
  },
  imageSettings: {
    cornerRadius: number;
    offsetX: number;
    offsetY: number;
    padding: number;
  },
  shadowSettings: {
    color: string;
    opacity: number;
    blur: number;
    distance: number;
  }
) => {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  const imageAspectRatio = image.width / image.height;
  const canvasAspectRatio = canvasWidth / canvasHeight;

  let imageDrawWidth: number, imageDrawHeight: number;
  if (imageAspectRatio > canvasAspectRatio) {
    imageDrawWidth = canvasWidth;
    imageDrawHeight = imageDrawWidth / imageAspectRatio;
  } else {
    imageDrawHeight = canvasHeight;
    imageDrawWidth = imageDrawHeight * imageAspectRatio;
  }

  const paddingFactor = imageSettings.padding / 100;
  const minImageDimension = Math.min(imageDrawWidth, imageDrawHeight);
  const maxPadding = minImageDimension * 0.25;
  const actualPadding = maxPadding * paddingFactor;

  imageDrawWidth -= 2 * actualPadding;
  imageDrawHeight -= 2 * actualPadding;

  const backgroundWidth = imageDrawWidth + 2 * actualPadding;
  const backgroundHeight = imageDrawHeight + 2 * actualPadding;

  const backgroundX = (canvasWidth - backgroundWidth) / 2;
  const backgroundY = (canvasHeight - backgroundHeight) / 2;
  const imageX = backgroundX + actualPadding + (imageSettings.offsetX / 100) * imageDrawWidth;
  const imageY = backgroundY + actualPadding + (imageSettings.offsetY / 100) * imageDrawHeight;

  // Apply background
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(backgroundX, backgroundY, backgroundWidth, backgroundHeight, (backgroundSettings.cornerRadius / 100) * Math.min(backgroundWidth, backgroundHeight));
  ctx.clip();

  ctx.globalAlpha = backgroundSettings.opacity / 100;

  if (backgroundSettings.type === 'freeform' && Array.isArray(backgroundSettings.color)) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = backgroundWidth;
    tempCanvas.height = backgroundHeight;
    const tempCtx = tempCanvas.getContext('2d');
    if (tempCtx) {
      renderFreeformGradient(tempCtx, backgroundWidth, backgroundHeight, backgroundSettings.color);
      ctx.drawImage(tempCanvas, backgroundX, backgroundY, backgroundWidth, backgroundHeight);
    }
  } else if (backgroundSettings.type === 'gradient' && typeof backgroundSettings.color === 'string') {
    // Handle linear gradient
    const gradientMatch = backgroundSettings.color.match(/linear-gradient\((.*?)\)/);
    if (gradientMatch) {
      const [angle, ...colorStops] = gradientMatch[1].split(',').map(s => s.trim());
      const gradient = ctx.createLinearGradient(backgroundX, backgroundY, backgroundX + backgroundWidth, backgroundY + backgroundHeight);
      colorStops.forEach((stop, index) => {
        const [color, position] = stop.split(' ');
        gradient.addColorStop(position ? parseFloat(position) / 100 : index / (colorStops.length - 1), color);
      });
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = backgroundSettings.color;
    }
    ctx.fillRect(backgroundX, backgroundY, backgroundWidth, backgroundHeight);
  } else if (backgroundSettings.type === 'image' && backgroundSettings.image) {
    const bgImage = document.createElement('img');
    bgImage.src = backgroundSettings.image;
    bgImage.onload = () => {
      ctx.drawImage(bgImage, backgroundX, backgroundY, backgroundWidth, backgroundHeight);
      drawMainImage();
    };
    return; // Exit the function early, the rest will be handled in the onload callback
  } else if (backgroundSettings.type === 'custom' && backgroundSettings.customImage) {
    const bgImage = document.createElement('img');
    bgImage.src = backgroundSettings.customImage;
    bgImage.onload = () => {
      ctx.drawImage(bgImage, backgroundX, backgroundY, backgroundWidth, backgroundHeight);
      drawMainImage();
    };
    return; // Exit the function early, the rest will be handled in the onload callback
  }

  ctx.restore();

  // Function to draw the main image
  function drawMainImage() {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvasWidth;
    tempCanvas.height = canvasHeight;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    tempCtx.shadowColor = shadowSettings.color + Math.round(shadowSettings.opacity * 2.55).toString(16).padStart(2, '0');
    tempCtx.shadowBlur = (shadowSettings.blur / 100) * Math.min(imageDrawWidth, imageDrawHeight);
    tempCtx.shadowOffsetX = (shadowSettings.distance / 100) * imageDrawWidth;
    tempCtx.shadowOffsetY = (shadowSettings.distance / 100) * imageDrawHeight;

    tempCtx.beginPath();
    tempCtx.roundRect(imageX, imageY, imageDrawWidth, imageDrawHeight, (imageSettings.cornerRadius / 100) * Math.min(imageDrawWidth, imageDrawHeight));
    tempCtx.fill();

    tempCtx.shadowColor = 'transparent';
    tempCtx.shadowBlur = 0;
    tempCtx.shadowOffsetX = 0;
    tempCtx.shadowOffsetY = 0;

    tempCtx.save();
    tempCtx.beginPath();
    tempCtx.roundRect(imageX, imageY, imageDrawWidth, imageDrawHeight, (imageSettings.cornerRadius / 100) * Math.min(imageDrawWidth, imageDrawHeight));
    tempCtx.clip();
    tempCtx.drawImage(image, 0, 0, image.width, image.height, imageX, imageY, imageDrawWidth, imageDrawHeight);
    tempCtx.restore();

    ctx.globalAlpha = 1; // Ensure the main image is drawn at full opacity
    ctx.drawImage(tempCanvas, 0, 0);
  }

  // If it's not an image background, draw the main image immediately
  if (backgroundSettings.type !== 'image' && backgroundSettings.type !== 'custom') {
    drawMainImage();
  }
};

const renderFreeformGradient = (ctx: CanvasRenderingContext2D, width: number, height: number, points: ColorPoint[]) => {
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const index = (y * width + x) * 4;
      const color = getInterpolatedColor(x / width * 100, y / height * 100, points);
      data[index] = color.r;
      data[index + 1] = color.g;
      data[index + 2] = color.b;
      data[index + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
};

const getInterpolatedColor = (x: number, y: number, points: ColorPoint[]) => {
  let totalWeight = 0;
  let r = 0, g = 0, b = 0;

  points.forEach(point => {
    const dx = point.x - x;
    const dy = point.y - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const weight = 1 / (distance * distance + 1);

    totalWeight += weight;
    const [pr, pg, pb] = hexToRgb(point.color);
    r += pr * weight;
    g += pg * weight;
    b += pb * weight;
  });

  return {
    r: Math.round(r / totalWeight),
    g: Math.round(g / totalWeight),
    b: Math.round(b / totalWeight)
  };
};

const hexToRgb = (hex: string): [number, number, number] => {
  const bigint = parseInt(hex.slice(1), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
};

const BackgroundSelector = ({ type, color, image, customImage, onTypeChange, onColorChange, onImageChange, onCustomImageChange, suggestedColors, suggestedImages, isOriginalImageUploaded, imageColors }: {
  type: BackgroundType;
  color: string | ColorPoint[];
  image: string | null;
  customImage: string | null;
  onTypeChange: (type: BackgroundType) => void;
  onColorChange: (color: string | ColorPoint[]) => void;
  onImageChange: (image: string) => void;
  onCustomImageChange: (image: string | null) => void;
  suggestedColors: string[];
  suggestedImages: string[];
  isOriginalImageUploaded: boolean;
  imageColors: string[];
}) => {
  const [isGradientOpen, setIsGradientOpen] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);

  const handleGradientSelect = (gradient: string) => {
    onTypeChange('gradient');
    onColorChange(gradient);
    setIsGradientOpen(false);
  };

  const handleImageSelect = (img: string) => {
    onTypeChange('image');
    onImageChange(img);
    setIsImageOpen(false);
  };

  const handleCustomImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onTypeChange('custom');
        onCustomImageChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveCustomImage = () => {
    onCustomImageChange(null);
    if (type === 'custom') {
      onTypeChange('gradient');
      onColorChange(suggestedColors[0]); // Set to the first suggested color
    }
  };

  return (
    <div className="space-y-4">
      {/* Auto-suggested backgrounds */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Auto-suggested Gradients</h3>
        <AutoSuggestedBackgrounds
          imageColors={imageColors}
          onSelectBackground={(background) => {
            if (Array.isArray(background)) {
              onTypeChange('freeform');
              onColorChange(background);
            } else {
              onTypeChange('gradient');
              onColorChange(background);
            }
          }}
        />
      </div>

      {/* Default gradients and images */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Default Backgrounds</h3>
        <div className="flex space-x-4">
          <Popover open={isGradientOpen} onOpenChange={setIsGradientOpen}>
            <PopoverTrigger asChild>
              <div 
                className='w-20 h-20 rounded-md cursor-pointer border border-gray-300' 
                style={{ background: type === 'gradient' && typeof color === 'string' ? color : suggestedColors[0] }}
              />
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="grid grid-cols-4 gap-2">
                {suggestedColors.map((gradient, index) => (
                  <div
                    key={index}
                    className="w-12 h-12 rounded-md cursor-pointer"
                    style={{ background: gradient }}
                    onClick={() => handleGradientSelect(gradient)}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Popover open={isImageOpen} onOpenChange={setIsImageOpen}>
            <PopoverTrigger asChild>
              <div 
                className='w-20 h-20 rounded-md cursor-pointer border border-gray-300 bg-cover bg-center' 
                style={{ backgroundImage: type === 'image' ? `url(${image})` : `url(${suggestedImages[0]})` }}
              />
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="grid grid-cols-3 gap-2">
                {suggestedImages.map((img, index) => (
                  <div
                    key={index}
                    className="w-16 h-16 rounded-md cursor-pointer bg-cover bg-center"
                    style={{ backgroundImage: `url(${img})` }}
                    onClick={() => handleImageSelect(img)}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <div className="relative group">
            <input
              type="file"
              accept="image/*"
              onChange={handleCustomImageUpload}
              style={{ display: 'none' }}
              id="custom-image-upload"
            />
            <label htmlFor="custom-image-upload">
              <div 
                className='w-20 h-20 rounded-md cursor-pointer border border-gray-300 flex items-center justify-center bg-cover bg-center'
                style={{ backgroundImage: customImage ? `url(${customImage})` : 'none' }}
              >
                {!customImage && (
                  <span className="text-sm text-gray-500 text-center">Upload Custom Image</span>
                )}
              </div>
            </label>
            {customImage && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button onClick={handleRemoveCustomImage} variant="destructive" size="sm">
                  Remove
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [backgroundColor, setBackgroundColor] = useState<string | ColorPoint[]>('linear-gradient(to left, #c6ffb1, #b4eef5)');
  const [backgroundOpacity, setBackgroundOpacity] = useState(100)
  const [shadowOpacity, setShadowOpacity] = useState(60)
  const [shadowBlur, setShadowBlur] = useState(10)
  const [shadowColor, setShadowColor] = useState('#000000')
  const [shadowDistance, setShadowDistance] = useState(5)
  const [imagePadding, setImagePadding] = useState(30)
  const [horizontalOffset, setHorizontalOffset] = useState(0)
  const [verticalOffset, setVerticalOffset] = useState(0)
  const [backgroundCornerRadius, setBackgroundCornerRadius] = useState(5)
  const [imageCornerRadius, setImageCornerRadius] = useState(5)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [originalImage, setOriginalImage] = useState<File | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const [previewSize, setPreviewSize] = useState({ width: 0, height: 0 })
  const previewContainerRef = useRef<HTMLDivElement>(null)
  const [imageObject, setImageObject] = useState<HTMLImageElement | null>(null)
  const [downloadableCanvas, setDownloadableCanvas] = useState<HTMLCanvasElement | null>(null);
  const [suggestedColors, setSuggestedColors] = useState<string[]>([
    'linear-gradient(to left, #f2b8ff, #e9e4fe)',
    'linear-gradient(to left, #c6ffb1, #b4eef5)',
    'linear-gradient(to left, #3de5b3, #fee899)',
    'linear-gradient(to left, #fda1ff, #fed3d3)',
    'linear-gradient(to left, #fff2a4, #d3acee)',
    'linear-gradient(to left, #9fbdd3, #ebe6e2)',
    'linear-gradient(to left, #f0e2cf, #f4d5af)',
    'linear-gradient(to left, #81b29a, #f2cc8f)',
    'linear-gradient(to left, #9f82fe, #ffe992)',
    'linear-gradient(to left, #a3ffe7, #7a6bfb)',
    'linear-gradient(to left, #fbe0ff, #92b4e9)',
    'linear-gradient(to left, #01befc, #fc7efc)',
    'linear-gradient(to left, #b9fbc0, #a3c4f3)',
    'linear-gradient(to left, #ffd488, #ff9b7f)',
  ]);

  const isDesktop = useMediaQuery("(min-width: 768px)")

  const [mobilePreviewSize, setMobilePreviewSize] = useState({ width: 0, height: 0 });

  const [backgroundType, setBackgroundType] = useState<BackgroundType>('gradient');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [customBackgroundImage, setCustomBackgroundImage] = useState<string | null>(null);
  const [suggestedImages, setSuggestedImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1502082553048-f009c37129b9',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429',
    'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f',
    'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1',
    'https://images.unsplash.com/photo-1502082553048-f009c37129b9',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429',
    'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f',
    'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1',
    'https://images.unsplash.com/photo-1502082553048-f009c37129b9',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429',
    'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f',
    'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1',
    'https://images.unsplash.com/photo-1502082553048-f009c37129b9',
    'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429',
  ]);

  const [isOriginalImageUploaded, setIsOriginalImageUploaded] = useState(false);
  const [imageColors, setImageColors] = useState<string[]>([]);

  useEffect(() => {
    const updateMobilePreviewSize = () => {
      const mobilePreviewContainer = document.getElementById('mobile-preview-container');
      if (mobilePreviewContainer) {
        setMobilePreviewSize({
          width: mobilePreviewContainer.offsetWidth,
          height: mobilePreviewContainer.offsetHeight,
        });
      }
    };

    updateMobilePreviewSize();
    window.addEventListener('resize', updateMobilePreviewSize);

    return () => window.removeEventListener('resize', updateMobilePreviewSize);
  }, []);

  useEffect(() => {
    const updateContainerSize = () => {
      if (previewContainerRef.current) {
        setPreviewSize({
          width: previewContainerRef.current.offsetWidth,
          height: previewContainerRef.current.offsetHeight,
        })
      }
    }

    updateContainerSize()
    window.addEventListener('resize', updateContainerSize)

    return () => window.removeEventListener('resize', updateContainerSize)
  }, [])

  useEffect(() => {
    if (imageObject) {
      const extractColors = async () => {
        const colorThief = new ColorThief();
        try {
          const palette = await colorThief.getPalette(imageObject, 10);
          const hexColors = palette.map(([r, g, b]: [number, number, number]) => 
            `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
          );
          setImageColors(hexColors);
          // Remove this line to prevent updating suggestedColors
          // setSuggestedColors(generateBackgrounds(hexColors));
        } catch (error) {
          console.error('Error extracting colors:', error);
          setImageColors([]);
        }
      };
      extractColors();
    }
  }, [imageObject]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file && file.type.startsWith('image/')) {
      setOriginalImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.onload = () => {
          setImageObject(img)
          setUploadedImage(img.src)
          setBackgroundColor('linear-gradient(to left, #c6ffb1, #b4eef5)')
          setBackgroundOpacity(100)
          setShadowOpacity(60)
          setShadowBlur(10)
          setShadowColor('#000000')
          setShadowDistance(5)
          setImagePadding(30)
          setBackgroundCornerRadius(5)
          setImageCornerRadius(5)
          setIsOriginalImageUploaded(true);
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {'image/*': []}
  })

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const handleDownloadableCanvasReady = useCallback((canvas: HTMLCanvasElement) => {
    setDownloadableCanvas(canvas);
  }, []);

  const handleDownload = useCallback(() => {
    if (downloadableCanvas) {
      const link = document.createElement('a');
      link.download = 'processed_image.png';
      link.href = downloadableCanvas.toDataURL('image/png');
      link.click();
    } else {
      console.error('Downloadable canvas is not ready');
    }
  }, [downloadableCanvas]);

  const handleReset = () => {
    setUploadedImage(null)
    setOriginalImage(null)
    setImageObject(null)
    setBackgroundColor('linear-gradient(to left, #c6ffb1, #b4eef5)')
    setBackgroundOpacity(100)
    setShadowOpacity(60)
    setShadowBlur(10)
    setShadowColor('#000000')
    setShadowDistance(5)
    setImagePadding(30)
    setHorizontalOffset(0)
    setVerticalOffset(0)
    setIsOriginalImageUploaded(false);
    setCustomBackgroundImage(null);
    setBackgroundType('gradient');
    setBackgroundImage(null);
    
    // Reset auto-generated gradients
    setImageColors([]);
    setSuggestedColors([
      'linear-gradient(to left, #f2b8ff, #e9e4fe)',
      'linear-gradient(to left, #c6ffb1, #b4eef5)',
      'linear-gradient(to left, #3de5b3, #fee899)',
      'linear-gradient(to left, #fda1ff, #fed3d3)',
      'linear-gradient(to left, #fff2a4, #d3acee)',
      'linear-gradient(to left, #9fbdd3, #ebe6e2)',
      'linear-gradient(to left, #f0e2cf, #f4d5af)',
      'linear-gradient(to left, #81b29a, #f2cc8f)',
      'linear-gradient(to left, #9f82fe, #ffe992)',
      'linear-gradient(to left, #a3ffe7, #7a6bfb)',
      'linear-gradient(to left, #fbe0ff, #92b4e9)',
      'linear-gradient(to left, #01befc, #fc7efc)',
      'linear-gradient(to left, #b9fbc0, #a3c4f3)',
      'linear-gradient(to left, #ffd488, #ff9b7f)',
    ]);
  }

  const handleCustomBackgroundChange = (newCustomImage: string | null) => {
    setCustomBackgroundImage(newCustomImage);
    if (newCustomImage) {
      setBackgroundType('custom');
    } else if (backgroundType === 'custom') {
      setBackgroundType('gradient');
      setBackgroundColor(suggestedColors[0]); // Set to the first suggested color
    }
    // Update the background image immediately
    if (imageObject && downloadableCanvas) {
      const ctx = downloadableCanvas.getContext('2d');
      if (ctx) {
        applyImageEffects(
          ctx,
          downloadableCanvas.width,
          downloadableCanvas.height,
          imageObject,
          {
            type: newCustomImage ? 'custom' : 'gradient',
            color: newCustomImage ? '' : suggestedColors[0],
            image: backgroundImage,
            customImage: newCustomImage,
            opacity: backgroundOpacity,
            cornerRadius: backgroundCornerRadius,
          },
          {
            cornerRadius: imageCornerRadius,
            offsetX: horizontalOffset,
            offsetY: verticalOffset,
            padding: imagePadding,
          },
          {
            color: shadowColor,
            opacity: shadowOpacity,
            blur: shadowBlur,
            distance: shadowDistance,
          }
        );
      }
    }
  };

  const handleSelectBackground = (background: string | ColorPoint[]) => {
    if (Array.isArray(background)) {
      setBackgroundType('freeform');
      setBackgroundColor(background);
    } else {
      setBackgroundType('gradient');
      setBackgroundColor(background);
    }
  };

  const generateBackgrounds = (colors: string[]) => {
    const generateFreeformGradient = (colors: string[], numColors: number) => {
      const selectedColors = colors.sort(() => 0.5 - Math.random()).slice(0, numColors);
      const gradientStops = selectedColors.map((color) => {
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        return { color, x, y };
      });
      return gradientStops;
    };

    const generateDiagonalGradient = (colors: string[]) => {
      const angle = Math.floor(Math.random() * 360);
      return `linear-gradient(${angle}deg, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)`;
    };

    const isLightColor = (color: string) => {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
      return brightness > 155;
    };

    const generateMatchingColors = (baseColors: string[]) => {
      // This is a simplified version. In a real-world scenario, you'd want to use a more sophisticated color matching algorithm.
      return baseColors.map(color => {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        return `#${((r + 128) % 256).toString(16).padStart(2, '0')}${((g + 128) % 256).toString(16).padStart(2, '0')}${((b + 128) % 256).toString(16).padStart(2, '0')}`;
      });
    };

    const generateBackgrounds = (imageColors: string[]) => {
      if (imageColors.length === 0) return Array(10).fill('');
      
      const backgrounds = [
        generateFreeformGradient(imageColors, Math.floor(Math.random() * 5) + 4), // 1
        generateFreeformGradient(imageColors.slice(0, 3), 3), // 2
        generateFreeformGradient(imageColors.filter(c => isLightColor(c)), Math.floor(Math.random() * 5) + 3), // 3
        generateFreeformGradient([...imageColors, ...generateMatchingColors(imageColors)], Math.floor(Math.random() * 4) + 5), // 4
        generateFreeformGradient([...imageColors, ...generateMatchingColors(imageColors)], Math.floor(Math.random() * 3) + 3), // 5
        generateFreeformGradient(generateMatchingColors(imageColors), Math.floor(Math.random() * 5) + 4), // 6
        generateFreeformGradient(generateMatchingColors(imageColors), Math.floor(Math.random() * 4) + 3), // 7
        generateFreeformGradient([...imageColors, ...generateMatchingColors(imageColors)], Math.floor(Math.random() * 3) + 1), // 8
        generateDiagonalGradient(generateMatchingColors(imageColors).slice(0, 3)), // 9
        imageColors[Math.floor(Math.random() * imageColors.length)] // 10
      ];
      return backgrounds;
    };

    return generateBackgrounds(colors);
  };

  return (
    <div className='flex flex-col md:flex-row h-[calc(100vh-4rem)]'>
      <div className='hidden md:block w-1/3 h-full overflow-y-auto p-4 space-y-4'>
        <Card className='hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1'>
          <CardContent className='space-y-4 p-6'>
            <h2 className='text-xl font-bold mb-4'>Background</h2>
            <BackgroundSelector
              type={backgroundType}
              color={backgroundColor}
              image={backgroundImage}
              customImage={customBackgroundImage}
              onTypeChange={setBackgroundType}
              onColorChange={(color: string | ColorPoint[]) => setBackgroundColor(color)}
              onImageChange={setBackgroundImage}
              onCustomImageChange={handleCustomBackgroundChange}
              suggestedColors={suggestedColors}
              suggestedImages={suggestedImages}
              isOriginalImageUploaded={isOriginalImageUploaded}
              imageColors={imageColors}
            />
            <div className='flex space-x-4'>
              <div className='flex-1 space-y-2'>
                <Label>Opacity</Label>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[backgroundOpacity]}
                  onValueChange={(value) => setBackgroundOpacity(value[0])}
                />
                <span className="text-sm text-gray-500">{backgroundOpacity}%</span>
              </div>
              <div className='flex-1 space-y-2'>
                <Label>Corner Radius</Label>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[backgroundCornerRadius]}
                  onValueChange={(value) => setBackgroundCornerRadius(value[0])}
                />
                <span className="text-sm text-gray-500">{backgroundCornerRadius}% of image size</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1'>
          <CardContent className='space-y-4 p-6'>
            <h2 className='text-xl font-bold mb-4'>Shadow</h2>
            <div className='flex space-x-4'>
              <div className='flex-1 space-y-2'>
                <Label>Opacity</Label>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[shadowOpacity]}
                  onValueChange={(value) => setShadowOpacity(value[0])}
                />
                <span className="text-sm text-gray-500">{shadowOpacity}%</span>
              </div>
              <div className='flex-1 space-y-2'>
                <Label>Blur</Label>
                <Slider
                  min={0}
                  max={20}
                  step={0.1}
                  value={[shadowBlur]}
                  onValueChange={(value) => setShadowBlur(value[0])}
                />
                <span className="text-sm text-gray-500">{shadowBlur}% of image size</span>
              </div>
            </div>
            <div 
              className='flex items-center cursor-pointer'
              onClick={() => toggleSection('shadow')}
            >
              <span className='mr-2'>Additional Settings</span>
              {expandedSection === 'shadow' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {expandedSection === 'shadow' && (
              <div className='flex space-x-4'>
                <div className='flex-1 space-y-2'>
                  <Label>Distance</Label>
                  <Slider
                    min={0}
                    max={20}
                    step={0.1}
                    value={[shadowDistance]}
                    onValueChange={(value) => setShadowDistance(value[0])}
                  />
                  <span className="text-sm text-gray-500">{shadowDistance}% of image size</span>
                </div>
                <div className='flex-1 space-y-2'>
                  <Label>Color</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <div 
                        className='w-10 h-10 rounded-md cursor-pointer border border-gray-300' 
                        style={{ backgroundColor: shadowColor }}
                      />
                    </PopoverTrigger>
                    <PopoverContent>
                      <ColorPicker color={shadowColor} onChange={setShadowColor} />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className='hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1'>
          <CardContent className='space-y-4 p-6'>
            <h2 className='text-xl font-bold mb-4'>Image</h2>
            <div className='flex space-x-4'>
              <div className='flex-1 space-y-2'>
                <Label>Corner Radius</Label>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[imageCornerRadius]}
                  onValueChange={(value) => setImageCornerRadius(value[0])}
                />
                <span className="text-sm text-gray-500">{imageCornerRadius}% of image size</span>
              </div>
              <div className='flex-1 space-y-2'>
                <Label>Padding</Label>
                <Slider
                  min={0}
                  max={50}
                  step={1}
                  value={[imagePadding]}
                  onValueChange={(value) => setImagePadding(value[0])}
                />
                <span className="text-sm text-gray-500">{imagePadding}%</span>
              </div>
            </div>
            <div 
              className='flex items-center cursor-pointer'
              onClick={() => toggleSection('image')}
            >
              <span className='mr-2'>Additional Settings</span>
              {expandedSection === 'image' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            {expandedSection === 'image' && (
              <div className='flex space-x-4'>
                <div className='flex-1 space-y-2'>
                  <Label>Horizontal Offset</Label>
                  <Slider
                    min={-50}
                    max={50}
                    step={1}
                    value={[horizontalOffset]}
                    onValueChange={(value) => setHorizontalOffset(value[0])}
                  />
                  <span className="text-sm text-gray-500">{horizontalOffset}% of image width</span>
                </div>
                <div className='flex-1 space-y-2'>
                  <Label>Vertical Offset</Label>
                  <Slider
                    min={-50}
                    max={50}
                    step={1}
                    value={[verticalOffset]}
                    onValueChange={(value) => setVerticalOffset(value[0])}
                  />
                  <span className="text-sm text-gray-500">{verticalOffset}% of image height</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className='hidden md:flex md:w-2/3 flex-col h-full p-4'>
        <Card className='flex-grow flex items-center justify-center overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1'>
          <div 
            ref={previewContainerRef} 
            className="w-full h-full flex items-center justify-center p-4"
          >
            {imageObject ? (
              <ImagePreview
                image={imageObject}
                containerRef={previewContainerRef}
                backgroundSettings={{
                  type: backgroundType,
                  color: backgroundColor,
                  image: backgroundImage,
                  customImage: customBackgroundImage,
                  opacity: backgroundOpacity,
                  cornerRadius: backgroundCornerRadius,
                }}
                imageSettings={{
                  cornerRadius: imageCornerRadius,
                  offsetX: horizontalOffset,
                  offsetY: verticalOffset,
                  padding: imagePadding,
                }}
                shadowSettings={{
                  color: shadowColor,
                  opacity: shadowOpacity,
                  blur: shadowBlur,
                  distance: shadowDistance,
                }}
                previewSize={previewSize}
                onDownloadableCanvasReady={handleDownloadableCanvasReady}
              />
            ) : (
              <div {...getRootProps()} className={cn(
                'text-center cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-4 w-full h-full flex items-center justify-center',
                'hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1'
              )}>
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop the image here ...</p>
                ) : (
                  <div>
                    <p className='mb-2'>Upload or Drag & Drop image here</p>
                    <Button size="sm" className="md:text-base md:px-4 md:py-2">Select Image</Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        <div className="flex justify-center space-x-4 mt-4">
          <Button 
            onClick={handleDownload} 
            disabled={!downloadableCanvas || !imageObject}
            className="text-lg hover:shadow-md px-10 py-7 transition-all duration-300 transform hover:-translate-y-1"
          >
            <Download className="mr-2 h-5 w-5" /> Download
          </Button>
          <Button 
            onClick={handleReset}
            className="text-lg hover:shadow-md px-10 py-7 transition-all duration-300 transform hover:-translate-y-1"
          >
            <RefreshCw className="mr-2 h-5 w-5" /> Reset
          </Button>
        </div>
        <div className="hidden md:block text-center mt-2 text-sm text-gray-500 dark:text-gray-400">
          Created by <a 
            href="https://mitvaghani.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-gray-700 dark:text-gray-300 hover:underline"
          >
            Mit Vaghani
          </a>
        </div>
      </div>
    </div>
  )
}
