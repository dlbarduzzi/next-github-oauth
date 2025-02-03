import { Container } from "@/components/container"
import { Courses } from "@/features/courses/components/courses"

export default function Page() {
  return (
    <div className="py-8">
      <Container>
        <Courses />
      </Container>
    </div>
  )
}
