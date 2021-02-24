import { resetServerContext } from "react-beautiful-dnd";

import EditablePage from "../../components/editablePage/index";

const Page = ({ pid, creatorid, blocks, err }) => {
  return <EditablePage id={pid} creatorid={creatorid} fetchedBlocks={blocks} err={err} />;
};

export const getServerSideProps = async (context) => {
  resetServerContext(); // needed for drag and drop functionality
  const pageId = context.query.pid;
  const req = context.req;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/pages/${pageId}`,
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
    let creatorid = "";
    if (data.page.creator)
      creatorid = data.page.creator.toString();
    return {
      props: { blocks: data.page.blocks, pid: pageId, creatorid: creatorid, err: false },
    };
  } catch (err) {
    console.log(err);
    return { props: { blocks: null, pid: null, creatorid: null, err: true } };
  }
};

export default Page;
