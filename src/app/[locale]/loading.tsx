import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Route-level loading UI. Demonstrates the skeleton-everywhere principle:
 * placeholders reserve the hero's layout so navigation never causes a shift.
 */
export default function Loading() {
  return (
    <Container className="pt-44 pb-20">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          <Skeleton className="h-7 w-40 rounded-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-3/4" />
          <Skeleton className="mt-2 h-5 w-full" />
          <Skeleton className="h-5 w-5/6" />
          <div className="mt-4 flex gap-3">
            <Skeleton className="h-12 w-44 rounded-xl" />
            <Skeleton className="h-12 w-40 rounded-xl" />
          </div>
        </div>
        <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
      </div>
    </Container>
  );
}
