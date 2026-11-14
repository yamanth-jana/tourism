export default function TypingAnimation() {
  return (
    <div className="flex items-center gap-1 py-1">
      <span className="w-2 h-2 rounded-full bg-primary-400 dark:bg-primary-500 animate-bounce" style={{ animationDelay: '0ms', animationDuration: '0.8s' }} />
      <span className="w-2 h-2 rounded-full bg-primary-400 dark:bg-primary-500 animate-bounce" style={{ animationDelay: '150ms', animationDuration: '0.8s' }} />
      <span className="w-2 h-2 rounded-full bg-primary-400 dark:bg-primary-500 animate-bounce" style={{ animationDelay: '300ms', animationDuration: '0.8s' }} />
    </div>
  );
}
