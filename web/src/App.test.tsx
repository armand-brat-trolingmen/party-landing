import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Party brand name', () => {
  render(<App />);
  expect(screen.getByText(/Party/i)).toBeInTheDocument();
});
