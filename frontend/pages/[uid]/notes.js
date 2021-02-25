import { resetServerContext } from "react-beautiful-dnd";

import NotesPage from "../../components/notesPage/index";

const IndexPage = ({ 
  pageIdList, 
  filteredPages, 
  blocks, 
  data,
  err }) => {
  return <NotesPage 
            pageIdList={pageIdList} 
            filteredPages={filteredPages} 
            fetchedBlocks={blocks} 
            userData={data} 
            err={err} />;
};

export const getServerSideProps = async (context) => {
  resetServerContext(); // needed for drag and drop functionality
  const pageId = context.query.uid;
  const req = context.req;
  try {

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/users/account?userId=` + pageId,
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
    return {
      props: { 
        filteredPages: filteredPages, 
        pageIdList: pageIdList, 
        data: data,
        err: false },
    };
  } catch (err) {
    console.log(err);
    return { props: { blocks: null, uid: null, creatorid: null, err: true } };
  }
};

export default IndexPage;
