export interface BackgroundSettings {
    color: string;
    opacity: number;
    cornerRadius: number;
    direction: string;
  }
  
  export interface ImageSettings {
    cornerRadius: number;
    offsetX: number;
    offsetY: number;
    padding: number;
  }
  
  export interface ShadowSettings {
    color: string;
    opacity: number;
    blur: number;
    distance: number;
  }
  
  export interface PreviewSize {
    width: number;
    height: number;
  }
  
  export interface ImagePreviewProps {
    image: HTMLImageElement;
    containerRef: React.RefObject<HTMLDivElement>;
    backgroundSettings: BackgroundSettings;
    imageSettings: ImageSettings;
    shadowSettings: ShadowSettings;
    previewSize: PreviewSize;
    onDownloadableCanvasReady: (canvas: HTMLCanvasElement) => void;
  }
  
  export interface DirectionButtonProps {
    icon: React.ComponentType<{ className?: string }>;
    isActive: boolean;
    onClick: () => void;
    direction: string;
  }