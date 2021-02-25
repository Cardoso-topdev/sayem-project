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

const ReadingListsPage = ({ 
    filteredPages, 
    permanentPages, 
    fetchedBlocks, 
    userData, 
    err }) => {
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

  let likes = pcards[0]
  let likesupdatedAtDate = new Date(Date.parse(likes.updatedAt));

  let archive = pcards[1]
  let archiveupdatedAtDate = new Date(Date.parse(likes.updatedAt)); 
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
          userId: userData._id,
        }),
      });
      const data = await response.json()
      const updatedCards = [...cards];
      updatedCards.push(data.page)
      setCards(updatedCards)
    } catch (err) {
      console.log(err);
    }
  };
  
  const handleInbox = () => {
    router.push('/' + userData._id);
  }

  const handleRL = () => {
    router.push('/' + userData._id + "/rlists");
  }

  const handleNotes =  () => {
    router.push('/' + userData._id + "/notes");
  }

  return (
    <>
      <BioHeader 
        style={{ marginBottom: "1rem" }} 
        userData = {userData} />

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
