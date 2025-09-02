declare module 'vanta/dist/vanta.net.min' {
    import * as THREE from 'three';
    
    interface VantaEffect {
      destroy(): void;
      resize(): void;
      setOptions(options: any): void;
    }
    
    interface NetOptions {
      el: HTMLElement | string;
      THREE?: typeof THREE;
      color?: number;
      backgroundColor?: number;
      points?: number;
      maxDistance?: number;
      spacing?: number;
      showDots?: boolean;
      [key: string]: any;
    }
    
    const NET: {
      (options: NetOptions): VantaEffect;
    };
    
    export default NET;
  }
  
  declare module 'vanta' {
    export * from 'vanta/dist/vanta.net.min';
  }