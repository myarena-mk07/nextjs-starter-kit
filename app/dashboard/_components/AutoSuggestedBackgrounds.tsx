import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface AutoSuggestedBackgroundsProps {
  imageColors: string[];
  onSelectBackground: (background: string | ColorPoint[], index: number) => Promise<void>;
  isApplying: boolean;
  applyingIndex: number | null;
}

interface ColorPoint {
  color: string;
  x: number;
  y: number;
}

const generateFreeformGradient = (colors: string[], numPoints: number): ColorPoint[] => {
  return colors
    .sort(() => 0.5 - Math.random())
    .slice(0, numPoints)
    .map(color => ({
      color,
      x: Math.random() * 100,
      y: Math.random() * 100
    }));
};

const renderFreeformGradient = (ctx: CanvasRenderingContext2D, width: number, height: number, points: ColorPoint[]) => {
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const index = (y * width + x) * 4;
      const color = getInterpolatedColor((x / width) * 100, (y / height) * 100, points);
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

const generateLinearGradient = (colors: string[]) => {
  const angle = Math.floor(Math.random() * 360);
  return `linear-gradient(${angle}deg, ${colors.join(', ')})`;
};

const isLightColor = (color: string) => {
  const [r, g, b] = hexToRgb(color);
  const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return brightness > 155;
};

const generateMatchingColor = (baseColor: string) => {
  const [r, g, b] = hexToRgb(baseColor);
  return `#${((r + 128) % 256).toString(16).padStart(2, '0')}${((g + 128) % 256).toString(16).padStart(2, '0')}${((b + 128) % 256).toString(16).padStart(2, '0')}`;
};

const generateMatchingColors = (baseColors: string[]) => {
  return baseColors.map(generateMatchingColor);
};

const generateBackgrounds = (imageColors: string[]): (string | ColorPoint[])[] => {
  if (imageColors.length === 0) return Array(10).fill('');
  
  const lightColors = imageColors.filter(isLightColor);
  const darkColors = imageColors.filter(color => !isLightColor(color));
  const matchingColors = generateMatchingColors(imageColors);

  return [
    generateFreeformGradient(imageColors, Math.floor(Math.random() * 5) + 4), // 1
    generateFreeformGradient(imageColors.slice(0, 3), 3), // 2
    generateFreeformGradient(lightColors, Math.floor(Math.random() * 5) + 3), // 3
    generateFreeformGradient([...imageColors, ...matchingColors].slice(0, Math.floor(Math.random() * 4) + 5), Math.floor(Math.random() * 5) + 4), // 4
    generateFreeformGradient([...imageColors, ...matchingColors].slice(0, Math.floor(Math.random() * 3) + 3), Math.floor(Math.random() * 3) + 3), // 5
    generateFreeformGradient(matchingColors.slice(0, Math.floor(Math.random() * 5) + 4), Math.floor(Math.random() * 5) + 4), // 6
    generateFreeformGradient(matchingColors.slice(0, Math.floor(Math.random() * 4) + 3), Math.floor(Math.random() * 4) + 3), // 7
    generateFreeformGradient([...imageColors, ...matchingColors].slice(0, Math.floor(Math.random() * 3) + 1), Math.floor(Math.random() * 3) + 1), // 8
    generateLinearGradient([darkColors[0], imageColors[Math.floor(imageColors.length / 2)], lightColors[0]]), // 9
    imageColors[Math.floor(Math.random() * imageColors.length)] // 10
  ];
};

export const AutoSuggestedBackgrounds: React.FC<AutoSuggestedBackgroundsProps> = ({ 
  imageColors, 
  onSelectBackground, 
  isApplying,
  applyingIndex
}) => {
  const [backgrounds, setBackgrounds] = useState<(string | ColorPoint[])[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingBackgrounds, setLoadingBackgrounds] = useState<boolean[]>(new Array(10).fill(false));

  useEffect(() => {
    generateBackgroundsAsync(imageColors);
  }, [imageColors]);

  const generateBackgroundsAsync = async (colors: string[]) => {
    setIsGenerating(true);
    setLoadingBackgrounds(new Array(10).fill(true));
    
    const delay = Math.random() * 1000 + 800; // Random delay between 800ms and 1800ms
    await new Promise(resolve => setTimeout(resolve, delay));

    const newBackgrounds = await new Promise<(string | ColorPoint[])[]>((resolve) => {
      setTimeout(() => {
        resolve(generateBackgrounds(colors));
      }, 0);
    });
    setBackgrounds(newBackgrounds);
    setIsGenerating(false);
    setLoadingBackgrounds(new Array(10).fill(false));
  };

  const handleGenerateMore = () => {
    generateBackgroundsAsync(imageColors);
  };

  const handleBackgroundClick = (background: string | ColorPoint[], index: number) => {
    if (!isApplying) {
      onSelectBackground(background, index);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        <AnimatePresence>
          {backgrounds.map((background, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="aspect-square rounded-md cursor-pointer border border-gray-300 flex items-center justify-center overflow-hidden relative"
              onClick={() => handleBackgroundClick(background, index)}
            >
              <div className={`w-full h-full ${(isApplying && applyingIndex === index) || loadingBackgrounds[index] ? 'opacity-30' : ''}`}>
                {Array.isArray(background) ? (
                  <canvas
                    className="w-full h-full"
                    ref={canvas => {
                      if (canvas) {
                        canvas.width = canvas.offsetWidth;
                        canvas.height = canvas.offsetHeight;
                        const ctx = canvas.getContext('2d');
                        if (ctx) renderFreeformGradient(ctx, canvas.width, canvas.height, background);
                      }
                    }}
                  />
                ) : (
                  <div
                    className="w-full h-full"
                    style={{ background: background }}
                  />
                )}
              </div>
              {((isApplying && applyingIndex === index) || loadingBackgrounds[index]) && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="animate-spin text-primary" size={24} />
                </div>
              )}
              {!background && (
                <span className="text-[8px] text-gray-400 text-center absolute">
                  No Image Uploaded
                </span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <Button onClick={handleGenerateMore} disabled={isGenerating || imageColors.length === 0}>
        {isGenerating ? (
          <Loader2 className="animate-spin mr-2" size={16} />
        ) : (
          'Generate More'
        )}
      </Button>
    </div>
  );
};