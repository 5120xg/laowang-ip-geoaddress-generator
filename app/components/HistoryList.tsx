import {
  Text,
  Box,
  IconButton,
  Separator,
  ScrollArea,
  Badge,
  Button,
  Flex,
} from "@radix-ui/themes";
import {
  TrashIcon,
  DownloadIcon,
  StarIcon,
  StarFilledIcon,
} from "@radix-ui/react-icons";
import type { HistoryRecord } from "../types";
import { downloadHistoryJSON } from "@/services/exportService";

interface HistoryListProps {
  history: HistoryRecord[];
  selectedId: string;
  onHistoryClick: (record: HistoryRecord) => void;
  onDeleteRecord: (id: string) => void;
  onDeleteAll: () => void;
  onToggleStarred: (id: string) => void;
}

export function HistoryList({
  history,
  selectedId,
  onHistoryClick,
  onDeleteRecord,
  onDeleteAll,
  onToggleStarred,
}: Readonly<HistoryListProps>) {
  const handleDeleteAll = () => {
    if (window.confirm("确定删除全部历史记录（包括已收藏的）吗？")) onDeleteAll();
  };

  return (
    <Box
      style={{ flex: 1, minHeight: 0, position: "relative" }}
      className="min-h-[260px] md:min-h-0"
    >
      <Flex direction="column" style={{ position: "absolute", inset: 0 }}>
        <Text size="2" mb="2" color="gray">
          历史记录
        </Text>
        <ScrollArea type="hover" scrollbars="vertical" style={{ flex: 1 }}>
          <Flex direction="column" gap="2" pr="3">
            {history.length === 0 ? (
              <Flex align="center" justify="center" style={{ minHeight: 100 }}>
                <Text size="2" color="gray" align="center">
                  当前没有任何生成的信息
                </Text>
              </Flex>
            ) : (
              history.map((record) => (
                <Box
                  key={record.id}
                  role="button"
                  tabIndex={0}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                    backgroundColor:
                      selectedId === record.id ? "var(--gray-a6)" : undefined,
                  }}
                  className="hover:bg-[var(--gray-a4)]"
                  onClick={() => onHistoryClick(record)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onHistoryClick(record);
                  }}
                >
                  <Flex align="center" justify="between" gap="3">
                    <Flex align="center" gap="2" style={{ flex: 1, minWidth: 0 }}>
                      <Text
                        size="2"
                        style={{
                          flex: 1,
                          minWidth: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={[record.address.city, record.address.state]
                          .filter(Boolean)
                          .join(", ")}
                      >
                        {record.user.name.first} {record.user.name.last}
                        {record.address.city && (
                          <Text color="gray"> · {record.address.city}</Text>
                        )}
                      </Text>
                      <Badge size="1" variant="soft" color="gray">
                        {new Date(record.timestamp).toLocaleDateString()}
                      </Badge>
                    </Flex>
                    <IconButton
                      size="1"
                      color="amber"
                      variant="ghost"
                      aria-label={record.isStarred ? "取消收藏" : "收藏"}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleStarred(record.id);
                      }}
                    >
                      {record.isStarred ? <StarFilledIcon /> : <StarIcon />}
                    </IconButton>
                    <IconButton
                      size="1"
                      color="red"
                      variant="ghost"
                      aria-label="删除"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteRecord(record.id);
                      }}
                    >
                      <TrashIcon />
                    </IconButton>
                  </Flex>
                </Box>
              ))
            )}
          </Flex>
        </ScrollArea>
        {history.length > 0 && (
          <>
            <Separator size="4" my="3" />
            <Flex justify="between" gap="3">
              <Button size="2" variant="soft" onClick={() => downloadHistoryJSON(history)}>
                <Text>导出JSON</Text>
                <DownloadIcon />
              </Button>
              <Button size="2" color="red" variant="soft" onClick={handleDeleteAll}>
                <Text>删除全部</Text>
                <TrashIcon />
              </Button>
            </Flex>
          </>
        )}
      </Flex>
    </Box>
  );
}
