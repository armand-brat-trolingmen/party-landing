import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { TextLoop } from './TextLoop';

const originalResizeObserver = globalThis.ResizeObserver;
const originalRequestAnimationFrame = globalThis.requestAnimationFrame;
const originalCancelAnimationFrame = globalThis.cancelAnimationFrame;
const originalClientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth');
const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect;

let activeFrame: FrameRequestCallback | null = null;

class ResizeObserverMock {
  private readonly callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element) {
    this.callback([{ target, contentRect: target.getBoundingClientRect() } as ResizeObserverEntry], this as never);
  }

  disconnect() {}

  unobserve() {}
}

function stepFrame(timestamp: number) {
  act(() => {
    activeFrame?.(timestamp);
  });
}

function parseTranslateX(transform: string) {
  const match = /translate3d\(([-\d.]+)px,\s*0,\s*0\)/.exec(transform);
  return match ? Number.parseFloat(match[1]) : 0;
}

beforeEach(() => {
  activeFrame = null;
  globalThis.ResizeObserver = ResizeObserverMock as typeof ResizeObserver;
  globalThis.requestAnimationFrame = ((callback: FrameRequestCallback) => {
    activeFrame = callback;
    return 1;
  }) as typeof requestAnimationFrame;
  globalThis.cancelAnimationFrame = vi.fn() as typeof cancelAnimationFrame;

  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    get() {
      return (this as HTMLElement).dataset.testid === 'text-loop' ? 320 : 0;
    },
  });

  HTMLElement.prototype.getBoundingClientRect = function getBoundingClientRect() {
    if ((this as HTMLElement).dataset.testid === 'text-loop-sequence-primary') {
      return {
        width: 640,
        height: 36,
        top: 0,
        left: 0,
        right: 640,
        bottom: 36,
        x: 0,
        y: 0,
        toJSON: () => '',
      } as DOMRect;
    }

    return {
      width: 320,
      height: 36,
      top: 0,
      left: 0,
      right: 320,
      bottom: 36,
      x: 0,
      y: 0,
      toJSON: () => '',
    } as DOMRect;
  };
});

afterEach(() => {
  globalThis.ResizeObserver = originalResizeObserver;
  globalThis.requestAnimationFrame = originalRequestAnimationFrame;
  globalThis.cancelAnimationFrame = originalCancelAnimationFrame;

  if (originalClientWidth) {
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', originalClientWidth);
  } else {
    delete (HTMLElement.prototype as { clientWidth?: number }).clientWidth;
  }

  HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect;
});

test('moves to the right and slows down from the current offset on hover', () => {
  render(<TextLoop items={['One', 'Two', 'Three']} direction="right" speed={100} hoverSpeed={20} />);

  const loop = screen.getByTestId('text-loop');
  const track = screen.getByTestId('text-loop-track');
  const primarySequence = within(screen.getByTestId('text-loop-sequence-primary'));

  stepFrame(0);
  stepFrame(1000);

  const beforeHoverX = parseTranslateX(track.getAttribute('style') ?? '');

  fireEvent.mouseEnter(loop);
  stepFrame(1500);

  const afterHoverX = parseTranslateX(track.getAttribute('style') ?? '');

  expect(loop).toHaveAttribute('data-direction', 'right');
  expect(loop).toHaveAttribute('data-edge-mask', 'none');
  expect(primarySequence.getAllByText('One')).toHaveLength(2);
  expect(primarySequence.getAllByText('Two')).toHaveLength(2);
  expect(primarySequence.getAllByText('Three')).toHaveLength(2);
  expect(afterHoverX).toBeGreaterThan(beforeHoverX);
  expect(afterHoverX).toBeGreaterThan(-640);
  expect(afterHoverX - beforeHoverX).toBeLessThan(40);
});
