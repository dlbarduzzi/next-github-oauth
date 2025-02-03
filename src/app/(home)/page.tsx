import { Container } from "@/components/container"
import { db } from "@/db/conn"

async function getUsers() {
  try {
    const users = await db.query.users.findMany()
    return users
  } catch (error) {
    console.log("get users error", error)
    return null
  }
}

async function getCourses() {
  try {
    const courses = await db.query.courses.findMany()
    return courses
  } catch (error) {
    console.log("get courses error", error)
    return null
  }
}

export default async function Page() {
  const users = await getUsers()
  const courses = await getCourses()
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
        <div className="space-y-8 pt-8">
          {users ? (
            <div className="max-w-3xl rounded-md bg-gray-100 px-5 py-4 text-sm">
              <pre>{JSON.stringify(users, null, 2)}</pre>
            </div>
          ) : null}
          {courses ? (
            <div className="max-w-3xl rounded-md bg-gray-100 px-5 py-4 text-sm">
              <pre>{JSON.stringify(courses, null, 2)}</pre>
            </div>
          ) : null}
        </div>
      </Container>
    </div>
  )
}
