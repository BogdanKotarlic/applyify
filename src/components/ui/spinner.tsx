export default function Spinner() {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}
