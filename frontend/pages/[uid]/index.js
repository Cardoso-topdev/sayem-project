import { resetServerContext } from "react-beautiful-dnd";
import { useContext } from "react";

import InboxPage from "../../components/inboxPage/index";
import { UserStateContext } from "../../context/UserContext";

const IndexPage = ({ 
  uid, 
  pageIdList, 
  filteredPages, 
  creatorid, 
  blocks, 
  bio, 
  err }) => {

  const state = useContext(UserStateContext);
  const userId = state.userId;
  console.log("USERID: ", userId);
  return <InboxPage 
            id={uid} 
            pageIdList={pageIdList} 
            filteredPages={filteredPages} 
            creatorid={creatorid} 
            fetchedBlocks={blocks} 
            userid={userId} 
            bio={bio} 
            err={err} />;
};

export const getServerSideProps = async (context) => {

  resetServerContext(); // needed for drag and drop functionality
  const pageId = context.query.uid;
  const req = context.req;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API}/users/account?userId=` + pageId);

    const data = await res.json();
    const pageIdList = data.pages;
    const pages = await Promise.all(
      pageIdList.map(async (id) => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/pages/${id}`,
          {
            method: "GET",
            credentials: "include",
            // Forward the authentication cookie to the backend
            headers: {
              "Content-Type": "application/json",
              Cookie: req ? req.headers.cookie : undefined,
            },
          }
        );
        return await response.json();
      })
    );
    const filteredPages = pages.filter((page) => !page.errCode);
    return {
      props: { 
        blocks: data.inboxBlocks, 
        filteredPages: filteredPages, 
        pageIdList: pageIdList, 
        uid: pageId, 
        creatorid: data.name, 
        bio: data.bio,
        err: false 
      },
    };
  } catch (err) {
    console.log(err);
    return { 
      props: { 
        blocks: null, 
        uid: null, 
        creatorid: null, 
        err: true 
      } 
    };
  }
};

export default IndexPage;
