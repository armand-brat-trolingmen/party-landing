import { act, render, screen } from '@testing-library/react';
import { useMediaQuery } from './useMediaQuery';

type ProbeProps = {
  onRender?: (matches: boolean) => void;
  query?: string;
};

function Probe({ onRender, query = '(max-width: 720px) and (pointer: coarse)' }: ProbeProps) {
  const matches = useMediaQuery(query);

  onRender?.(matches);

  return <output data-testid="media-query-match">{matches ? 'true' : 'false'}</output>;
}

test('reads the current media query match on the first render without a false-to-true flip', () => {
  const renderValues: boolean[] = [];

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockReturnValue({
      matches: true,
      media: '(max-width: 720px) and (pointer: coarse)',
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });

  render(<Probe onRender={(matches) => renderValues.push(matches)} />);

  expect(screen.getByTestId('media-query-match')).toHaveTextContent('true');
  expect(renderValues).toEqual([true]);
});

test('falls back to addListener/removeListener when modern media query events are unavailable', () => {
  const addListener = vi.fn();
  const removeListener = vi.fn();
  const mediaQuery = {
    matches: false,
    media: '(max-width: 720px) and (pointer: coarse)',
    onchange: null,
    addListener,
    removeListener,
    dispatchEvent: vi.fn(),
  };

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockReturnValue(mediaQuery),
  });

  const { unmount } = render(<Probe />);

  expect(addListener).toHaveBeenCalledTimes(1);
  expect(screen.getByTestId('media-query-match')).toHaveTextContent('false');

  mediaQuery.matches = true;

  act(() => {
    const listener = addListener.mock.calls[0]?.[0] as (() => void) | undefined;
    listener?.();
  });

  expect(screen.getByTestId('media-query-match')).toHaveTextContent('true');

  unmount();

  expect(removeListener).toHaveBeenCalledWith(addListener.mock.calls[0]?.[0]);
});
