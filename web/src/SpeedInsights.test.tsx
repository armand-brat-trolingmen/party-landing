import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('@vercel/speed-insights/react', () => ({
  SpeedInsights: () => <div data-testid="vercel-speed-insights" />,
}));

import App from './App';

test('mounts Vercel Speed Insights in the app shell', () => {
  render(<App />);

  expect(screen.getByTestId('vercel-speed-insights')).toBeInTheDocument();
});
