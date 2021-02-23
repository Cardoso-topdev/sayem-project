import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import Button from "../button";
import EditableBlock from "../editableBlock";
import Notice from "../notice";
import { usePrevious } from "../../hooks";
import { objectId, setCaretToEnd } from "../../utils";
import Card from "../card";
import PermanentCard from "../permanentCard";
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import InboxIcon from '@material-ui/icons/Inbox';
import { makeStyles } from '@material-ui/core/styles';
import ViewListIcon from '@material-ui/icons/ViewList';
import NotesIcon from '@material-ui/icons/Notes';
import BioHeader from "../bioheader";

const useStyles = makeStyles((theme) => ({
  link: {
    display: 'flex',
    paddingBottom: 20,
  },
  icon: {
    marginRight: theme.spacing(0.5),
    paddingTop: 5,
    width: 25,
    height: 25,
  },
  bc: {
    paddingTop: 10,
    paddingBottom: 10,
  }
}));

// A page is represented by an array containing several blocks
// [
//   {
//     _id: "5f54d75b114c6d176d7e9765",
//     html: "Heading",
//     tag: "h1",
//     imageUrl: "",
//   },
//   {
//     _id: "5f54d75b114c6d176d7e9766",
//     html: "I am a <strong>paragraph</strong>",
//     tag: "p",
//     imageUrl: "",
//   },
//     _id: "5f54d75b114c6d176d7e9767",
//     html: "/im",
//     tag: "img",
//     imageUrl: "images/test.png",
//   }
// ]

const ReadingListsPage = ({ id, creatorid, pageIdList, filteredPages, permanentPages, fetchedBlocks, err }) => {
  if (err) {
    return (
      <Notice status="ERROR">
        <h3>Something went wrong 💔</h3>
        <p>Have you tried to restart the app at '/' ?</p>
      </Notice>
    );
  }
  const initialPages = filteredPages || [];
  permanentPages = permanentPages || [];
  const [cards, setCards] = useState(initialPages.map((data) => data.page));
  const [pcards, setPCards] = useState(permanentPages.map((data) => data.page));
  const [showInbox, setShowInbox] = useState(true)
  const [showRL, setShowRL] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const router = useRouter();
  const [blocks, setBlocks] = useState(fetchedBlocks);
  const [currentBlockId, setCurrentBlockId] = useState(null);
  const classes = useStyles();
  console.log("permanentPages")
  console.log(pcards)
  
  let likes = pcards[0]
  console.log("likes")
  console.log(likes)
  let likesupdatedAtDate = new Date(Date.parse(likes.updatedAt));
  console.log(likesupdatedAtDate)
  console.log(likes.blocks)

  let archive = pcards[1]
  let archiveupdatedAtDate = new Date(Date.parse(likes.updatedAt)); 
  // console.log("ReadingListPage props")
  // console.log(id)
  const prevBlocks = usePrevious(blocks);

  const deleteCard = async (pageId) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API}/pages/${pageId}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const cardIndex = cards.map((page) => page._id).indexOf(pageId);
      const updatedCards = [...cards];
      updatedCards.splice(cardIndex, 1);
      setCards(updatedCards);
    } catch (err) {
      console.log(err);
    }
  };

  const createCard = async () => {
    try {
      console.log("create card called")
      console.log(cards)
      const blocks = [{ tag: "h1", html: "New Playlist", imageUrl: "" }];
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/pages/postpage`, {
        method: "POST",
        credentials: "include",
        headers: { 
          "Content-Type": "application/json",
          // truly need to figure out if i should "forward the authentication cookie to the backend"
          // Cookie: req ? req.headers.cookie : undefined,
        },
        
        body: JSON.stringify({
          blocks: blocks,
          userId: id,
        }),
      });
      const data = await response.json()
      console.log("data")
      console.log(data)
      console.log(cards)
      const updatedCards = [...cards];
      updatedCards.push(data.page)
      console.log("data.page")
      console.log(data.page)
      // cards.push(data.page)
      console.log(updatedCards)
      setCards(updatedCards)

        
      // const cardIndex = cards.map((page) => page._id).indexOf(pageId);
      // const updatedCards = [...cards];
      // updatedCards.splice(cardIndex, 1);
      // setCards(updatedCards);
    } catch (err) {
      console.log(err);
    }
  };
  
  // // Update the database whenever blocks change
  // useEffect(() => {
  //   const updatePageOnServer = async (blocks) => {
  //     try {
  //       await fetch(`${process.env.NEXT_PUBLIC_API}/pages/${id}`, {
  //         method: "PUT",
  //         credentials: "include",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           blocks: blocks,
  //         }),
  //       });
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   if (prevBlocks && prevBlocks !== blocks) {
  //     updatePageOnServer(blocks);
  //   }
  // }, [blocks, prevBlocks]);

  // // Handling the cursor and focus on adding and deleting blocks
  // useEffect(() => {
  //   // If a new block was added, move the caret to it
  //   if (prevBlocks && prevBlocks.length + 1 === blocks.length) {
  //     const nextBlockPosition =
  //       blocks.map((b) => b._id).indexOf(currentBlockId) + 1 + 1;
  //     const nextBlock = document.querySelector(
  //       `[data-position="${nextBlockPosition}"]`
  //     );
  //     if (nextBlock) {
  //       nextBlock.focus();
  //     }
  //   }
  //   // If a block was deleted, move the caret to the end of the last block
  //   if (prevBlocks && prevBlocks.length - 1 === blocks.length) {
  //     const lastBlockPosition = prevBlocks
  //       .map((b) => b._id)
  //       .indexOf(currentBlockId);
  //     const lastBlock = document.querySelector(
  //       `[data-position="${lastBlockPosition}"]`
  //     );
  //     if (lastBlock) {
  //       setCaretToEnd(lastBlock);
  //     }
  //   }
  // }, [blocks, prevBlocks, currentBlockId]);

  const deleteImageOnServer = async (imageUrl) => {
    // The imageUrl contains images/name.jpg, hence we do not need
    // to explicitly add the /images endpoint in the API url
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/pages/${imageUrl}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      await response.json();
    } catch (err) {
      console.log(err);
    }
  };

  const updateBlockHandler = (currentBlock) => {
    const index = blocks.map((b) => b._id).indexOf(currentBlock.id);
    const oldBlock = blocks[index];
    const updatedBlocks = [...blocks];
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      tag: currentBlock.tag,
      html: currentBlock.html,
      imageUrl: currentBlock.imageUrl,
    };
    setBlocks(updatedBlocks);
    // If the image has been changed, we have to delete the
    // old image file on the server
    if (oldBlock.imageUrl && oldBlock.imageUrl !== currentBlock.imageUrl) {
      deleteImageOnServer(oldBlock.imageUrl);
    }
  };

  const addBlockHandler = (currentBlock) => {
    setCurrentBlockId(currentBlock.id);
    const index = blocks.map((b) => b._id).indexOf(currentBlock.id);
    const updatedBlocks = [...blocks];
    const newBlock = { _id: objectId(), tag: "p", html: "", imageUrl: "" };
    updatedBlocks.splice(index + 1, 0, newBlock);
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      tag: currentBlock.tag,
      html: currentBlock.html,
      imageUrl: currentBlock.imageUrl,
    };
    setBlocks(updatedBlocks);
  };

  const deleteBlockHandler = (currentBlock) => {
    if (blocks.length > 1) {
      setCurrentBlockId(currentBlock.id);
      const index = blocks.map((b) => b._id).indexOf(currentBlock.id);
      const deletedBlock = blocks[index];
      const updatedBlocks = [...blocks];
      updatedBlocks.splice(index, 1);
      setBlocks(updatedBlocks);
      // If the deleted block was an image block, we have to delete
      // the image file on the server
      if (deletedBlock.tag === "img" && deletedBlock.imageUrl) {
        deleteImageOnServer(deletedBlock.imageUrl);
      }
    }
  };

  const onDragEndHandler = (result) => {
    const { destination, source } = result;

    // If we don't have a destination (due to dropping outside the droppable)
    // or the destination hasn't changed, we change nothing
    if (!destination || destination.index === source.index) {
      return;
    }

    const updatedBlocks = [...blocks];
    const removedBlocks = updatedBlocks.splice(source.index - 1, 1);
    updatedBlocks.splice(destination.index - 1, 0, removedBlocks[0]);
    setBlocks(updatedBlocks);
  };

  function handleInbox() {
    router.push('/' + id);
  }

  function handleRL() {
    router.push('/' + id + "/rlists");
  }

  function handleNotes () {
    router.push('/' + id + "/notes");
  }

  return (
    <>
      {/* <h1 className="pageHeading">Welcome, {creatorid}! </h1> */}

      <BioHeader style={{ marginBottom: "1rem" }}>
        <h4>Sayem Hoque</h4>
        <p>@sayemhoque</p>
        <p>Hi there, I'm Sayem!</p>
        
        
        {/* <DragDropContext onDragEnd={onDragEndHandler}>
          <Droppable droppableId={id}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <EditableBlock
                  key={block1._id}
                  position={0}
                  id={block1._id}
                  tag={block1.tag}
                  html={block1.html}
                  html2={block1.html2}
                  imageUrl={block1.imageUrl}
                  displayText={block1.displayText}
                  protocol={block1.protocol}
                  hostname={block1.hostname}
                  pathname={block1.pathname}
                  pageId={id}
                  disabled={true}
                  addBlock={addBlockHandler}
                  deleteBlock={deleteBlockHandler}
                  updateBlock={updateBlockHandler}
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext> */}
      </BioHeader>
      <Breadcrumbs separator="/">
        <Link color="inherit" style={{fontSize:"1.1em", cursor:"pointer"}} onClick={handleInbox}>
          <InboxIcon className={classes.icon} />
          Inbox
        </Link>

        <Link color="inherit" style={{fontSize:"1.1em", cursor:"pointer"}} onClick={handleNotes}>
          <NotesIcon className={classes.icon} />
          Notes
        </Link>
        <Link color="inherit" style={{fontSize:"2em", cursor:"pointer"}} onClick={handleRL}>
          <ViewListIcon className={classes.icon} />
          Lists
        </Link>
        

      </Breadcrumbs>

      <div id="pageList">
        {cards.length === 0 && (
          <Notice style={{ marginBottom: "2rem" }}>
            <p>You can create your own playlists here!</p>
          </Notice>
        )}

        <PermanentCard
          key={0}
          pageId={likes._id}
          date={likesupdatedAtDate}
          content={likes.blocks}
        />
        <PermanentCard
          key={1}
          pageId={archive._id}
          date={archiveupdatedAtDate}
          content={archive.blocks}
        />
        {cards.map((page, key) => {
          const updatedAtDate = new Date(Date.parse(page.updatedAt));
          const pageId = page._id;
          const blocks = page.blocks;
          return (
            <Card
              key={key}
              pageId={pageId}
              date={updatedAtDate}
              content={blocks}
              deleteCard={(pageId) => deleteCard(pageId)}
            />
          );
        })}
        
      </div>
      <Button onClickHandler={() => createCard()}>Create New Playlist </Button>
    </>
  );
};

export default ReadingListsPage;
