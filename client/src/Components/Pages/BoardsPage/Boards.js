import LoadingScreen from "../../LoadingScreen";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBoards } from "../../../Services/boardsService";
import Navbar from "../../Navbar";
import { Container, Sidebar, SidebarHeader, SidebarItem, MainContent, Grid, SectionTitle, Board, AddBoard } from "./Styled";
import CreateBoard from "../../Modals/CreateBoardModal/CreateBoard";
import { useHistory } from "react-router";

const Boards = () => {
  const dispatch = useDispatch();
  const history = useHistory();
const { pending, boardsData = [] } = useSelector((state) => state.boards);
  const { userInfo } = useSelector((state) => state.user);
  const [openModal, setOpenModal] = useState(false);
  const [searchString, setSearchString] = useState('');

  const handleModalClose = () => setOpenModal(false);
  const handleClick = (e) => history.push(`/board/${e.target.id}`);

  useEffect(() => { getBoards(false, dispatch); }, [dispatch]);
  useEffect(() => { document.title = "Boards | Trello Clone"; }, []);

  const filteredBoards = boardsData.filter(item =>
    searchString ? item.title.toLowerCase().includes(searchString.toLowerCase()) : true
  );

  return (
    <>
      {pending && <LoadingScreen />}
      <Container>
        <Navbar searchString={searchString} setSearchString={setSearchString} />
        <div style={{ display: 'flex', height: 'calc(100vh - 3.1rem)', marginTop: '3.1rem' }}>

          {/* Sidebar */}
          <Sidebar>
            <SidebarHeader>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: userInfo?.color || '#0079bf',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 'bold', fontSize: 16
              }}>
                {userInfo?.name?.[0]}{userInfo?.surname?.[0]}
              </div>
              <div style={{ marginLeft: 10 }}>
                <div style={{ fontWeight: 600, color: '#172b4d', fontSize: 14 }}>
                  {userInfo?.name} {userInfo?.surname}
                </div>
                <div style={{ fontSize: 11, color: '#5e6c84' }}>{userInfo?.email}</div>
              </div>
            </SidebarHeader>

            <div style={{ borderTop: '1px solid #e2e4e9', margin: '8px 0' }} />

            <SidebarItem active>
              <span>📋</span> Your Boards
            </SidebarItem>
            <SidebarItem onClick={() => setOpenModal(true)}>
              <span>➕</span> Create new board
            </SidebarItem>
          </Sidebar>

          {/* Main content */}
          <MainContent>
            <SectionTitle>
              📋 Your Boards
              <span style={{ fontSize: 13, fontWeight: 400, color: '#5e6c84', marginLeft: 10 }}>
                {filteredBoards.length} board{filteredBoards.length !== 1 ? 's' : ''}
              </span>
            </SectionTitle>

            <Grid>
              {!pending && filteredBoards.map((item) => (
                <Board
                  key={item._id}
                  link={item.backgroundImageLink}
                  isImage={item.isImage}
                  id={item._id}
                  onClick={handleClick}
                >
                  <span id={item._id} style={{ pointerEvents: 'none' }}>{item.title}</span>
                </Board>
              ))}
              {!pending && (
                <AddBoard onClick={() => setOpenModal(true)}>
                  + Create new board
                </AddBoard>
              )}
            </Grid>
          </MainContent>
        </div>
      </Container>
      {openModal && <CreateBoard callback={handleModalClose} />}
    </>
  );
};

export default Boards;