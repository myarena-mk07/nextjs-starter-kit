declare module 'colorthief' {
  export default class ColorThief {
    getColor(image: HTMLImageElement | null): [number, number, number];
    getPalette(image: HTMLImageElement | null, colorCount?: number): [number, number, number][];
  }
}