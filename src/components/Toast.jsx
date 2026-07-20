import React from 'react';
import { CheckCircle, Info } from 'lucide-react';

export function Toast({ toast }) {
  if (!toast) return null;

  return (
    <div class="toast-container">
      <div class="toast">
        <CheckCircle style={{ width: 18, height: 18, color: 'var(--accent-primary)' }} />
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
