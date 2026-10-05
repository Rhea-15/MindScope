import * as React from 'react';

interface TabsProps {
  value: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ value, onValueChange, children, className = '' }: TabsProps) {
  return <div className={className}>{children}</div>;
}

export function TabsList({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`grid gap-2 ${className}`.trim()}>{children}</div>;
}

export function TabsTrigger({ value, children, className = '', onClick }: { value: string; children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      className={`rounded-md border px-3 py-2 text-sm font-medium transition ${className}`.trim()}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className = '' }: { value: string; children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
