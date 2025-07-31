import YearlyAbsenceTracker from '@/components/yearly-absence-tracker';

export default function Home() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-0 sm:px-0 lg:px-8">
        <YearlyAbsenceTracker />
      </div>
    </div>
  );
}
