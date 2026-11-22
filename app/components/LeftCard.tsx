import {
  Card,
  Text,
  Flex,
  TextField,
  Button,
  SegmentedControl,
  Separator,
} from "@radix-ui/themes";
import { ReloadIcon } from "@radix-ui/react-icons";
import { AddressSelector } from "./AddressSelector";
import { HistoryList } from "./HistoryList";
import type { HistoryRecord, InputMode, Region } from "../types";

interface LeftCardProps {
  mode: InputMode;
  onModeChange: (mode: InputMode) => void;
  inputIp: string;
  onInputIpChange: (value: string) => void;
  region: Region | null;
  onRegionChange: (region: Region) => void;
  currentIP: string;
  isLoading: boolean;
  onGenerate: () => void;
  history: HistoryRecord[];
  selectedId: string;
  onHistoryClick: (record: HistoryRecord) => void;
  onDeleteRecord: (id: string) => void;
  onDeleteAll: () => void;
  onToggleStarred: (id: string) => void;
}

export const LeftCard = ({
  mode,
  onModeChange,
  inputIp,
  onInputIpChange,
  region,
  onRegionChange,
  currentIP,
  isLoading,
  onGenerate,
  history,
  selectedId,
  onHistoryClick,
  onDeleteRecord,
  onDeleteAll,
  onToggleStarred,
}: LeftCardProps) => {
  return (
    <Card size={{ initial: "2", md: "4" }} style={{ flex: 2, display: "flex" }}>
      <Flex direction="column" gap="3" style={{ flex: 1, width: "100%" }}>
        <Flex gap="3" direction={{ initial: "column", sm: "row" }}>
          <SegmentedControl.Root
            value={mode}
            onValueChange={(value) => onModeChange(value as InputMode)}
            size="2"
          >
            <SegmentedControl.Item value="ip">IP</SegmentedControl.Item>
            <SegmentedControl.Item value="region">地址</SegmentedControl.Item>
          </SegmentedControl.Root>

          {mode === "region" ? (
            <AddressSelector value={region} onSelect={onRegionChange}>
              <TextField.Root
                size="2"
                readOnly
                placeholder="点击选择地区"
                value={region ? `${region.city}, ${region.state}, ${region.country}` : ""}
                style={{ flex: 1, cursor: "pointer" }}
              />
            </AddressSelector>
          ) : (
            <TextField.Root
              size="2"
              placeholder={currentIP || "输入 IPv4 / IPv6"}
              value={inputIp}
              onChange={(e) => onInputIpChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isLoading) onGenerate();
              }}
              style={{ flex: 1 }}
            />
          )}

          <Button size="2" onClick={onGenerate} disabled={isLoading}>
            <Text>{isLoading ? "生成中..." : "生成地址"}</Text>
            <ReloadIcon className={isLoading ? "animate-spin" : ""} />
          </Button>
        </Flex>
        <Separator size="4" />
        <HistoryList
          history={history}
          selectedId={selectedId}
          onHistoryClick={onHistoryClick}
          onDeleteRecord={onDeleteRecord}
          onDeleteAll={onDeleteAll}
          onToggleStarred={onToggleStarred}
        />
      </Flex>
    </Card>
  );
};
