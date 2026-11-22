import { IconButton, Flex, Box } from "@radix-ui/themes";
import { EnvelopeClosedIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import { ThemeChanger } from "./ThemeChanger";
import { REPO_URL } from "../config";

const ICON_SIZE = 24;

interface TopBarProps {
  onInboxOpen: () => void;
  unread?: number;
}

export function TopBar({ onInboxOpen, unread = 0 }: TopBarProps) {
  return (
    <Flex
      justify="end"
      align="center"
      px={{ initial: "4", md: "6" }}
      py="4"
      style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}
    >
      <Flex gap="6" align="center">
        <Box position="relative">
          <IconButton size="4" variant="ghost" aria-label="收信箱" onClick={onInboxOpen}>
            <EnvelopeClosedIcon width={ICON_SIZE} height={ICON_SIZE} />
          </IconButton>
          {unread > 0 && (
            <span
              aria-label={`${unread} 封邮件`}
              style={{
                position: "absolute",
                top: -6,
                right: -6,
                minWidth: 16,
                height: 16,
                padding: "0 4px",
                borderRadius: 8,
                background: "var(--red-9)",
                color: "white",
                fontSize: 10,
                lineHeight: "16px",
                textAlign: "center",
                pointerEvents: "none",
              }}
            >
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </Box>
        <IconButton size="4" variant="ghost" aria-label="GitHub" asChild>
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
            <GitHubLogoIcon width={ICON_SIZE} height={ICON_SIZE} />
          </a>
        </IconButton>
        <ThemeChanger iconSize={ICON_SIZE} />
      </Flex>
    </Flex>
  );
}
