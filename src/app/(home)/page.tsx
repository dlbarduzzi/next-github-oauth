import { Container } from "@/components/container"

export default function Page() {
  return (
    <div className="py-8">
      <Container>
        <div className="max-w-3xl rounded-md bg-gray-100 px-5 py-4">
          <h1 className="font-bold text-black">Fun Fact</h1>
          <p className="pt-2 leading-6 text-black">
            Honey never spoils! Archaeologists have discovered pots of honey in ancient
            Egyptian tombs that are over 3,000 years old—and still perfectly edible!
          </p>
        </div>
      </Container>
    </div>
  )
}
