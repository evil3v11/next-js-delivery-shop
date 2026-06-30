export interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export interface ErrorComponentProps {
  error: Error;
  userMessage?: string;
}