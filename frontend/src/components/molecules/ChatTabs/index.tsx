'use client';

import { Badge } from '@mui/material';
import { ChatRounded as GeneralChatIcon, SmartToyRounded as AIChatIcon } from '@mui/icons-material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import * as S from './styles';

interface ChatTabsProps {
  activeTab: 'general' | 'ai' | 'notes';
  onTabChange: (tab: 'general' | 'ai' | 'notes') => void;
  isMaster?: boolean;
  generalUnread?: number;
  aiUnread?: number;
  children: React.ReactNode;
}

export const ChatTabs = ({
  activeTab,
  onTabChange,
  isMaster = false,
  generalUnread = 0,
  aiUnread = 0,
  children,
}: ChatTabsProps) => {
  const handleTabChange = (_: React.SyntheticEvent, newValue: 'general' | 'ai' | 'notes') => {
    onTabChange(newValue);
  };

  if (!isMaster) {
    return (
      <S.ChatTabsContainer>
        <S.StyledTabs value="general" sx={{ pointerEvents: 'none' }}>
          <S.StyledTab
            value="general"
            icon={
              <Badge badgeContent={generalUnread} color="error" max={99}>
                <GeneralChatIcon fontSize="small" />
              </Badge>
            }
            label="Chat Geral"
            sx={{ width: '100%' }}
          />
        </S.StyledTabs>

        <S.TabPanel
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          style={{ flexGrow: 1 }}
        >
          {children}
        </S.TabPanel>
      </S.ChatTabsContainer>
    );
  }

  return (
    <S.ChatTabsContainer>
      <S.StyledTabs value={activeTab} onChange={handleTabChange} variant="fullWidth">
        <S.StyledTab
          value="general"
          icon={
            <Badge badgeContent={generalUnread} color="error" max={99}>
              <GeneralChatIcon fontSize="small" />
            </Badge>
          }
        />
        <S.StyledTab
          value="ai"
          icon={
            <Badge badgeContent={aiUnread} color="error" max={99}>
              <AIChatIcon fontSize="small" />
            </Badge>
          }
        />
        <S.StyledTab
          value="notes"
          icon={
            <Badge color="error" max={99}>
              <EditNoteIcon fontSize="small" />
            </Badge>
          }
        />
      </S.StyledTabs>

      <S.TabPanel
        key={activeTab}
        initial={{ opacity: 0, x: activeTab === 'general' ? -10 : 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column' }}
      >
        {children}
      </S.TabPanel>
    </S.ChatTabsContainer>
  );
};
