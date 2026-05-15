import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from '../App';

describe('Karmurs Record homepage', () => {
  it('renders the site title, script phrase, and primary cards', () => {
    render(<App />);

    expect(screen.getByText("Karmurs' Record")).toBeInTheDocument();
    expect(screen.getByText(/Things/i)).toBeInTheDocument();
    expect(screen.getByText('Journal')).toBeInTheDocument();
    expect(screen.getByText('Gallery')).toBeInTheDocument();
    expect(screen.getByText('Racing')).toBeInTheDocument();
  });
});
