import { resetServerContext } from "react-beautiful-dnd";

import InboxPage from "../../components/inboxPage/index";

const IndexPage = ({ uid, pageIdList, filteredPages, creatorid, blocks, err }) => {
  return <InboxPage id={uid} pageIdList={pageIdList} filteredPages={filteredPages} creatorid={creatorid} fetchedBlocks={blocks} err={err} />;
};

export const getServerSideProps = async (context) => {
  resetServerContext(); // needed for drag and drop functionality
  const pageId = context.query.uid;
  const req = context.req;
  try {

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/users/account`,
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
    const data = await response.json();
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
    console.log("inbox page")
    console.log(filteredPages)
    console.log(pageIdList)
    console.log(pageId)
    console.log(data)
    return {
      props: { blocks: data.inboxBlocks, filteredPages: filteredPages, pageIdList: pageIdList, uid: pageId, creatorid: data.name, err: false },
    };
  } catch (err) {
    console.log(err);
    return { props: { blocks: null, uid: null, creatorid: null, err: true } };
  }
};

export default IndexPage;
