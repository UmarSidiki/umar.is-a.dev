declare module '@barba/core' {
  export interface ITransitionData {
    current: {
      container: HTMLElement;
      namespace: string;
      url: {
        href: string;
        pathname: string;
      };
    };
    next: {
      container: HTMLElement;
      namespace: string;
      url: {
        href: string;
        pathname: string;
      };
    };
    trigger: HTMLElement | string;
  }

  interface IBarbaTransition {
    name?: string;
    to?: {
      namespace?: string;
    };
    from?: {
      namespace?: string;
    };
    leave?(data: ITransitionData): Promise<void> | void | object;
    enter?(data: ITransitionData): Promise<void> | void | object;
    beforeLeave?(data: ITransitionData): Promise<void> | void;
    afterLeave?(data: ITransitionData): Promise<void> | void;
    beforeEnter?(data: ITransitionData): Promise<void> | void;
    afterEnter?(data: ITransitionData): Promise<void> | void;
  }

  interface IBarbaView {
    namespace: string;
    beforeEnter?(data?: ITransitionData): Promise<void> | void;
    afterEnter?(data?: ITransitionData): Promise<void> | void;
    beforeLeave?(data?: ITransitionData): Promise<void> | void;
    afterLeave?(data?: ITransitionData): Promise<void> | void;
  }

  interface IBarbaCache {
    reset(): void;
  }

  interface IBarbaHooks {
    before(callback: (data?: ITransitionData) => void): void;
    after(callback: (data?: ITransitionData) => void): void;
    beforeLeave(callback: (data?: ITransitionData) => void): void;
    afterLeave(callback: (data?: ITransitionData) => void): void;
    beforeEnter(callback: (data?: ITransitionData) => void): void;
    afterEnter(callback: (data?: ITransitionData) => void): void;
  }

  interface IBarba {
    init(config: {
      transitions?: IBarbaTransition[];
      views?: IBarbaView[];
      preventRunning?: boolean;
      timeout?: number;
    }): void;
    go(url: string): void;
    cache: IBarbaCache;
    hooks: IBarbaHooks;
  }

  const barba: IBarba;
  export default barba;
}
