import YearlyAbsenceTracker from '@/components/yearly-absence-tracker';

export default function PublicPage() {
  return (
    <div className="bg-background min-h-screen">
      <YearlyAbsenceTracker isPublicView={true} />
    </div>
  );
}
