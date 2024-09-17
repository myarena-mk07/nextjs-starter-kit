"use client"

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ColorPicker } from '@/components/ui/color-picker'
import { useDropzone } from 'react-dropzone'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChevronDown, ChevronUp, Download, Copy, RefreshCw } from 'lucide-react'

const ImagePreview = ({ image, containerRef, backgroundSettings, imageSettings, shadowSettings, previewSize, onDownloadableCanvasReady }: {
  image: HTMLImageElement;
  containerRef: React.RefObject<HTMLDivElement>;
  backgroundSettings: {
    color: string;
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

      // Set canvas sizes
      canvas.width = previewSize.width;
      canvas.height = previewSize.height;
      downloadableCanvas.width = image.width;
      downloadableCanvas.height = image.height;

      // Apply effects to preview canvas
      applyImageEffects(ctx, canvas.width, canvas.height, image, backgroundSettings, imageSettings, shadowSettings);

      // Apply effects to downloadable canvas
      applyImageEffects(downloadableCtx, downloadableCanvas.width, downloadableCanvas.height, image, backgroundSettings, imageSettings, shadowSettings);

      // Notify parent component that downloadable canvas is ready
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

// Helper function to apply image effects
const applyImageEffects = (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, image: HTMLImageElement, backgroundSettings: any, imageSettings: any, shadowSettings: any) => {
  // Clear the canvas
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  const imageAspectRatio = image.width / image.height;
  const canvasAspectRatio = canvasWidth / canvasHeight;

  // Calculate the maximum size the image can be while maintaining its aspect ratio
  let imageDrawWidth, imageDrawHeight;
  if (imageAspectRatio > canvasAspectRatio) {
    imageDrawWidth = canvasWidth;
    imageDrawHeight = imageDrawWidth / imageAspectRatio;
  } else {
    imageDrawHeight = canvasHeight;
    imageDrawWidth = imageDrawHeight * imageAspectRatio;
  }

  // Calculate padding
  const paddingFactor = imageSettings.padding / 100;
  const minImageDimension = Math.min(imageDrawWidth, imageDrawHeight);
  const maxPadding = minImageDimension * 0.25; // Max padding is 25% of the smaller image dimension
  const actualPadding = maxPadding * paddingFactor;

  // Apply padding
  imageDrawWidth -= 2 * actualPadding;
  imageDrawHeight -= 2 * actualPadding;

  // Calculate background size (image size + padding)
  const backgroundWidth = imageDrawWidth + 2 * actualPadding;
  const backgroundHeight = imageDrawHeight + 2 * actualPadding;

  // Center the background and image
  const backgroundX = (canvasWidth - backgroundWidth) / 2;
  const backgroundY = (canvasHeight - backgroundHeight) / 2;
  const imageX = backgroundX + actualPadding + (imageSettings.offsetX / 100) * imageDrawWidth;
  const imageY = backgroundY + actualPadding + (imageSettings.offsetY / 100) * imageDrawHeight;

  // Draw background
  ctx.fillStyle = backgroundSettings.color + Math.round(backgroundSettings.opacity * 2.55).toString(16).padStart(2, '0');
  ctx.beginPath();
  ctx.roundRect(backgroundX, backgroundY, backgroundWidth, backgroundHeight, (backgroundSettings.cornerRadius / 100) * Math.min(backgroundWidth, backgroundHeight));
  ctx.fill();

  // Create a temporary canvas for the image and shadow
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvasWidth;
  tempCanvas.height = canvasHeight;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;

  // Draw shadow
  tempCtx.shadowColor = shadowSettings.color + Math.round(shadowSettings.opacity * 2.55).toString(16).padStart(2, '0');
  tempCtx.shadowBlur = (shadowSettings.blur / 100) * Math.min(imageDrawWidth, imageDrawHeight);
  tempCtx.shadowOffsetX = (shadowSettings.distance / 100) * imageDrawWidth;
  tempCtx.shadowOffsetY = (shadowSettings.distance / 100) * imageDrawHeight;

  // Draw a rectangle as a base for the shadow
  tempCtx.beginPath();
  tempCtx.roundRect(imageX, imageY, imageDrawWidth, imageDrawHeight, (imageSettings.cornerRadius / 100) * Math.min(imageDrawWidth, imageDrawHeight));
  tempCtx.fill();

  // Clear the shadow
  tempCtx.shadowColor = 'transparent';
  tempCtx.shadowBlur = 0;
  tempCtx.shadowOffsetX = 0;
  tempCtx.shadowOffsetY = 0;

  // Draw the image
  tempCtx.save();
  tempCtx.beginPath();
  tempCtx.roundRect(imageX, imageY, imageDrawWidth, imageDrawHeight, (imageSettings.cornerRadius / 100) * Math.min(imageDrawWidth, imageDrawHeight));
  tempCtx.clip();
  tempCtx.drawImage(image, 0, 0, image.width, image.height, imageX, imageY, imageDrawWidth, imageDrawHeight);
  tempCtx.restore();

  // Draw the temporary canvas onto the main canvas
  ctx.drawImage(tempCanvas, 0, 0);
};

export default function Dashboard() {
  const [backgroundColor, setBackgroundColor] = useState('#FF0000')
  const [backgroundOpacity, setBackgroundOpacity] = useState(100)
  const [shadowOpacity, setShadowOpacity] = useState(60)
  const [shadowBlur, setShadowBlur] = useState(10) // Now a percentage of image size
  const [shadowColor, setShadowColor] = useState('#000000')
  const [shadowDistance, setShadowDistance] = useState(5) // Now a percentage of image size
  const [imagePadding, setImagePadding] = useState(30) // Already a percentage
  const [horizontalOffset, setHorizontalOffset] = useState(0) // Now a percentage of image width
  const [verticalOffset, setVerticalOffset] = useState(0) // Now a percentage of image height
  const [backgroundCornerRadius, setBackgroundCornerRadius] = useState(5) // Now a percentage of image size
  const [imageCornerRadius, setImageCornerRadius] = useState(5) // Now a percentage of image size
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [originalImage, setOriginalImage] = useState<File | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const [previewSize, setPreviewSize] = useState({ width: 0, height: 0 })
  const previewContainerRef = useRef<HTMLDivElement>(null)
  const [imageObject, setImageObject] = useState<HTMLImageElement | null>(null)
  const [downloadableCanvas, setDownloadableCanvas] = useState<HTMLCanvasElement | null>(null);

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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file && file.type.startsWith('image/')) {
      setOriginalImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          setImageObject(img)
          setUploadedImage(img.src)
          // Apply default settings
          setBackgroundColor('#FF0000')
          setBackgroundOpacity(100)
          setShadowOpacity(60)
          setShadowBlur(10)
          setShadowColor('#000000')
          setShadowDistance(5)
          setImagePadding(30)
          setBackgroundCornerRadius(5)
          setImageCornerRadius(5)
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
      // You might want to show a user-friendly error message here
    }
  }, [downloadableCanvas]);

  const handleReset = () => {
    setUploadedImage(null)
    setOriginalImage(null)
    setImageObject(null)
    setBackgroundColor('#FF0000')
    setBackgroundOpacity(100)
    setShadowOpacity(60)
    setShadowBlur(10)
    setShadowColor('#000000')
    setShadowDistance(5)
    setImagePadding(30)
    setHorizontalOffset(0)
    setVerticalOffset(0)
  }

  const handleCopyToClipboard = useCallback(async () => {
    const canvas = previewRef.current?.querySelector('canvas');
    if (canvas) {
      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({
                [blob.type]: blob
              })
            ])
            console.log('Image copied to clipboard')
          } catch (err) {
            console.error('Failed to copy image: ', err)
          }
        }
      }, 'image/png')
    }
  }, [])

  return (
    <div className='flex flex-col md:flex-row h-full gap-4'>
      <div className='w-full md:w-1/3 space-y-4 overflow-y-auto max-h-[calc(100vh-6rem)] p-4'>
        <Card className='hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1'>
          <CardContent className='space-y-4 p-6'>
            <h2 className='text-xl font-bold mb-4'>Background</h2>
            <div className='flex items-center space-x-4'>
              <Popover>
                <PopoverTrigger asChild>
                  <div 
                    className='w-10 h-10 rounded-md cursor-pointer border border-gray-300' 
                    style={{ backgroundColor: backgroundColor }}
                  />
                </PopoverTrigger>
                <PopoverContent>
                  <ColorPicker color={backgroundColor} onChange={setBackgroundColor} />
                </PopoverContent>
              </Popover>
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
      <div className='w-full md:w-2/3 h-[calc(100vh-6rem)] flex flex-col p-4'>
        <Card className='flex-grow flex items-center justify-center overflow-hidden'>
          <div 
            ref={previewContainerRef} 
            className="w-full h-full flex items-center justify-center p-4"
          >
            {imageObject ? (
              <ImagePreview
                image={imageObject}
                containerRef={previewContainerRef}
                backgroundSettings={{
                  color: backgroundColor,
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
              <div {...getRootProps()} className='text-center cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-12 w-full h-full flex items-center justify-center'>
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop the image here ...</p>
                ) : (
                  <div>
                    <p className='mb-4'>Upload or Drag & Drop image here</p>
                    <Button>Select Image</Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
        <div className="flex justify-center space-x-4 mt-4">
          <Button onClick={handleDownload} disabled={!downloadableCanvas}>
            <Download className="mr-2 h-4 w-4" /> Download
          </Button>
          <Button onClick={handleReset}>
            <RefreshCw className="mr-2 h-4 w-4" /> Reset
          </Button>
          <Button onClick={handleCopyToClipboard} disabled={!imageObject}>
            <Copy className="mr-2 h-4 w-4" /> Copy to Clipboard
          </Button>
        </div>
      </div>
    </div>
  )
}
