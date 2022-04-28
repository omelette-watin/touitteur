import api from "@/api/api"
import MainWrapper from "@/components/MainWrapper"
import ProfileFeed from "@/components/ProfileFeed"
import ProfileHeader from "@/components/ProfileHeader"
import { UserType } from "@/types/user"
import { GetServerSideProps } from "next"

const UserProfile = ({ user }: { user: UserType }) => {
  return (
    <MainWrapper title={user?.profileName || user?.username || "Profile"}>
      {user ? (
        <>
          <ProfileHeader user={user} />
          <ProfileFeed user={user} />
        </>
      ) : (
        <div className="p-8 text-center">This account doesn't exist...</div>
      )}
    </MainWrapper>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { data: user } = await api
    .get(`/users/name/${params?.username}`)
    .catch(() => {
      return { data: null }
    })

  return {
    props: {
      title: user ? `${user.profileName} (@${user.username})` : "Profile",
      user,
      needAuth: true,
    },
  }
}

export default UserProfile
