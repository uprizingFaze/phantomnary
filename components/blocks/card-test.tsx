"use client";

import { Button, Card } from "@/components/ui";

export default function CardTest({
  month,
  year,
}: {
  month?: string;
  year?: string;
}) {
  return (
    <Card className="max-w-lg">
      <Card.Header>
        <Card.Title>Monthly Report</Card.Title>
        <Card.Description>{`Financial summary for ${month}`}</Card.Description>
      </Card.Header>
      <Card.Content>
        The monthly financial report shows a 15% increase in revenue compared to
        last month.
      </Card.Content>
      <Card.Footer>
        <Button>View Details</Button>
      </Card.Footer>
    </Card>
  );
}
