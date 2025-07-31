import YearlyAbsenceTracker from '@/components/yearly-absence-tracker';

export default function Home() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <YearlyAbsenceTracker />
      </div>
    </div>
  );
}
