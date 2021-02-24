import { resetServerContext } from "react-beautiful-dnd";

import ReadingListsPage from "../../components/readingListsPage/index";

const RListPage = ({ uid, pageIdList, filteredPages, permanentPages, creatorid, blocks, err }) => {
  return <ReadingListsPage id={uid} pageIdList={pageIdList} filteredPages={filteredPages} permanentPages={permanentPages} creatorid={creatorid} fetchedBlocks={blocks} err={err} />;
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
    const permanentPagesList = data.permanentPages;

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

    const permanentPages = await Promise.all(
      permanentPagesList.map(async (id) => {
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
      props: { permanentPages: permanentPages, filteredPages: filteredPages, pageIdList: pageIdList, uid: pageId, creatorid: data.name, err: false },
    };
  } catch (err) {
    console.log(err);
    return { props: { blocks: null, uid: null, creatorid: null, err: true } };
  }
};

export default RListPage;
