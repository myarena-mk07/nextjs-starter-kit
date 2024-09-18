"use client"

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ColorPicker } from '@/components/ui/color-picker'
import { useDropzone } from 'react-dropzone'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChevronDown, ChevronUp, Download, RefreshCw } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { cn } from "@/lib/utils"
import { useMediaQuery } from '@/hooks/use-media-query'

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

const applyImageEffects = (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number, image: HTMLImageElement, backgroundSettings: any, imageSettings: any, shadowSettings: any) => {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  const imageAspectRatio = image.width / image.height;
  const canvasAspectRatio = canvasWidth / canvasHeight;

  let imageDrawWidth, imageDrawHeight;
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

  const gradient = ctx.createLinearGradient(backgroundX, backgroundY, backgroundX + backgroundWidth, backgroundY);
  if (backgroundSettings.color.includes('linear-gradient')) {
    const colors = backgroundSettings.color.match(/#[a-f\d]{6}/gi);
    if (colors && colors.length >= 2) {
      gradient.addColorStop(0, colors[0]);
      gradient.addColorStop(1, colors[1]);
    }
  } else {
    gradient.addColorStop(0, backgroundSettings.color);
    gradient.addColorStop(1, backgroundSettings.color);
  }
  
  ctx.fillStyle = gradient;
  ctx.globalAlpha = backgroundSettings.opacity / 100;
  ctx.beginPath();
  ctx.roundRect(backgroundX, backgroundY, backgroundWidth, backgroundHeight, (backgroundSettings.cornerRadius / 100) * Math.min(backgroundWidth, backgroundHeight));
  ctx.fill();
  ctx.globalAlpha = 1;

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

  ctx.drawImage(tempCanvas, 0, 0);
};

export default function Dashboard() {
  const [backgroundColor, setBackgroundColor] = useState('linear-gradient(to left, #c6ffb1, #b4eef5)');
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
        const img = new Image()
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
  }

  return (
    <div className='flex flex-col md:flex-row h-[calc(100vh-4rem)]'>
      <div className='hidden md:block w-1/3 h-full overflow-y-auto p-4 space-y-4'>
        <Card className='hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1'>
          <CardContent className='space-y-4 p-6'>
            <h2 className='text-xl font-bold mb-4'>Background</h2>
            <div className='flex items-center space-x-4 mb-4'>
              <Popover>
                <PopoverTrigger asChild>
                  <div 
                    className='w-10 h-10 rounded-md cursor-pointer border border-gray-300' 
                    style={{ background: backgroundColor }}
                  />
                </PopoverTrigger>
                <PopoverContent className="w-64">
                  <div className="grid grid-cols-4 gap-2">
                  {suggestedColors.map((gradient, index) => (
                      <div
                        key={index}
                        className='w-full h-10 rounded-md cursor-pointer border border-gray-300'
                        style={{ background: gradient }}
                        onClick={() => setBackgroundColor(gradient)}
                      />
                    ))}
                  </div>
                  {/* <div className="mt-4">
                    <ColorPicker 
                      color={backgroundColor} 
                      onChange={(color) => {
                        if (typeof color === 'string' && color.includes('linear-gradient')) {
                          setBackgroundColor(color);
                        } else {
                          setBackgroundColor(`linear-gradient(to left, ${color}, ${color})`);
                        }
                      }} 
                    />
                  </div> */}
                </PopoverContent>
              </Popover>
              {/* <div className='flex-1'>
                <Label>Current Background</Label>
                <div 
                  className='w-full h-10 rounded-md border border-gray-300 mt-2' 
                  style={{ background: backgroundColor }}
                />
              </div> */}
            </div>
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
            className="hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
          >
            <Download className="mr-2 h-5 w-5" /> Download
          </Button>
          <Button 
            onClick={handleReset}
            className="hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
          >
            <RefreshCw className="mr-2 h-5 w-5" /> Reset
          </Button>
        </div>
        <div className="text-center mt-2 text-sm text-gray-500">
          Created by <a href="https://mitvaghani.com" target="_blank" rel="noopener noreferrer" className="text-black hover:underline">Mit Vaghani</a>
        </div>
      </div>

      <div className='md:hidden flex flex-col h-full'>
        <div className='h-[40%] p-4'>
          <Card className='h-full flex items-center justify-center overflow-hidden'>
            <div 
              id="mobile-preview-container"
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
                  previewSize={mobilePreviewSize}
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
                      <Button size="sm">Select Image</Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Middle 50% (scrollable) */}
        <div className='h-[50%] overflow-y-auto p-4 space-y-4'> {/* Added space-y-4 for spacing between cards */}
          {/* Background settings card */}
          <Card className='hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1'>
            <CardContent className='space-y-4 p-6'>
              <h2 className='text-xl font-bold mb-4'>Background</h2>
              <div className='flex items-center space-x-4 mb-4'>
                <Popover>
                  <PopoverTrigger asChild>
                    <div 
                      className='w-10 h-10 rounded-md cursor-pointer border border-gray-300' 
                      style={{ background: backgroundColor }}
                    />
                  </PopoverTrigger>
                  <PopoverContent className="w-[calc(100vw-2rem)] sm:w-64" sideOffset={5}>
                    <div className="grid grid-cols-5 gap-2">
                      {suggestedColors.map((gradient, index) => (
                        <div
                          key={index}
                          className='w-full h-10 rounded-md cursor-pointer border border-gray-300'
                          style={{ background: gradient }}
                          onClick={() => setBackgroundColor(gradient)}
                        />
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
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

          {/* Shadow settings card */}
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

          {/* Image settings card */}
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

        <div className='h-[10%] bg-background p-4 flex flex-col justify-between'>
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={handleDownload} 
              disabled={!downloadableCanvas || !imageObject}
              className="hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
            >
              <Download className="mr-2 h-5 w-5" /> Download
            </Button>
            <Button 
              onClick={handleReset}
              className="hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
            >
              <RefreshCw className="mr-2 h-5 w-5" /> Reset
            </Button>
          </div>
          <div className="text-center text-sm text-gray-500">
            Created by <a href="https://mitvaghani.com" target="_blank" rel="noopener noreferrer" className="text-black hover:underline">Mit Vaghani</a>
          </div>
        </div>
      </div>
    </div>
  )
}