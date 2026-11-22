"use client";

import {
  Dialog,
  Text,
  Button,
  ScrollArea,
  Tabs,
  Box,
  Flex,
  Card,
  Badge,
  Heading,
} from "@radix-ui/themes";
import type { TempMailMessage } from "../types";
import { EnvelopeClosedIcon } from "@radix-ui/react-icons";

interface InboxDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  emailLoading: boolean;
  emailError: string;
  messages: TempMailMessage[];
  onMessageClick: (msg: TempMailMessage) => void;
  selectedMessage: TempMailMessage | null;
}

/**
 * 邮件 HTML 来自任意发件人，绝不能直接插入页面（XSS）。
 * 放进 sandbox iframe：不允许脚本、不与本站同源，只允许在新窗口打开链接。
 */
function buildSrcDoc(html: string): string {
  return `<!doctype html><html><head><meta charset="utf-8"><base target="_blank"><style>body{margin:0;padding:12px;font-family:system-ui,-apple-system,sans-serif;word-break:break-word;color:#111;background:#fff}img{max-width:100%;height:auto}</style></head><body>${html}</body></html>`;
}

const CONTENT_HEIGHT = "calc(80vh - 200px)";

function MessageView({ message }: { message: TempMailMessage }) {
  const hasHtml = (message.html?.length ?? 0) > 0;
  const hasText = !!message.text;

  if (!hasHtml && !hasText) {
    return (
      <Flex align="center" justify="center" style={{ height: "100%" }}>
        <Text color="gray">（邮件没有正文）</Text>
      </Flex>
    );
  }

  return (
    <Tabs.Root key={message.id} defaultValue={hasHtml ? "html" : "text"}>
      <Tabs.List>
        {hasHtml && <Tabs.Trigger value="html">HTML</Tabs.Trigger>}
        {hasText && <Tabs.Trigger value="text">文本</Tabs.Trigger>}
      </Tabs.List>

      <Box py="3">
        {hasHtml && (
          <Tabs.Content value="html">
            <iframe
              title="邮件内容"
              sandbox="allow-popups allow-popups-to-escape-sandbox"
              referrerPolicy="no-referrer"
              srcDoc={buildSrcDoc(message.html.join("\n"))}
              style={{
                width: "100%",
                height: CONTENT_HEIGHT,
                border: 0,
                borderRadius: "var(--radius-2)",
                background: "white",
              }}
            />
          </Tabs.Content>
        )}
        {hasText && (
          <Tabs.Content value="text">
            <ScrollArea type="hover" scrollbars="vertical" style={{ height: CONTENT_HEIGHT }}>
              <pre
                style={{
                  whiteSpace: "pre-wrap",
                  wordWrap: "break-word",
                  margin: 0,
                  fontFamily: "var(--font-mono)",
                  fontSize: "14px",
                }}
              >
                {message.text}
              </pre>
            </ScrollArea>
          </Tabs.Content>
        )}
      </Box>
    </Tabs.Root>
  );
}

export function InboxDialog({
  open,
  onOpenChange,
  email,
  emailLoading,
  emailError,
  messages,
  onMessageClick,
  selectedMessage,
}: Readonly<InboxDialogProps>) {
  const status = emailLoading
    ? { color: "gray" as const, text: "创建中" }
    : emailError
      ? { color: "red" as const, text: "不可用" }
      : { color: "green" as const, text: "在线" };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 1000, height: "80vh" }}>
        <Dialog.Title className="sr-only">收信箱</Dialog.Title>
        <Dialog.Description className="sr-only">临时邮箱收到的邮件</Dialog.Description>
        <Flex direction="column" style={{ height: "100%" }}>
          <Flex justify="between" align="center" mb="4" gap="3">
            <Flex align="center" gap="2" wrap="wrap" style={{ minWidth: 0 }}>
              <Heading as="h3" mr="2">
                收信箱
              </Heading>
              <EnvelopeClosedIcon width="24" height="24" />
              <Text size="2" weight="medium" style={{ wordBreak: "break-all" }}>
                {email || emailError || "…"}
              </Text>
              <Badge size="1" color={status.color} radius="full">
                {status.text}
              </Badge>
            </Flex>
            <Dialog.Close>
              <Button variant="soft" color="gray">
                关闭
              </Button>
            </Dialog.Close>
          </Flex>

          <Flex
            gap="4"
            direction={{ initial: "column", md: "row" }}
            style={{ flex: 1, minHeight: 0 }}
          >
            <Card
              className="w-full md:w-[320px] max-h-[30vh] md:max-h-none"
              style={{ flexShrink: 0 }}
            >
              <ScrollArea type="hover" scrollbars="vertical" style={{ height: "100%" }}>
                <Flex direction="column" gap="2" style={{ minHeight: "100%" }}>
                  {messages.length === 0 ? (
                    <Flex align="center" justify="center" style={{ flex: 1, minHeight: 80 }}>
                      <Text color="gray">暂无邮件</Text>
                    </Flex>
                  ) : (
                    messages.map((msg) => (
                      <Card
                        key={msg.id}
                        variant="surface"
                        style={{
                          cursor: "pointer",
                          backgroundColor:
                            selectedMessage?.id === msg.id ? "var(--accent-3)" : undefined,
                        }}
                        onClick={() => onMessageClick(msg)}
                      >
                        <Flex direction="column" gap="2" p="2">
                          <Text weight="bold" size="2" truncate>
                            {msg.subject || "无主题"}
                          </Text>
                          <Text size="1" color="gray" truncate>
                            {msg.from.name} ({msg.from.address})
                          </Text>
                          <Text size="1" color="gray">
                            {new Date(msg.createdAt).toLocaleString()}
                          </Text>
                        </Flex>
                      </Card>
                    ))
                  )}
                </Flex>
              </ScrollArea>
            </Card>

            <Card style={{ flex: 1, minWidth: 0 }}>
              {selectedMessage ? (
                <MessageView message={selectedMessage} />
              ) : (
                <Flex align="center" justify="center" style={{ height: "100%", minHeight: 120 }}>
                  <Text color="gray">选择一封邮件查看内容</Text>
                </Flex>
              )}
            </Card>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
