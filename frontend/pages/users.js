import Notice from "../components/notice";
import UserCard from "../components/userCard";

const UsersPage = ({ users }) => {
  // console.log(users);
  let usersList = [];
  Object.entries(users).forEach(([key, value]) => {
    usersList.push(<UserCard key={key} _id={value._id} email={value.email} bio={value.bio} name={value.name}/>);
  });
  return (
    <div>
      {usersList}
    </div>    
  );
};

export const getServerSideProps = async (context) => {
  const req = context.req;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/users/getUserList`)
    const data = await res.json()
    if (data.errCode) {
      throw new Error(data.message);
    } else {
      return { props: { users: data } };
    }
  } catch (err) {
    console.log(err);
    return {
      props: {
        activated: false,
        message: err.message || "Unknown error occured!",
      },
    };
  }
};

export default UsersPage;
