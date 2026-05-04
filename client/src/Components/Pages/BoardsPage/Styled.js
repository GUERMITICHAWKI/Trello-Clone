import styled from 'styled-components';

export const Container = styled.div`
  background-color: #f4f5f7;
  min-height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
`;

/* ─── Sidebar ─── */
export const Sidebar = styled.div`
  width: 240px;
  min-width: 240px;
  background: #ffffff;
  border-right: 1px solid #e2e4e9;
  height: 100%;
  padding: 16px 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
`;

export const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 10px 16px 10px;
`;

export const SidebarItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 14px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: ${({ active }) => (active ? '600' : '400')};
  color: ${({ active }) => (active ? '#0079bf' : '#172b4d')};
  background: ${({ active }) => (active ? '#e6f2fb' : 'transparent')};
  cursor: pointer;
  transition: background 150ms;
  user-select: none;
  &:hover {
    background: ${({ active }) => (active ? '#e6f2fb' : '#f0f1f3')};
  }
`;

/* ─── Main content ─── */
export const MainContent = styled.div`
  flex: 1;
  padding: 32px 36px;
  overflow-y: auto;
  height: 100%;
`;

export const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: #172b4d;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  max-width: 1100px;
`;

/* ─── Board card ─── */
export const Board = styled.div`
  color: white;
  padding: 12px;
  width: 100%;
  height: 100px;
  border-radius: 8px;
  ${({ isImage, link }) =>
    isImage
      ? `background-image: url(${link}); background-size: cover; background-position: center;`
      : `background-color: ${link};`}
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
  cursor: pointer;
  font-weight: 600;
  font-size: 15px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.4);
  transition: transform 150ms, box-shadow 150ms;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0);
    transition: background 150ms;
    border-radius: 8px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.2);
    &::after {
      background: rgba(0,0,0,0.08);
    }
  }
`;

export const AddBoard = styled.div`
  width: 100%;
  height: 100px;
  border-radius: 8px;
  border: 2px dashed #c1c7d0;
  background: transparent;
  color: #5e6c84;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 150ms, color 150ms, border-color 150ms;

  &:hover {
    background: #e6f2fb;
    color: #0079bf;
    border-color: #0079bf;
  }
`;

// Keep these exports for backward compat if used elsewhere
export const Title = SectionTitle;
export const Wrapper = MainContent;